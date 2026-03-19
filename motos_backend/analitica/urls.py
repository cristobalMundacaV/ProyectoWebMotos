from django.urls import path

from .views import (
    CatalogoDashboardAnalyticsAPIView,
    CatalogoEventoCreateAPIView,
    MantencionesDashboardAnalyticsAPIView,
)


urlpatterns = [
    path("catalogo/eventos/", CatalogoEventoCreateAPIView.as_view(), name="catalogo_evento_create"),
    path("dashboard/catalogo/", CatalogoDashboardAnalyticsAPIView.as_view(), name="dashboard_analytics_catalogo"),
    path("dashboard/mantenciones/", MantencionesDashboardAnalyticsAPIView.as_view(), name="dashboard_analytics_mantenciones"),
]
