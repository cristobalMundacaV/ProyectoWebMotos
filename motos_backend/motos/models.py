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
    precio_lista = models.DecimalField(max_digits=12, decimal_places=2, default=0)
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
    permite_variante_maletas = models.BooleanField(default=False)
    precio_con_maletas = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    precio_lista_con_maletas = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    imagen_con_maletas = models.ImageField(upload_to="motos/", blank=True, null=True)

    es_destacada = models.BooleanField(default=False)
    orden_carrusel = models.PositiveIntegerField(default=1)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.modelo


class TipoAtributo(models.Model):
    nombre = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    orden = models.PositiveIntegerField(default=1)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ["orden", "id"]

    def __str__(self):
        return self.nombre


class ValorAtributoMoto(models.Model):
    moto = models.ForeignKey(
        Moto,
        on_delete=models.CASCADE,
        related_name="valores_atributos",
    )
    tipo_atributo = models.ForeignKey(
        TipoAtributo,
        on_delete=models.PROTECT,
        related_name="valores_moto",
    )
    nombre = models.CharField(max_length=120, default="")
    valor = models.TextField()
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["orden", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["moto", "tipo_atributo", "nombre"],
                name="uq_valoratributomoto_moto_tipoatributo_nombre",
            ),
        ]

    def __str__(self):
        return f"{self.moto.modelo} - {self.tipo_atributo.nombre} - {self.nombre}"


class SeccionFichaTecnica(models.Model):
    moto = models.ForeignKey(
        Moto,
        on_delete=models.CASCADE,
        related_name="secciones_ficha",
    )
    nombre = models.CharField(max_length=120)
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["orden", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["moto", "orden"],
                name="uq_seccionfichatecnica_moto_orden",
            ),
        ]

    def __str__(self):
        return f"{self.moto.modelo} - {self.nombre}"


class ItemFichaTecnica(models.Model):
    seccion = models.ForeignKey(
        SeccionFichaTecnica,
        on_delete=models.CASCADE,
        related_name="items",
    )
    nombre = models.CharField(max_length=120)
    valor = models.TextField()
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["orden", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["seccion", "orden"],
                name="uq_itemfichatecnica_seccion_orden",
            ),
        ]

    def __str__(self):
        return f"{self.seccion.nombre} - {self.nombre}: {self.valor[:50]}"


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
