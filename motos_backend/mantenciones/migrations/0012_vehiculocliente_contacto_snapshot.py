from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mantenciones", "0011_mantencion_reminder_sent_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="vehiculocliente",
            name="cliente_apellidos",
            field=models.CharField(blank=True, default="", max_length=120, verbose_name="apellidos cliente"),
        ),
        migrations.AddField(
            model_name="vehiculocliente",
            name="cliente_email",
            field=models.EmailField(blank=True, default="", max_length=254, verbose_name="email cliente"),
        ),
        migrations.AddField(
            model_name="vehiculocliente",
            name="cliente_nombres",
            field=models.CharField(blank=True, default="", max_length=120, verbose_name="nombres cliente"),
        ),
        migrations.AddField(
            model_name="vehiculocliente",
            name="cliente_telefono",
            field=models.CharField(blank=True, default="", max_length=30, verbose_name="telefono cliente"),
        ),
    ]
