from django.contrib import admin

from .models import AuditLog, ContactoSitio


@admin.register(ContactoSitio)
class ContactoSitioAdmin(admin.ModelAdmin):
    list_display = ("id", "instagram", "telefono", "ubicacion", "actualizado_en")
    search_fields = ("instagram", "telefono", "ubicacion")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "creado_en", "accion", "entidad", "entidad_id", "actor", "request_id")
    list_filter = ("accion", "entidad", "creado_en")
    search_fields = ("request_id", "entidad", "entidad_id", "actor__username", "actor__email")
    readonly_fields = ("creado_en", "request_id", "actor", "entidad", "entidad_id", "accion", "before", "after", "metadata")
