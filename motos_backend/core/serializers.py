from rest_framework import serializers
from .phone_utils import normalize_chile_phone

from .models import ContactoSitio


class ContactoSitioSerializer(serializers.ModelSerializer):
    def validate_telefono(self, value):
        try:
            return normalize_chile_phone(value, required=True)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc))

    class Meta:
        model = ContactoSitio
        fields = ["instagram", "telefono", "ubicacion"]
