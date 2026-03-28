from django.db import models
from django.conf import settings


class ContactoSitio(models.Model):
    instagram = models.CharField(max_length=120, blank=True)
    telefono = models.CharField(max_length=60, blank=True)
    ubicacion = models.CharField(max_length=180, blank=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contacto del sitio"
        verbose_name_plural = "Contacto del sitio"

    def __str__(self):
        return "Datos de contacto del sitio"


class AuditLog(models.Model):
    ACCION_CREATE = "create"
    ACCION_UPDATE = "update"
    ACCION_DELETE = "delete"

    ACCION_CHOICES = [
        (ACCION_CREATE, "Create"),
        (ACCION_UPDATE, "Update"),
        (ACCION_DELETE, "Delete"),
    ]

    creado_en = models.DateTimeField(auto_now_add=True)
    request_id = models.CharField(max_length=64, db_index=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    entidad = models.CharField(max_length=120, db_index=True)
    entidad_id = models.CharField(max_length=64, db_index=True)
    accion = models.CharField(max_length=20, choices=ACCION_CHOICES, db_index=True)
    before = models.JSONField(null=True, blank=True)
    after = models.JSONField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-creado_en", "-id"]
        indexes = [
            models.Index(fields=["entidad", "entidad_id", "-creado_en"], name="idx_audit_entidad_fecha"),
            models.Index(fields=["actor", "-creado_en"], name="idx_audit_actor_fecha"),
            models.Index(fields=["accion", "-creado_en"], name="idx_audit_accion_fecha"),
        ]

    def __str__(self):
        return f"{self.entidad}:{self.entidad_id} [{self.accion}]"
