from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mantenciones", "0009_mantencionhorariofecha"),
    ]

    operations = [
        migrations.CreateModel(
            name="MantencionHoraBloqueada",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("fecha", models.DateField(verbose_name="fecha")),
                ("hora", models.TimeField(verbose_name="hora")),
                ("bloqueado", models.BooleanField(default=True, verbose_name="bloqueado")),
                ("motivo", models.CharField(blank=True, default="", max_length=255, verbose_name="motivo")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="creado")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="actualizado")),
            ],
            options={
                "verbose_name": "hora bloqueada de mantencion",
                "verbose_name_plural": "horas bloqueadas de mantencion",
                "ordering": ["-fecha", "hora"],
            },
        ),
        migrations.AddConstraint(
            model_name="mantencionhorabloqueada",
            constraint=models.UniqueConstraint(fields=("fecha", "hora"), name="uniq_mant_hora_bloq_fecha_hora"),
        ),
        migrations.AddIndex(
            model_name="mantencionhorabloqueada",
            index=models.Index(fields=["fecha"], name="idx_mant_hora_bloq_fecha"),
        ),
        migrations.AddIndex(
            model_name="mantencionhorabloqueada",
            index=models.Index(fields=["bloqueado"], name="idx_mant_hora_bloq_estado"),
        ),
    ]
