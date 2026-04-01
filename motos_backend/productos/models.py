from django.db import models
from django.db.models import Q
from django.db.models.functions import Lower


class Producto(models.Model):
    subcategoria = models.ForeignKey(
        'catalogo.SubcategoriaProducto',
        on_delete=models.PROTECT,
        related_name='productos'
    )
    marca = models.ForeignKey(
        'catalogo.Marca',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='productos'
    )

    nombre = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)

    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)

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
        indexes = [
            models.Index(fields=["activo", "subcategoria", "marca"], name="idx_producto_act_sub_marca"),
            models.Index(fields=["es_destacado", "orden_carrusel", "id"], name="idx_producto_destacado_ord"),
            models.Index(fields=["precio"], name="idx_producto_precio"),
        ]
        constraints = [
            models.CheckConstraint(condition=Q(precio__gte=0), name="chk_producto_precio_gte_0"),
            models.CheckConstraint(condition=Q(orden_carrusel__gte=1), name="chk_producto_orden_gte_1"),
            models.UniqueConstraint(
                Lower("nombre"),
                "subcategoria",
                "marca",
                condition=Q(marca__isnull=False),
                name="uq_producto_semantic_marca",
            ),
            models.UniqueConstraint(
                Lower("nombre"),
                "subcategoria",
                condition=Q(marca__isnull=True),
                name="uq_producto_semantic_nomarca",
            ),
        ]

    def __str__(self):
        return self.nombre


class ImagenProducto(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        related_name='imagenes'
    )
    imagen = models.ImageField(upload_to='productos/galeria/')
    texto_alternativo = models.CharField(max_length=255, blank=True)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ["orden"]
        indexes = [
            models.Index(fields=["producto", "orden"], name="idx_imagenprod_prod_orden"),
        ]
        constraints = [
            models.CheckConstraint(condition=Q(orden__gte=0), name="chk_imagenprod_orden_gte_0"),
        ]

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"


class EspecificacionProducto(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        related_name='especificaciones'
    )
    clave = models.CharField(max_length=100)
    valor = models.CharField(max_length=255)

    class Meta:
        ordering = ["clave"]
        constraints = [
            models.UniqueConstraint(fields=["producto", "clave"], name="uq_especprod_producto_clave"),
            models.CheckConstraint(condition=~Q(clave=""), name="chk_especprod_clave_not_empty"),
        ]

    def __str__(self):
        return f"{self.producto.nombre} - {self.clave}"


class CompatibilidadProductoMoto(models.Model):
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        related_name='compatibilidades'
    )
    moto = models.ForeignKey(
        'motos.Moto',
        on_delete=models.PROTECT,
        related_name='productos_compatibles'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["producto", "moto"], name="uq_compat_producto_moto"),
        ]
        indexes = [
            models.Index(fields=["moto", "producto"], name="idx_compat_moto_producto"),
            models.Index(fields=["producto"], name="idx_compat_producto"),
        ]
        verbose_name = 'Compatibilidad de producto con moto'
        verbose_name_plural = 'Compatibilidades de productos con motos'

    def __str__(self):
        return f"{self.producto.nombre} compatible con {self.moto.modelo}"
