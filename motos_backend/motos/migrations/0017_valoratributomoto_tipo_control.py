from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0016_alter_moto_video_presentacion_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="valoratributomoto",
            name="tipo_control",
            field=models.CharField(
                choices=[("texto", "Texto"), ("switch", "Switch")],
                default="texto",
                max_length=20,
            ),
        ),
    ]

