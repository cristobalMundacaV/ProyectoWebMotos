from django.db import models

class Marca(models.Model):
    TIPO_MOTO = "moto"
    TIPO_ACCESORIO_MOTO = "accesorio_moto"
    TIPO_ACCESORIO_RIDER = "accesorio_rider"
    TIPO_CHOICES = [
        (TIPO_MOTO, "Moto"),
        (TIPO_ACCESORIO_MOTO, "Accesorio moto"),
        (TIPO_ACCESORIO_RIDER, "Accesorio rider"),
    ]

    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    url_logo = models.URLField(blank=True)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=32, choices=TIPO_CHOICES, blank=True, null=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class CategoriaMoto(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class SubcategoriaProducto(models.Model):
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.CASCADE, related_name="subcategorias")
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["categoria__nombre", "nombre"]

    def __str__(self):
        return f"{self.categoria.nombre} - {self.nombre}"