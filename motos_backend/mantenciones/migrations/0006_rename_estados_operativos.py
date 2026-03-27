from django.db import migrations, models


ESTADOS_MAP = {
    "ingresada": "solicitud",
    "aceptada": "aprobado",
    "en_revision": "en_proceso",
    "en_proceso": "en_proceso",
    "esperando_repuestos": "en_espera",
    "finalizada": "finalizado",
    "entregada": "entregada",
    "cancelada": "cancelado",
    "no_asistio": "inasistencia",
}


def forward_states(apps, schema_editor):
    Mantencion = apps.get_model("mantenciones", "Mantencion")
    MantencionEstadoHistorial = apps.get_model("mantenciones", "MantencionEstadoHistorial")

    for old_state, new_state in ESTADOS_MAP.items():
        Mantencion.objects.filter(estado=old_state).update(estado=new_state)
        MantencionEstadoHistorial.objects.filter(estado_nuevo=old_state).update(estado_nuevo=new_state)
        MantencionEstadoHistorial.objects.filter(estado_anterior=old_state).update(estado_anterior=new_state)


def backward_states(apps, schema_editor):
    Mantencion = apps.get_model("mantenciones", "Mantencion")
    MantencionEstadoHistorial = apps.get_model("mantenciones", "MantencionEstadoHistorial")

    reverse_map = {
        "solicitud": "ingresada",
        "aprobado": "aceptada",
        # El mapeo previo fusiono en_revision/en_proceso -> en_proceso.
        # Para rollback elegimos el valor operativo mas estable.
        "en_proceso": "en_proceso",
        "en_espera": "esperando_repuestos",
        "finalizado": "finalizada",
        "entregada": "entregada",
        "cancelado": "cancelada",
        "inasistencia": "no_asistio",
        "no_aceptado": "ingresada",
    }

    for new_state, old_state in reverse_map.items():
        Mantencion.objects.filter(estado=new_state).update(estado=old_state)
        MantencionEstadoHistorial.objects.filter(estado_nuevo=new_state).update(estado_nuevo=old_state)
        MantencionEstadoHistorial.objects.filter(estado_anterior=new_state).update(estado_anterior=old_state)


class Migration(migrations.Migration):
    dependencies = [
        ("mantenciones", "0005_mantencion_rut_cliente"),
    ]

    operations = [
        migrations.RunPython(forward_states, backward_states),
        migrations.AlterField(
            model_name="mantencion",
            name="estado",
            field=models.CharField(
                choices=[
                    ("solicitud", "Solicitud"),
                    ("aprobado", "Aprobado"),
                    ("en_proceso", "En proceso"),
                    ("en_espera", "En espera"),
                    ("finalizado", "Finalizado"),
                    ("entregada", "Entregado"),
                    ("cancelado", "Cancelado"),
                    ("inasistencia", "Inasistencia"),
                    ("no_aceptado", "No aceptado"),
                ],
                default="solicitud",
                max_length=24,
                verbose_name="estado",
            ),
        ),
        migrations.AlterField(
            model_name="mantencionestadohistorial",
            name="estado_nuevo",
            field=models.CharField(
                choices=[
                    ("solicitud", "Solicitud"),
                    ("aprobado", "Aprobado"),
                    ("en_proceso", "En proceso"),
                    ("en_espera", "En espera"),
                    ("finalizado", "Finalizado"),
                    ("entregada", "Entregado"),
                    ("cancelado", "Cancelado"),
                    ("inasistencia", "Inasistencia"),
                    ("no_aceptado", "No aceptado"),
                ],
                max_length=24,
                verbose_name="estado nuevo",
            ),
        ),
    ]
