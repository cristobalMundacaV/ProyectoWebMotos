from django.contrib import admin

from .models import Mantencion, VehiculoCliente


@admin.register(VehiculoCliente)
class VehiculoClienteAdmin(admin.ModelAdmin):
    list_display = ("matricula", "marca", "modelo", "cliente", "kilometraje_actual")
    search_fields = (
        "matricula",
        "marca",
        "modelo",
        "cliente__first_name",
        "cliente__last_name",
        "cliente__username",
    )


@admin.register(Mantencion)
class MantencionAdmin(admin.ModelAdmin):
    list_display = ("moto_cliente", "fecha_ingreso", "estado", "tipo_mantencion", "costo_total")
    list_filter = ("estado", "tipo_mantencion", "fecha_ingreso")
    search_fields = ("moto_cliente__matricula", "moto_cliente__marca")
