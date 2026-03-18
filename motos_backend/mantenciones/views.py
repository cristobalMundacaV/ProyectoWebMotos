from rest_framework import viewsets

from .models import Mantencion, VehiculoCliente
from .serializers import MantencionSerializer, VehiculoClienteSerializer


class VehiculoClienteViewSet(viewsets.ModelViewSet):
    queryset = VehiculoCliente.objects.select_related("cliente").all()
    serializer_class = VehiculoClienteSerializer


class MantencionViewSet(viewsets.ModelViewSet):
    serializer_class = MantencionSerializer

    def get_queryset(self):
        return (
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
            .all()
            .order_by("-fecha_ingreso", "-created_at")
        )
