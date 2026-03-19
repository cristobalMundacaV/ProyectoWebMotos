from django.db import models


class ModeloMoto(models.Model):
    marca = models.ForeignKey("catalogo.Marca", on_delete=models.PROTECT, related_name="modelos_moto")
    nombre_modelo = models.CharField(max_length=150)
    categoria = models.ForeignKey("catalogo.CategoriaMoto", on_delete=models.PROTECT, null=True, blank=True)
    cilindrada = models.IntegerField(null=True, blank=True)
    tipo_motor = models.CharField(max_length=120, blank=True)
    potencia = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    torque = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    refrigeracion = models.CharField(max_length=120, blank=True)
    transmision = models.CharField(max_length=120, blank=True)
    peso = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    capacidad_estanque = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["nombre_modelo"]
        constraints = [
            models.UniqueConstraint(fields=["marca", "nombre_modelo"], name="uq_modelomoto_marca_nombre_modelo"),
        ]

    def __str__(self):
        return f"{self.marca.nombre} {self.nombre_modelo}"


class Moto(models.Model):
    marca = models.ForeignKey('catalogo.Marca', on_delete=models.CASCADE)
    modelo_moto = models.ForeignKey("motos.ModeloMoto", on_delete=models.PROTECT, related_name="motos")

    modelo = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    anio = models.IntegerField()
    color = models.CharField(max_length=60, blank=True)
    stock = models.IntegerField(default=0)
    estado = models.CharField(
        max_length=20,
        choices=[
            ("disponible", "Disponible"),
            ("reservada", "Reservada"),
            ("vendida", "Vendida"),
            ("inactiva", "Inactiva"),
        ],
        default="disponible",
    )

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
