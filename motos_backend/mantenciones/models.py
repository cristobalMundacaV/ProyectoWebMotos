from django.conf import settings
from django.db import models


class VehiculoCliente(models.Model):
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehiculos_cliente",
        verbose_name="cliente",
    )
    matricula = models.CharField(max_length=20, unique=True, verbose_name="matricula")
    marca = models.CharField(max_length=80, verbose_name="marca")
    modelo = models.CharField(max_length=120, verbose_name="modelo")
    anio = models.IntegerField(null=True, blank=True, verbose_name="anio")
    kilometraje_actual = models.IntegerField(default=0, verbose_name="kilometraje actual")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="creado")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="actualizado")

    class Meta:
        verbose_name = "vehiculo de cliente"
        verbose_name_plural = "vehiculos de clientes"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        cliente_nombre = (
            self.cliente.get_full_name().strip() if hasattr(self.cliente, "get_full_name") else str(self.cliente)
        )
        cliente_nombre = cliente_nombre or getattr(self.cliente, "username", "cliente")
        return f"{self.matricula} - {self.marca} {self.modelo} ({cliente_nombre})"


class Mantencion(models.Model):
    TIPO_PREVENTIVA = "preventiva"
    TIPO_CORRECTIVA = "correctiva"
    TIPO_GARANTIA = "garantia"
    TIPO_REVISION_GENERAL = "revision_general"
    TIPO_CAMBIO_ACEITE = "cambio_aceite"
    TIPO_FRENOS = "frenos"
    TIPO_TRANSMISION = "transmision"
    TIPO_ELECTRICA = "electrica"
    TIPO_OTRA = "otra"

    TIPO_MANTENCION_CHOICES = [
        (TIPO_PREVENTIVA, "Preventiva"),
        (TIPO_CORRECTIVA, "Correctiva"),
        (TIPO_GARANTIA, "Garantia"),
        (TIPO_REVISION_GENERAL, "Revision general"),
        (TIPO_CAMBIO_ACEITE, "Cambio de aceite"),
        (TIPO_FRENOS, "Frenos"),
        (TIPO_TRANSMISION, "Transmision"),
        (TIPO_ELECTRICA, "Electrica"),
        (TIPO_OTRA, "Otra"),
    ]

    ESTADO_INGRESADA = "ingresada"
    ESTADO_EN_REVISION = "en_revision"
    ESTADO_EN_PROCESO = "en_proceso"
    ESTADO_ESPERANDO_REPUESTOS = "esperando_repuestos"
    ESTADO_FINALIZADA = "finalizada"
    ESTADO_ENTREGADA = "entregada"
    ESTADO_CANCELADA = "cancelada"

    ESTADO_CHOICES = [
        (ESTADO_INGRESADA, "Ingresada"),
        (ESTADO_EN_REVISION, "En revision"),
        (ESTADO_EN_PROCESO, "En proceso"),
        (ESTADO_ESPERANDO_REPUESTOS, "Esperando repuestos"),
        (ESTADO_FINALIZADA, "Finalizada"),
        (ESTADO_ENTREGADA, "Entregada"),
        (ESTADO_CANCELADA, "Cancelada"),
    ]

    moto_cliente = models.ForeignKey(
        VehiculoCliente,
        on_delete=models.CASCADE,
        related_name="mantenciones",
        verbose_name="moto cliente",
    )
    fecha_ingreso = models.DateField(verbose_name="fecha de ingreso")
    kilometraje_ingreso = models.IntegerField(verbose_name="kilometraje de ingreso")
    tipo_mantencion = models.CharField(
        max_length=30,
        choices=TIPO_MANTENCION_CHOICES,
        default=TIPO_PREVENTIVA,
        verbose_name="tipo de mantencion",
    )
    motivo = models.TextField(verbose_name="motivo")
    diagnostico = models.TextField(blank=True, verbose_name="diagnostico")
    trabajo_realizado = models.TextField(blank=True, verbose_name="trabajo realizado")
    costo_total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="costo total")
    estado = models.CharField(
        max_length=24,
        choices=ESTADO_CHOICES,
        default=ESTADO_INGRESADA,
        verbose_name="estado",
    )
    fecha_entrega = models.DateField(null=True, blank=True, verbose_name="fecha de entrega")
    observaciones = models.TextField(blank=True, verbose_name="observaciones")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="creado")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="actualizado")

    class Meta:
        verbose_name = "mantencion"
        verbose_name_plural = "mantenciones"
        ordering = ["-fecha_ingreso", "-created_at"]

    def __str__(self) -> str:
        return f"Mantencion {self.moto_cliente.matricula} - {self.fecha_ingreso} ({self.get_estado_display()})"
