from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0012_seed_ficha_tecnica_defaults"),
    ]

    operations = [
        migrations.AlterField(
            model_name="valoratributomoto",
            name="valor",
            field=models.TextField(blank=True, default=""),
        ),
    ]

