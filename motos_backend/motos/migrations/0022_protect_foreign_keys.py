import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0021_remove_moto_chk_moto_stock_gte_0"),
    ]

    operations = [
        migrations.AlterField(
            model_name="valoratributomoto",
            name="moto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="valores_atributos",
                to="motos.moto",
            ),
        ),
        migrations.AlterField(
            model_name="seccionfichatecnica",
            name="moto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="secciones_ficha",
                to="motos.moto",
            ),
        ),
        migrations.AlterField(
            model_name="itemfichatecnica",
            name="seccion",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="items",
                to="motos.seccionfichatecnica",
            ),
        ),
        migrations.AlterField(
            model_name="imagenmoto",
            name="moto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="imagenes",
                to="motos.moto",
            ),
        ),
        migrations.AlterField(
            model_name="especificacionmoto",
            name="moto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="especificaciones",
                to="motos.moto",
            ),
        ),
    ]
