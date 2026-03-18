from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AgendarMantencionAPIView,
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
    path("", include(router.urls)),
]
