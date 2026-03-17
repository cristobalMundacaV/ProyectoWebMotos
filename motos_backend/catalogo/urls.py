from django.urls import path

from .views import (
    categorias_accesorios_moto,
    categorias_accesorios_moto_detalle,
    categorias_accesorios_rider,
    categorias_accesorios_rider_detalle,
    categorias_indumentaria,
)

urlpatterns = [
    path("indumentaria/categorias/", categorias_indumentaria, name="categorias_indumentaria"),
    path("accesorios-moto/categorias/", categorias_accesorios_moto, name="categorias_accesorios_moto"),
    path(
        "accesorios-moto/categorias/<int:subcategoria_id>/",
        categorias_accesorios_moto_detalle,
        name="categorias_accesorios_moto_detalle",
    ),
    path("accesorios-rider/categorias/", categorias_accesorios_rider, name="categorias_accesorios_rider"),
    path(
        "accesorios-rider/categorias/<int:subcategoria_id>/",
        categorias_accesorios_rider_detalle,
        name="categorias_accesorios_rider_detalle",
    ),
]
