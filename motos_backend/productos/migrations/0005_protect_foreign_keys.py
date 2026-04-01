import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0004_remove_stock_from_producto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="producto",
            name="marca",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="productos",
                to="catalogo.marca",
            ),
        ),
        migrations.AlterField(
            model_name="imagenproducto",
            name="producto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="imagenes",
                to="productos.producto",
            ),
        ),
        migrations.AlterField(
            model_name="especificacionproducto",
            name="producto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="especificaciones",
                to="productos.producto",
            ),
        ),
        migrations.AlterField(
            model_name="compatibilidadproductomoto",
            name="producto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="compatibilidades",
                to="productos.producto",
            ),
        ),
        migrations.AlterField(
            model_name="compatibilidadproductomoto",
            name="moto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="productos_compatibles",
                to="motos.moto",
            ),
        ),
    ]
