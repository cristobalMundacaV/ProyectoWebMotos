from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .availability import get_disponibilidad
from .models import HorarioMantencion, Mantencion, VehiculoCliente
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

    def get_queryset(self):
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
