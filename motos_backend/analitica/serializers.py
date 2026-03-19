from rest_framework import serializers

from .models import CatalogoEvento


class CatalogoEventoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogoEvento
        fields = (
            "tipo_evento",
            "tipo_entidad",
            "entidad_id",
            "entidad_slug",
            "entidad_nombre",
            "session_id",
            "origen",
            "metadata",
        )

    def validate_session_id(self, value: str) -> str:
        return (value or "").strip()[:80]

    def validate_origen(self, value: str) -> str:
        return (value or "").strip()[:255]

    def validate(self, attrs):
        attrs["entidad_nombre"] = (attrs.get("entidad_nombre") or "").strip()
        attrs["entidad_slug"] = (attrs.get("entidad_slug") or "").strip().lower()
        return attrs
