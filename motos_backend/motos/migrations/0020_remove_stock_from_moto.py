from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0019_moto_denorm_and_performance_indexes"),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE motos_moto DROP CONSTRAINT IF EXISTS chk_moto_stock_gte_0;",
            reverse_sql=(
                "ALTER TABLE motos_moto "
                "ADD CONSTRAINT chk_moto_stock_gte_0 CHECK (stock >= 0);"
            ),
        ),
        migrations.RemoveField(
            model_name="moto",
            name="stock",
        ),
    ]

