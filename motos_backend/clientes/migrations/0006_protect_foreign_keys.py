import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("clientes", "0005_harden_integrity_clients"),
    ]

    operations = [
        migrations.AlterField(
            model_name="perfilusuario",
            name="user",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="perfil_usuario",
                to="auth.user",
            ),
        ),
        migrations.AlterField(
            model_name="contactocliente",
            name="moto",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="motos.moto",
            ),
        ),
        migrations.AlterField(
            model_name="contactocliente",
            name="producto",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="productos.producto",
            ),
        ),
    ]
