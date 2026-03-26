from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0013_alter_valoratributomoto_valor_optional"),
    ]

    operations = [
        migrations.AddField(
            model_name="moto",
            name="video_presentacion",
            field=models.URLField(blank=True, default="", max_length=500),
        ),
    ]
