import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mantenciones", "0012_vehiculocliente_contacto_snapshot"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name="mantencionestadohistorial",
            name="changed_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="mantenciones_estado_cambios",
                to=settings.AUTH_USER_MODEL,
                verbose_name="modificado por",
            ),
        ),
    ]
