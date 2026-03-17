from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from catalogo.models import CategoriaMoto, Marca
from clientes.permissions import has_admin_access
from .models import Moto
from .serializers import CategoriaMotoSerializer, MarcaSerializer, MotoSerializer


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
        motos = Moto.objects.filter(activa=True).select_related("marca", "categoria")
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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def meta_motos(request):
    marcas = list(
        _filter_marcas_por_tipo(Marca.objects.filter(activa=True), Marca.TIPO_MOTO)
        .order_by("nombre")
        .values("id", "nombre")
    )
    categorias = list(
        CategoriaMoto.objects.filter(activa=True)
        .order_by("nombre")
        .values("id", "nombre")
    )

    return Response({"marcas": marcas, "categorias": categorias})


@api_view(["GET", "POST"])
def categorias_moto(request):
    if request.method == "GET":
        categorias = CategoriaMoto.objects.order_by("nombre")
        serializer = CategoriaMotoSerializer(categorias, many=True)
        return Response(serializer.data)

    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden crear categorías."},
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
        categoria.delete()
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
        marca.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MarcaSerializer(marca, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
