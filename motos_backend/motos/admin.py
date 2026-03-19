from django.contrib import admin

from .models import EspecificacionMoto, ImagenMoto, ModeloMoto, Moto


@admin.register(ModeloMoto)
class ModeloMotoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "marca",
        "nombre_modelo",
        "categoria",
        "cilindrada",
        "tipo_motor",
        "activo",
    )
    list_filter = ("activo", "marca", "categoria")
    search_fields = ("nombre_modelo", "slug", "marca__nombre")
    autocomplete_fields = ("marca", "categoria")


@admin.register(Moto)
class MotoAdmin(admin.ModelAdmin):
    list_display = ("id", "marca", "modelo_moto", "anio", "stock", "precio", "estado", "activa")
    list_filter = ("estado", "activa", "es_destacada", "marca", "modelo_moto")
    search_fields = ("modelo", "slug", "marca__nombre", "modelo_moto__nombre_modelo")
    autocomplete_fields = ("marca", "modelo_moto")


@admin.register(ImagenMoto)
class ImagenMotoAdmin(admin.ModelAdmin):
    list_display = ("id", "moto", "orden")
    autocomplete_fields = ("moto",)


@admin.register(EspecificacionMoto)
class EspecificacionMotoAdmin(admin.ModelAdmin):
    list_display = ("id", "moto", "clave", "valor")
    search_fields = ("clave", "valor", "moto__modelo")
    autocomplete_fields = ("moto",)
