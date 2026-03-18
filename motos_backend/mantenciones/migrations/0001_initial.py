from django.db import migrations, models
from django.conf import settings
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="VehiculoCliente",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("matricula", models.CharField(max_length=20, unique=True, verbose_name="matricula")),
                ("marca", models.CharField(max_length=80, verbose_name="marca")),
                ("modelo", models.CharField(max_length=120, verbose_name="modelo")),
                ("anio", models.IntegerField(blank=True, null=True, verbose_name="anio")),
                ("kilometraje_actual", models.IntegerField(default=0, verbose_name="kilometraje actual")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="creado")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="actualizado")),
                (
                    "cliente",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="vehiculos_cliente",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="cliente",
                    ),
                ),
            ],
            options={
                "verbose_name": "vehiculo de cliente",
                "verbose_name_plural": "vehiculos de clientes",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="Mantencion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("fecha_ingreso", models.DateField(verbose_name="fecha de ingreso")),
                ("kilometraje_ingreso", models.IntegerField(verbose_name="kilometraje de ingreso")),
                (
                    "tipo_mantencion",
                    models.CharField(
                        choices=[
                            ("preventiva", "Preventiva"),
                            ("correctiva", "Correctiva"),
                            ("garantia", "Garantia"),
                            ("revision_general", "Revision general"),
                            ("cambio_aceite", "Cambio de aceite"),
                            ("frenos", "Frenos"),
                            ("transmision", "Transmision"),
                            ("electrica", "Electrica"),
                            ("otra", "Otra"),
                        ],
                        default="preventiva",
                        max_length=30,
                        verbose_name="tipo de mantencion",
                    ),
                ),
                ("motivo", models.TextField(verbose_name="motivo")),
                ("diagnostico", models.TextField(blank=True, verbose_name="diagnostico")),
                ("trabajo_realizado", models.TextField(blank=True, verbose_name="trabajo realizado")),
                ("costo_total", models.DecimalField(decimal_places=2, max_digits=12, verbose_name="costo total")),
                (
                    "estado",
                    models.CharField(
                        choices=[
                            ("ingresada", "Ingresada"),
                            ("en_revision", "En revision"),
                            ("en_proceso", "En proceso"),
                            ("esperando_repuestos", "Esperando repuestos"),
                            ("finalizada", "Finalizada"),
                            ("entregada", "Entregada"),
                            ("cancelada", "Cancelada"),
                        ],
                        default="ingresada",
                        max_length=24,
                        verbose_name="estado",
                    ),
                ),
                ("fecha_entrega", models.DateField(blank=True, null=True, verbose_name="fecha de entrega")),
                ("observaciones", models.TextField(blank=True, verbose_name="observaciones")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="creado")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="actualizado")),
                (
                    "moto_cliente",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="mantenciones",
                        to="mantenciones.vehiculocliente",
                        verbose_name="moto cliente",
                    ),
                ),
            ],
            options={
                "verbose_name": "mantencion",
                "verbose_name_plural": "mantenciones",
                "ordering": ["-fecha_ingreso", "-created_at"],
            },
        ),
    ]
