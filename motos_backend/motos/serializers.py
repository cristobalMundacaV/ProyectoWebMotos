from rest_framework import serializers

from catalogo.models import CategoriaMoto, Marca
from .models import Moto


class MotoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)

    def validate_marca(self, marca):
        if marca.tipo and marca.tipo != Marca.TIPO_MOTO:
            raise serializers.ValidationError("La marca seleccionada no pertenece a motos.")
        return marca

    class Meta:
        model = Moto
        fields = "__all__"


class CategoriaMotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaMoto
        fields = ["id", "nombre", "slug", "descripcion", "activa"]


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ["id", "nombre", "slug", "descripcion", "tipo", "activa"]
