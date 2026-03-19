from django.contrib import admin

from .models import HorarioMantencion, Mantencion, MantencionEstadoHistorial, VehiculoCliente


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
    list_display = ("moto_cliente", "fecha_ingreso", "hora_ingreso", "estado", "tipo_mantencion", "kilometraje_ingreso", "costo_total")
    list_filter = ("estado", "tipo_mantencion", "fecha_ingreso")
    search_fields = ("moto_cliente__matricula", "moto_cliente__marca")


@admin.register(HorarioMantencion)
class HorarioMantencionAdmin(admin.ModelAdmin):
    list_display = ("dia_semana", "hora_inicio", "hora_fin", "intervalo_minutos", "cupos_por_bloque", "activo")
    list_filter = ("dia_semana", "activo")


@admin.register(MantencionEstadoHistorial)
class MantencionEstadoHistorialAdmin(admin.ModelAdmin):
    list_display = ("mantencion", "estado_anterior", "estado_nuevo", "fuente", "changed_by", "changed_at")
    list_filter = ("estado_nuevo", "fuente", "changed_at")
    search_fields = ("mantencion__moto_cliente__matricula", "mantencion__moto_cliente__marca")
