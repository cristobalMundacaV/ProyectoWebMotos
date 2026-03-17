from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="moto",
            old_name="nombre",
            new_name="modelo",
        ),
    ]
