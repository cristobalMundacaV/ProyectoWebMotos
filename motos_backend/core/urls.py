from django.urls import path

from .views import admin_contacto, contacto_publico


urlpatterns = [
    path("contacto/", contacto_publico, name="contacto_publico"),
    path("admin/contacto/", admin_contacto, name="admin_contacto"),
]
