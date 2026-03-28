from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mantenciones", "0010_mantencionhorabloqueada"),
    ]

    operations = [
        migrations.AddField(
            model_name="mantencion",
            name="reminder_sent_at",
            field=models.DateTimeField(blank=True, null=True, verbose_name="recordatorio enviado"),
        ),
    ]

