from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AgendarMantencionAPIView,
    MantencionCancelarAPIView,
    MantencionConsultaRutAPIView,
    HorarioMantencionViewSet,
    MantencionDisponibilidadAPIView,
    MantencionViewSet,
    VehiculoClienteViewSet,
)


router = DefaultRouter()
router.register(r"vehiculos", VehiculoClienteViewSet, basename="mantenciones-vehiculos")
router.register(r"horarios", HorarioMantencionViewSet, basename="mantenciones-horarios")
router.register(r"", MantencionViewSet, basename="mantenciones")

urlpatterns = [
    path("agendar/", AgendarMantencionAPIView.as_view(), name="agendar-mantencion"),
    path("disponibilidad/", MantencionDisponibilidadAPIView.as_view(), name="mantencion-disponibilidad"),
    path("consulta/", MantencionConsultaRutAPIView.as_view(), name="mantencion-consulta-rut"),
    path("consulta/<int:mantencion_id>/cancelar/", MantencionCancelarAPIView.as_view(), name="mantencion-cancelar-rut"),
    path("", include(router.urls)),
]
