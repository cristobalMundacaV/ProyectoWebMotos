from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .availability import get_disponibilidad
from .integrity import mark_expired_unaccepted_requests
from .models import HorarioMantencion, Mantencion, MantencionEstadoHistorial, VehiculoCliente
from .permissions import IsOperationalStaff
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
    permission_classes = [IsOperationalStaff]


class HorarioMantencionViewSet(viewsets.ModelViewSet):
    queryset = HorarioMantencion.objects.all().order_by("dia_semana", "hora_inicio")
    serializer_class = HorarioMantencionSerializer
    permission_classes = [IsOperationalStaff]


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

        return Response(
            {
                "detail": "Tu hora fue cancelada correctamente.",
                "id": mantencion.id,
                "estado": mantencion.estado,
                "estado_label": mantencion.get_estado_display(),
            },
            status=status.HTTP_200_OK,
        )
