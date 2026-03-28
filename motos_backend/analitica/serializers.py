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


class KpiMetaSerializer(serializers.Serializer):
    name = serializers.CharField()
    type = serializers.CharField()
    time_mode = serializers.CharField()
    window = serializers.DictField(child=serializers.CharField())
    comparison_window = serializers.DictField(child=serializers.CharField(), required=False, allow_null=True)
    sample_size = serializers.IntegerField()
    granularity = serializers.CharField()
    fallback_policy = serializers.CharField()
    decision_support = serializers.CharField()


class KpiContractSerializer(serializers.Serializer):
    kpi_key = serializers.CharField()
    value = serializers.JSONField(allow_null=True)
    display = serializers.CharField(allow_null=True, required=False)
    meta = KpiMetaSerializer()
    quality_flags = serializers.ListField(child=serializers.CharField(), allow_empty=True)
    empty_reason = serializers.CharField(allow_null=True, required=False)
