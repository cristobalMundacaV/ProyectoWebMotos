from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mantenciones", "0008_mantenciondiabloqueado_and_reagendacion"),
    ]

    operations = [
        migrations.CreateModel(
            name="MantencionHorarioFecha",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("fecha", models.DateField(unique=True, verbose_name="fecha")),
                ("hora_inicio", models.TimeField(verbose_name="hora inicio")),
                ("hora_fin", models.TimeField(verbose_name="hora fin")),
                ("intervalo_minutos", models.PositiveSmallIntegerField(default=60, verbose_name="intervalo (minutos)")),
                ("cupos_por_bloque", models.PositiveSmallIntegerField(default=1, verbose_name="cupos por bloque")),
                ("activo", models.BooleanField(default=True, verbose_name="activo")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="creado")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="actualizado")),
            ],
            options={
                "verbose_name": "horario por fecha de mantencion",
                "verbose_name_plural": "horarios por fecha de mantencion",
                "ordering": ["-fecha"],
            },
        ),
        migrations.AddIndex(
            model_name="mantencionhorariofecha",
            index=models.Index(fields=["fecha"], name="idx_mant_hor_fecha"),
        ),
        migrations.AddIndex(
            model_name="mantencionhorariofecha",
            index=models.Index(fields=["activo"], name="idx_mant_hor_fecha_activo"),
        ),
    ]
