from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
import logging
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from catalogo.models import CategoriaMoto, Marca
from clientes.permissions import IsCatalogAdmin, IsCatalogAdminOrReadOnly
from core.audit import build_request_metadata, create_audit_log, serialize_instance_for_audit
from .ficha_defaults import ensure_moto_ficha_defaults
from .models import ModeloMoto, Moto, TipoAtributo, ValorAtributoMoto
from .services import create_or_update_moto_with_gallery, update_modelo_and_sync_motos
from .serializers import (
    CategoriaMotoSerializer,
    MarcaSerializer,
    ModeloMotoSerializer,
    MotoDetalleFichaSerializer,
    MotoSerializer,
    TipoAtributoSerializer,
    ValorAtributoMotoSerializer,
)


ACCESORIOS_CATEGORY_SLUGS = ["accesorios-para-la-moto", "accesorios"]
logger = logging.getLogger(__name__)


def _parse_bool(value) -> bool:
    return str(value).strip().lower() in {"1", "true", "si", "yes", "on"}


def _request_meta(request):
    return build_request_metadata(request)


def _filter_marcas_por_tipo(queryset, tipo):
    tipo = (tipo or "").strip().lower()

    if tipo == Marca.TIPO_MOTO:
        return queryset.filter(tipo=Marca.TIPO_MOTO).distinct()

    if tipo == Marca.TIPO_ACCESORIO_MOTO:
        return queryset.filter(tipo=Marca.TIPO_ACCESORIO_MOTO).distinct()

    if tipo == Marca.TIPO_ACCESORIO_RIDER:
        return queryset.filter(tipo=Marca.TIPO_ACCESORIO_RIDER).distinct()

    return queryset


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def lista_motos(request):
    if request.method == "GET":
        motos = (
            Moto.objects.filter(activa=True)
            .select_related("marca", "modelo_moto", "modelo_moto__categoria")
            .prefetch_related("imagenes")
            .order_by("-es_destacada", "orden_carrusel", "id")
        )
        serializer = MotoSerializer(motos, many=True)
        return Response(serializer.data)

    serializer = MotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    moto = create_or_update_moto_with_gallery(
        serializer=serializer,
        gallery_files=request.FILES.getlist("imagenes"),
        gallery_keep_ids=request.data.getlist("gallery_keep_ids") if _parse_bool(request.data.get("sync_gallery_images", "")) else None,
        remove_primary_image=_parse_bool(request.data.get("remove_primary_image", "")),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(MotoSerializer(moto).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def detalle_moto_admin(request, moto_id):
    moto = Moto.objects.filter(id=moto_id).first()
    if not moto:
        return Response({"detail": "Moto no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        before = serialize_instance_for_audit(moto)
        moto.delete()
        create_audit_log(
            action="delete",
            entity="motos.Moto",
            entity_id=moto_id,
            before=before,
            after=None,
            actor=request.user,
            metadata=_request_meta(request),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MotoSerializer(moto, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    updated_moto = create_or_update_moto_with_gallery(
        serializer=serializer,
        gallery_files=request.FILES.getlist("imagenes"),
        gallery_keep_ids=request.data.getlist("gallery_keep_ids") if _parse_bool(request.data.get("sync_gallery_images", "")) else None,
        remove_primary_image=_parse_bool(request.data.get("remove_primary_image", "")),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(MotoSerializer(updated_moto).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def detalle_moto_ficha(request, moto_id):
    moto = (
        Moto.objects.filter(id=moto_id, activa=True)
        .select_related("marca", "modelo_moto", "modelo_moto__categoria")
        .prefetch_related("imagenes", "valores_atributos__tipo_atributo", "secciones_ficha__items")
        .first()
    )
    if not moto:
        return Response({"detail": "Moto no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    serializer = MotoDetalleFichaSerializer(moto)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsCatalogAdmin])
def meta_motos(request):
    marcas = list(
        _filter_marcas_por_tipo(Marca.objects.filter(activa=True), Marca.TIPO_MOTO)
        .order_by("nombre")
        .values("id", "nombre")
    )
    categorias = list(CategoriaMoto.objects.filter(activa=True).order_by("nombre").values("id", "nombre"))
    modelos_raw = list(
        ModeloMoto.objects.filter(activo=True)
        .select_related("marca", "categoria")
        .order_by("nombre_modelo")
        .values("id", "nombre_modelo", "slug", "marca", "marca__nombre", "categoria_id", "categoria__nombre", "cilindrada")
    )
    modelos = [
        {
            "id": item["id"],
            "nombre": item["nombre_modelo"],
            "slug": item["slug"],
            "marca": item["marca"],
            "marca_nombre": item["marca__nombre"],
            "categoria": item["categoria_id"],
            "categoria_nombre": item["categoria__nombre"],
            "cilindrada": item["cilindrada"],
        }
        for item in modelos_raw
    ]

    return Response({"marcas": marcas, "categorias": categorias, "modelos": modelos})


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def modelos_moto(request):
    if request.method == "GET":
        marca_id = request.GET.get("marca")
        queryset = ModeloMoto.objects.select_related("marca", "categoria").order_by("nombre_modelo")
        if marca_id:
            queryset = queryset.filter(marca_id=marca_id)
        serializer = ModeloMotoSerializer(queryset, many=True)
        return Response(serializer.data)

    serializer = ModeloMotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        modelo = serializer.save()
        create_audit_log(
            action="create",
            entity="motos.ModeloMoto",
            entity_id=modelo.pk,
            before=None,
            after=serialize_instance_for_audit(modelo),
            actor=request.user,
            metadata=_request_meta(request),
        )
    except IntegrityError:
        return Response(
            {"detail": "No se pudo crear el modelo. Ya existe uno con esos datos."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as exc:
        logger.exception("Error inesperado al crear modelo de moto")
        return Response(
            {"detail": "No se pudo crear el modelo.", "error": str(exc)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return Response(ModeloMotoSerializer(modelo).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def modelos_moto_detalle(request, modelo_id):
    modelo = ModeloMoto.objects.filter(id=modelo_id).first()
    if not modelo:
        return Response({"detail": "Modelo no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            before = serialize_instance_for_audit(modelo)
            modelo.delete()
            create_audit_log(
                action="delete",
                entity="motos.ModeloMoto",
                entity_id=modelo_id,
                before=before,
                after=None,
                actor=request.user,
                metadata=_request_meta(request),
            )
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar el modelo porque tiene motos asociadas."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    try:
        serializer = ModeloMotoSerializer(modelo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_modelo = update_modelo_and_sync_motos(
            serializer=serializer,
            actor=request.user,
            metadata=_request_meta(request),
        )
        return Response(ModeloMotoSerializer(updated_modelo).data)
    except IntegrityError:
        return Response(
            {"detail": "No se pudo actualizar el modelo. Ya existe uno con ese nombre para esta marca."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as exc:
        logger.exception("Error inesperado al actualizar modelo de moto id=%s", modelo_id)
        return Response(
            {"detail": "No se pudo actualizar el modelo.", "error": str(exc)},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def categorias_moto(request):
    if request.method == "GET":
        categorias = CategoriaMoto.objects.order_by("nombre")
        serializer = CategoriaMotoSerializer(categorias, many=True)
        return Response(serializer.data)

    serializer = CategoriaMotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    categoria = serializer.save()
    create_audit_log(
        action="create",
        entity="catalogo.CategoriaMoto",
        entity_id=categoria.pk,
        before=None,
        after=serialize_instance_for_audit(categoria),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(CategoriaMotoSerializer(categoria).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def categorias_moto_detalle(request, categoria_id):
    categoria = CategoriaMoto.objects.filter(id=categoria_id).first()
    if not categoria:
        return Response({"detail": "Categoria no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            before = serialize_instance_for_audit(categoria)
            categoria.delete()
            create_audit_log(
                action="delete",
                entity="catalogo.CategoriaMoto",
                entity_id=categoria_id,
                before=before,
                after=None,
                actor=request.user,
                metadata=_request_meta(request),
            )
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar la categoria porque tiene motos asociadas."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = CategoriaMotoSerializer(categoria, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    before = serialize_instance_for_audit(categoria)
    updated_categoria = serializer.save()
    create_audit_log(
        action="update",
        entity="catalogo.CategoriaMoto",
        entity_id=updated_categoria.pk,
        before=before,
        after=serialize_instance_for_audit(updated_categoria),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(CategoriaMotoSerializer(updated_categoria).data)


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def marcas_moto(request):
    tipo = request.GET.get("tipo", "").strip().lower()

    if request.method == "GET":
        marcas = _filter_marcas_por_tipo(Marca.objects.order_by("nombre"), tipo)
        serializer = MarcaSerializer(marcas, many=True)
        return Response(serializer.data)

    payload = request.data.copy()
    if tipo in {
        Marca.TIPO_MOTO,
        Marca.TIPO_ACCESORIO_MOTO,
        Marca.TIPO_ACCESORIO_RIDER,
    }:
        payload["tipo"] = tipo

    serializer = MarcaSerializer(data=payload)
    serializer.is_valid(raise_exception=True)
    marca = serializer.save()
    create_audit_log(
        action="create",
        entity="catalogo.Marca",
        entity_id=marca.pk,
        before=None,
        after=serialize_instance_for_audit(marca),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(MarcaSerializer(marca).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def marcas_moto_detalle(request, marca_id):
    marca = Marca.objects.filter(id=marca_id).first()
    if not marca:
        return Response({"detail": "Marca no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            before = serialize_instance_for_audit(marca)
            marca.delete()
            create_audit_log(
                action="delete",
                entity="catalogo.Marca",
                entity_id=marca_id,
                before=before,
                after=None,
                actor=request.user,
                metadata=_request_meta(request),
            )
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar la marca porque tiene motos o productos asociados."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MarcaSerializer(marca, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    before = serialize_instance_for_audit(marca)
    updated_marca = serializer.save()
    create_audit_log(
        action="update",
        entity="catalogo.Marca",
        entity_id=updated_marca.pk,
        before=before,
        after=serialize_instance_for_audit(updated_marca),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(MarcaSerializer(updated_marca).data)


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def tipos_atributo(request):
    if request.method == "GET":
        queryset = TipoAtributo.objects.order_by("orden", "id")
        serializer = TipoAtributoSerializer(queryset, many=True)
        return Response(serializer.data)

    serializer = TipoAtributoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    tipo = serializer.save()
    create_audit_log(
        action="create",
        entity="motos.TipoAtributo",
        entity_id=tipo.pk,
        before=None,
        after=serialize_instance_for_audit(tipo),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(TipoAtributoSerializer(tipo).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def tipo_atributo_detalle(request, tipo_id):
    tipo = TipoAtributo.objects.filter(id=tipo_id).first()
    if not tipo:
        return Response({"detail": "Seccion no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            before = serialize_instance_for_audit(tipo)
            tipo.delete()
            create_audit_log(
                action="delete",
                entity="motos.TipoAtributo",
                entity_id=tipo_id,
                before=before,
                after=None,
                actor=request.user,
                metadata=_request_meta(request),
            )
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar la seccion porque tiene items asociados."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = TipoAtributoSerializer(tipo, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    before = serialize_instance_for_audit(tipo)
    updated_tipo = serializer.save()
    create_audit_log(
        action="update",
        entity="motos.TipoAtributo",
        entity_id=updated_tipo.pk,
        before=before,
        after=serialize_instance_for_audit(updated_tipo),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(TipoAtributoSerializer(updated_tipo).data)


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def valores_atributo_moto(request):
    if request.method == "GET":
        moto_id = request.GET.get("moto")
        if moto_id:
            moto = Moto.objects.filter(id=moto_id).first()
            if moto:
                ensure_moto_ficha_defaults(moto)
        queryset = ValorAtributoMoto.objects.select_related("moto", "tipo_atributo").order_by(
            "tipo_atributo__orden",
            "orden",
            "id",
        )
        if moto_id:
            queryset = queryset.filter(moto_id=moto_id)
        serializer = ValorAtributoMotoSerializer(queryset, many=True)
        return Response(serializer.data)

    global_mode = str(request.data.get("global", "")).strip().lower() in ("1", "true", "si", "yes")
    if global_mode:
        tipo_atributo_id = request.data.get("tipo_atributo")
        nombre = str(request.data.get("nombre") or "").strip()
        valor = str(request.data.get("valor") or "")
        tipo_control = str(request.data.get("tipo_control") or "texto").strip().lower()
        orden_raw = request.data.get("orden", 1)

        try:
            orden = int(orden_raw)
        except (TypeError, ValueError):
            orden = 1

        if not tipo_atributo_id:
            return Response(
                {"detail": "El tipo_atributo es obligatorio para crear item global."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not nombre:
            return Response(
                {"detail": "El nombre del item es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if tipo_control not in {"texto", "switch"}:
            return Response(
                {"detail": "El tipo de control debe ser texto o switch."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tipo_atributo = TipoAtributo.objects.filter(id=tipo_atributo_id).first()
        if not tipo_atributo:
            return Response({"detail": "Seccion no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        created_count = 0
        skipped_count = 0
        failed = []

        for moto in Moto.objects.only("id").order_by("id"):
            try:
                _, created = ValorAtributoMoto.objects.get_or_create(
                    moto_id=moto.id,
                    tipo_atributo_id=tipo_atributo.id,
                    nombre=nombre,
                    defaults={"valor": valor, "orden": orden, "tipo_control": tipo_control},
                )
                if created:
                    created_count += 1
                else:
                    skipped_count += 1
            except Exception as exc:
                failed.append({"moto_id": moto.id, "error": str(exc)})

        failed_count = len(failed)
        create_audit_log(
            action="update",
            entity="motos.ValorAtributoMoto.global",
            entity_id=tipo_atributo.id,
            before=None,
            after={
                "nombre": nombre,
                "tipo_control": tipo_control,
                "created_count": created_count,
                "skipped_count": skipped_count,
                "failed_count": failed_count,
            },
            actor=request.user,
            metadata=_request_meta(request),
        )
        response_status = status.HTTP_201_CREATED if failed_count == 0 else status.HTTP_207_MULTI_STATUS
        return Response(
            {
                "mode": "global",
                "nombre": nombre,
                "tipo_atributo": tipo_atributo.id,
                "tipo_control": tipo_control,
                "created_count": created_count,
                "skipped_count": skipped_count,
                "failed_count": failed_count,
                "failed": failed[:5],
            },
            status=response_status,
        )

    serializer = ValorAtributoMotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    valor = serializer.save()
    create_audit_log(
        action="create",
        entity="motos.ValorAtributoMoto",
        entity_id=valor.pk,
        before=None,
        after=serialize_instance_for_audit(valor),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(ValorAtributoMotoSerializer(valor).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def valor_atributo_moto_detalle(request, valor_id):
    valor = ValorAtributoMoto.objects.filter(id=valor_id).first()
    if not valor:
        return Response({"detail": "Item no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        before = serialize_instance_for_audit(valor)
        valor.delete()
        create_audit_log(
            action="delete",
            entity="motos.ValorAtributoMoto",
            entity_id=valor_id,
            before=before,
            after=None,
            actor=request.user,
            metadata=_request_meta(request),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = ValorAtributoMotoSerializer(valor, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    before = serialize_instance_for_audit(valor)
    updated_valor = serializer.save()
    create_audit_log(
        action="update",
        entity="motos.ValorAtributoMoto",
        entity_id=updated_valor.pk,
        before=before,
        after=serialize_instance_for_audit(updated_valor),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(ValorAtributoMotoSerializer(updated_valor).data)




