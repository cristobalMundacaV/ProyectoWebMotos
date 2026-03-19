from django.db import migrations, models


def split_nombre_completo(apps, schema_editor):
    ContactoCliente = apps.get_model("clientes", "ContactoCliente")
    for contacto in ContactoCliente.objects.all():
        full_name = (getattr(contacto, "nombre_completo", "") or "").strip()
        if not full_name:
            contacto.nombres = ""
            contacto.apellidos = ""
        else:
            parts = full_name.split()
            contacto.nombres = parts[0]
            contacto.apellidos = " ".join(parts[1:]) if len(parts) > 1 else ""
        contacto.save(update_fields=["nombres", "apellidos"])


def reverse_join_nombre_completo(apps, schema_editor):
    ContactoCliente = apps.get_model("clientes", "ContactoCliente")
    for contacto in ContactoCliente.objects.all():
        nombres = (getattr(contacto, "nombres", "") or "").strip()
        apellidos = (getattr(contacto, "apellidos", "") or "").strip()
        contacto.nombre_completo = f"{nombres} {apellidos}".strip()
        contacto.save(update_fields=["nombre_completo"])


class Migration(migrations.Migration):
    dependencies = [
        ("clientes", "0002_perfilusuario"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactocliente",
            name="nombres",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="contactocliente",
            name="apellidos",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.RunPython(split_nombre_completo, reverse_join_nombre_completo),
        migrations.RemoveField(
            model_name="contactocliente",
            name="nombre_completo",
        ),
        migrations.AlterField(
            model_name="contactocliente",
            name="nombres",
            field=models.CharField(max_length=120),
        ),
        migrations.AlterField(
            model_name="contactocliente",
            name="apellidos",
            field=models.CharField(max_length=120),
        ),
    ]

