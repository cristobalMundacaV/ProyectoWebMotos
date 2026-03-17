from django.urls import path
from .views import (
    categorias_moto,
    categorias_moto_detalle,
    detalle_moto_admin,
    lista_motos,
    marcas_moto,
    marcas_moto_detalle,
    meta_motos,
)

urlpatterns = [
    path('motos/', lista_motos, name='lista_motos'),
    path('motos/<int:moto_id>/', detalle_moto_admin, name='detalle_moto_admin'),
    path('motos/meta/', meta_motos, name='meta_motos'),
    path('motos/categorias/', categorias_moto, name='categorias_moto'),
    path('motos/categorias/<int:categoria_id>/', categorias_moto_detalle, name='categorias_moto_detalle'),
    path('motos/marcas/', marcas_moto, name='marcas_moto'),
    path('motos/marcas/<int:marca_id>/', marcas_moto_detalle, name='marcas_moto_detalle'),
    path('motorcycles/', lista_motos, name='lista_motorcycles'),
]
