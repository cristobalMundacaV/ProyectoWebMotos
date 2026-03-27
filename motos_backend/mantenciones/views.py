from datetime import datetime, time

from django.db import transaction
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .availability import get_disponibilidad
from .models import HorarioMantencion, Mantencion, MantencionEstadoHistorial, VehiculoCliente
from .serializers import (
    AgendarMantencionSerializer,
    ConsultarMantencionPorRutSerializer,
    HorarioMantencionSerializer,
    MantencionSerializer,
    VehiculoClienteSerializer,
)


class VehiculoClienteViewSet(viewsets.ModelViewSet):
    queryset = VehiculoCliente.objects.select_related("cliente").all()
    serializer_class = VehiculoClienteSerializer


class HorarioMantencionViewSet(viewsets.ModelViewSet):
    queryset = HorarioMantencion.objects.all().order_by("dia_semana", "hora_inicio")
    serializer_class = HorarioMantencionSerializer


class MantencionViewSet(viewsets.ModelViewSet):
    serializer_class = MantencionSerializer

    def _scheduled_datetime(self, mantencion: Mantencion):
        if not mantencion.fecha_ingreso:
            return None
        hora_ingreso = mantencion.hora_ingreso or time(23, 59, 59)
        scheduled_at = datetime.combine(mantencion.fecha_ingreso, hora_ingreso)
        if timezone.is_naive(scheduled_at):
            scheduled_at = timezone.make_aware(scheduled_at, timezone.get_current_timezone())
        return scheduled_at

    def _mark_expired_unaccepted_requests(self):
        now = timezone.localtime()
        pendientes = Mantencion.objects.filter(estado=Mantencion.ESTADO_INGRESADA).only(
            "id", "fecha_ingreso", "hora_ingreso", "estado", "updated_at"
        )

        to_update = []
        to_history = []
        for mantencion in pendientes:
            scheduled_at = self._scheduled_datetime(mantencion)
            if not scheduled_at or scheduled_at >= now:
                continue

            estado_anterior = mantencion.estado
            mantencion.estado = Mantencion.ESTADO_NO_ASISTIO
            mantencion.updated_at = timezone.now()
            to_update.append(mantencion)
            to_history.append(
                MantencionEstadoHistorial(
                    mantencion=mantencion,
                    estado_anterior=estado_anterior,
                    estado_nuevo=Mantencion.ESTADO_NO_ASISTIO,
                    changed_by=None,
                    fuente=MantencionEstadoHistorial.FUENTE_API,
                    observacion="Solicitud no aceptada antes de la hora agendada",
                )
            )

        if not to_update:
            return

        with transaction.atomic():
            Mantencion.objects.bulk_update(to_update, ["estado", "updated_at"])
            MantencionEstadoHistorial.objects.bulk_create(to_history)

    def get_queryset(self):
        self._mark_expired_unaccepted_requests()
        return (
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
            .all()
            .order_by("-fecha_ingreso", "-created_at")
        )


class AgendarMantencionAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AgendarMantencionSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        mantencion = serializer.save()
        response_serializer = MantencionSerializer(mantencion, context={"request": request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class MantencionDisponibilidadAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        raw_days = request.query_params.get("days")
        try:
            days = int(raw_days) if raw_days is not None else 21
        except (TypeError, ValueError):
            days = 21
        days = min(max(days, 1), 60)
        return Response({"days": days, "slots": get_disponibilidad(days_ahead=days)}, status=status.HTTP_200_OK)


class MantencionConsultaRutAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        query_serializer = ConsultarMantencionPorRutSerializer(data={"rut": request.query_params.get("rut", "")})
        query_serializer.is_valid(raise_exception=True)
        rut = query_serializer.validated_data["rut"]

        mantenciones = (
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente", "moto_cliente__cliente__perfil_usuario")
            .filter(rut_cliente=rut)
            .order_by("-fecha_ingreso", "-hora_ingreso", "-created_at")[:25]
        )

        results = [
            {
                "id": mantencion.id,
                "rut_cliente": mantencion.rut_cliente,
                "nombres": mantencion.moto_cliente.cliente.first_name,
                "apellidos": mantencion.moto_cliente.cliente.last_name,
                "telefono": getattr(getattr(mantencion.moto_cliente.cliente, "perfil_usuario", None), "telefono", ""),
                "email": mantencion.moto_cliente.cliente.email,
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
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, mantencion_id: int):
        query_serializer = ConsultarMantencionPorRutSerializer(data={"rut": request.data.get("rut", "")})
        query_serializer.is_valid(raise_exception=True)
        rut = query_serializer.validated_data["rut"]

        mantencion = Mantencion.objects.filter(id=mantencion_id, rut_cliente=rut).first()
        if not mantencion:
            return Response(
                {"detail": "No encontramos esa hora asociada al RUT indicado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if mantencion.estado == Mantencion.ESTADO_CANCELADA:
            return Response(
                {"detail": "La hora ya se encuentra cancelada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        estados_cancelables = {Mantencion.ESTADO_INGRESADA, Mantencion.ESTADO_ACEPTADA}
        if mantencion.estado not in estados_cancelables:
            return Response(
                {"detail": "Solo puedes cancelar horas en estado Ingresada o Aceptada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        estado_anterior = mantencion.estado
        mantencion.estado = Mantencion.ESTADO_CANCELADA
        mantencion.save()

        MantencionEstadoHistorial.objects.create(
            mantencion=mantencion,
            estado_anterior=estado_anterior,
            estado_nuevo=Mantencion.ESTADO_CANCELADA,
            changed_by=None,
            fuente=MantencionEstadoHistorial.FUENTE_PORTAL_CLIENTE,
            observacion="Cancelacion realizada por cliente desde consulta de estado",
        )

        return Response(
            {
                "detail": "Tu hora fue cancelada correctamente.",
                "id": mantencion.id,
                "estado": mantencion.estado,
                "estado_label": mantencion.get_estado_display(),
            },
            status=status.HTTP_200_OK,
        )
