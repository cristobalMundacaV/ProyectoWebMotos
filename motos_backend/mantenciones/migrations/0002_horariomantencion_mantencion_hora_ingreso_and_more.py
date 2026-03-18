from django.db import migrations, models


def seed_horarios_default(apps, schema_editor):
    HorarioMantencion = apps.get_model("mantenciones", "HorarioMantencion")
    if HorarioMantencion.objects.exists():
        return

    horarios = []
    for dia_semana in [0, 1, 2, 3, 4]:
        horarios.append(
            HorarioMantencion(
                dia_semana=dia_semana,
                hora_inicio="09:00",
                hora_fin="18:00",
                intervalo_minutos=60,
                cupos_por_bloque=1,
                activo=True,
            )
        )
    HorarioMantencion.objects.bulk_create(horarios)


class Migration(migrations.Migration):

    dependencies = [
        ("mantenciones", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="HorarioMantencion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "dia_semana",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (0, "Lunes"),
                            (1, "Martes"),
                            (2, "Miercoles"),
                            (3, "Jueves"),
                            (4, "Viernes"),
                            (5, "Sabado"),
                            (6, "Domingo"),
                        ],
                        verbose_name="dia de semana",
                    ),
                ),
                ("hora_inicio", models.TimeField(verbose_name="hora inicio")),
                ("hora_fin", models.TimeField(verbose_name="hora fin")),
                ("intervalo_minutos", models.PositiveSmallIntegerField(default=60, verbose_name="intervalo (minutos)")),
                ("cupos_por_bloque", models.PositiveSmallIntegerField(default=1, verbose_name="cupos por bloque")),
                ("activo", models.BooleanField(default=True, verbose_name="activo")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="creado")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="actualizado")),
            ],
            options={
                "verbose_name": "horario operativo de mantencion",
                "verbose_name_plural": "horarios operativos de mantencion",
                "ordering": ["dia_semana", "hora_inicio"],
            },
        ),
        migrations.AddField(
            model_name="mantencion",
            name="hora_ingreso",
            field=models.TimeField(blank=True, null=True, verbose_name="hora de ingreso"),
        ),
        migrations.AlterField(
            model_name="mantencion",
            name="kilometraje_ingreso",
            field=models.IntegerField(blank=True, null=True, verbose_name="kilometraje de ingreso"),
        ),
        migrations.RunPython(seed_horarios_default, migrations.RunPython.noop),
    ]
