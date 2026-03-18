from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AgendarMantencionAPIView, MantencionViewSet, VehiculoClienteViewSet


router = DefaultRouter()
router.register(r"vehiculos", VehiculoClienteViewSet, basename="mantenciones-vehiculos")
router.register(r"", MantencionViewSet, basename="mantenciones")

urlpatterns = [
    path("agendar/", AgendarMantencionAPIView.as_view(), name="agendar-mantencion"),
    path("", include(router.urls)),
]
