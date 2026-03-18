from django.db import migrations, models
import django.db.models.deletion
from django.utils.text import slugify


def _build_unique_slug(base_slug, used_slugs):
    slug = base_slug or "modelo"
    if slug not in used_slugs:
        used_slugs.add(slug)
        return slug

    index = 2
    while True:
        candidate = f"{slug}-{index}"
        if candidate not in used_slugs:
            used_slugs.add(candidate)
            return candidate
        index += 1


def forwards_create_modelos(apps, schema_editor):
    Moto = apps.get_model("motos", "Moto")
    ModeloMoto = apps.get_model("motos", "ModeloMoto")

    used_slugs = set(ModeloMoto.objects.values_list("slug", flat=True))
    cache = {}

    for moto in Moto.objects.select_related("marca").all():
        if not moto.marca_id:
            continue

        nombre = (moto.modelo or "").strip()
        if not nombre:
            continue

        cache_key = (moto.marca_id, nombre)
        modelo = cache.get(cache_key)
        if not modelo:
            modelo = ModeloMoto.objects.filter(marca_id=moto.marca_id, nombre=nombre).first()
            if not modelo:
                base_slug = slugify(nombre)
                unique_slug = _build_unique_slug(base_slug, used_slugs)
                modelo = ModeloMoto.objects.create(
                    marca_id=moto.marca_id,
                    nombre=nombre,
                    slug=unique_slug,
                    activo=True,
                )
            cache[cache_key] = modelo

        moto.modelo_ref_id = modelo.id
        moto.save(update_fields=["modelo_ref"])


def backwards_noop(apps, schema_editor):
    return


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0001_initial"),
        ("motos", "0002_rename_moto_nombre_modelo"),
    ]

    operations = [
        migrations.CreateModel(
            name="ModeloMoto",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nombre", models.CharField(max_length=150)),
                ("slug", models.SlugField(unique=True)),
                ("descripcion", models.TextField(blank=True)),
                ("activo", models.BooleanField(default=True)),
                ("marca", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="modelos_moto", to="catalogo.marca")),
            ],
            options={
                "ordering": ["nombre"],
            },
        ),
        migrations.AddConstraint(
            model_name="modelomoto",
            constraint=models.UniqueConstraint(fields=("marca", "nombre"), name="uq_modelomoto_marca_nombre"),
        ),
        migrations.AddField(
            model_name="moto",
            name="modelo_ref",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="motos", to="motos.modelomoto"),
        ),
        migrations.RunPython(forwards_create_modelos, backwards_noop),
    ]
