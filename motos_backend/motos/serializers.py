from django.utils.text import slugify
from rest_framework import serializers

from catalogo.models import CategoriaMoto, Marca
from .models import ModeloMoto, Moto


def normalize_uppercase_label(value):
    return str(value or "").strip().replace("\t", " ").replace("  ", " ").upper()


def normalize_title_case_label(value):
    raw = str(value or "").replace("\t", " ")
    parts = [part for part in raw.split() if part]
    return " ".join(part[:1].upper() + part[1:].lower() for part in parts).strip()


class ModeloMotoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    nombre = serializers.CharField(source="nombre_modelo", required=False)
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)

    def _build_unique_slug(self, nombre_modelo):
        base_slug = slugify(nombre_modelo) or "modelo-moto"
        candidate = base_slug
        counter = 2
        queryset = ModeloMoto.objects.all()
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        while queryset.filter(slug=candidate).exists():
            candidate = f"{base_slug}-{counter}"
            counter += 1
        return candidate

    def validate_marca(self, marca):
        if marca.tipo and marca.tipo != Marca.TIPO_MOTO:
            raise serializers.ValidationError("La marca seleccionada no pertenece a motos.")
        return marca

    def validate(self, attrs):
        nombre_modelo = (attrs.get("nombre_modelo") or getattr(self.instance, "nombre_modelo", "")).strip()
        categoria = attrs.get("categoria", getattr(self.instance, "categoria", None))
        cilindrada = attrs.get("cilindrada", getattr(self.instance, "cilindrada", None))
        if not nombre_modelo:
            raise serializers.ValidationError({"nombre": "El nombre del modelo es obligatorio."})
        if not categoria:
            raise serializers.ValidationError({"categoria": "La categoria del modelo es obligatoria."})
        if cilindrada in (None, ""):
            raise serializers.ValidationError({"cilindrada": "La cilindrada del modelo es obligatoria."})
        if int(cilindrada) <= 0:
            raise serializers.ValidationError({"cilindrada": "La cilindrada debe ser mayor a 0."})
        attrs["nombre_modelo"] = nombre_modelo
        if not attrs.get("slug"):
            attrs["slug"] = self._build_unique_slug(nombre_modelo)
        return attrs

    class Meta:
        model = ModeloMoto
        fields = [
            "id",
            "marca",
            "marca_nombre",
            "nombre_modelo",
            "nombre",
            "slug",
            "descripcion",
            "categoria",
            "categoria_nombre",
            "cilindrada",
            "tipo_motor",
            "potencia",
            "torque",
            "refrigeracion",
            "transmision",
            "peso",
            "capacidad_estanque",
            "activo",
        ]


class MotoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    categoria_nombre = serializers.CharField(source="modelo_moto.categoria.nombre", read_only=True)
    modelo = serializers.CharField(required=False, allow_blank=True)
    modelo_id = serializers.PrimaryKeyRelatedField(
        source="modelo_moto",
        queryset=ModeloMoto.objects.filter(activo=True),
        required=False,
        allow_null=True,
        write_only=True,
    )
    modelo_ref_nombre = serializers.CharField(source="modelo_moto.nombre_modelo", read_only=True)
    modelo_ref = serializers.IntegerField(source="modelo_moto.id", read_only=True)
    categoria = serializers.IntegerField(source="modelo_moto.categoria_id", read_only=True)
    cilindrada = serializers.IntegerField(source="modelo_moto.cilindrada", read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        source="_legacy_categoria",
        queryset=CategoriaMoto.objects.filter(activa=True),
        required=False,
        allow_null=True,
        write_only=True,
    )
    cilindrada_input = serializers.IntegerField(
        source="_legacy_cilindrada",
        required=False,
        write_only=True,
        min_value=0,
    )

    def to_internal_value(self, data):
        payload = data.copy() if hasattr(data, "copy") else dict(data)
        if "categoria" in payload and "categoria_id" not in payload:
            payload["categoria_id"] = payload.get("categoria")
        if "cilindrada" in payload and "cilindrada_input" not in payload:
            payload["cilindrada_input"] = payload.get("cilindrada")
        return super().to_internal_value(payload)

    def validate_marca(self, marca):
        if marca.tipo and marca.tipo != Marca.TIPO_MOTO:
            raise serializers.ValidationError("La marca seleccionada no pertenece a motos.")
        return marca

    def validate(self, attrs):
        modelo_moto = attrs.get("modelo_moto")
        marca = attrs.get("marca") or getattr(self.instance, "marca", None)
        modelo = (attrs.get("modelo") or "").strip()
        attrs["modelo"] = modelo

        if modelo_moto and marca and modelo_moto.marca_id != marca.id:
            raise serializers.ValidationError({"modelo_id": "El modelo seleccionado no pertenece a la marca indicada."})

        if not modelo_moto and not modelo:
            raise serializers.ValidationError({"modelo_id": "Debes seleccionar un modelo o ingresar un nombre de modelo."})

        return attrs

    def _build_unique_modelo_slug(self, nombre_modelo, marca_id):
        base_slug = slugify(nombre_modelo) or f"modelo-{marca_id}"
        candidate = base_slug
        counter = 2
        while ModeloMoto.objects.filter(slug=candidate).exists():
            candidate = f"{base_slug}-{counter}"
            counter += 1
        return candidate

    def _ensure_modelo_moto(self, validated_data):
        modelo_moto = validated_data.get("modelo_moto")
        if modelo_moto:
            return modelo_moto

        marca = validated_data.get("marca") or getattr(self.instance, "marca", None)
        modelo_text = (validated_data.get("modelo") or "").strip()
        if not marca or not modelo_text:
            return None

        legacy_categoria = validated_data.pop("_legacy_categoria", None)
        legacy_cilindrada = validated_data.pop("_legacy_cilindrada", None)

        modelo_moto, _ = ModeloMoto.objects.get_or_create(
            marca=marca,
            nombre_modelo=modelo_text,
            defaults={
                "slug": self._build_unique_modelo_slug(modelo_text, marca.id),
                "activo": True,
                "categoria": legacy_categoria,
                "cilindrada": legacy_cilindrada,
            },
        )

        update_fields = []
        if legacy_categoria and modelo_moto.categoria_id is None:
            modelo_moto.categoria = legacy_categoria
            update_fields.append("categoria")
        if legacy_cilindrada is not None and modelo_moto.cilindrada is None:
            modelo_moto.cilindrada = legacy_cilindrada
            update_fields.append("cilindrada")
        if update_fields:
            modelo_moto.save(update_fields=update_fields)

        validated_data["modelo_moto"] = modelo_moto
        return modelo_moto

    def create(self, validated_data):
        validated_data.pop("_legacy_categoria", None)
        validated_data.pop("_legacy_cilindrada", None)
        modelo_moto = self._ensure_modelo_moto(validated_data)
        if modelo_moto:
            validated_data["modelo"] = modelo_moto.nombre_modelo
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("_legacy_categoria", None)
        validated_data.pop("_legacy_cilindrada", None)
        modelo_moto = self._ensure_modelo_moto(validated_data)
        if modelo_moto:
            validated_data["modelo"] = modelo_moto.nombre_modelo
        return super().update(instance, validated_data)

    class Meta:
        model = Moto
        fields = [
            "id",
            "marca",
            "categoria",
            "categoria_id",
            "modelo_ref",
            "modelo_moto",
            "modelo_id",
            "modelo_ref_nombre",
            "modelo",
            "slug",
            "descripcion",
            "precio",
            "cilindrada",
            "cilindrada_input",
            "anio",
            "color",
            "stock",
            "estado",
            "imagen_principal",
            "es_destacada",
            "activa",
            "fecha_creacion",
            "marca_nombre",
            "categoria_nombre",
        ]


class CategoriaMotoSerializer(serializers.ModelSerializer):
    def validate_nombre(self, nombre):
        normalized = normalize_title_case_label(nombre)
        if not normalized:
            raise serializers.ValidationError("El nombre es obligatorio.")
        return normalized

    class Meta:
        model = CategoriaMoto
        fields = ["id", "nombre", "slug", "descripcion", "activa"]


class MarcaSerializer(serializers.ModelSerializer):
    def validate_nombre(self, nombre):
        normalized = normalize_uppercase_label(nombre)
        if not normalized:
            raise serializers.ValidationError("El nombre es obligatorio.")
        return normalized

    class Meta:
        model = Marca
        fields = ["id", "nombre", "slug", "descripcion", "tipo", "activa"]
