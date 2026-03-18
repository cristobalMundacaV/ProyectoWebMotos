from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from clientes.models import PerfilUsuario
from .models import Mantencion, VehiculoCliente


class VehiculoClienteNestedSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()

    class Meta:
        model = VehiculoCliente
        fields = (
            "id",
            "cliente",
            "cliente_nombre",
            "matricula",
            "marca",
            "modelo",
            "anio",
            "kilometraje_actual",
        )

    def get_cliente_nombre(self, obj: VehiculoCliente) -> str:
        full_name = obj.cliente.get_full_name().strip() if hasattr(obj.cliente, "get_full_name") else ""
        return full_name or getattr(obj.cliente, "username", "")


class VehiculoClienteSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = VehiculoCliente
        fields = (
            "id",
            "cliente",
            "cliente_nombre",
            "matricula",
            "marca",
            "modelo",
            "anio",
            "kilometraje_actual",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def get_cliente_nombre(self, obj: VehiculoCliente) -> str:
        full_name = obj.cliente.get_full_name().strip() if hasattr(obj.cliente, "get_full_name") else ""
        return full_name or getattr(obj.cliente, "username", "")


class MantencionSerializer(serializers.ModelSerializer):
    moto_cliente_detalle = VehiculoClienteNestedSerializer(source="moto_cliente", read_only=True)

    class Meta:
        model = Mantencion
        fields = (
            "id",
            "moto_cliente",
            "moto_cliente_detalle",
            "fecha_ingreso",
            "kilometraje_ingreso",
            "tipo_mantencion",
            "motivo",
            "diagnostico",
            "trabajo_realizado",
            "costo_total",
            "estado",
            "fecha_entrega",
            "observaciones",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class AgendarMantencionSerializer(serializers.Serializer):
    nombre_completo = serializers.CharField(max_length=150)
    telefono = serializers.CharField(max_length=30)
    email = serializers.EmailField(required=False, allow_blank=True)

    matricula = serializers.CharField(max_length=20)
    marca = serializers.CharField(max_length=80)
    modelo = serializers.CharField(max_length=120)
    anio = serializers.IntegerField(required=True)
    kilometraje_actual = serializers.IntegerField(min_value=0)

    fecha_ingreso = serializers.DateField(required=False)
    kilometraje_ingreso = serializers.IntegerField(min_value=0)
    tipo_mantencion = serializers.ChoiceField(choices=Mantencion.TIPO_MANTENCION_CHOICES)
    motivo = serializers.CharField()
    observaciones = serializers.CharField(required=False, allow_blank=True)

    def _generate_username(self, nombre_completo: str, telefono: str, email: str) -> str:
        User = get_user_model()
        if email:
            base = email.split("@", 1)[0].strip().lower()
        else:
            slug_name = "".join(ch for ch in nombre_completo.lower().strip() if ch.isalnum())[:20]
            only_digits = "".join(ch for ch in telefono if ch.isdigit())[-6:]
            base = f"{slug_name}{only_digits}" if slug_name else f"cliente{only_digits}"
        base = base or "cliente"
        candidate = base
        suffix = 1
        while User.objects.filter(username__iexact=candidate).exists():
            suffix += 1
            candidate = f"{base}{suffix}"
        return candidate[:150]

    def _resolve_or_create_cliente(self):
        request = self.context.get("request")
        if request and getattr(request, "user", None) and request.user.is_authenticated:
            return request.user

        User = get_user_model()
        email = (self.validated_data.get("email") or "").strip().lower()
        telefono = self.validated_data["telefono"].strip()
        nombre_completo = self.validated_data["nombre_completo"].strip()

        user = None
        if email:
            user = User.objects.filter(
                email__iexact=email,
                perfil_usuario__rol=PerfilUsuario.ROL_CLIENTE,
            ).first()

        if not user:
            username = self._generate_username(nombre_completo, telefono, email)
            first_name, _, last_name = nombre_completo.partition(" ")
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name.strip(),
                last_name=last_name.strip(),
                is_active=True,
            )
            user.set_unusable_password()
            user.save(update_fields=["password"])

        PerfilUsuario.objects.update_or_create(
            user=user,
            defaults={"telefono": telefono, "rol": PerfilUsuario.ROL_CLIENTE},
        )
        return user

    def create(self, validated_data):
        cliente = self._resolve_or_create_cliente()
        matricula = validated_data["matricula"].strip().upper()

        vehiculo, created = VehiculoCliente.objects.get_or_create(
            matricula=matricula,
            defaults={
                "cliente": cliente,
                "marca": validated_data["marca"].strip(),
                "modelo": validated_data["modelo"].strip(),
                "anio": validated_data.get("anio"),
                "kilometraje_actual": validated_data["kilometraje_actual"],
            },
        )

        if not created and vehiculo.cliente_id != cliente.id:
            raise serializers.ValidationError({"matricula": "Esta matricula ya esta asociada a otro cliente."})

        vehiculo.marca = validated_data["marca"].strip()
        vehiculo.modelo = validated_data["modelo"].strip()
        vehiculo.anio = validated_data.get("anio")
        vehiculo.kilometraje_actual = validated_data["kilometraje_actual"]
        vehiculo.save()

        mantencion = Mantencion.objects.create(
            moto_cliente=vehiculo,
            fecha_ingreso=validated_data.get("fecha_ingreso") or timezone.localdate(),
            kilometraje_ingreso=validated_data["kilometraje_ingreso"],
            tipo_mantencion=validated_data["tipo_mantencion"],
            motivo=validated_data["motivo"].strip(),
            observaciones=(validated_data.get("observaciones") or "").strip(),
            estado=Mantencion.ESTADO_INGRESADA,
            costo_total=0,
        )
        return mantencion
