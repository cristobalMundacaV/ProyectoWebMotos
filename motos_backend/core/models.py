from django.db import models


class ContactoSitio(models.Model):
    instagram = models.CharField(max_length=120, blank=True)
    telefono = models.CharField(max_length=60, blank=True)
    ubicacion = models.CharField(max_length=180, blank=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contacto del sitio"
        verbose_name_plural = "Contacto del sitio"

    def __str__(self):
        return "Datos de contacto del sitio"
