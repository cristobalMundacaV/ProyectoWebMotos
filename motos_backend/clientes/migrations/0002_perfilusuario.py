from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("clientes", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PerfilUsuario",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("telefono", models.CharField(blank=True, max_length=30)),
                (
                    "rol",
                    models.CharField(
                        choices=[
                            ("superadmin", "Superadmin"),
                            ("admin", "Admin"),
                            ("encargado", "Encargado"),
                            ("cliente", "Cliente"),
                        ],
                        default="cliente",
                        max_length=20,
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="perfil_usuario",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
