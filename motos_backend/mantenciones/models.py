from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class VehiculoCliente(models.Model):
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
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

    ESTADO_SOLICITUD = "solicitud"
    ESTADO_APROBADO = "aprobado"
    ESTADO_EN_PROCESO = "en_proceso"
    ESTADO_EN_ESPERA = "en_espera"
    ESTADO_FINALIZADO = "finalizado"
    ESTADO_ENTREGADA = "entregada"
    ESTADO_CANCELADO = "cancelado"
    ESTADO_INASISTENCIA = "inasistencia"
    ESTADO_NO_ACEPTADO = "no_aceptado"

    ESTADO_CHOICES = [
        (ESTADO_SOLICITUD, "Solicitud"),
        (ESTADO_APROBADO, "Aprobado"),
        (ESTADO_EN_PROCESO, "En proceso"),
        (ESTADO_EN_ESPERA, "En espera"),
        (ESTADO_FINALIZADO, "Finalizado"),
        (ESTADO_ENTREGADA, "Entregado"),
        (ESTADO_CANCELADO, "Cancelado"),
        (ESTADO_INASISTENCIA, "Inasistencia"),
        (ESTADO_NO_ACEPTADO, "No aceptado"),
    ]

    ESTADOS_AGENDABLES = {ESTADO_SOLICITUD, ESTADO_APROBADO}
    ESTADOS_ACTIVOS_TALLER = {ESTADO_EN_PROCESO, ESTADO_EN_ESPERA}
    ESTADOS_CIERRE = {ESTADO_FINALIZADO, ESTADO_ENTREGADA}
    ESTADOS_CUPO_OCUPADO = {
        ESTADO_SOLICITUD,
        ESTADO_APROBADO,
        ESTADO_EN_PROCESO,
        ESTADO_EN_ESPERA,
        ESTADO_FINALIZADO,
        ESTADO_ENTREGADA,
        ESTADO_INASISTENCIA,
    }
    ESTADOS_NO_OCUPAN_CUPO = {ESTADO_CANCELADO, ESTADO_NO_ACEPTADO}

    ALLOWED_STATE_TRANSITIONS = {
        ESTADO_SOLICITUD: {ESTADO_APROBADO, ESTADO_CANCELADO, ESTADO_NO_ACEPTADO},
        ESTADO_APROBADO: {ESTADO_EN_PROCESO, ESTADO_INASISTENCIA, ESTADO_CANCELADO},
        ESTADO_EN_PROCESO: {ESTADO_EN_ESPERA, ESTADO_FINALIZADO, ESTADO_CANCELADO},
        ESTADO_EN_ESPERA: {ESTADO_EN_PROCESO, ESTADO_CANCELADO},
        ESTADO_FINALIZADO: {ESTADO_ENTREGADA, ESTADO_CANCELADO},
        ESTADO_ENTREGADA: set(),
        ESTADO_CANCELADO: set(),
        ESTADO_INASISTENCIA: set(),
        ESTADO_NO_ACEPTADO: set(),
    }

    moto_cliente = models.ForeignKey(
        VehiculoCliente,
        on_delete=models.PROTECT,
        related_name="mantenciones",
        verbose_name="moto cliente",
    )
    rut_cliente = models.CharField(max_length=12, blank=True, default="", db_index=True, verbose_name="rut cliente")
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
        default=ESTADO_SOLICITUD,
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
        constraints = [
            models.CheckConstraint(
                check=models.Q(costo_total__gte=0),
                name="chk_mantencion_costo_total_non_negative",
            ),
            models.CheckConstraint(
                check=models.Q(kilometraje_ingreso__isnull=True) | models.Q(kilometraje_ingreso__gte=0),
                name="chk_mantencion_km_ingreso_non_negative",
            ),
            models.CheckConstraint(
                check=~models.Q(rut_cliente=""),
                name="chk_mantencion_rut_not_empty",
            ),
            models.CheckConstraint(
                check=models.Q(fecha_entrega__isnull=True) | models.Q(fecha_entrega__gte=models.F("fecha_ingreso")),
                name="chk_mantencion_fecha_entrega_gte_ingreso",
            ),
            models.CheckConstraint(
                check=(
                    ~models.Q(estado__in=["en_proceso", "en_espera", "finalizado", "entregada"])
                    | (models.Q(hora_ingreso__isnull=False) & models.Q(kilometraje_ingreso__isnull=False))
                ),
                name="chk_mantencion_estado_requiere_ingreso",
            ),
            models.CheckConstraint(
                check=~models.Q(estado="entregada") | models.Q(fecha_entrega__isnull=False),
                name="chk_mantencion_entregada_requiere_fecha_entrega",
            ),
            models.UniqueConstraint(
                fields=["moto_cliente", "fecha_ingreso", "hora_ingreso"],
                condition=(
                    models.Q(hora_ingreso__isnull=False)
                    & models.Q(
                        estado__in=[
                            "solicitud",
                            "aprobado",
                            "en_proceso",
                            "en_espera",
                            "finalizado",
                        ]
                    )
                ),
                name="uniq_mantencion_activa_por_moto_slot",
            ),
        ]

    def __str__(self) -> str:
        return f"Mantencion {self.moto_cliente.matricula} - {self.fecha_ingreso} ({self.get_estado_display()})"

    @classmethod
    def can_transition(cls, from_state: str, to_state: str) -> bool:
        if from_state == to_state:
            return True
        return to_state in cls.ALLOWED_STATE_TRANSITIONS.get(from_state, set())

    def clean(self):
        super().clean()

        if self.estado in self.ESTADOS_ACTIVOS_TALLER | self.ESTADOS_CIERRE:
            if self.hora_ingreso is None:
                raise ValidationError({"hora_ingreso": "La hora de ingreso es obligatoria para este estado."})
            if self.kilometraje_ingreso is None:
                raise ValidationError({"kilometraje_ingreso": "El kilometraje de ingreso es obligatorio para este estado."})

        if self.estado in self.ESTADOS_CIERRE:
            if not (self.diagnostico or "").strip():
                raise ValidationError({"diagnostico": "El diagnostico es obligatorio para este estado."})
            if not (self.trabajo_realizado or "").strip():
                raise ValidationError({"trabajo_realizado": "El trabajo realizado es obligatorio para este estado."})

        if self.estado == self.ESTADO_ENTREGADA and self.fecha_entrega is None:
            raise ValidationError({"fecha_entrega": "La fecha de entrega es obligatoria cuando la mantencion esta entregada."})

    def save(self, *args, **kwargs):
        validate = kwargs.pop("validate", True)
        if validate:
            self.full_clean()
        return super().save(*args, **kwargs)


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
        on_delete=models.PROTECT,
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
