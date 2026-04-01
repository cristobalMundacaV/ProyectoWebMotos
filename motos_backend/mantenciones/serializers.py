from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from core.phone_utils import normalize_chile_phone
from core.plate_utils import is_valid_chile_motorcycle_plate, normalize_chile_motorcycle_plate
import logging
from datetime import datetime, time

from .availability import slot_disponible
from .models import HorarioMantencion, Mantencion, MantencionEstadoHistorial, VehiculoCliente
from .notifications import (
    get_recipient_email,
    send_mantencion_approved_email,
    send_mantencion_canceled_email,
    send_mantencion_confirmation_email,
    send_mantencion_finalized_email,
    send_mantencion_ingreso_taller_email,
    send_mantencion_delivered_email,
    send_mantencion_no_asistencia_email,
    send_mantencion_reagendacion_email,
)


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
            "cliente_telefono",
            "cliente_email",
            "cliente_nombres",
            "cliente_apellidos",
        )

    def get_cliente_nombre(self, obj: VehiculoCliente) -> str:
        snapshot_name = f"{(obj.cliente_nombres or '').strip()} {(obj.cliente_apellidos or '').strip()}".strip()
        if snapshot_name:
            return snapshot_name
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
            "cliente_nombres",
            "cliente_apellidos",
            "cliente_telefono",
            "cliente_email",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def get_cliente_nombre(self, obj: VehiculoCliente) -> str:
        snapshot_name = f"{(obj.cliente_nombres or '').strip()} {(obj.cliente_apellidos or '').strip()}".strip()
        if snapshot_name:
            return snapshot_name
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
            "motivo_cancelacion",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "rut_cliente")

    def update(self, instance, validated_data):
        request = self.context.get("request")
        source = (
            MantencionEstadoHistorial.FUENTE_ADMIN_PANEL
            if request and getattr(request, "user", None) and request.user.is_authenticated
            else MantencionEstadoHistorial.FUENTE_API
        )
        changed_by = request.user if request and getattr(request, "user", None) and request.user.is_authenticated else None

        with transaction.atomic():
            locked = Mantencion.objects.select_for_update().get(pk=instance.pk)
            previous_estado = locked.estado
            next_estado = validated_data.get("estado", locked.estado)
            estado_cambia = previous_estado != next_estado

            if estado_cambia and not Mantencion.can_transition(previous_estado, next_estado):
                raise serializers.ValidationError(
                    {"estado": f"Transicion invalida: {previous_estado} -> {next_estado}."}
                )

            aceptando_solicitud = previous_estado != Mantencion.ESTADO_APROBADO and next_estado == Mantencion.ESTADO_APROBADO
            entrando_a_taller = previous_estado != Mantencion.ESTADO_EN_PROCESO and next_estado == Mantencion.ESTADO_EN_PROCESO

            if aceptando_solicitud:
                hora_ingreso = locked.hora_ingreso or time(23, 59, 59)
                scheduled_at = datetime.combine(locked.fecha_ingreso, hora_ingreso)
                if timezone.is_naive(scheduled_at):
                    scheduled_at = timezone.make_aware(scheduled_at, timezone.get_current_timezone())
                if scheduled_at < timezone.localtime():
                    raise serializers.ValidationError(
                        {"estado": "No se puede aceptar una solicitud cuya fecha/hora ya vencio."}
                    )

            if entrando_a_taller and "hora_ingreso" not in validated_data:
                validated_data["hora_ingreso"] = timezone.localtime().time().replace(microsecond=0)

            for field, value in validated_data.items():
                setattr(locked, field, value)

            try:
                locked.save()
            except DjangoValidationError as exc:
                raise serializers.ValidationError(exc.message_dict if hasattr(exc, "message_dict") else {"detail": exc.messages})

            if estado_cambia:
                MantencionEstadoHistorial.objects.create(
                    mantencion=locked,
                    estado_anterior=previous_estado,
                    estado_nuevo=locked.estado,
                    changed_by=changed_by,
                    fuente=source,
                )

            if estado_cambia:
                recipient_email = get_recipient_email(locked)
                if recipient_email:
                    def _send_estado_email():
                        try:
                            if locked.estado == Mantencion.ESTADO_APROBADO:
                                send_mantencion_approved_email(mantencion=locked, recipient_email=recipient_email)
                            elif locked.estado == Mantencion.ESTADO_EN_PROCESO:
                                send_mantencion_ingreso_taller_email(mantencion=locked, recipient_email=recipient_email)
                            elif locked.estado == Mantencion.ESTADO_CANCELADO:
                                send_mantencion_canceled_email(mantencion=locked, recipient_email=recipient_email)
                            elif locked.estado == Mantencion.ESTADO_REAGENDACION:
                                send_mantencion_reagendacion_email(mantencion=locked, recipient_email=recipient_email)
                            elif locked.estado == Mantencion.ESTADO_INASISTENCIA:
                                send_mantencion_no_asistencia_email(mantencion=locked, recipient_email=recipient_email)
                            elif locked.estado == Mantencion.ESTADO_FINALIZADO:
                                send_mantencion_finalized_email(mantencion=locked, recipient_email=recipient_email)
                            elif locked.estado == Mantencion.ESTADO_ENTREGADA:
                                send_mantencion_delivered_email(mantencion=locked, recipient_email=recipient_email)
                        except Exception:
                            logger.exception(
                                "Error enviando correo de cambio de estado para mantencion_id=%s estado=%s",
                                locked.id,
                                locked.estado,
                            )

                    transaction.on_commit(_send_estado_email)

            return locked


class AgendarMantencionSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=12, required=True)
    nombres = serializers.CharField(max_length=120)
    apellidos = serializers.CharField(max_length=120)
    telefono = serializers.CharField(max_length=30)
    email = serializers.EmailField(required=True)

    matricula = serializers.CharField(max_length=20)
    marca = serializers.CharField(max_length=80)
    modelo = serializers.CharField(max_length=120)
    anio = serializers.IntegerField(required=True)
    kilometraje_actual = serializers.IntegerField(min_value=0)

    fecha_agendada = serializers.DateField()
    hora_agendada = serializers.TimeField(input_formats=["%H:%M", "%H:%M:%S"])
    tipo_mantencion = serializers.ChoiceField(choices=Mantencion.TIPO_MANTENCION_CHOICES)
    motivo = serializers.CharField()

    def validate_telefono(self, value):
        try:
            return normalize_chile_phone(value, required=True)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc))

    def validate_matricula(self, value):
        normalized = normalize_chile_motorcycle_plate(value)
        if not is_valid_chile_motorcycle_plate(normalized):
            raise serializers.ValidationError(
                "La matricula debe corresponder a una patente chilena de moto (formato AAA99, ejemplo: TKG30)."
            )
        return normalized

    def _normalize_person_name(self, raw_value: str) -> str:
        cleaned = " ".join((raw_value or "").strip().split())
        if not cleaned:
            return ""
        return " ".join(word[:1].upper() + word[1:].lower() for word in cleaned.split(" "))

    def _normalize_vehicle_text_upper(self, raw_value: str) -> str:
        return " ".join((raw_value or "").strip().split()).upper()

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
        nombres = self._normalize_person_name(attrs.get("nombres") or "")
        apellidos = self._normalize_person_name(attrs.get("apellidos") or "")
        marca = self._normalize_vehicle_text_upper(attrs.get("marca") or "")
        modelo = self._normalize_vehicle_text_upper(attrs.get("modelo") or "")
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
        if not marca:
            raise serializers.ValidationError({"marca": "La marca es obligatoria."})
        if not modelo:
            raise serializers.ValidationError({"modelo": "El modelo es obligatorio."})
        if not email:
            raise serializers.ValidationError({"email": "El email es obligatorio para enviar la confirmacion."})

        fecha = attrs.get("fecha_agendada")
        hora = attrs.get("hora_agendada")
        if fecha and hora and not slot_disponible(fecha, hora):
            raise serializers.ValidationError({"hora_agendada": "La hora seleccionada ya no esta disponible. Elige otra opcion."})
        attrs["rut"] = normalized_rut
        attrs["nombres"] = nombres
        attrs["apellidos"] = apellidos
        attrs["marca"] = marca
        attrs["modelo"] = modelo
        attrs["email"] = email
        return attrs

    def _slot_capacity_for_time(self, *, fecha, hora):
        weekday = fecha.weekday()
        horarios = list(
            HorarioMantencion.objects.select_for_update()
            .filter(activo=True, dia_semana=weekday)
            .order_by("hora_inicio")
        )
        if not horarios:
            raise serializers.ValidationError({"fecha_agendada": "No hay horarios operativos para el dia seleccionado."})

        if fecha == timezone.localdate() and hora <= timezone.localtime().time():
            raise serializers.ValidationError({"hora_agendada": "La hora seleccionada ya vencio."})

        total_capacity = 0
        for bloque in horarios:
            if not (bloque.hora_inicio <= hora < bloque.hora_fin):
                continue
            if bloque.intervalo_minutos <= 0:
                continue
            start_minutes = bloque.hora_inicio.hour * 60 + bloque.hora_inicio.minute
            slot_minutes = hora.hour * 60 + hora.minute
            if (slot_minutes - start_minutes) % int(bloque.intervalo_minutos) != 0:
                continue
            total_capacity += int(bloque.cupos_por_bloque or 0)

        if total_capacity <= 0:
            raise serializers.ValidationError({"hora_agendada": "La hora seleccionada no pertenece a un bloque operativo valido."})
        return total_capacity

    def _validate_slot_with_lock(self, *, fecha, hora):
        total_capacity = self._slot_capacity_for_time(fecha=fecha, hora=hora)

        reservadas = (
            Mantencion.objects.select_for_update()
            .filter(fecha_ingreso=fecha, hora_ingreso=hora)
            .exclude(estado__in=[Mantencion.ESTADO_CANCELADO, Mantencion.ESTADO_NO_ACEPTADO])
            .count()
        )
        if reservadas >= total_capacity:
            raise serializers.ValidationError({"hora_agendada": "La hora seleccionada ya no esta disponible. Elige otra opcion."})

    def _get_guest_cliente_user(self):
        User = get_user_model()
        username = "__cliente_invitado__"
        user = User.objects.filter(username=username).first()
        if user:
            return user

        user = User.objects.create(
            username=username,
            email="",
            first_name="Cliente",
            last_name="Invitado",
            is_active=False,
            is_staff=False,
            is_superuser=False,
        )
        user.set_unusable_password()
        user.save(update_fields=["password"])
        return user

    def create(self, validated_data):
        with transaction.atomic():
            self._validate_slot_with_lock(
                fecha=validated_data["fecha_agendada"],
                hora=validated_data["hora_agendada"],
            )
            cliente = self._get_guest_cliente_user()
            matricula = validated_data["matricula"].strip().upper()
            nombres = validated_data["nombres"].strip()
            apellidos = validated_data["apellidos"].strip()
            telefono = validated_data["telefono"]
            email = (validated_data.get("email") or "").strip().lower()

            vehiculo, created = VehiculoCliente.objects.get_or_create(
                matricula=matricula,
                defaults={
                    "cliente": cliente,
                    "marca": validated_data["marca"],
                    "modelo": validated_data["modelo"],
                    "anio": validated_data.get("anio"),
                    "kilometraje_actual": validated_data["kilometraje_actual"],
                    "cliente_nombres": nombres,
                    "cliente_apellidos": apellidos,
                    "cliente_telefono": telefono,
                    "cliente_email": email,
                },
            )

            vehiculo.marca = validated_data["marca"]
            vehiculo.modelo = validated_data["modelo"]
            vehiculo.anio = validated_data.get("anio")
            vehiculo.kilometraje_actual = validated_data["kilometraje_actual"]
            vehiculo.cliente = cliente
            vehiculo.cliente_nombres = nombres
            vehiculo.cliente_apellidos = apellidos
            vehiculo.cliente_telefono = telefono
            vehiculo.cliente_email = email
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
                changed_by=None,
                fuente=MantencionEstadoHistorial.FUENTE_PORTAL_CLIENTE,
                observacion="Creacion de solicitud de mantencion",
            )

            recipient_email = validated_data["email"]

            # El agendamiento no debe fallar si el servicio de correo tiene problemas.
            # Enviamos el email al confirmar la transaccion y registramos cualquier error.
            def _send_confirmation_email():
                try:
                    send_mantencion_confirmation_email(
                        mantencion=mantencion,
                        recipient_email=recipient_email,
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
