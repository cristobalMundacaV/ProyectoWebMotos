from django.db import models


class ModeloMoto(models.Model):
    marca = models.ForeignKey("catalogo.Marca", on_delete=models.PROTECT, related_name="modelos_moto")
    nombre = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre"]
        constraints = [
            models.UniqueConstraint(fields=["marca", "nombre"], name="uq_modelomoto_marca_nombre"),
        ]

    def __str__(self):
        return f"{self.marca.nombre} {self.nombre}"


class Moto(models.Model):
    marca = models.ForeignKey('catalogo.Marca', on_delete=models.CASCADE)
    categoria = models.ForeignKey('catalogo.CategoriaMoto', on_delete=models.PROTECT)
    modelo_ref = models.ForeignKey("motos.ModeloMoto", on_delete=models.PROTECT, related_name="motos", null=True, blank=True)

    modelo = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)

    cilindrada = models.IntegerField()
    anio = models.IntegerField()
    stock = models.IntegerField(default=0)

    imagen_principal = models.ImageField(upload_to="motos/", blank=True, null=True)

    es_destacada = models.BooleanField(default=False)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.modelo


class ImagenMoto(models.Model):
    moto = models.ForeignKey(Moto, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to="motos/galeria/", blank=True, null=True)
    texto_alternativo = models.CharField(max_length=255, blank=True)
    orden = models.IntegerField(default=0)

    def __str__(self):
        return f"Imagen de {self.moto.modelo}"


class EspecificacionMoto(models.Model):
    moto = models.ForeignKey(Moto, on_delete=models.CASCADE, related_name='especificaciones')
    clave = models.CharField(max_length=100)
    valor = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.moto.modelo} - {self.clave}"
