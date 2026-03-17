from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import CategoriaProducto, SubcategoriaProducto


ACCESORIOS_CATEGORY_SLUGS = ["accesorios-para-la-moto", "accesorios"]


@api_view(["GET", "POST"])
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

	if not request.user or not request.user.is_authenticated:
		return Response(
			{"detail": "Debes iniciar sesión para crear categorías."},
			status=status.HTTP_401_UNAUTHORIZED,
		)

	nombre = (request.data.get("nombre") or "").strip()
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

	if not request.user or not request.user.is_authenticated:
		return Response(
			{"detail": "Debes iniciar sesión para crear categorías."},
			status=status.HTTP_401_UNAUTHORIZED,
		)

	nombre = (request.data.get("nombre") or "").strip()
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
			{"detail": "No existe una categoría padre para Accesorios de Moto."},
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

	if not request.user or not request.user.is_authenticated:
		return Response(
			{"detail": "Debes iniciar sesión para crear categorías."},
			status=status.HTTP_401_UNAUTHORIZED,
		)

	nombre = (request.data.get("nombre") or "").strip()
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
			{"detail": "No existe una categoría padre para Indumentaria Rider."},
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


def _validate_auth_for_catalog_update(request):
	if not request.user or not request.user.is_authenticated:
		return Response(
			{"detail": "Debes iniciar sesion para gestionar categorias."},
			status=status.HTTP_401_UNAUTHORIZED,
		)
	return None


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
		subcategoria.nombre = (data.get("nombre") or "").strip() or subcategoria.nombre
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
def categorias_accesorios_moto_detalle(request, subcategoria_id):
	auth_error = _validate_auth_for_catalog_update(request)
	if auth_error:
		return auth_error

	subcategoria = SubcategoriaProducto.objects.select_related("categoria").filter(id=subcategoria_id).first()
	if not subcategoria or subcategoria.categoria.slug not in ACCESORIOS_CATEGORY_SLUGS:
		return Response({"detail": "Subcategoria no encontrada."}, status=status.HTTP_404_NOT_FOUND)

	if request.method == "DELETE":
		subcategoria.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

	subcategoria = _update_subcategoria_from_request(subcategoria, request.data)
	return Response(_serialize_subcategoria(subcategoria))


@api_view(["PATCH", "DELETE"])
def categorias_accesorios_rider_detalle(request, subcategoria_id):
	auth_error = _validate_auth_for_catalog_update(request)
	if auth_error:
		return auth_error

	subcategoria = SubcategoriaProducto.objects.select_related("categoria").filter(id=subcategoria_id).first()
	if not subcategoria or subcategoria.categoria.slug in ACCESORIOS_CATEGORY_SLUGS:
		return Response({"detail": "Subcategoria no encontrada."}, status=status.HTTP_404_NOT_FOUND)

	if request.method == "DELETE":
		subcategoria.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

	subcategoria = _update_subcategoria_from_request(subcategoria, request.data)
	return Response(_serialize_subcategoria(subcategoria))
