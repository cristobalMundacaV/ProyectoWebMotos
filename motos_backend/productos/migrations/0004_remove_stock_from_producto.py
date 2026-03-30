from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0003_harden_integrity_productos"),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE productos_producto DROP CONSTRAINT IF EXISTS chk_producto_stock_gte_0;",
            reverse_sql=(
                "ALTER TABLE productos_producto "
                "ADD CONSTRAINT chk_producto_stock_gte_0 CHECK (stock >= 0);"
            ),
        ),
        migrations.RemoveField(
            model_name="producto",
            name="stock",
        ),
    ]

