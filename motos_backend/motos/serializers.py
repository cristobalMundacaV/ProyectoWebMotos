from rest_framework import serializers

from catalogo.models import CategoriaMoto, Marca
from .models import ModeloMoto, Moto


class ModeloMotoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)

    def validate_marca(self, marca):
        if marca.tipo and marca.tipo != Marca.TIPO_MOTO:
            raise serializers.ValidationError("La marca seleccionada no pertenece a motos.")
        return marca

    class Meta:
        model = ModeloMoto
        fields = ["id", "marca", "marca_nombre", "nombre", "slug", "descripcion", "activo"]


class MotoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)
    modelo = serializers.CharField(required=False, allow_blank=True)
    modelo_id = serializers.PrimaryKeyRelatedField(
        source="modelo_ref",
        queryset=ModeloMoto.objects.filter(activo=True),
        required=False,
        allow_null=True,
        write_only=True,
    )
    modelo_ref_nombre = serializers.CharField(source="modelo_ref.nombre", read_only=True)

    def validate_marca(self, marca):
        if marca.tipo and marca.tipo != Marca.TIPO_MOTO:
            raise serializers.ValidationError("La marca seleccionada no pertenece a motos.")
        return marca

    def validate(self, attrs):
        modelo_ref = attrs.get("modelo_ref")
        marca = attrs.get("marca") or getattr(self.instance, "marca", None)
        modelo = attrs.get("modelo", "").strip()

        if modelo_ref and marca and modelo_ref.marca_id != marca.id:
            raise serializers.ValidationError(
                {"modelo_id": "El modelo seleccionado no pertenece a la marca indicada."}
            )

        if not modelo_ref and not modelo:
            raise serializers.ValidationError(
                {"modelo_id": "Debes seleccionar un modelo o ingresar un nombre de modelo."}
            )

        return attrs

    def create(self, validated_data):
        modelo_ref = validated_data.get("modelo_ref")
        if modelo_ref:
            validated_data["modelo"] = modelo_ref.nombre
        return super().create(validated_data)

    def update(self, instance, validated_data):
        modelo_ref = validated_data.get("modelo_ref")
        if modelo_ref:
            validated_data["modelo"] = modelo_ref.nombre
        return super().update(instance, validated_data)

    class Meta:
        model = Moto
        fields = [
            "id",
            "marca",
            "categoria",
            "modelo_ref",
            "modelo_id",
            "modelo_ref_nombre",
            "modelo",
            "slug",
            "descripcion",
            "precio",
            "cilindrada",
            "anio",
            "stock",
            "imagen_principal",
            "es_destacada",
            "activa",
            "fecha_creacion",
            "marca_nombre",
            "categoria_nombre",
        ]


class CategoriaMotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaMoto
        fields = ["id", "nombre", "slug", "descripcion", "activa"]


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ["id", "nombre", "slug", "descripcion", "tipo", "activa"]
