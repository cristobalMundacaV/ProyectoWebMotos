from django.conf import settings
from django.db import models


class CatalogoEvento(models.Model):
    TIPO_MOTO = "moto"
    TIPO_ACCESORIO = "accesorio"
    TIPO_INDUMENTARIA = "indumentaria"
    TIPO_OTRO = "otro"

    TIPO_ENTIDAD_CHOICES = [
        (TIPO_MOTO, "Moto"),
        (TIPO_ACCESORIO, "Accesorio"),
        (TIPO_INDUMENTARIA, "Indumentaria"),
        (TIPO_OTRO, "Otro"),
    ]

    EVENTO_VISTA_DETALLE = "view_detail"
    EVENTO_VISTA_LISTADO = "view_list"
    EVENTO_CLICK = "click"

    TIPO_EVENTO_CHOICES = [
        (EVENTO_VISTA_DETALLE, "Vista detalle"),
        (EVENTO_VISTA_LISTADO, "Vista listado"),
        (EVENTO_CLICK, "Click"),
    ]

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="fecha evento")
    tipo_evento = models.CharField(
        max_length=24,
        choices=TIPO_EVENTO_CHOICES,
        default=EVENTO_VISTA_DETALLE,
        verbose_name="tipo de evento",
    )
    tipo_entidad = models.CharField(max_length=20, choices=TIPO_ENTIDAD_CHOICES, verbose_name="tipo entidad")
    entidad_id = models.PositiveIntegerField(null=True, blank=True, verbose_name="id entidad")
    entidad_slug = models.SlugField(max_length=180, blank=True, default="", verbose_name="slug entidad")
    entidad_nombre = models.CharField(max_length=220, blank=True, default="", verbose_name="nombre entidad")
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="eventos_catalogo",
        null=True,
        blank=True,
        verbose_name="usuario",
    )
    session_id = models.CharField(max_length=80, blank=True, default="", verbose_name="session id")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="ip")
    user_agent = models.TextField(blank=True, default="", verbose_name="user agent")
    origen = models.CharField(max_length=255, blank=True, default="", verbose_name="origen")
    metadata = models.JSONField(default=dict, blank=True, verbose_name="metadata")

    class Meta:
        verbose_name = "evento de catalogo"
        verbose_name_plural = "eventos de catalogo"
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["created_at"], name="idx_cat_event_created"),
            models.Index(fields=["tipo_entidad", "created_at"], name="idx_cat_event_tipo_fecha"),
            models.Index(fields=["tipo_entidad", "entidad_id"], name="idx_cat_event_tipo_entidad"),
            models.Index(fields=["session_id", "created_at"], name="idx_cat_event_session_fecha"),
            models.Index(fields=["tipo_evento", "created_at"], name="idx_cat_event_evento_fecha"),
        ]

    def __str__(self) -> str:
        return f"{self.tipo_evento} {self.tipo_entidad} {self.entidad_nombre or self.entidad_id}"
