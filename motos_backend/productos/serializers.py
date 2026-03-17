from rest_framework import serializers

from catalogo.models import Marca

from .models import CompatibilidadProductoMoto, Producto


class ProductoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    categoria_nombre = serializers.CharField(
        source="subcategoria.categoria.nombre", read_only=True
    )
    categoria_slug = serializers.CharField(
        source="subcategoria.categoria.slug", read_only=True
    )
    subcategoria_nombre = serializers.CharField(source="subcategoria.nombre", read_only=True)
    subcategoria_slug = serializers.CharField(source="subcategoria.slug", read_only=True)

    class Meta:
        model = Producto
        fields = [
            "id",
            "nombre",
            "slug",
            "descripcion",
            "precio",
            "stock",
            "imagen_principal",
            "es_destacado",
            "activo",
            "requiere_compatibilidad",
            "fecha_creacion",
            "marca_nombre",
            "categoria_nombre",
            "categoria_slug",
            "subcategoria_nombre",
            "subcategoria_slug",
        ]


class CompatibilidadProductoMotoSerializer(serializers.ModelSerializer):
    moto_id = serializers.IntegerField(source="moto.id", read_only=True)
    moto_nombre = serializers.CharField(source="moto.modelo", read_only=True)
    moto_slug = serializers.CharField(source="moto.slug", read_only=True)

    class Meta:
        model = CompatibilidadProductoMoto
        fields = ["moto_id", "moto_nombre", "moto_slug"]


class ProductoAccesorioAdminSerializer(serializers.ModelSerializer):
    compatibilidad_motos = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        write_only=True,
    )

    class Meta:
        model = Producto
        fields = [
            "id",
            "subcategoria",
            "marca",
            "nombre",
            "slug",
            "descripcion",
            "precio",
            "stock",
            "imagen_principal",
            "es_destacado",
            "activo",
            "requiere_compatibilidad",
            "compatibilidad_motos",
        ]
        extra_kwargs = {
            "marca": {"required": True, "allow_null": False},
        }

    def validate_marca(self, marca):
        if marca is None:
            raise serializers.ValidationError("La marca es obligatoria.")
        if marca.tipo and marca.tipo != Marca.TIPO_ACCESORIO_MOTO:
            raise serializers.ValidationError("La marca seleccionada no pertenece a Accesorios Motos.")
        return marca

    def validate_subcategoria(self, subcategoria):
        if subcategoria.categoria.slug not in ["accesorios-para-la-moto", "accesorios"]:
            raise serializers.ValidationError("La subcategoria debe pertenecer a Accesorios Motos.")
        return subcategoria

    def validate(self, attrs):
        requiere_compatibilidad = attrs.get("requiere_compatibilidad", False)
        moto_ids = attrs.get("compatibilidad_motos", [])

        if requiere_compatibilidad and not moto_ids:
            raise serializers.ValidationError(
                {"compatibilidad_motos": ["Selecciona al menos una moto compatible."]}
            )

        return attrs

    def create(self, validated_data):
        moto_ids = validated_data.pop("compatibilidad_motos", [])
        producto = Producto.objects.create(**validated_data)

        if moto_ids:
            CompatibilidadProductoMoto.objects.bulk_create(
                [
                    CompatibilidadProductoMoto(producto=producto, moto_id=moto_id)
                    for moto_id in set(moto_ids)
                ]
            )

        return producto


class ProductoAccesorioRiderAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            "id",
            "subcategoria",
            "marca",
            "nombre",
            "slug",
            "descripcion",
            "precio",
            "stock",
            "imagen_principal",
            "es_destacado",
            "activo",
        ]
        extra_kwargs = {
            "marca": {"required": True, "allow_null": False},
        }

    def validate_marca(self, marca):
        if marca is None:
            raise serializers.ValidationError("La marca es obligatoria.")
        if marca.tipo and marca.tipo != Marca.TIPO_ACCESORIO_RIDER:
            raise serializers.ValidationError("La marca seleccionada no pertenece a Indumentaria Rider.")
        return marca

    def validate_subcategoria(self, subcategoria):
        if subcategoria.categoria.slug in ["accesorios-para-la-moto", "accesorios"]:
            raise serializers.ValidationError(
                "La subcategoria debe pertenecer a categorías rider, no a Accesorios Motos."
            )
        return subcategoria

    def create(self, validated_data):
        validated_data["requiere_compatibilidad"] = False
        return Producto.objects.create(**validated_data)


class ProductoAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            "nombre",
            "descripcion",
            "precio",
            "stock",
            "imagen_principal",
            "es_destacado",
            "activo",
        ]
