from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mantenciones", "0007_harden_integrity_and_security_constraints"),
    ]

    operations = [
        migrations.CreateModel(
            name="MantencionDiaBloqueado",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("fecha", models.DateField(unique=True, verbose_name="fecha bloqueada")),
                ("bloqueado", models.BooleanField(default=True, verbose_name="bloqueado")),
                ("motivo", models.CharField(blank=True, default="", max_length=255, verbose_name="motivo")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="creado")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="actualizado")),
            ],
            options={
                "verbose_name": "dia bloqueado de mantencion",
                "verbose_name_plural": "dias bloqueados de mantencion",
                "ordering": ["-fecha"],
            },
        ),
        migrations.AddIndex(
            model_name="mantenciondiabloqueado",
            index=models.Index(fields=["fecha"], name="idx_mant_dia_bloq_fecha"),
        ),
        migrations.AddIndex(
            model_name="mantenciondiabloqueado",
            index=models.Index(fields=["bloqueado"], name="idx_mant_dia_bloq_estado"),
        ),
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
                    ("reagendacion", "Reagendacion"),
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
                    ("reagendacion", "Reagendacion"),
                ],
                max_length=24,
                verbose_name="estado nuevo",
            ),
        ),
    ]
