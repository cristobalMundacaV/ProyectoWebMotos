from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AgendarMantencionAPIView,
    MantencionActivarDiaAPIView,
    MantencionCancelarAPIView,
    MantencionBloquearDiaAPIView,
    MantencionConsultaRutAPIView,
    LimpiarHorariosMantencionAPIView,
    HorarioMantencionViewSet,
    MantencionDisponibilidadAPIView,
    MantencionLimpiarHorarioFechaAPIView,
    MantencionToggleHoraAPIView,
    MantencionViewSet,
    VehiculoClienteViewSet,
)


router = DefaultRouter()
router.register(r"vehiculos", VehiculoClienteViewSet, basename="mantenciones-vehiculos")
router.register(r"horarios", HorarioMantencionViewSet, basename="mantenciones-horarios")
router.register(r"", MantencionViewSet, basename="mantenciones")

urlpatterns = [
    path("agendar/", AgendarMantencionAPIView.as_view(), name="agendar-mantencion"),
    path("horarios/clear/", LimpiarHorariosMantencionAPIView.as_view(), name="mantencion-horarios-clear"),
    path("disponibilidad/", MantencionDisponibilidadAPIView.as_view(), name="mantencion-disponibilidad"),
    path("disponibilidad/bloquear-dia/", MantencionBloquearDiaAPIView.as_view(), name="mantencion-bloquear-dia"),
    path("disponibilidad/activar-dia/", MantencionActivarDiaAPIView.as_view(), name="mantencion-activar-dia"),
    path("disponibilidad/limpiar-fecha/", MantencionLimpiarHorarioFechaAPIView.as_view(), name="mantencion-limpiar-horario-fecha"),
    path("disponibilidad/toggle-hora/", MantencionToggleHoraAPIView.as_view(), name="mantencion-toggle-hora"),
    path("consulta/", MantencionConsultaRutAPIView.as_view(), name="mantencion-consulta-rut"),
    path("consulta/<int:mantencion_id>/cancelar/", MantencionCancelarAPIView.as_view(), name="mantencion-cancelar-rut"),
    path("", include(router.urls)),
]
