from django.contrib import admin

from .models import ContactoSitio


@admin.register(ContactoSitio)
class ContactoSitioAdmin(admin.ModelAdmin):
    list_display = ("id", "instagram", "telefono", "ubicacion", "actualizado_en")
    search_fields = ("instagram", "telefono", "ubicacion")
