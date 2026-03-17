from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="marca",
            name="tipo",
            field=models.CharField(
                blank=True,
                choices=[
                    ("moto", "Moto"),
                    ("accesorio_moto", "Accesorio moto"),
                    ("accesorio_rider", "Accesorio rider"),
                ],
                max_length=32,
                null=True,
            ),
        ),
    ]