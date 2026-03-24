from django.db.models import Q
from django.db.models.deletion import ProtectedError
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from catalogo.models import CategoriaMoto, Marca
from clientes.permissions import has_admin_access
from .models import ModeloMoto, Moto, TipoAtributo, ValorAtributoMoto
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


def _filter_marcas_por_tipo(queryset, tipo):
    tipo = (tipo or "").strip().lower()

    if tipo == Marca.TIPO_MOTO:
        return queryset.filter(
            Q(tipo=Marca.TIPO_MOTO) | (Q(tipo__isnull=True) & Q(moto__isnull=False))
        ).distinct()

    if tipo == Marca.TIPO_ACCESORIO_MOTO:
        return queryset.filter(
            Q(tipo=Marca.TIPO_ACCESORIO_MOTO)
            | (
                Q(tipo__isnull=True)
                & Q(productos__subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
            )
        ).distinct()

    if tipo == Marca.TIPO_ACCESORIO_RIDER:
        return queryset.filter(
            Q(tipo=Marca.TIPO_ACCESORIO_RIDER)
            | (
                Q(tipo__isnull=True)
                & Q(productos__subcategoria__categoria__slug__isnull=False)
                & ~Q(productos__subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
            )
        ).distinct()

    return queryset


@api_view(["GET", "POST"])
def lista_motos(request):
    if request.method == "GET":
        motos = (
            Moto.objects.filter(activa=True)
            .select_related("marca", "modelo_moto", "modelo_moto__categoria")
            .order_by("-es_destacada", "orden_carrusel", "id")
        )
        serializer = MotoSerializer(motos, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear motos."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = MotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def detalle_moto_admin(request, moto_id):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar motos."},
            status=status.HTTP_403_FORBIDDEN,
        )

    moto = Moto.objects.filter(id=moto_id).first()
    if not moto:
        return Response({"detail": "Moto no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        moto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MotoSerializer(moto, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
def detalle_moto_ficha(request, moto_id):
    moto = (
        Moto.objects.filter(id=moto_id, activa=True)
        .select_related("marca", "modelo_moto", "modelo_moto__categoria")
        .prefetch_related("valores_atributos__tipo_atributo", "secciones_ficha__items")
        .first()
    )
    if not moto:
        return Response({"detail": "Moto no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    serializer = MotoDetalleFichaSerializer(moto)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
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
def modelos_moto(request):
    if request.method == "GET":
        marca_id = request.GET.get("marca")
        queryset = ModeloMoto.objects.select_related("marca", "categoria").order_by("nombre_modelo")
        if marca_id:
            queryset = queryset.filter(marca_id=marca_id)
        serializer = ModeloMotoSerializer(queryset, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear modelos."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ModeloMotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def modelos_moto_detalle(request, modelo_id):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar modelos."},
            status=status.HTTP_403_FORBIDDEN,
        )

    modelo = ModeloMoto.objects.filter(id=modelo_id).first()
    if not modelo:
        return Response({"detail": "Modelo no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            modelo.delete()
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar el modelo porque tiene motos asociadas."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = ModeloMotoSerializer(modelo, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    updated_modelo = serializer.save()
    Moto.objects.filter(modelo_moto=updated_modelo).update(modelo=updated_modelo.nombre_modelo)
    return Response(ModeloMotoSerializer(updated_modelo).data)


@api_view(["GET", "POST"])
def categorias_moto(request):
    if request.method == "GET":
        categorias = CategoriaMoto.objects.order_by("nombre")
        serializer = CategoriaMotoSerializer(categorias, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear categorias."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = CategoriaMotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def categorias_moto_detalle(request, categoria_id):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar categorias."},
            status=status.HTTP_403_FORBIDDEN,
        )

    categoria = CategoriaMoto.objects.filter(id=categoria_id).first()
    if not categoria:
        return Response({"detail": "Categoria no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            categoria.delete()
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar la categoria porque tiene motos asociadas."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = CategoriaMotoSerializer(categoria, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET", "POST"])
def marcas_moto(request):
    tipo = request.GET.get("tipo", "").strip().lower()

    if request.method == "GET":
        marcas = _filter_marcas_por_tipo(Marca.objects.order_by("nombre"), tipo)
        serializer = MarcaSerializer(marcas, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear marcas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    payload = request.data.copy()
    if tipo in {
        Marca.TIPO_MOTO,
        Marca.TIPO_ACCESORIO_MOTO,
        Marca.TIPO_ACCESORIO_RIDER,
    }:
        payload["tipo"] = tipo

    serializer = MarcaSerializer(data=payload)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def marcas_moto_detalle(request, marca_id):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar marcas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    marca = Marca.objects.filter(id=marca_id).first()
    if not marca:
        return Response({"detail": "Marca no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            marca.delete()
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar la marca porque tiene motos o productos asociados."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MarcaSerializer(marca, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET", "POST"])
def tipos_atributo(request):
    if request.method == "GET":
        queryset = TipoAtributo.objects.order_by("orden", "id")
        serializer = TipoAtributoSerializer(queryset, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear secciones de ficha tecnica."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = TipoAtributoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def tipo_atributo_detalle(request, tipo_id):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar secciones de ficha tecnica."},
            status=status.HTTP_403_FORBIDDEN,
        )

    tipo = TipoAtributo.objects.filter(id=tipo_id).first()
    if not tipo:
        return Response({"detail": "Seccion no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        try:
            tipo.delete()
        except ProtectedError:
            return Response(
                {"detail": "No se puede eliminar la seccion porque tiene items asociados."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = TipoAtributoSerializer(tipo, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET", "POST"])
def valores_atributo_moto(request):
    if request.method == "GET":
        moto_id = request.GET.get("moto")
        queryset = ValorAtributoMoto.objects.select_related("moto", "tipo_atributo").order_by(
            "tipo_atributo__orden",
            "orden",
            "id",
        )
        if moto_id:
            queryset = queryset.filter(moto_id=moto_id)
        serializer = ValorAtributoMotoSerializer(queryset, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear items de ficha tecnica."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ValorAtributoMotoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def valor_atributo_moto_detalle(request, valor_id):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar items de ficha tecnica."},
            status=status.HTTP_403_FORBIDDEN,
        )

    valor = ValorAtributoMoto.objects.filter(id=valor_id).first()
    if not valor:
        return Response({"detail": "Item no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        valor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = ValorAtributoMotoSerializer(valor, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
