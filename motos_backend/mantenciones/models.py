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


class HorarioMantencion(models.Model):
    DIA_SEMANA_CHOICES = [
        (0, "Lunes"),
        (1, "Martes"),
        (2, "Miercoles"),
        (3, "Jueves"),
        (4, "Viernes"),
        (5, "Sabado"),
        (6, "Domingo"),
    ]

    dia_semana = models.PositiveSmallIntegerField(choices=DIA_SEMANA_CHOICES, verbose_name="dia de semana")
    hora_inicio = models.TimeField(verbose_name="hora inicio")
    hora_fin = models.TimeField(verbose_name="hora fin")
    intervalo_minutos = models.PositiveSmallIntegerField(default=60, verbose_name="intervalo (minutos)")
    cupos_por_bloque = models.PositiveSmallIntegerField(default=1, verbose_name="cupos por bloque")
    activo = models.BooleanField(default=True, verbose_name="activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="creado")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="actualizado")

    class Meta:
        verbose_name = "horario operativo de mantencion"
        verbose_name_plural = "horarios operativos de mantencion"
        ordering = ["dia_semana", "hora_inicio"]

    def __str__(self) -> str:
        dia = dict(self.DIA_SEMANA_CHOICES).get(self.dia_semana, str(self.dia_semana))
        return f"{dia}: {self.hora_inicio.strftime('%H:%M')} - {self.hora_fin.strftime('%H:%M')}"


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
    ESTADO_ACEPTADA = "aceptada"
    ESTADO_EN_REVISION = "en_revision"
    ESTADO_EN_PROCESO = "en_proceso"
    ESTADO_ESPERANDO_REPUESTOS = "esperando_repuestos"
    ESTADO_FINALIZADA = "finalizada"
    ESTADO_ENTREGADA = "entregada"
    ESTADO_CANCELADA = "cancelada"
    ESTADO_NO_ASISTIO = "no_asistio"

    ESTADO_CHOICES = [
        (ESTADO_INGRESADA, "Ingresada"),
        (ESTADO_ACEPTADA, "Aceptada"),
        (ESTADO_EN_REVISION, "En revision"),
        (ESTADO_EN_PROCESO, "En proceso"),
        (ESTADO_ESPERANDO_REPUESTOS, "Esperando repuestos"),
        (ESTADO_FINALIZADA, "Finalizada"),
        (ESTADO_ENTREGADA, "Entregada"),
        (ESTADO_CANCELADA, "Cancelada"),
        (ESTADO_NO_ASISTIO, "No asistio"),
    ]

    moto_cliente = models.ForeignKey(
        VehiculoCliente,
        on_delete=models.CASCADE,
        related_name="mantenciones",
        verbose_name="moto cliente",
    )
    fecha_ingreso = models.DateField(verbose_name="fecha de ingreso")
    hora_ingreso = models.TimeField(null=True, blank=True, verbose_name="hora de ingreso")
    kilometraje_ingreso = models.IntegerField(null=True, blank=True, verbose_name="kilometraje de ingreso")
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
        indexes = [
            models.Index(fields=["created_at"], name="idx_mantencion_created_at"),
            models.Index(fields=["fecha_ingreso"], name="idx_mantencion_fecha_ingreso"),
            models.Index(fields=["estado"], name="idx_mantencion_estado"),
            models.Index(fields=["tipo_mantencion"], name="idx_mantencion_tipo"),
            models.Index(fields=["fecha_ingreso", "hora_ingreso"], name="idx_mantencion_fecha_hora"),
            models.Index(fields=["created_at", "estado"], name="idx_mantencion_created_estado"),
        ]

    def __str__(self) -> str:
        return f"Mantencion {self.moto_cliente.matricula} - {self.fecha_ingreso} ({self.get_estado_display()})"


class MantencionEstadoHistorial(models.Model):
    FUENTE_PORTAL_CLIENTE = "portal_cliente"
    FUENTE_ADMIN_PANEL = "admin_panel"
    FUENTE_API = "api"

    FUENTE_CHOICES = [
        (FUENTE_PORTAL_CLIENTE, "Portal cliente"),
        (FUENTE_ADMIN_PANEL, "Admin panel"),
        (FUENTE_API, "API"),
    ]

    mantencion = models.ForeignKey(
        Mantencion,
        on_delete=models.CASCADE,
        related_name="historial_estados",
        verbose_name="mantencion",
    )
    estado_anterior = models.CharField(max_length=24, blank=True, default="", verbose_name="estado anterior")
    estado_nuevo = models.CharField(max_length=24, choices=Mantencion.ESTADO_CHOICES, verbose_name="estado nuevo")
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="mantenciones_estado_cambios",
        verbose_name="modificado por",
    )
    fuente = models.CharField(max_length=24, choices=FUENTE_CHOICES, default=FUENTE_API, verbose_name="fuente")
    observacion = models.CharField(max_length=255, blank=True, default="", verbose_name="observacion")
    changed_at = models.DateTimeField(auto_now_add=True, verbose_name="fecha de cambio")

    class Meta:
        verbose_name = "historial de estado de mantencion"
        verbose_name_plural = "historial de estados de mantenciones"
        ordering = ["-changed_at", "-id"]
        indexes = [
            models.Index(fields=["changed_at"], name="idx_hist_mant_changed_at"),
            models.Index(fields=["estado_nuevo"], name="idx_hist_mant_estado_nuevo"),
            models.Index(fields=["mantencion", "changed_at"], name="idx_hist_mant_mant_fecha"),
        ]

    def __str__(self) -> str:
        previo = self.estado_anterior or "sin_estado"
        return f"{self.mantencion_id}: {previo} -> {self.estado_nuevo}"
