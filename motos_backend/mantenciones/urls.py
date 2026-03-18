from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MantencionViewSet, VehiculoClienteViewSet


router = DefaultRouter()
router.register(r"vehiculos", VehiculoClienteViewSet, basename="mantenciones-vehiculos")
router.register(r"", MantencionViewSet, basename="mantenciones")

urlpatterns = [
    path("", include(router.urls)),
]
