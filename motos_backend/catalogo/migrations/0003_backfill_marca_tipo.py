from django.db import migrations


def backfill_marca_tipo(apps, schema_editor):
    Marca = apps.get_model("catalogo", "Marca")

    marcas_por_slug = {
        "voge": "moto",
        "airoh": "accesorio_rider",
        "shaft": "accesorio_rider",
        "4rs": "accesorio_moto",
        "belta": "accesorio_moto",
        "motocentric": "accesorio_moto",
        "rhinowalk": "accesorio_moto",
    }

    marcas_por_nombre = {
        "VOGE": "moto",
        "AIROH": "accesorio_rider",
        "SHAFT": "accesorio_rider",
        "4RS": "accesorio_moto",
        "BELTA": "accesorio_moto",
        "MOTOCENTRIC": "accesorio_moto",
        "RHINOWALK": "accesorio_moto",
    }

    for marca in Marca.objects.filter(tipo__isnull=True):
        tipo = marcas_por_slug.get((marca.slug or "").lower()) or marcas_por_nombre.get((marca.nombre or "").upper())
        if tipo:
            marca.tipo = tipo
            marca.save(update_fields=["tipo"])


def reverse_backfill_marca_tipo(apps, schema_editor):
    Marca = apps.get_model("catalogo", "Marca")
    Marca.objects.filter(
        slug__in=["voge", "airoh", "shaft", "4rs", "belta", "motocentric", "rhinowalk"]
    ).update(tipo=None)


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0002_marca_tipo"),
    ]

    operations = [
        migrations.RunPython(backfill_marca_tipo, reverse_backfill_marca_tipo),
    ]