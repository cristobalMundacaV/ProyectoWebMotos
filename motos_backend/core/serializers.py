from rest_framework import serializers

from .models import ContactoSitio


class ContactoSitioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoSitio
        fields = ["instagram", "telefono", "ubicacion"]
