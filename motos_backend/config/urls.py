from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/catalogo/', include('catalogo.urls')),
    path('api/', include('motos.urls')),
    path('api/productos/', include('productos.urls')),
    path('api/tienda/', include('productos.urls')),
    path('api/tienda/', include('core.urls')),
    path('api/core/', include('core.urls')),
    path('api/clientes/', include('clientes.urls')),
    path('api/mantenciones/', include('mantenciones.urls')),
    path('api/analitica/', include('analitica.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
