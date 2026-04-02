from datetime import date, datetime, timedelta
import logging

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .availability import get_disponibilidad
from core.realtime import broadcast_realtime_event
from .integrity import mark_expired_unaccepted_requests
from .models import (
    HorarioMantencion,
    Mantencion,
    MantencionDiaBloqueado,
    MantencionHoraBloqueada,
    MantencionEstadoHistorial,
    MantencionHorarioFecha,
    VehiculoCliente,
)
from .permissions import IsOperationalStaff
from .notifications import (
    get_recipient_email,
    send_mantencion_canceled_email,
    send_mantencion_reagendacion_email,
)
from .serializers import (
    AgendarMantencionSerializer,
    ConsultarMantencionPorRutSerializer,
    HorarioMantencionSerializer,
    MantencionSerializer,
    VehiculoClienteSerializer,
)


logger = logging.getLogger(__name__)


def _broadcast_after_commit(event_type, payload=None):
    transaction.on_commit(lambda: broadcast_realtime_event(event_type, payload or {}))


class VehiculoClienteViewSet(viewsets.ModelViewSet):
    queryset = VehiculoCliente.objects.select_related("cliente").all()
    serializer_class = VehiculoClienteSerializer
    permission_classes = [IsOperationalStaff]


class HorarioMantencionViewSet(viewsets.ModelViewSet):
    queryset = HorarioMantencion.objects.all().order_by("dia_semana", "hora_inicio")
    serializer_class = HorarioMantencionSerializer
    permission_classes = [IsOperationalStaff]

    def perform_create(self, serializer):
        instance = serializer.save()
        _broadcast_after_commit("schedule_updated", {"id": instance.id, "action": "created"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})

    def perform_update(self, serializer):
        instance = serializer.save()
        _broadcast_after_commit("schedule_updated", {"id": instance.id, "action": "updated"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})

    def perform_destroy(self, instance):
        schedule_id = instance.id
        super().perform_destroy(instance)
        _broadcast_after_commit("schedule_updated", {"id": schedule_id, "action": "deleted"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})


class LimpiarHorariosMantencionAPIView(APIView):
    permission_classes = [IsOperationalStaff]

    def post(self, request):
        with transaction.atomic():
            weekly_deleted = HorarioMantencion.objects.all().delete()[0]
            by_date_deleted = MantencionHorarioFecha.objects.all().delete()[0]
            blocked_hours_deleted = MantencionHoraBloqueada.objects.all().delete()[0]
            blocked_days_deleted = MantencionDiaBloqueado.objects.all().delete()[0]

            _broadcast_after_commit("schedule_updated", {"action": "cleared"})
            _broadcast_after_commit("availability_updated", {"scope": "calendar", "action": "cleared"})

        return Response(
            {
                "deleted": {
                    "horarios_semanales": weekly_deleted,
                    "horarios_por_fecha": by_date_deleted,
                    "horas_bloqueadas": blocked_hours_deleted,
                    "dias_bloqueados": blocked_days_deleted,
                }
            },
            status=status.HTTP_200_OK,
        )


class MantencionViewSet(viewsets.ModelViewSet):
    serializer_class = MantencionSerializer
    permission_classes = [IsOperationalStaff]

    def get_queryset(self):
        mark_expired_unaccepted_requests()
        return (
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
            .all()
            .order_by("-fecha_ingreso", "-created_at")
        )

    def perform_create(self, serializer):
        instance = serializer.save()
        _broadcast_after_commit("maintenance_created", {"id": instance.id})
        _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})

    def perform_update(self, serializer):
        instance = serializer.save()
        _broadcast_after_commit("maintenance_updated", {"id": instance.id, "estado": instance.estado})
        _broadcast_after_commit("maintenance_status_changed", {"id": instance.id, "estado": instance.estado})
        _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})

    def perform_destroy(self, instance):
        mantencion_id = instance.id
        super().perform_destroy(instance)
        _broadcast_after_commit("maintenance_updated", {"id": mantencion_id, "action": "deleted"})
        _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})


class AgendarMantencionAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AgendarMantencionSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        mantencion = serializer.save()
        _broadcast_after_commit("maintenance_created", {"id": mantencion.id})
        _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})
        _broadcast_after_commit("availability_updated", {"scope": "calendar"})
        response_serializer = MantencionSerializer(mantencion, context={"request": request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class MantencionDisponibilidadAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    MAX_DAYS_AHEAD = 31

    def get(self, request):
        today = date.today()
        max_end = today + timedelta(days=self.MAX_DAYS_AHEAD - 1)
        raw_from = (request.query_params.get("from") or "").strip()
        raw_to = (request.query_params.get("to") or "").strip()

        if raw_from or raw_to:
            try:
                from_date = date.fromisoformat(raw_from) if raw_from else today
                to_date = date.fromisoformat(raw_to) if raw_to else from_date
            except ValueError:
                return Response(
                    {"detail": "Formato de fecha invalido. Usa YYYY-MM-DD en from/to."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            start_date = max(from_date, today)
            end_date = min(to_date, max_end)
            if start_date > end_date:
                return Response(
                    {
                        "from": start_date.isoformat(),
                        "to": end_date.isoformat(),
                        "slots": [],
                        "max_days_ahead": self.MAX_DAYS_AHEAD,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "from": start_date.isoformat(),
                    "to": end_date.isoformat(),
                    "slots": get_disponibilidad(start_date=start_date, end_date=end_date),
                    "max_days_ahead": self.MAX_DAYS_AHEAD,
                },
                status=status.HTTP_200_OK,
            )

        raw_days = request.query_params.get("days")
        try:
            days = int(raw_days) if raw_days is not None else self.MAX_DAYS_AHEAD
        except (TypeError, ValueError):
            days = self.MAX_DAYS_AHEAD
        days = min(max(days, 1), self.MAX_DAYS_AHEAD)
        end_date = min(today + timedelta(days=days - 1), max_end)
        return Response(
            {
                "days": days,
                "from": today.isoformat(),
                "to": end_date.isoformat(),
                "slots": get_disponibilidad(days_ahead=days),
                "max_days_ahead": self.MAX_DAYS_AHEAD,
            },
            status=status.HTTP_200_OK,
        )


class MantencionBloquearDiaAPIView(APIView):
    permission_classes = [IsOperationalStaff]

    def post(self, request):
        raw_fecha = str(request.data.get("fecha", "")).strip()
        if not raw_fecha:
            return Response({"detail": "La fecha es obligatoria."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target_date = date.fromisoformat(raw_fecha)
        except ValueError:
            return Response({"detail": "Formato de fecha invalido. Usa YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        confirm_with_bookings = bool(request.data.get("confirm_with_bookings", False))
        observacion = str(request.data.get("observacion", "")).strip() or "Dia marcado sin agenda por el equipo"

        estados_reagendables = [Mantencion.ESTADO_SOLICITUD, Mantencion.ESTADO_APROBADO]

        with transaction.atomic():
            mark_expired_unaccepted_requests()
            affected = list(
                Mantencion.objects.select_for_update()
                .filter(fecha_ingreso=target_date, estado__in=estados_reagendables)
                .only("id", "estado")
            )

            if affected and not confirm_with_bookings:
                return Response(
                    {
                        "needs_confirmation": True,
                        "detail": "Hay horas agendadas para este dia. Seguro que quieres cancelar la atencion del dia?",
                        "bookings_count": len(affected),
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            if affected:
                mantencion_ids = [item.id for item in affected]
                Mantencion.objects.filter(id__in=mantencion_ids).update(estado=Mantencion.ESTADO_REAGENDACION)
                MantencionEstadoHistorial.objects.bulk_create(
                    [
                        MantencionEstadoHistorial(
                            mantencion_id=item.id,
                            estado_anterior=item.estado,
                            estado_nuevo=Mantencion.ESTADO_REAGENDACION,
                            changed_by=request.user if request.user.is_authenticated else None,
                            fuente=MantencionEstadoHistorial.FUENTE_ADMIN_PANEL,
                            observacion="Reagendacion automatica por bloqueo del dia en calendario",
                        )
                        for item in affected
                    ]
                )
                affected_for_email = list(
                    Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
                    .filter(id__in=mantencion_ids)
                )
            else:
                affected_for_email = []

            MantencionDiaBloqueado.objects.update_or_create(
                fecha=target_date,
                defaults={"bloqueado": True, "motivo": observacion},
            )

            if affected_for_email:
                def _send_reagendacion_notifications():
                    for mantencion in affected_for_email:
                        recipient_email = get_recipient_email(mantencion)
                        if not recipient_email:
                            continue
                        try:
                            send_mantencion_reagendacion_email(
                                mantencion=mantencion,
                                recipient_email=recipient_email,
                            )
                        except Exception:
                            logger.exception(
                                "Error enviando correo de reagendacion por bloqueo de dia para mantencion_id=%s",
                                mantencion.id,
                            )

                transaction.on_commit(_send_reagendacion_notifications)

            _broadcast_after_commit("availability_updated", {"scope": "calendar", "fecha": target_date.isoformat()})
            _broadcast_after_commit("maintenance_status_changed", {"scope": "day_block", "fecha": target_date.isoformat()})
            _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})

        return Response(
            {
                "fecha": target_date.isoformat(),
                "bloqueado": True,
                "bookings_reagendadas": len(affected),
            },
            status=status.HTTP_200_OK,
        )


class MantencionActivarDiaAPIView(APIView):
    permission_classes = [IsOperationalStaff]

    def post(self, request):
        raw_fecha = str(request.data.get("fecha", "")).strip()
        raw_hora_inicio = str(request.data.get("hora_inicio", "")).strip()
        raw_hora_fin = str(request.data.get("hora_fin", "")).strip()

        if not raw_fecha:
            return Response({"detail": "La fecha es obligatoria."}, status=status.HTTP_400_BAD_REQUEST)
        if not raw_hora_inicio or not raw_hora_fin:
            return Response({"detail": "Hora inicio y hora fin son obligatorias."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_date = date.fromisoformat(raw_fecha)
        except ValueError:
            return Response({"detail": "Formato de fecha invalido. Usa YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            hora_inicio = datetime.strptime(raw_hora_inicio, "%H:%M").time()
            hora_fin = datetime.strptime(raw_hora_fin, "%H:%M").time()
        except ValueError:
            return Response({"detail": "Formato de hora invalido. Usa HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intervalo_minutos = int(request.data.get("intervalo_minutos", 60))
            cupos_por_bloque = int(request.data.get("cupos_por_bloque", 1))
        except (TypeError, ValueError):
            return Response({"detail": "Intervalo y horas por bloque deben ser numericos."}, status=status.HTTP_400_BAD_REQUEST)

        if hora_fin <= hora_inicio:
            return Response({"detail": "La hora fin debe ser mayor a la hora inicio."}, status=status.HTTP_400_BAD_REQUEST)
        if intervalo_minutos <= 0:
            return Response({"detail": "El intervalo debe ser mayor a 0 minutos."}, status=status.HTTP_400_BAD_REQUEST)
        if cupos_por_bloque <= 0:
            return Response({"detail": "Las horas por bloque deben ser mayores a 0."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            MantencionDiaBloqueado.objects.update_or_create(
                fecha=target_date,
                defaults={"bloqueado": False, "motivo": "Dia habilitado desde calendario"},
            )
            # Al reactivar un dia, reiniciamos cualquier bloqueo por hora previo
            # para que el dia quede exactamente con la configuracion ingresada.
            MantencionHoraBloqueada.objects.filter(fecha=target_date).delete()
            MantencionHorarioFecha.objects.update_or_create(
                fecha=target_date,
                defaults={
                    "hora_inicio": hora_inicio,
                    "hora_fin": hora_fin,
                    "intervalo_minutos": intervalo_minutos,
                    "cupos_por_bloque": cupos_por_bloque,
                    "activo": True,
                },
            )

        _broadcast_after_commit("availability_updated", {"scope": "calendar", "fecha": target_date.isoformat()})
        _broadcast_after_commit("schedule_updated", {"scope": "calendar", "fecha": target_date.isoformat()})

        return Response(
            {
                "fecha": target_date.isoformat(),
                "activo": True,
                "hora_inicio": hora_inicio.strftime("%H:%M"),
                "hora_fin": hora_fin.strftime("%H:%M"),
                "intervalo_minutos": intervalo_minutos,
                "cupos_por_bloque": cupos_por_bloque,
            },
            status=status.HTTP_200_OK,
        )


class MantencionToggleHoraAPIView(APIView):
    permission_classes = [IsOperationalStaff]

    def post(self, request):
        raw_fecha = str(request.data.get("fecha", "")).strip()
        raw_hora = str(request.data.get("hora", "")).strip()
        action = str(request.data.get("action", "block")).strip().lower()
        confirm_with_bookings = bool(request.data.get("confirm_with_bookings", False))

        if action not in {"block", "unblock"}:
            return Response({"detail": "Accion invalida. Usa 'block' o 'unblock'."}, status=status.HTTP_400_BAD_REQUEST)
        if not raw_fecha or not raw_hora:
            return Response({"detail": "Fecha y hora son obligatorias."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_date = date.fromisoformat(raw_fecha)
        except ValueError:
            return Response({"detail": "Formato de fecha invalido. Usa YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_hora = datetime.strptime(raw_hora, "%H:%M").time()
        except ValueError:
            return Response({"detail": "Formato de hora invalido. Usa HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if action == "block":
                mark_expired_unaccepted_requests()
                estados_reagendables = [Mantencion.ESTADO_SOLICITUD, Mantencion.ESTADO_APROBADO]
                affected = list(
                    Mantencion.objects.select_for_update()
                    .filter(
                        fecha_ingreso=target_date,
                        hora_ingreso=target_hora,
                        estado__in=estados_reagendables,
                    )
                    .only("id", "estado")
                )

                if affected and not confirm_with_bookings:
                    return Response(
                        {
                            "needs_confirmation": True,
                            "detail": "Hay horas agendadas para esta hora. Seguro que quieres desactivarla?",
                            "bookings_count": len(affected),
                        },
                        status=status.HTTP_409_CONFLICT,
                    )

                if affected:
                    mantencion_ids = [item.id for item in affected]
                    Mantencion.objects.filter(id__in=mantencion_ids).update(estado=Mantencion.ESTADO_REAGENDACION)
                    MantencionEstadoHistorial.objects.bulk_create(
                        [
                            MantencionEstadoHistorial(
                                mantencion_id=item.id,
                                estado_anterior=item.estado,
                                estado_nuevo=Mantencion.ESTADO_REAGENDACION,
                                changed_by=request.user if request.user.is_authenticated else None,
                                fuente=MantencionEstadoHistorial.FUENTE_ADMIN_PANEL,
                                observacion="Reagendacion automatica por bloqueo de hora en calendario",
                            )
                            for item in affected
                        ]
                    )
                    affected_for_email = list(
                        Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
                        .filter(id__in=mantencion_ids)
                    )
                else:
                    affected_for_email = []

                MantencionHoraBloqueada.objects.update_or_create(
                    fecha=target_date,
                    hora=target_hora,
                    defaults={"bloqueado": True, "motivo": "Hora desactivada desde calendario"},
                )

                if affected_for_email:
                    def _send_reagendacion_notifications():
                        for mantencion in affected_for_email:
                            recipient_email = get_recipient_email(mantencion)
                            if not recipient_email:
                                continue
                            try:
                                send_mantencion_reagendacion_email(
                                    mantencion=mantencion,
                                    recipient_email=recipient_email,
                                )
                            except Exception:
                                logger.exception(
                                    "Error enviando correo de reagendacion por bloqueo de hora para mantencion_id=%s",
                                    mantencion.id,
                                )

                    transaction.on_commit(_send_reagendacion_notifications)

                _broadcast_after_commit("availability_updated", {"scope": "calendar", "fecha": target_date.isoformat()})
                _broadcast_after_commit(
                    "maintenance_status_changed",
                    {"scope": "hour_block", "fecha": target_date.isoformat(), "hora": target_hora.strftime("%H:%M")},
                )
                _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})

                return Response(
                    {
                        "fecha": target_date.isoformat(),
                        "hora": target_hora.strftime("%H:%M"),
                        "bloqueado": True,
                        "bookings_reagendadas": len(affected),
                    },
                    status=status.HTTP_200_OK,
                )

            MantencionHoraBloqueada.objects.update_or_create(
                fecha=target_date,
                hora=target_hora,
                defaults={"bloqueado": False, "motivo": "Hora activada desde calendario"},
            )
            _broadcast_after_commit("availability_updated", {"scope": "calendar", "fecha": target_date.isoformat()})
            return Response(
                {
                    "fecha": target_date.isoformat(),
                    "hora": target_hora.strftime("%H:%M"),
                    "bloqueado": False,
                    "bookings_reagendadas": 0,
                },
                status=status.HTTP_200_OK,
            )


class MantencionLimpiarHorarioFechaAPIView(APIView):
    permission_classes = [IsOperationalStaff]

    def post(self, request):
        raw_fecha = str(request.data.get("fecha", "")).strip()
        if not raw_fecha:
            return Response({"detail": "La fecha es obligatoria."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target_date = date.fromisoformat(raw_fecha)
        except ValueError:
            return Response({"detail": "Formato de fecha invalido. Usa YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            deleted_by_date = MantencionHorarioFecha.objects.filter(fecha=target_date).delete()[0]
            deleted_hour_blocks = MantencionHoraBloqueada.objects.filter(fecha=target_date).delete()[0]

            _broadcast_after_commit("availability_updated", {"scope": "calendar", "fecha": target_date.isoformat()})
            _broadcast_after_commit("schedule_updated", {"scope": "calendar", "fecha": target_date.isoformat(), "action": "cleaned_date"})

        return Response(
            {
                "fecha": target_date.isoformat(),
                "deleted": {
                    "horario_fecha": deleted_by_date,
                    "horas_bloqueadas": deleted_hour_blocks,
                },
            },
            status=status.HTTP_200_OK,
        )


class MantencionConsultaRutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def _is_staff_user(self, user) -> bool:
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        perfil = getattr(user, "perfil_usuario", None)
        rol = getattr(perfil, "rol", "")
        return rol in {"superadmin", "admin", "encargado"}

    def get(self, request):
        mark_expired_unaccepted_requests()
        query_serializer = ConsultarMantencionPorRutSerializer(data={"rut": request.query_params.get("rut", "")})
        query_serializer.is_valid(raise_exception=True)
        rut = query_serializer.validated_data["rut"]

        queryset = (
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente", "moto_cliente__cliente__perfil_usuario")
            .filter(rut_cliente=rut)
        )
        if not self._is_staff_user(request.user):
            queryset = queryset.filter(moto_cliente__cliente=request.user)

        mantenciones = (
            queryset
            .order_by("-fecha_ingreso", "-hora_ingreso", "-created_at")[:25]
        )

        results = [
            {
                "id": mantencion.id,
                "rut_cliente": mantencion.rut_cliente,
                "nombres": (mantencion.moto_cliente.cliente_nombres or "").strip() or mantencion.moto_cliente.cliente.first_name,
                "apellidos": (mantencion.moto_cliente.cliente_apellidos or "").strip() or mantencion.moto_cliente.cliente.last_name,
                "telefono": (mantencion.moto_cliente.cliente_telefono or "").strip()
                or getattr(getattr(mantencion.moto_cliente.cliente, "perfil_usuario", None), "telefono", ""),
                "email": (mantencion.moto_cliente.cliente_email or "").strip() or mantencion.moto_cliente.cliente.email,
                "estado": mantencion.estado,
                "estado_label": mantencion.get_estado_display(),
                "fecha_ingreso": mantencion.fecha_ingreso,
                "hora_ingreso": mantencion.hora_ingreso,
                "tipo_mantencion": mantencion.tipo_mantencion,
                "tipo_mantencion_label": mantencion.get_tipo_mantencion_display(),
                "matricula": mantencion.moto_cliente.matricula,
                "marca": mantencion.moto_cliente.marca,
                "modelo": mantencion.moto_cliente.modelo,
                "motivo": mantencion.motivo,
                "created_at": mantencion.created_at,
            }
            for mantencion in mantenciones
        ]

        return Response({"rut": rut, "results": results}, status=status.HTTP_200_OK)


class MantencionCancelarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def _is_staff_user(self, user) -> bool:
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        perfil = getattr(user, "perfil_usuario", None)
        rol = getattr(perfil, "rol", "")
        return rol in {"superadmin", "admin", "encargado"}

    def post(self, request, mantencion_id: int):
        mark_expired_unaccepted_requests()
        query_serializer = ConsultarMantencionPorRutSerializer(data={"rut": request.data.get("rut", "")})
        query_serializer.is_valid(raise_exception=True)
        rut = query_serializer.validated_data["rut"]
        with transaction.atomic():
            queryset = Mantencion.objects.select_for_update().filter(id=mantencion_id, rut_cliente=rut)
            if not self._is_staff_user(request.user):
                queryset = queryset.filter(moto_cliente__cliente=request.user)

            mantencion = queryset.first()
            if not mantencion:
                return Response(
                    {"detail": "No encontramos esa hora asociada al RUT indicado."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if not Mantencion.can_transition(mantencion.estado, Mantencion.ESTADO_CANCELADO):
                return Response(
                    {"detail": "No es posible cancelar una mantencion en su estado actual."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            estado_anterior = mantencion.estado
            mantencion.estado = Mantencion.ESTADO_CANCELADO
            mantencion.save()

            MantencionEstadoHistorial.objects.create(
                mantencion=mantencion,
                estado_anterior=estado_anterior,
                estado_nuevo=Mantencion.ESTADO_CANCELADO,
                changed_by=request.user if request.user.is_authenticated else None,
                fuente=MantencionEstadoHistorial.FUENTE_PORTAL_CLIENTE,
                observacion="Cancelacion realizada por cliente desde consulta de estado",
            )

            recipient_email = get_recipient_email(mantencion)
            if recipient_email:
                def _send_cancel_email():
                    try:
                        send_mantencion_canceled_email(mantencion=mantencion, recipient_email=recipient_email)
                    except Exception:
                        logger.exception(
                            "Error enviando correo de cancelacion para mantencion_id=%s",
                            mantencion.id,
                        )

                transaction.on_commit(_send_cancel_email)

            _broadcast_after_commit("maintenance_status_changed", {"id": mantencion.id, "estado": mantencion.estado})
            _broadcast_after_commit("maintenance_updated", {"id": mantencion.id, "estado": mantencion.estado})
            _broadcast_after_commit("availability_updated", {"scope": "calendar"})
            _broadcast_after_commit("dashboard_updated", {"domain": "mantenciones"})

        return Response(
            {
                "detail": "Tu hora fue cancelada correctamente.",
                "id": mantencion.id,
                "estado": mantencion.estado,
                "estado_label": mantencion.get_estado_display(),
            },
            status=status.HTTP_200_OK,
        )
