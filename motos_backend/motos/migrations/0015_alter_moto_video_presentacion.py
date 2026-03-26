from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0014_moto_video_presentacion"),
    ]

    operations = [
        migrations.AlterField(
            model_name="moto",
            name="video_presentacion",
            field=models.FileField(blank=True, null=True, upload_to="motos/videos/"),
        ),
    ]
