from django.contrib import admin
from .models import ContactoCliente


@admin.register(ContactoCliente)
class ContactoClienteAdmin(admin.ModelAdmin):
	list_display = ("id", "nombre_completo", "telefono", "email", "moto", "producto", "fecha_creacion")
	list_filter = ("fecha_creacion", "moto", "producto")
	search_fields = ("nombre_completo", "telefono", "email")
