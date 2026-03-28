from django.db import models
from django.db.models import Q

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
    tipo = models.CharField(max_length=32, choices=TIPO_CHOICES, default=TIPO_MOTO)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]
        indexes = [
            models.Index(fields=["activa", "tipo", "nombre"], name="idx_marca_activa_tipo_nom"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~Q(nombre=""),
                name="chk_catalogo_marca_nombre_not_empty",
            ),
            models.CheckConstraint(
                condition=~Q(tipo=""),
                name="chk_catalogo_marca_tipo_not_empty",
            ),
        ]

    def __str__(self):
        return self.nombre


class CategoriaMoto(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]
        constraints = [
            models.CheckConstraint(
                condition=~Q(nombre=""),
                name="chk_catalogo_categoriamoto_nombre_not_empty",
            ),
        ]

    def __str__(self):
        return self.nombre


class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]
        indexes = [
            models.Index(fields=["activa", "nombre"], name="idx_catprod_activa_nombre"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~Q(nombre=""),
                name="chk_catalogo_categoriaprod_nombre_not_empty",
            ),
        ]

    def __str__(self):
        return self.nombre


class SubcategoriaProducto(models.Model):
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.PROTECT, related_name="subcategorias")
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        ordering = ["categoria__nombre", "nombre"]
        indexes = [
            models.Index(fields=["activa", "categoria", "nombre"], name="idx_subcat_act_cat_nom"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~Q(nombre=""),
                name="chk_catalogo_subcat_nombre_not_empty",
            ),
        ]

    def __str__(self):
        return f"{self.categoria.nombre} - {self.nombre}"
