from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


def sanitize_empty_rut(apps, schema_editor):
    Mantencion = apps.get_model("mantenciones", "Mantencion")
    Mantencion.objects.filter(rut_cliente="").update(rut_cliente="PENDIENTE")


def dedupe_active_slots(apps, schema_editor):
    Mantencion = apps.get_model("mantenciones", "Mantencion")
    MantencionEstadoHistorial = apps.get_model("mantenciones", "MantencionEstadoHistorial")

    active_states = ["solicitud", "aprobado", "en_proceso", "en_espera", "finalizado"]
    duplicates = {}

    for item in (
        Mantencion.objects.filter(hora_ingreso__isnull=False, estado__in=active_states)
        .values("moto_cliente_id", "fecha_ingreso", "hora_ingreso")
        .order_by("moto_cliente_id", "fecha_ingreso", "hora_ingreso", "id")
    ):
        key = (item["moto_cliente_id"], item["fecha_ingreso"], item["hora_ingreso"])
        duplicates.setdefault(key, 0)
        duplicates[key] += 1

    duplicate_keys = {key for key, count in duplicates.items() if count > 1}
    if not duplicate_keys:
        return

    for moto_cliente_id, fecha_ingreso, hora_ingreso in duplicate_keys:
        slot_rows = list(
            Mantencion.objects.filter(
                moto_cliente_id=moto_cliente_id,
                fecha_ingreso=fecha_ingreso,
                hora_ingreso=hora_ingreso,
                estado__in=active_states,
            ).order_by("created_at", "id")
        )
        keeper = slot_rows[0]
        for duplicate in slot_rows[1:]:
            old_state = duplicate.estado
            duplicate.estado = "cancelado"
            duplicate.observaciones = (
                (duplicate.observaciones or "").strip() + " | Cancelado automaticamente por saneamiento de duplicidad de agenda."
            ).strip(" |")
            duplicate.save(update_fields=["estado", "observaciones", "updated_at"])

            MantencionEstadoHistorial.objects.create(
                mantencion_id=duplicate.id,
                estado_anterior=old_state,
                estado_nuevo="cancelado",
                changed_by=None,
                fuente="api",
                observacion="Saneamiento de duplicidad: slot activo duplicado para misma moto/fecha/hora",
            )


class Migration(migrations.Migration):
    dependencies = [
        ("mantenciones", "0006_rename_estados_operativos"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(sanitize_empty_rut, migrations.RunPython.noop),
        migrations.RunPython(dedupe_active_slots, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="vehiculocliente",
            name="cliente",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="vehiculos_cliente",
                to=settings.AUTH_USER_MODEL,
                verbose_name="cliente",
            ),
        ),
        migrations.AlterField(
            model_name="mantencion",
            name="moto_cliente",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="mantenciones",
                to="mantenciones.vehiculocliente",
                verbose_name="moto cliente",
            ),
        ),
        migrations.AlterField(
            model_name="mantencionestadohistorial",
            name="mantencion",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="historial_estados",
                to="mantenciones.mantencion",
                verbose_name="mantencion",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.CheckConstraint(
                condition=models.Q(("costo_total__gte", 0)),
                name="chk_mantencion_costo_total_non_negative",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.CheckConstraint(
                condition=models.Q(("kilometraje_ingreso__isnull", True)) | models.Q(("kilometraje_ingreso__gte", 0)),
                name="chk_mantencion_km_ingreso_non_negative",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.CheckConstraint(
                condition=~models.Q(("rut_cliente", "")),
                name="chk_mantencion_rut_not_empty",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.CheckConstraint(
                condition=models.Q(("fecha_entrega__isnull", True))
                | models.Q(("fecha_entrega__gte", models.F("fecha_ingreso"))),
                name="chk_mantencion_fecha_entrega_gte_ingreso",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.CheckConstraint(
                condition=~models.Q(("estado__in", ["en_proceso", "en_espera", "finalizado", "entregada"]))
                | (models.Q(("hora_ingreso__isnull", False)) & models.Q(("kilometraje_ingreso__isnull", False))),
                name="chk_mantencion_estado_requiere_ingreso",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.CheckConstraint(
                condition=~models.Q(("estado", "entregada")) | models.Q(("fecha_entrega__isnull", False)),
                name="chk_mantencion_entregada_requiere_fecha_entrega",
            ),
        ),
        migrations.AddConstraint(
            model_name="mantencion",
            constraint=models.UniqueConstraint(
                condition=models.Q(("hora_ingreso__isnull", False))
                & models.Q(("estado__in", ["solicitud", "aprobado", "en_proceso", "en_espera", "finalizado"])),
                fields=("moto_cliente", "fecha_ingreso", "hora_ingreso"),
                name="uniq_mantencion_activa_por_moto_slot",
            ),
        ),
    ]
