from django.utils.text import slugify
from rest_framework import serializers

from catalogo.models import CategoriaMoto, Marca
from .ficha_defaults import ensure_moto_ficha_defaults
from .models import (
    ImagenMoto,
    ItemFichaTecnica,
    ModeloMoto,
    Moto,
    SeccionFichaTecnica,
    TipoAtributo,
    ValorAtributoMoto,
)


def normalize_uppercase_label(value):
    return str(value or "").strip().replace("\t", " ").replace("  ", " ").upper()


def normalize_title_case_label(value):
    raw = str(value or "").replace("\t", " ")
    parts = [part for part in raw.split() if part]
    return " ".join(part[:1].upper() + part[1:].lower() for part in parts).strip()


class ImagenMotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenMoto
        fields = ["id", "imagen", "texto_alternativo", "orden"]


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
        marca = attrs.get("marca", getattr(self.instance, "marca", None))
        categoria = attrs.get("categoria", getattr(self.instance, "categoria", None))
        cilindrada = attrs.get("cilindrada", getattr(self.instance, "cilindrada", None))
        if not nombre_modelo:
            raise serializers.ValidationError({"nombre": "El nombre del modelo es obligatorio."})
        if marca and nombre_modelo:
            duplicate_qs = ModeloMoto.objects.filter(
                marca=marca,
                nombre_modelo__iexact=nombre_modelo,
            )
            if self.instance:
                duplicate_qs = duplicate_qs.exclude(pk=self.instance.pk)
            if duplicate_qs.exists():
                raise serializers.ValidationError(
                    {"nombre": "Ya existe un modelo con ese nombre para esta marca."}
                )
        is_create = self.instance is None
        if is_create:
            if not categoria:
                raise serializers.ValidationError({"categoria": "La categoria del modelo es obligatoria."})

        # En updates parciales, solo validar categoria si viene en el payload.
        if "categoria" in attrs and not categoria:
            raise serializers.ValidationError({"categoria": "La categoria del modelo es obligatoria."})

        if cilindrada not in (None, "") and int(cilindrada) <= 0:
            raise serializers.ValidationError({"cilindrada": "La cilindrada debe ser mayor a 0."})
        attrs["nombre_modelo"] = nombre_modelo
        if not attrs.get("slug"):
            attrs["slug"] = self._build_unique_slug(nombre_modelo)
        return attrs

    class Meta:
        model = ModeloMoto
        validators = []
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
    imagenes = ImagenMotoSerializer(many=True, read_only=True)
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
        permite_variante_maletas = attrs.get(
            "permite_variante_maletas",
            getattr(self.instance, "permite_variante_maletas", False),
        )
        precio_con_maletas = attrs.get(
            "precio_con_maletas",
            getattr(self.instance, "precio_con_maletas", None),
        )
        precio_lista = attrs.get(
            "precio_lista",
            getattr(self.instance, "precio_lista", None),
        )
        precio_lista_con_maletas = attrs.get(
            "precio_lista_con_maletas",
            getattr(self.instance, "precio_lista_con_maletas", None),
        )
        imagen_con_maletas = attrs.get(
            "imagen_con_maletas",
            getattr(self.instance, "imagen_con_maletas", None),
        )
        attrs["modelo"] = modelo

        if modelo_moto and marca and modelo_moto.marca_id != marca.id:
            raise serializers.ValidationError({"modelo_id": "El modelo seleccionado no pertenece a la marca indicada."})

        if not modelo_moto and not modelo:
            raise serializers.ValidationError({"modelo_id": "Debes seleccionar un modelo o ingresar un nombre de modelo."})

        # En edicion de moto no se debe crear un modelo nuevo por error de tipeo.
        # El cambio de nombre/categoria/cilindrada del modelo debe gestionarse desde el mantenedor de modelos.
        if self.instance and not modelo_moto:
            current_modelo = str(getattr(self.instance, "modelo", "") or "").strip()
            if modelo and normalize_uppercase_label(modelo) != normalize_uppercase_label(current_modelo):
                raise serializers.ValidationError(
                    {"modelo_id": "Para cambiar el modelo, selecciona uno existente desde la lista de modelos."}
                )

        if precio_lista in (None, ""):
            raise serializers.ValidationError({"precio_lista": "Debes indicar el precio de lista."})

        if permite_variante_maletas and precio_con_maletas in (None, ""):
            raise serializers.ValidationError(
                {"precio_con_maletas": "Debes indicar el precio con maletas cuando la variante esta habilitada."}
            )

        if permite_variante_maletas and not imagen_con_maletas:
            raise serializers.ValidationError(
                {"imagen_con_maletas": "Debes subir una imagen con maletas cuando la variante esta habilitada."}
            )

        if not permite_variante_maletas:
            attrs["precio_con_maletas"] = None
            attrs["precio_lista_con_maletas"] = None
            attrs["imagen_con_maletas"] = None
        elif precio_lista_con_maletas in (None, ""):
            attrs["precio_lista_con_maletas"] = precio_lista

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
        moto = super().create(validated_data)
        ensure_moto_ficha_defaults(moto)
        return moto

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
            "precio_lista",
            "permite_variante_maletas",
            "precio_con_maletas",
            "precio_lista_con_maletas",
            "imagen_con_maletas",
            "cilindrada",
            "cilindrada_input",
            "anio",
            "color",
            "estado",
            "imagen_principal",
            "imagenes",
            "video_presentacion",
            "es_destacada",
            "orden_carrusel",
            "activa",
            "fecha_creacion",
            "marca_nombre",
            "categoria_nombre",
        ]
        extra_kwargs = {
            # El alta/edicion debe entrar por `modelo_id` (source="modelo_moto").
            # Dejamos `modelo_moto` solo de lectura para evitar el error:
            # "modelo_moto: Este campo es requerido."
            "modelo_moto": {"read_only": True},
        }


class ItemFichaTecnicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemFichaTecnica
        fields = ["nombre", "valor", "orden"]


class SeccionFichaTecnicaSerializer(serializers.ModelSerializer):
    items = ItemFichaTecnicaSerializer(many=True, read_only=True)

    class Meta:
        model = SeccionFichaTecnica
        fields = ["nombre", "orden", "items"]


class MotoDetalleFichaSerializer(MotoSerializer):
    secciones_ficha = serializers.SerializerMethodField()

    def get_secciones_ficha(self, obj):
        valores = list(getattr(obj, "valores_atributos").all())
        if valores:
            secciones_map = {}

            for valor in valores:
                tipo = valor.tipo_atributo
                seccion_actual = secciones_map.setdefault(
                    tipo.id,
                    {
                        "nombre": tipo.nombre,
                        "orden": tipo.orden,
                        "items": [],
                    },
                )
                seccion_actual["orden"] = min(seccion_actual["orden"], tipo.orden)
                seccion_actual["items"].append(
                    {
                        "nombre": valor.nombre,
                        "valor": valor.valor,
                        "orden": valor.orden,
                    }
                )

            secciones = sorted(secciones_map.values(), key=lambda section: (section["orden"], section["nombre"]))
            for seccion in secciones:
                seccion["items"] = sorted(
                    seccion["items"],
                    key=lambda item: (item["orden"], item["nombre"]),
                )
            return secciones

        return SeccionFichaTecnicaSerializer(obj.secciones_ficha.all(), many=True).data

    class Meta(MotoSerializer.Meta):
        fields = MotoSerializer.Meta.fields + ["secciones_ficha"]


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


class TipoAtributoSerializer(serializers.ModelSerializer):
    def validate_nombre(self, value):
        normalized = str(value or "").strip()
        if not normalized:
            raise serializers.ValidationError("El nombre de la seccion es obligatorio.")
        return normalized

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify(validated_data["nombre"]) or "seccion-ficha"
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "nombre" in validated_data and "slug" not in validated_data:
            validated_data["slug"] = slugify(validated_data["nombre"]) or instance.slug
        return super().update(instance, validated_data)

    class Meta:
        model = TipoAtributo
        fields = ["id", "nombre", "slug", "orden", "activo"]


class ValorAtributoMotoSerializer(serializers.ModelSerializer):
    tipo_atributo_nombre = serializers.CharField(source="tipo_atributo.nombre", read_only=True)
    tipo_atributo_orden = serializers.IntegerField(source="tipo_atributo.orden", read_only=True)
    valor = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = ValorAtributoMoto
        fields = [
            "id",
            "moto",
            "tipo_atributo",
            "tipo_atributo_nombre",
            "tipo_atributo_orden",
            "nombre",
            "valor",
            "orden",
        ]
