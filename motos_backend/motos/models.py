from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError


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
        indexes = [
            models.Index(fields=["activo", "marca", "nombre_modelo"], name="idx_modelomoto_act_marca_nom"),
        ]
        constraints = [
            models.UniqueConstraint(fields=["marca", "nombre_modelo"], name="uq_modelomoto_marca_nombre_modelo"),
            models.CheckConstraint(
                condition=Q(cilindrada__isnull=True) | Q(cilindrada__gt=0),
                name="chk_modelomoto_cilindrada_gt_0",
            ),
            models.CheckConstraint(
                condition=Q(potencia__isnull=True) | Q(potencia__gte=0),
                name="chk_modelomoto_potencia_gte_0",
            ),
            models.CheckConstraint(
                condition=Q(torque__isnull=True) | Q(torque__gte=0),
                name="chk_modelomoto_torque_gte_0",
            ),
            models.CheckConstraint(
                condition=Q(peso__isnull=True) | Q(peso__gte=0),
                name="chk_modelomoto_peso_gte_0",
            ),
            models.CheckConstraint(
                condition=Q(capacidad_estanque__isnull=True) | Q(capacidad_estanque__gte=0),
                name="chk_modelomoto_estanque_gte_0",
            ),
        ]

    def __str__(self):
        return f"{self.marca.nombre} {self.nombre_modelo}"


class Moto(models.Model):
    marca = models.ForeignKey('catalogo.Marca', on_delete=models.PROTECT)
    modelo_moto = models.ForeignKey("motos.ModeloMoto", on_delete=models.PROTECT, related_name="motos")

    modelo = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    precio_lista = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    anio = models.IntegerField()
    color = models.CharField(max_length=60, blank=True)
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
    video_presentacion = models.URLField(max_length=500, blank=True, default="")
    permite_variante_maletas = models.BooleanField(default=False)
    precio_con_maletas = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    precio_lista_con_maletas = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    imagen_con_maletas = models.ImageField(upload_to="motos/", blank=True, null=True)

    es_destacada = models.BooleanField(default=False)
    orden_carrusel = models.PositiveIntegerField(default=1)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["activa", "es_destacada", "orden_carrusel", "id"], name="idx_moto_home_feed"),
            models.Index(fields=["marca", "modelo_moto", "activa"], name="idx_moto_marca_modelo_act"),
            models.Index(fields=["estado", "activa"], name="idx_moto_estado_activa"),
            models.Index(fields=["activa", "modelo"], name="idx_moto_activa_modelo"),
        ]
        constraints = [
            models.CheckConstraint(condition=Q(precio__gte=0), name="chk_moto_precio_gte_0"),
            models.CheckConstraint(condition=Q(precio_lista__gte=0), name="chk_moto_precio_lista_gte_0"),
            models.CheckConstraint(condition=Q(precio_lista__gte=models.F("precio")), name="chk_moto_lista_gte_precio"),
            models.CheckConstraint(condition=Q(anio__gte=1990) & Q(anio__lte=2100), name="chk_moto_anio_range"),
            models.CheckConstraint(condition=Q(orden_carrusel__gte=1), name="chk_moto_orden_carrusel_gte_1"),
            models.CheckConstraint(
                condition=Q(permite_variante_maletas=False) | (Q(precio_con_maletas__isnull=False) & Q(precio_con_maletas__gte=0)),
                name="chk_moto_maletas_precio_required",
            ),
            models.CheckConstraint(
                condition=Q(permite_variante_maletas=False) | (Q(precio_lista_con_maletas__isnull=False) & Q(precio_lista_con_maletas__gte=0)),
                name="chk_moto_maletas_lista_required",
            ),
            models.CheckConstraint(
                condition=Q(precio_lista_con_maletas__isnull=True) | Q(precio_con_maletas__isnull=True) | Q(precio_lista_con_maletas__gte=models.F("precio_con_maletas")),
                name="chk_moto_lista_maletas_gte_precio",
            ),
        ]

    def __str__(self):
        if self.modelo_moto_id:
            return self.modelo_moto.nombre_modelo
        return self.modelo

    def clean(self):
        if self.modelo_moto_id and self.marca_id and self.modelo_moto.marca_id != self.marca_id:
            raise ValidationError({"modelo_moto": "El modelo de moto no pertenece a la marca seleccionada."})

        if self.modelo_moto_id:
            modelo_nombre = (self.modelo_moto.nombre_modelo or "").strip()
            if modelo_nombre:
                self.modelo = modelo_nombre
        else:
            self.modelo = (self.modelo or "").strip()
            if not self.modelo:
                raise ValidationError({"modelo": "El nombre del modelo es obligatorio."})

    def save(self, *args, **kwargs):
        update_fields = kwargs.get("update_fields")

        if self.modelo_moto_id:
            if hasattr(self, "modelo_moto") and self.modelo_moto is not None:
                modelo_nombre = (self.modelo_moto.nombre_modelo or "").strip()
            else:
                modelo_nombre = (
                    ModeloMoto.objects.filter(pk=self.modelo_moto_id).values_list("nombre_modelo", flat=True).first()
                    or ""
                ).strip()
            if modelo_nombre and self.modelo != modelo_nombre:
                self.modelo = modelo_nombre
                if update_fields is not None:
                    update_fields = set(update_fields)
                    update_fields.add("modelo")
                    kwargs["update_fields"] = list(update_fields)
        else:
            self.modelo = (self.modelo or "").strip()

        super().save(*args, **kwargs)


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
    TIPO_CONTROL_TEXTO = "texto"
    TIPO_CONTROL_SWITCH = "switch"
    TIPO_CONTROL_CHOICES = [
        (TIPO_CONTROL_TEXTO, "Texto"),
        (TIPO_CONTROL_SWITCH, "Switch"),
    ]

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
    valor = models.TextField(blank=True, default="")
    tipo_control = models.CharField(max_length=20, choices=TIPO_CONTROL_CHOICES, default=TIPO_CONTROL_TEXTO)
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["orden", "id"]
        indexes = [
            models.Index(fields=["moto", "tipo_atributo", "orden"], name="idx_valoratrib_moto_tipo_ord"),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["moto", "tipo_atributo", "nombre"],
                name="uq_valoratributomoto_moto_tipoatributo_nombre",
            ),
            models.CheckConstraint(condition=Q(orden__gte=1), name="chk_valoratributo_orden_gte_1"),
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

    class Meta:
        indexes = [
            models.Index(fields=["moto", "orden"], name="idx_imagenmoto_moto_orden"),
        ]
        constraints = [
            models.CheckConstraint(condition=Q(orden__gte=0), name="chk_imagenmoto_orden_gte_0"),
        ]

    def __str__(self):
        return f"Imagen de {self.moto.modelo}"


class EspecificacionMoto(models.Model):
    moto = models.ForeignKey(Moto, on_delete=models.CASCADE, related_name='especificaciones')
    clave = models.CharField(max_length=100)
    valor = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["moto", "clave"], name="uq_especmoto_moto_clave"),
            models.CheckConstraint(condition=~Q(clave=""), name="chk_especmoto_clave_not_empty"),
        ]

    def __str__(self):
        return f"{self.moto.modelo} - {self.clave}"
