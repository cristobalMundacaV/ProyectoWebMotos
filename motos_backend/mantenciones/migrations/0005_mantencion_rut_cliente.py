from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mantenciones", "0004_mantencionestadohistorial_alter_mantencion_estado_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="mantencion",
            name="rut_cliente",
            field=models.CharField(blank=True, db_index=True, default="", max_length=12, verbose_name="rut cliente"),
        ),
    ]

