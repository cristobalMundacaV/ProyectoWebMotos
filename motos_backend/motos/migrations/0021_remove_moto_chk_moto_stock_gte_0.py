from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("motos", "0020_remove_stock_from_moto"),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE motos_moto DROP CONSTRAINT IF EXISTS chk_moto_stock_gte_0;",
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]

