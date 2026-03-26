from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Max, Q

from catalogo.models import Marca, SubcategoriaProducto
from clientes.permissions import has_admin_access
from motos.models import Moto
from .models import ImagenProducto, Producto
from .serializers import (
	ProductoAdminUpdateSerializer,
	ProductoAccesorioAdminSerializer,
	ProductoAccesorioRiderAdminSerializer,
	ProductoSerializer,
)


ACCESORIOS_CATEGORY_SLUGS = ["accesorios-para-la-moto", "accesorios"]


def _save_producto_gallery_files(producto, files):
	if not producto or not files:
		return
	first_created_image = None
	current_max_order = producto.imagenes.aggregate(max_order=Max("orden")).get("max_order") or 0
	for index, image_file in enumerate(files, start=1):
		created_image = ImagenProducto.objects.create(
			producto=producto,
			imagen=image_file,
			orden=current_max_order + index,
		)
		if first_created_image is None:
			first_created_image = created_image
	if first_created_image and not producto.imagen_principal:
		producto.imagen_principal = first_created_image.imagen
		producto.save(update_fields=["imagen_principal"])


def _filter_marcas_por_tipo(queryset, tipo):
	tipo = (tipo or "").strip().lower()

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


def _apply_tipo_filter(queryset, tipo):
	if tipo == "accesorios":
		return queryset.filter(subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)

	if tipo == "indumentaria":
		return queryset.exclude(subcategoria__categoria__slug__in=ACCESORIOS_CATEGORY_SLUGS)

	return queryset


@api_view(["GET"])
def lista_productos(request):
	tipo = request.GET.get("tipo", "").strip().lower()
	moto_slug = request.GET.get("moto", "").strip()
	order = request.GET.get("order", "").strip().lower()

	productos = Producto.objects.filter(activo=True).select_related(
		"subcategoria", "subcategoria__categoria"
	).prefetch_related("imagenes")
	productos = _apply_tipo_filter(productos, tipo)

	if moto_slug:
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
def motos_compatibles(request):
	motos = Moto.objects.filter(activa=True).order_by("modelo").values("id", "slug", "modelo")
	return Response(list(motos))


@api_view(["GET"])
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
def admin_accesorios_motos(request):
	if not has_admin_access(request.user):
		return Response(
			{"detail": "Solo administradores pueden gestionar accesorios."},
			status=status.HTTP_403_FORBIDDEN,
		)

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
	producto = serializer.save()
	_save_producto_gallery_files(producto, request.FILES.getlist("imagenes"))

	response_serializer = ProductoSerializer(producto)
	return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
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
def admin_accesorios_rider(request):
	if not has_admin_access(request.user):
		return Response(
			{"detail": "Solo administradores pueden gestionar accesorios rider."},
			status=status.HTTP_403_FORBIDDEN,
		)

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
	producto = serializer.save()
	_save_producto_gallery_files(producto, request.FILES.getlist("imagenes"))

	response_serializer = ProductoSerializer(producto)
	return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
def admin_producto_detalle(request, producto_id):
	if not has_admin_access(request.user):
		return Response(
			{"detail": "Solo administradores pueden gestionar productos."},
			status=status.HTTP_403_FORBIDDEN,
		)

	producto = Producto.objects.filter(id=producto_id).first()
	if not producto:
		return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

	if request.method == "DELETE":
		producto.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

	serializer = ProductoAdminUpdateSerializer(producto, data=request.data, partial=True)
	serializer.is_valid(raise_exception=True)
	serializer.save()
	_save_producto_gallery_files(producto, request.FILES.getlist("imagenes"))

	response_serializer = ProductoSerializer(producto)
	return Response(response_serializer.data)

