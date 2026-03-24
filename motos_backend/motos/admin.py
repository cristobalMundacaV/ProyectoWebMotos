from django.contrib import admin

from .models import (
    EspecificacionMoto,
    ImagenMoto,
    ItemFichaTecnica,
    ModeloMoto,
    Moto,
    SeccionFichaTecnica,
    TipoAtributo,
    ValorAtributoMoto,
)


class SeccionFichaTecnicaInline(admin.TabularInline):
    model = SeccionFichaTecnica
    extra = 1
    fields = ("nombre", "orden")
    ordering = ("orden", "id")


class ItemFichaTecnicaInline(admin.TabularInline):
    model = ItemFichaTecnica
    extra = 1
    fields = ("nombre", "valor", "orden")
    ordering = ("orden", "id")


class ValorAtributoMotoInline(admin.TabularInline):
    model = ValorAtributoMoto
    extra = 1
    fields = ("tipo_atributo", "nombre", "valor", "orden")
    autocomplete_fields = ("tipo_atributo",)
    ordering = ("orden", "id")


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
    inlines = [ValorAtributoMotoInline, SeccionFichaTecnicaInline]


@admin.register(ImagenMoto)
class ImagenMotoAdmin(admin.ModelAdmin):
    list_display = ("id", "moto", "orden")
    autocomplete_fields = ("moto",)


@admin.register(EspecificacionMoto)
class EspecificacionMotoAdmin(admin.ModelAdmin):
    list_display = ("id", "moto", "clave", "valor")
    search_fields = ("clave", "valor", "moto__modelo")
    autocomplete_fields = ("moto",)


@admin.register(SeccionFichaTecnica)
class SeccionFichaTecnicaAdmin(admin.ModelAdmin):
    list_display = ("id", "moto", "nombre", "orden")
    list_filter = ("moto__marca",)
    search_fields = ("nombre", "moto__modelo", "moto__marca__nombre")
    autocomplete_fields = ("moto",)
    ordering = ("moto_id", "orden", "id")
    inlines = [ItemFichaTecnicaInline]


@admin.register(ItemFichaTecnica)
class ItemFichaTecnicaAdmin(admin.ModelAdmin):
    list_display = ("id", "seccion", "nombre", "orden")
    search_fields = ("nombre", "valor", "seccion__nombre", "seccion__moto__modelo")
    autocomplete_fields = ("seccion",)
    ordering = ("seccion_id", "orden", "id")


@admin.register(TipoAtributo)
class TipoAtributoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "orden", "activo")
    list_filter = ("activo",)
    search_fields = ("nombre", "slug")
    ordering = ("orden", "id")


@admin.register(ValorAtributoMoto)
class ValorAtributoMotoAdmin(admin.ModelAdmin):
    list_display = ("id", "moto", "tipo_atributo", "nombre", "orden")
    list_filter = ("tipo_atributo", "moto__marca")
    search_fields = ("moto__modelo", "tipo_atributo__nombre", "nombre", "valor")
    autocomplete_fields = ("moto", "tipo_atributo")
    ordering = ("moto_id", "orden", "id")
