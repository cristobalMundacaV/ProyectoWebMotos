from django.contrib import admin
from .models import Producto, ImagenProducto, EspecificacionProducto, CompatibilidadProductoMoto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
	list_display = ("id", "nombre", "categoria_padre", "subcategoria", "marca", "precio", "stock", "es_destacado", "orden_carrusel", "activo")
	list_filter = ("activo", "es_destacado", "requiere_compatibilidad", "subcategoria__categoria", "subcategoria", "marca")
	search_fields = ("nombre", "slug")

	def categoria_padre(self, obj):
		return obj.subcategoria.categoria.nombre

	categoria_padre.short_description = "Categoria"


@admin.register(ImagenProducto)
class ImagenProductoAdmin(admin.ModelAdmin):
	list_display = ("id", "producto", "orden")
	list_filter = ("producto",)
	search_fields = ("producto__nombre", "texto_alternativo")


@admin.register(EspecificacionProducto)
class EspecificacionProductoAdmin(admin.ModelAdmin):
	list_display = ("id", "producto", "clave", "valor")
	list_filter = ("producto",)
	search_fields = ("producto__nombre", "clave", "valor")


@admin.register(CompatibilidadProductoMoto)
class CompatibilidadProductoMotoAdmin(admin.ModelAdmin):
	list_display = ("id", "producto", "moto")
	list_filter = ("moto", "producto")
	search_fields = ("producto__nombre", "moto__nombre")
