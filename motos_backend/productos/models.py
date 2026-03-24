from django.db import models


class Producto(models.Model):
    subcategoria = models.ForeignKey(
        'catalogo.SubcategoriaProducto',
        on_delete=models.PROTECT,
        related_name='productos'
    )
    marca = models.ForeignKey(
        'catalogo.Marca',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='productos'
    )

    nombre = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)

    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.IntegerField(default=0)

    imagen_principal = models.ImageField(
        upload_to='productos/',
        blank=True,
        null=True
    )

    es_destacado = models.BooleanField(default=False)
    orden_carrusel = models.PositiveIntegerField(default=1)
    activo = models.BooleanField(default=True)

    # True si el producto depende de modelos específicos de moto
    # por ejemplo parabrisas, defensas, top case, sliders, etc.
    requiere_compatibilidad = models.BooleanField(default=False)

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha_creacion"]

    def __str__(self):
        return self.nombre


class ImagenProducto(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='imagenes'
    )
    imagen = models.ImageField(upload_to='productos/galeria/')
    texto_alternativo = models.CharField(max_length=255, blank=True)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ["orden"]

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"


class EspecificacionProducto(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='especificaciones'
    )
    clave = models.CharField(max_length=100)
    valor = models.CharField(max_length=255)

    class Meta:
        ordering = ["clave"]

    def __str__(self):
        return f"{self.producto.nombre} - {self.clave}"


class CompatibilidadProductoMoto(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='compatibilidades'
    )
    moto = models.ForeignKey(
        'motos.Moto',
        on_delete=models.CASCADE,
        related_name='productos_compatibles'
    )

    class Meta:
        unique_together = ('producto', 'moto')
        verbose_name = 'Compatibilidad de producto con moto'
        verbose_name_plural = 'Compatibilidades de productos con motos'

    def __str__(self):
        return f"{self.producto.nombre} compatible con {self.moto.modelo}"
