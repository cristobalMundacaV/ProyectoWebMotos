from django.contrib import admin
from .models import Marca, CategoriaMoto, CategoriaProducto, SubcategoriaProducto


@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
	list_display = ("id", "nombre", "tipo", "slug", "activa")
	list_filter = ("tipo", "activa")
	search_fields = ("nombre", "slug")


@admin.register(CategoriaMoto)
class CategoriaMotoAdmin(admin.ModelAdmin):
	list_display = ("id", "nombre", "slug", "activa")
	list_filter = ("activa",)
	search_fields = ("nombre", "slug")


@admin.register(CategoriaProducto)
class CategoriaProductoAdmin(admin.ModelAdmin):
	list_display = ("id", "nombre", "slug", "activa")
	list_filter = ("activa",)
	search_fields = ("nombre", "slug")


@admin.register(SubcategoriaProducto)
class SubcategoriaProductoAdmin(admin.ModelAdmin):
	list_display = ("id", "nombre", "categoria", "slug", "activa")
	list_filter = ("activa", "categoria")
	search_fields = ("nombre", "slug", "categoria__nombre")
