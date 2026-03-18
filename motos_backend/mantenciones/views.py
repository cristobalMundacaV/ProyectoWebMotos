from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .availability import get_disponibilidad
from .models import HorarioMantencion, Mantencion, VehiculoCliente
from .serializers import (
    AgendarMantencionSerializer,
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
