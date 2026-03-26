from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0015_alter_moto_video_presentacion"),
    ]

    operations = [
        migrations.AlterField(
            model_name="moto",
            name="video_presentacion",
            field=models.URLField(blank=True, default="", max_length=500),
        ),
    ]
