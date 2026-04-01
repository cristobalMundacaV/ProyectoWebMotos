from django.db.models.deletion import ProtectedError, RestrictedError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from clientes.permissions import IsCatalogAdmin, IsCatalogAdminOrReadOnly
from core.audit import build_request_metadata, create_audit_log, serialize_instance_for_audit
from .models import CategoriaProducto, SubcategoriaProducto


ACCESORIOS_CATEGORY_SLUGS = ["accesorios-para-la-moto", "accesorios"]


def _request_meta(request):
    return build_request_metadata(request)


def normalize_title_case_label(value):
    raw = str(value or "").replace("\t", " ")
    parts = [part for part in raw.split() if part]
    return " ".join(part[:1].upper() + part[1:].lower() for part in parts).strip()


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def categorias_indumentaria(request):
    if request.method == "GET":
        categorias = CategoriaProducto.objects.order_by("nombre")
        data = [
            {
                "id": categoria.id,
                "nombre": categoria.nombre,
                "slug": categoria.slug,
                "descripcion": categoria.descripcion,
                "activa": categoria.activa,
            }
            for categoria in categorias
        ]
        return Response(data)

    nombre = normalize_title_case_label(request.data.get("nombre"))
    slug = (request.data.get("slug") or "").strip()
    descripcion = (request.data.get("descripcion") or "").strip()
    activa = request.data.get("activa", True)

    if not nombre or not slug:
        return Response(
            {"detail": "Nombre y slug son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(activa, str):
        activa = activa.lower() in ["true", "1", "yes", "si", "on"]

    categoria = CategoriaProducto.objects.create(
        nombre=nombre,
        slug=slug,
        descripcion=descripcion,
        activa=activa,
    )
    create_audit_log(
        action="create",
        entity="catalogo.CategoriaProducto",
        entity_id=categoria.pk,
        before=None,
        after=serialize_instance_for_audit(categoria),
        actor=request.user,
        metadata=_request_meta(request),
    )

    return Response(
        {
            "id": categoria.id,
            "nombre": categoria.nombre,
            "slug": categoria.slug,
            "descripcion": categoria.descripcion,
            "activa": categoria.activa,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def categorias_accesorios_moto(request):
    if request.method == "GET":
        categorias_padre = list(
            CategoriaProducto.objects.filter(slug__in=ACCESORIOS_CATEGORY_SLUGS)
            .order_by("nombre")
            .values("id", "nombre", "slug")
        )
        subcategorias = list(
            SubcategoriaProducto.objects.filter(categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
            .select_related("categoria")
            .order_by("nombre")
            .values(
                "id",
                "nombre",
                "slug",
                "descripcion",
                "activa",
                "categoria_id",
                "categoria__nombre",
            )
        )

        return Response(
            {
                "categorias_padre": categorias_padre,
                "subcategorias": [
                    {
                        "id": sub["id"],
                        "nombre": sub["nombre"],
                        "slug": sub["slug"],
                        "descripcion": sub["descripcion"],
                        "activa": sub["activa"],
                        "categoria_id": sub["categoria_id"],
                        "categoria_nombre": sub["categoria__nombre"],
                    }
                    for sub in subcategorias
                ],
            }
        )

    nombre = normalize_title_case_label(request.data.get("nombre"))
    slug = (request.data.get("slug") or "").strip()
    descripcion = (request.data.get("descripcion") or "").strip()
    activa = request.data.get("activa", True)

    if not nombre or not slug:
        return Response(
            {"detail": "Nombre y slug son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    categoria = (
        CategoriaProducto.objects.filter(slug="accesorios-para-la-moto").first()
        or CategoriaProducto.objects.filter(slug="accesorios").first()
        or CategoriaProducto.objects.filter(slug__in=ACCESORIOS_CATEGORY_SLUGS).order_by("nombre").first()
    )
    if not categoria:
        return Response(
            {"detail": "No existe una categoria padre para Accesorios de Moto."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(activa, str):
        activa = activa.lower() in ["true", "1", "yes", "si", "on"]

    subcategoria = SubcategoriaProducto.objects.create(
        categoria=categoria,
        nombre=nombre,
        slug=slug,
        descripcion=descripcion,
        activa=activa,
    )
    create_audit_log(
        action="create",
        entity="catalogo.SubcategoriaProducto",
        entity_id=subcategoria.pk,
        before=None,
        after=serialize_instance_for_audit(subcategoria),
        actor=request.user,
        metadata=_request_meta(request),
    )

    return Response(
        {
            "id": subcategoria.id,
            "nombre": subcategoria.nombre,
            "slug": subcategoria.slug,
            "descripcion": subcategoria.descripcion,
            "activa": subcategoria.activa,
            "categoria_id": categoria.id,
            "categoria_nombre": categoria.nombre,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdminOrReadOnly])
def categorias_accesorios_rider(request):
    if request.method == "GET":
        categorias_padre = list(
            CategoriaProducto.objects.exclude(slug__in=ACCESORIOS_CATEGORY_SLUGS)
            .order_by("nombre")
            .values("id", "nombre", "slug")
        )
        subcategorias = list(
            SubcategoriaProducto.objects.exclude(categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
            .select_related("categoria")
            .order_by("nombre")
            .values(
                "id",
                "nombre",
                "slug",
                "descripcion",
                "activa",
                "categoria_id",
                "categoria__nombre",
            )
        )

        return Response(
            {
                "categorias_padre": categorias_padre,
                "subcategorias": [
                    {
                        "id": sub["id"],
                        "nombre": sub["nombre"],
                        "slug": sub["slug"],
                        "descripcion": sub["descripcion"],
                        "activa": sub["activa"],
                        "categoria_id": sub["categoria_id"],
                        "categoria_nombre": sub["categoria__nombre"],
                    }
                    for sub in subcategorias
                ],
            }
        )

    nombre = normalize_title_case_label(request.data.get("nombre"))
    slug = (request.data.get("slug") or "").strip()
    descripcion = (request.data.get("descripcion") or "").strip()
    activa = request.data.get("activa", True)

    if not nombre or not slug:
        return Response(
            {"detail": "Nombre y slug son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    categoria = (
        CategoriaProducto.objects.filter(slug="indumentaria-rider").first()
        or CategoriaProducto.objects.exclude(slug__in=ACCESORIOS_CATEGORY_SLUGS).order_by("nombre").first()
    )
    if not categoria:
        return Response(
            {"detail": "No existe una categoria padre para Indumentaria Rider."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(activa, str):
        activa = activa.lower() in ["true", "1", "yes", "si", "on"]

    subcategoria = SubcategoriaProducto.objects.create(
        categoria=categoria,
        nombre=nombre,
        slug=slug,
        descripcion=descripcion,
        activa=activa,
    )
    create_audit_log(
        action="create",
        entity="catalogo.SubcategoriaProducto",
        entity_id=subcategoria.pk,
        before=None,
        after=serialize_instance_for_audit(subcategoria),
        actor=request.user,
        metadata=_request_meta(request),
    )

    return Response(
        {
            "id": subcategoria.id,
            "nombre": subcategoria.nombre,
            "slug": subcategoria.slug,
            "descripcion": subcategoria.descripcion,
            "activa": subcategoria.activa,
            "categoria_id": categoria.id,
            "categoria_nombre": categoria.nombre,
        },
        status=status.HTTP_201_CREATED,
    )


def _serialize_subcategoria(subcategoria):
    return {
        "id": subcategoria.id,
        "nombre": subcategoria.nombre,
        "slug": subcategoria.slug,
        "descripcion": subcategoria.descripcion,
        "activa": subcategoria.activa,
        "categoria_id": subcategoria.categoria_id,
        "categoria_nombre": subcategoria.categoria.nombre,
    }


def _update_subcategoria_from_request(subcategoria, data):
    if "nombre" in data:
        subcategoria.nombre = normalize_title_case_label(data.get("nombre")) or subcategoria.nombre
    if "slug" in data:
        subcategoria.slug = (data.get("slug") or "").strip() or subcategoria.slug
    if "descripcion" in data:
        subcategoria.descripcion = (data.get("descripcion") or "").strip()
    if "activa" in data:
        activa = data.get("activa")
        if isinstance(activa, str):
            activa = activa.lower() in ["true", "1", "yes", "si", "on"]
        subcategoria.activa = bool(activa)
    subcategoria.save()
    return subcategoria


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def categorias_accesorios_moto_detalle(request, subcategoria_id):
    subcategoria = SubcategoriaProducto.objects.select_related("categoria").filter(id=subcategoria_id).first()
    if not subcategoria or subcategoria.categoria.slug not in ACCESORIOS_CATEGORY_SLUGS:
        return Response({"detail": "Subcategoria no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        if subcategoria.productos.exists():
            return Response(
                {"detail": "Cannot delete this item because it has related records."},
                status=status.HTTP_409_CONFLICT,
            )
        try:
            before = serialize_instance_for_audit(subcategoria)
            subcategoria.delete()
            create_audit_log(
                action="delete",
                entity="catalogo.SubcategoriaProducto",
                entity_id=subcategoria_id,
                before=before,
                after=None,
                actor=request.user,
                metadata=_request_meta(request),
            )
        except (ProtectedError, RestrictedError):
            return Response(
                {"detail": "Cannot delete this item because it has related records."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    before = serialize_instance_for_audit(subcategoria)
    subcategoria = _update_subcategoria_from_request(subcategoria, request.data)
    create_audit_log(
        action="update",
        entity="catalogo.SubcategoriaProducto",
        entity_id=subcategoria.pk,
        before=before,
        after=serialize_instance_for_audit(subcategoria),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(_serialize_subcategoria(subcategoria))


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def categorias_accesorios_rider_detalle(request, subcategoria_id):
    subcategoria = SubcategoriaProducto.objects.select_related("categoria").filter(id=subcategoria_id).first()
    if not subcategoria or subcategoria.categoria.slug in ACCESORIOS_CATEGORY_SLUGS:
        return Response({"detail": "Subcategoria no encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        if subcategoria.productos.exists():
            return Response(
                {"detail": "Cannot delete this item because it has related records."},
                status=status.HTTP_409_CONFLICT,
            )
        try:
            before = serialize_instance_for_audit(subcategoria)
            subcategoria.delete()
            create_audit_log(
                action="delete",
                entity="catalogo.SubcategoriaProducto",
                entity_id=subcategoria_id,
                before=before,
                after=None,
                actor=request.user,
                metadata=_request_meta(request),
            )
        except (ProtectedError, RestrictedError):
            return Response(
                {"detail": "Cannot delete this item because it has related records."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    before = serialize_instance_for_audit(subcategoria)
    subcategoria = _update_subcategoria_from_request(subcategoria, request.data)
    create_audit_log(
        action="update",
        entity="catalogo.SubcategoriaProducto",
        entity_id=subcategoria.pk,
        before=before,
        after=serialize_instance_for_audit(subcategoria),
        actor=request.user,
        metadata=_request_meta(request),
    )
    return Response(_serialize_subcategoria(subcategoria))
