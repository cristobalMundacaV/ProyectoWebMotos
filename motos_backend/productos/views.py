from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
import re

from catalogo.models import Marca, SubcategoriaProducto
from clientes.permissions import IsCatalogAdmin
from core.audit import build_request_metadata, create_audit_log, serialize_instance_for_audit
from motos.models import Moto
from .models import Producto
from .services import create_producto_with_relations, update_producto_with_relations
from .serializers import (
	ProductoAdminUpdateSerializer,
	ProductoAccesorioAdminSerializer,
	ProductoAccesorioRiderAdminSerializer,
	ProductoSerializer,
)


ACCESORIOS_CATEGORY_SLUGS = ["accesorios-para-la-moto", "accesorios"]


def _request_meta(request):
	return build_request_metadata(request)


def _parse_image_ids(raw_ids):
	ids = set()
	for raw_item in raw_ids or []:
		for match in re.findall(r"\d+", str(raw_item or "")):
			try:
				ids.add(int(match))
			except (TypeError, ValueError):
				continue
	return ids


def _parse_compatibilidad_motos(data):
	raw_values = []
	if hasattr(data, "getlist"):
		raw_values.extend(data.getlist("compatibilidad_motos"))
	value = data.get("compatibilidad_motos")
	if value not in (None, "", []):
		raw_values.append(value)

	ids = set()
	for raw in raw_values:
		if isinstance(raw, (list, tuple)):
			iter_values = raw
		else:
			iter_values = re.findall(r"\d+", str(raw))
		for item in iter_values:
			try:
				ids.add(int(item))
			except (TypeError, ValueError):
				continue
	return sorted(ids)


def _filter_marcas_por_tipo(queryset, tipo):
	tipo = (tipo or "").strip().lower()

	if tipo == Marca.TIPO_ACCESORIO_MOTO:
		return queryset.filter(tipo=Marca.TIPO_ACCESORIO_MOTO).distinct()

	if tipo == Marca.TIPO_ACCESORIO_RIDER:
		return queryset.filter(tipo=Marca.TIPO_ACCESORIO_RIDER).distinct()

	return queryset


def _apply_tipo_filter(queryset, tipo):
	if tipo == "accesorios":
		return queryset.filter(subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)

	if tipo == "indumentaria":
		return queryset.exclude(subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)

	return queryset


@api_view(["GET"])
@permission_classes([AllowAny])
def lista_productos(request):
	tipo = request.GET.get("tipo", "").strip().lower()
	moto_slug = request.GET.get("moto", "").strip()
	order = request.GET.get("order", "").strip().lower()

	productos = Producto.objects.filter(activo=True).select_related(
		"subcategoria", "subcategoria__categoria"
	).prefetch_related("imagenes")
	productos = _apply_tipo_filter(productos, tipo)

	if moto_slug:
		if moto_slug == "universal":
			productos = productos.filter(
				Q(requiere_compatibilidad=False) | Q(compatibilidades__isnull=True)
			)
		else:
			productos = productos.filter(compatibilidades__moto__slug=moto_slug)

	if order == "precio-asc":
		productos = productos.order_by("precio")
	elif order == "precio-desc":
		productos = productos.order_by("-precio")
	elif order == "release":
		productos = productos.order_by("-es_destacado", "orden_carrusel", "id")
	else:
		productos = productos.order_by("-fecha_creacion")

	serializer = ProductoSerializer(productos.distinct(), many=True)
	return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def categorias_producto(request):
	tipo = request.GET.get("tipo", "").strip().lower()

	subcategorias = SubcategoriaProducto.objects.filter(activa=True).select_related("categoria")
	if tipo == "accesorios":
		subcategorias = subcategorias.filter(categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
	elif tipo == "indumentaria":
		subcategorias = subcategorias.exclude(categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)

	categorias = sorted({sub.nombre for sub in subcategorias})
	return Response(categorias)


@api_view(["GET"])
@permission_classes([AllowAny])
def motos_compatibles(request):
	motos = list(Moto.objects.filter(activa=True).order_by("modelo").values("id", "slug", "modelo"))
	return Response(
		[
			{"id": 0, "slug": "universal", "modelo": "Universal"},
			*motos,
		]
	)


@api_view(["GET"])
@permission_classes([IsCatalogAdmin])
def accesorios_motos_meta(request):
	subcategorias = list(
		SubcategoriaProducto.objects.filter(categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
		.select_related("categoria")
		.order_by("nombre")
		.values("id", "nombre", "categoria__nombre")
	)
	motos = list(Moto.objects.filter(activa=True).order_by("modelo").values("id", "modelo", "slug"))
	marcas = list(
		_filter_marcas_por_tipo(Marca.objects.filter(activa=True), Marca.TIPO_ACCESORIO_MOTO)
		.order_by("nombre")
		.values("id", "nombre")
	)

	return Response(
		{
			"subcategorias": [
				{
					"id": sub["id"],
					"nombre": sub["nombre"],
					"categoria_nombre": sub["categoria__nombre"],
				}
				for sub in subcategorias
			],
			"marcas": marcas,
			"motos": motos,
		}
	)


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdmin])
def admin_accesorios_motos(request):
	if request.method == "GET":
		productos = (
			Producto.objects.filter(subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
			.select_related("subcategoria", "subcategoria__categoria", "marca")
			.prefetch_related("imagenes")
			.order_by("-fecha_creacion")
		)
		serializer = ProductoSerializer(productos, many=True)
		return Response(serializer.data)

	payload = request.data.copy()
	if payload.get("requiere_compatibilidad") in ["false", "False", "0", "off", "no", ""]:
		payload.setlist("compatibilidad_motos", [])

	serializer = ProductoAccesorioAdminSerializer(data=payload)
	serializer.is_valid(raise_exception=True)
	producto = create_producto_with_relations(
		serializer=serializer,
		gallery_files=request.FILES.getlist("imagenes"),
		actor=request.user,
		metadata=_request_meta(request),
	)

	response_serializer = ProductoSerializer(producto)
	return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsCatalogAdmin])
def accesorios_rider_meta(request):
	subcategorias = list(
		SubcategoriaProducto.objects.exclude(categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
		.select_related("categoria")
		.order_by("nombre")
		.values("id", "nombre", "categoria__nombre")
	)
	marcas = list(
		_filter_marcas_por_tipo(Marca.objects.filter(activa=True), Marca.TIPO_ACCESORIO_RIDER)
		.order_by("nombre")
		.values("id", "nombre")
	)

	return Response(
		{
			"subcategorias": [
				{
					"id": sub["id"],
					"nombre": sub["nombre"],
					"categoria_nombre": sub["categoria__nombre"],
				}
				for sub in subcategorias
			],
			"marcas": marcas,
		}
	)


@api_view(["GET", "POST"])
@permission_classes([IsCatalogAdmin])
def admin_accesorios_rider(request):
	if request.method == "GET":
		productos = (
			Producto.objects.exclude(subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)
			.select_related("subcategoria", "subcategoria__categoria", "marca")
			.prefetch_related("imagenes")
			.order_by("-es_destacado", "orden_carrusel", "id")
		)
		serializer = ProductoSerializer(productos, many=True)
		return Response(serializer.data)

	serializer = ProductoAccesorioRiderAdminSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	producto = create_producto_with_relations(
		serializer=serializer,
		gallery_files=request.FILES.getlist("imagenes"),
		actor=request.user,
		metadata=_request_meta(request),
	)

	response_serializer = ProductoSerializer(producto)
	return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsCatalogAdmin])
def admin_producto_detalle(request, producto_id):
	producto = Producto.objects.filter(id=producto_id).first()
	if not producto:
		return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

	if request.method == "DELETE":
		before = serialize_instance_for_audit(producto)
		producto.delete()
		create_audit_log(
			action="delete",
			entity="productos.Producto",
			entity_id=producto_id,
			before=before,
			after=None,
			actor=request.user,
			metadata=_request_meta(request),
		)
		return Response(status=status.HTTP_204_NO_CONTENT)

	serializer = ProductoAdminUpdateSerializer(producto, data=request.data, partial=True)
	serializer.is_valid(raise_exception=True)

	raw_delete_ids = []
	if hasattr(request.data, "getlist"):
		raw_delete_ids.extend(request.data.getlist("imagenes_eliminar"))
	if request.data.get("imagenes_eliminar"):
		raw_delete_ids.append(request.data.get("imagenes_eliminar"))

	image_ids_to_delete = _parse_image_ids(raw_delete_ids)
	compatibilidad_motos = None
	if "compatibilidad_motos" in request.data:
		compatibilidad_motos = _parse_compatibilidad_motos(request.data)
	if request.data.get("requiere_compatibilidad") in ["false", "False", "0", "off", "no", ""]:
		compatibilidad_motos = []

	producto = update_producto_with_relations(
		serializer=serializer,
		gallery_files=request.FILES.getlist("imagenes"),
		image_ids_to_delete=image_ids_to_delete,
		compatibilidad_motos=compatibilidad_motos,
		actor=request.user,
		metadata=_request_meta(request),
	)

	response_serializer = ProductoSerializer(producto)
	return Response(response_serializer.data)

