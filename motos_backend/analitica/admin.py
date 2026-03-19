from django.contrib import admin

from .models import CatalogoEvento


@admin.register(CatalogoEvento)
class CatalogoEventoAdmin(admin.ModelAdmin):
    list_display = ("created_at", "tipo_evento", "tipo_entidad", "entidad_nombre", "entidad_id", "session_id")
    list_filter = ("tipo_evento", "tipo_entidad", "created_at")
    search_fields = ("entidad_nombre", "entidad_slug", "session_id", "origen")
