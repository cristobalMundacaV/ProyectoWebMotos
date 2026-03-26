from rest_framework import serializers
import re

from catalogo.models import Marca

from .models import CompatibilidadProductoMoto, ImagenProducto, Producto


def normalize_product_name(value):
    raw = str(value or "").replace("\t", " ")
    normalized_parts = []

    for part in raw.split():
        if not part:
            continue
        if re.fullmatch(r"[A-Z0-9-]+", part) and re.search(r"[A-Z]", part):
            normalized_parts.append(part)
            continue
        normalized_parts.append(part[:1].upper() + part[1:])

    return " ".join(normalized_parts).strip()


def force_brand_token_in_name(nombre, marca):
    normalized = normalize_product_name(nombre)
    brand_name = str(getattr(marca, "nombre", "") or "").strip()
    if not normalized or not brand_name:
        return normalized

    pattern = re.compile(rf"(?<!\w){re.escape(brand_name)}(?!\w)", re.IGNORECASE)
    return pattern.sub(brand_name, normalized)


class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ["id", "imagen", "texto_alternativo", "orden"]


class ProductoSerializer(serializers.ModelSerializer):
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    categoria_nombre = serializers.CharField(source="subcategoria.categoria.nombre", read_only=True)
    categoria_slug = serializers.CharField(source="subcategoria.categoria.slug", read_only=True)
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
            "imagenes",
            "es_destacado",
            "orden_carrusel",
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
            "orden_carrusel",
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

    def validate_nombre(self, nombre):
        normalized = normalize_product_name(nombre)
        if not normalized:
            raise serializers.ValidationError("El nombre es obligatorio.")
        return normalized

    def validate(self, attrs):
        requiere_compatibilidad = attrs.get("requiere_compatibilidad", False)
        moto_ids = attrs.get("compatibilidad_motos", [])
        marca = attrs.get("marca")

        if requiere_compatibilidad and not moto_ids:
            raise serializers.ValidationError(
                {"compatibilidad_motos": ["Selecciona al menos una moto compatible."]}
            )

        if "nombre" in attrs:
            attrs["nombre"] = force_brand_token_in_name(attrs.get("nombre"), marca)

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
            "orden_carrusel",
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
                "La subcategoria debe pertenecer a categorias rider, no a Accesorios Motos."
            )
        return subcategoria

    def validate_nombre(self, nombre):
        normalized = normalize_product_name(nombre)
        if not normalized:
            raise serializers.ValidationError("El nombre es obligatorio.")
        return normalized

    def create(self, validated_data):
        validated_data["requiere_compatibilidad"] = False
        return Producto.objects.create(**validated_data)

    def validate(self, attrs):
        marca = attrs.get("marca")
        if "nombre" in attrs:
            attrs["nombre"] = force_brand_token_in_name(attrs.get("nombre"), marca)
        return attrs


class ProductoAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            "subcategoria",
            "marca",
            "nombre",
            "descripcion",
            "precio",
            "stock",
            "imagen_principal",
            "es_destacado",
            "orden_carrusel",
            "activo",
        ]
        extra_kwargs = {
            "marca": {"required": False, "allow_null": False},
            "subcategoria": {"required": False},
        }

    def validate_marca(self, marca):
        if marca is None:
            raise serializers.ValidationError("La marca es obligatoria.")
        return marca

    def validate_subcategoria(self, subcategoria):
        return subcategoria

    def validate_nombre(self, nombre):
        normalized = normalize_product_name(nombre)
        if not normalized:
            raise serializers.ValidationError("El nombre es obligatorio.")
        return normalized

    def validate(self, attrs):
        marca = attrs.get("marca") or getattr(self.instance, "marca", None)
        subcategoria = attrs.get("subcategoria") or getattr(self.instance, "subcategoria", None)

        categoria_slug = getattr(getattr(subcategoria, "categoria", None), "slug", "")
        if categoria_slug in ["accesorios-para-la-moto", "accesorios"]:
            if marca and marca.tipo and marca.tipo != Marca.TIPO_ACCESORIO_MOTO:
                raise serializers.ValidationError({"marca": "La marca seleccionada no pertenece a Accesorios Motos."})
        else:
            if marca and marca.tipo and marca.tipo != Marca.TIPO_ACCESORIO_RIDER:
                raise serializers.ValidationError({"marca": "La marca seleccionada no pertenece a Indumentaria Rider."})

        if "nombre" in attrs:
            attrs["nombre"] = force_brand_token_in_name(attrs.get("nombre"), marca)
        return attrs
