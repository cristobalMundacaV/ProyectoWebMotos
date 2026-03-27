from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
import logging
from datetime import datetime, time

from clientes.models import PerfilUsuario
from .availability import slot_disponible
from .models import HorarioMantencion, Mantencion, MantencionEstadoHistorial, VehiculoCliente
from .notifications import send_mantencion_confirmation_email


logger = logging.getLogger(__name__)


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


class HorarioMantencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioMantencion
        fields = (
            "id",
            "dia_semana",
            "hora_inicio",
            "hora_fin",
            "intervalo_minutos",
            "cupos_por_bloque",
            "activo",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def validate(self, attrs):
        hora_inicio = attrs.get("hora_inicio", getattr(self.instance, "hora_inicio", None))
        hora_fin = attrs.get("hora_fin", getattr(self.instance, "hora_fin", None))
        intervalo = attrs.get("intervalo_minutos", getattr(self.instance, "intervalo_minutos", 0))
        if hora_inicio and hora_fin and hora_fin <= hora_inicio:
            raise serializers.ValidationError({"hora_fin": "La hora fin debe ser mayor a la hora inicio."})
        if intervalo is not None and int(intervalo) <= 0:
            raise serializers.ValidationError({"intervalo_minutos": "El intervalo debe ser mayor que cero."})
        return attrs


class MantencionSerializer(serializers.ModelSerializer):
    moto_cliente_detalle = VehiculoClienteNestedSerializer(source="moto_cliente", read_only=True)

    class Meta:
        model = Mantencion
        fields = (
            "id",
            "moto_cliente",
            "moto_cliente_detalle",
            "rut_cliente",
            "fecha_ingreso",
            "hora_ingreso",
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

    def update(self, instance, validated_data):
        previous_estado = instance.estado
        next_estado = validated_data.get("estado", instance.estado)
        entrando_a_taller = instance.estado != Mantencion.ESTADO_EN_PROCESO and next_estado == Mantencion.ESTADO_EN_PROCESO
        aceptando_solicitud = instance.estado != Mantencion.ESTADO_APROBADO and next_estado == Mantencion.ESTADO_APROBADO

        if aceptando_solicitud:
            if instance.estado != Mantencion.ESTADO_SOLICITUD:
                raise serializers.ValidationError(
                    {"estado": "Solo se pueden aprobar solicitudes que esten en estado Solicitud."}
                )

            hora_ingreso = instance.hora_ingreso or time(23, 59, 59)
            scheduled_at = datetime.combine(instance.fecha_ingreso, hora_ingreso)
            if timezone.is_naive(scheduled_at):
                scheduled_at = timezone.make_aware(scheduled_at, timezone.get_current_timezone())

            if scheduled_at < timezone.localtime():
                raise serializers.ValidationError(
                    {"estado": "No se puede aceptar una solicitud cuya fecha/hora ya vencio."}
                )

        if entrando_a_taller and "hora_ingreso" not in validated_data:
            validated_data["hora_ingreso"] = timezone.localtime().time().replace(microsecond=0)

        updated_instance = super().update(instance, validated_data)

        if previous_estado != updated_instance.estado:
            request = self.context.get("request")
            source = (
                MantencionEstadoHistorial.FUENTE_ADMIN_PANEL
                if request and getattr(request, "user", None) and request.user.is_authenticated
                else MantencionEstadoHistorial.FUENTE_API
            )
            MantencionEstadoHistorial.objects.create(
                mantencion=updated_instance,
                estado_anterior=previous_estado,
                estado_nuevo=updated_instance.estado,
                changed_by=request.user if request and getattr(request, "user", None) and request.user.is_authenticated else None,
                fuente=source,
            )

        return updated_instance


class AgendarMantencionSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=12, required=True)
    nombres = serializers.CharField(max_length=120)
    apellidos = serializers.CharField(max_length=120)
    telefono = serializers.CharField(max_length=30)
    email = serializers.EmailField(required=True)

    matricula = serializers.RegexField(
        regex=r"^[A-Za-z]{3}\d{2}$",
        max_length=5,
        error_messages={"invalid": "La matricula debe tener formato AAA99 (ejemplo: TKG30)."},
    )
    marca = serializers.CharField(max_length=80)
    modelo = serializers.CharField(max_length=120)
    anio = serializers.IntegerField(required=True)
    kilometraje_actual = serializers.IntegerField(min_value=0)

    fecha_agendada = serializers.DateField()
    hora_agendada = serializers.TimeField(input_formats=["%H:%M", "%H:%M:%S"])
    tipo_mantencion = serializers.ChoiceField(choices=Mantencion.TIPO_MANTENCION_CHOICES)
    motivo = serializers.CharField()

    def _normalize_rut(self, raw_rut: str) -> str:
        cleaned = (raw_rut or "").replace(".", "").replace("-", "").replace(" ", "").upper()
        if len(cleaned) < 2:
            return ""
        body = "".join(ch for ch in cleaned[:-1] if ch.isdigit())
        dv = cleaned[-1]
        if not body or not dv or (not dv.isdigit() and dv != "K"):
            return ""
        return f"{body}-{dv}"

    def _is_valid_rut(self, raw_rut: str) -> bool:
        normalized = self._normalize_rut(raw_rut)
        if not normalized:
            return False

        body, dv = normalized.split("-", 1)
        total = 0
        multiplier = 2
        for digit_char in reversed(body):
            total += int(digit_char) * multiplier
            multiplier = 2 if multiplier == 7 else multiplier + 1

        remainder = 11 - (total % 11)
        expected_dv = "0" if remainder == 11 else "K" if remainder == 10 else str(remainder)
        return dv == expected_dv

    def validate(self, attrs):
        rut = (attrs.get("rut") or "").strip()
        nombres = (attrs.get("nombres") or "").strip()
        apellidos = (attrs.get("apellidos") or "").strip()
        email = (attrs.get("email") or "").strip().lower()
        if not rut:
            raise serializers.ValidationError({"rut": "El RUT es obligatorio."})
        normalized_rut = self._normalize_rut(rut)
        if not normalized_rut or not self._is_valid_rut(normalized_rut):
            raise serializers.ValidationError({"rut": "Ingresa un RUT valido (ejemplo: 12345678-5)."})
        if not nombres:
            raise serializers.ValidationError({"nombres": "Los nombres son obligatorios."})
        if not apellidos:
            raise serializers.ValidationError({"apellidos": "Los apellidos son obligatorios."})
        if not email:
            raise serializers.ValidationError({"email": "El email es obligatorio para enviar la confirmacion."})

        fecha = attrs.get("fecha_agendada")
        hora = attrs.get("hora_agendada")
        if fecha and hora and not slot_disponible(fecha, hora):
            raise serializers.ValidationError(
                {"hora_agendada": "La hora seleccionada ya no esta disponible. Elige otra opcion."}
            )
        attrs["rut"] = normalized_rut
        attrs["nombres"] = nombres
        attrs["apellidos"] = apellidos
        attrs["email"] = email
        return attrs

    def _generate_username(self, nombres: str, apellidos: str, telefono: str, email: str) -> str:
        User = get_user_model()
        if email:
            base = email.split("@", 1)[0].strip().lower()
        else:
            base_name = f"{nombres} {apellidos}".strip()
            slug_name = "".join(ch for ch in base_name.lower() if ch.isalnum())[:20]
            only_digits = "".join(ch for ch in telefono if ch.isdigit())[-6:]
            base = f"{slug_name}{only_digits}" if slug_name else f"cliente{only_digits}"
        base = base or "cliente"
        candidate = base
        suffix = 1
        while User.objects.filter(username__iexact=candidate).exists():
            suffix += 1
            candidate = f"{base}{suffix}"
        return candidate[:150]

    def _sync_cliente_data(self, user, *, nombres: str, apellidos: str, telefono: str, email: str):
        updated_fields = []

        if user.first_name != nombres:
            user.first_name = nombres
            updated_fields.append("first_name")

        if user.last_name != apellidos:
            user.last_name = apellidos
            updated_fields.append("last_name")

        if email and user.email != email:
            user.email = email
            updated_fields.append("email")

        if updated_fields:
            user.save(update_fields=updated_fields)

        PerfilUsuario.objects.update_or_create(
            user=user,
            defaults={"telefono": telefono, "rol": PerfilUsuario.ROL_CLIENTE},
        )

        return user

    def _resolve_or_create_cliente(self):
        request = self.context.get("request")
        telefono = self.validated_data["telefono"].strip()
        nombres = self.validated_data["nombres"].strip()
        apellidos = self.validated_data["apellidos"].strip()
        email = (self.validated_data.get("email") or "").strip().lower()

        if request and getattr(request, "user", None) and request.user.is_authenticated:
            return self._sync_cliente_data(
                request.user,
                nombres=nombres,
                apellidos=apellidos,
                telefono=telefono,
                email=email,
            )

        User = get_user_model()

        user = None
        if email:
            user = User.objects.filter(
                email__iexact=email,
                perfil_usuario__rol=PerfilUsuario.ROL_CLIENTE,
            ).first()

        if not user:
            username = self._generate_username(nombres, apellidos, telefono, email)
            user = User.objects.create(
                username=username,
                email=email,
                first_name=nombres,
                last_name=apellidos,
                is_active=True,
            )
            user.set_unusable_password()
            user.save(update_fields=["password"])

        return self._sync_cliente_data(
            user,
            nombres=nombres,
            apellidos=apellidos,
            telefono=telefono,
            email=email,
        )

    def create(self, validated_data):
        with transaction.atomic():
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
                rut_cliente=validated_data["rut"],
                fecha_ingreso=validated_data["fecha_agendada"],
                hora_ingreso=validated_data["hora_agendada"],
                kilometraje_ingreso=None,
                tipo_mantencion=validated_data["tipo_mantencion"],
                motivo=validated_data["motivo"].strip(),
                observaciones="",
                estado=Mantencion.ESTADO_SOLICITUD,
                costo_total=0,
            )
            MantencionEstadoHistorial.objects.create(
                mantencion=mantencion,
                estado_anterior="",
                estado_nuevo=Mantencion.ESTADO_SOLICITUD,
                changed_by=cliente if getattr(cliente, "is_authenticated", False) else None,
                fuente=MantencionEstadoHistorial.FUENTE_PORTAL_CLIENTE,
                observacion="Creacion de solicitud de mantencion",
            )

            cliente_nombre = f"{validated_data['nombres']} {validated_data['apellidos']}".strip()
            recipient_email = validated_data["email"]
            nombre_final = cliente_nombre or "cliente"

            # El agendamiento no debe fallar si el servicio de correo tiene problemas.
            # Enviamos el email al confirmar la transaccion y registramos cualquier error.
            def _send_confirmation_email():
                try:
                    send_mantencion_confirmation_email(
                        mantencion=mantencion,
                        recipient_email=recipient_email,
                        cliente_nombre=nombre_final,
                    )
                except Exception:
                    logger.exception(
                        "Error enviando correo de confirmacion para mantencion_id=%s",
                        mantencion.id,
                    )

            transaction.on_commit(_send_confirmation_email)

            return mantencion


class ConsultarMantencionPorRutSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=12, required=True)

    def _normalize_rut(self, raw_rut: str) -> str:
        cleaned = (raw_rut or "").replace(".", "").replace("-", "").replace(" ", "").upper()
        if len(cleaned) < 2:
            return ""
        body = "".join(ch for ch in cleaned[:-1] if ch.isdigit())
        dv = cleaned[-1]
        if not body or not dv or (not dv.isdigit() and dv != "K"):
            return ""
        return f"{body}-{dv}"

    def _is_valid_rut(self, raw_rut: str) -> bool:
        normalized = self._normalize_rut(raw_rut)
        if not normalized:
            return False

        body, dv = normalized.split("-", 1)
        total = 0
        multiplier = 2
        for digit_char in reversed(body):
            total += int(digit_char) * multiplier
            multiplier = 2 if multiplier == 7 else multiplier + 1

        remainder = 11 - (total % 11)
        expected_dv = "0" if remainder == 11 else "K" if remainder == 10 else str(remainder)
        return dv == expected_dv

    def validate(self, attrs):
        rut = (attrs.get("rut") or "").strip()
        if not rut:
            raise serializers.ValidationError({"rut": "El RUT es obligatorio."})
        normalized_rut = self._normalize_rut(rut)
        if not normalized_rut or not self._is_valid_rut(normalized_rut):
            raise serializers.ValidationError({"rut": "Ingresa un RUT valido (ejemplo: 12345678-5)."})
        attrs["rut"] = normalized_rut
        return attrs
