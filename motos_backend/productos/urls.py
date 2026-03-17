from django.urls import path

from .views import (
    accesorios_motos_meta,
    accesorios_rider_meta,
    admin_accesorios_motos,
    admin_accesorios_rider,
    admin_producto_detalle,
    categorias_producto,
    lista_productos,
    motos_compatibles,
)

urlpatterns = [
    path("productos/", lista_productos, name="lista_productos"),
    path("admin/accesorios-motos/", admin_accesorios_motos, name="admin_accesorios_motos"),
    path("admin/productos/<int:producto_id>/", admin_producto_detalle, name="admin_producto_detalle"),
    path("admin/accesorios-motos/meta/", accesorios_motos_meta, name="accesorios_motos_meta"),
    path("admin/accesorios-rider/", admin_accesorios_rider, name="admin_accesorios_rider"),
    path("admin/accesorios-rider/meta/", accesorios_rider_meta, name="accesorios_rider_meta"),
    path("categorias/", categorias_producto, name="categorias_producto"),
    path("motos-compatibles/", motos_compatibles, name="motos_compatibles"),
]
