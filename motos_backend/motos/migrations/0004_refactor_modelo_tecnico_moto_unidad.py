from django.db import migrations, models
import django.db.models.deletion
from django.utils.text import slugify


def _unique_slug(base, used):
    seed = base or "modelo-moto"
    if seed not in used:
        used.add(seed)
        return seed
    i = 2
    while True:
        candidate = f"{seed}-{i}"
        if candidate not in used:
            used.add(candidate)
            return candidate
        i += 1


def forwards_assign_modelo_moto(apps, schema_editor):
    Moto = apps.get_model("motos", "Moto")
    ModeloMoto = apps.get_model("motos", "ModeloMoto")

    used_slugs = set(ModeloMoto.objects.values_list("slug", flat=True))

    for moto in Moto.objects.all():
        # Prefer existing relation created in migration 0003.
        modelo = None
        if getattr(moto, "modelo_ref_id", None):
            modelo = ModeloMoto.objects.filter(id=moto.modelo_ref_id).first()

        nombre_modelo = (getattr(moto, "modelo", "") or "").strip() or f"Modelo-{moto.id}"
        if not modelo:
            modelo = ModeloMoto.objects.filter(
                marca_id=moto.marca_id,
                nombre_modelo=nombre_modelo,
            ).first()

        if not modelo:
            slug = _unique_slug(slugify(nombre_modelo), used_slugs)
            modelo = ModeloMoto.objects.create(
                marca_id=moto.marca_id,
                nombre_modelo=nombre_modelo,
                slug=slug,
                activo=True,
            )

        dirty_fields = []
        # Hydrate technical fields from old Moto data when missing.
        if modelo.categoria_id is None and getattr(moto, "categoria_id", None):
            modelo.categoria_id = moto.categoria_id
            dirty_fields.append("categoria")
        if modelo.cilindrada is None and getattr(moto, "cilindrada", None) is not None:
            modelo.cilindrada = moto.cilindrada
            dirty_fields.append("cilindrada")
        if dirty_fields:
            modelo.save(update_fields=dirty_fields)

        moto.modelo_moto_id = modelo.id
        if getattr(moto, "modelo", None) != modelo.nombre_modelo:
            moto.modelo = modelo.nombre_modelo
            moto.save(update_fields=["modelo_moto", "modelo"])
        else:
            moto.save(update_fields=["modelo_moto"])


def backwards_noop(apps, schema_editor):
    return


class Migration(migrations.Migration):

    dependencies = [
        ("catalogo", "0001_initial"),
        ("motos", "0003_modelomoto_and_moto_modelo_ref"),
    ]

    operations = [
        migrations.RenameField(
            model_name="modelomoto",
            old_name="nombre",
            new_name="nombre_modelo",
        ),
        migrations.RemoveConstraint(
            model_name="modelomoto",
            name="uq_modelomoto_marca_nombre",
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="capacidad_estanque",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="categoria",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to="catalogo.categoriamoto"),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="cilindrada",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="peso",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="potencia",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="refrigeracion",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="tipo_motor",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="torque",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AddField(
            model_name="modelomoto",
            name="transmision",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddConstraint(
            model_name="modelomoto",
            constraint=models.UniqueConstraint(fields=("marca", "nombre_modelo"), name="uq_modelomoto_marca_nombre_modelo"),
        ),
        migrations.AlterModelOptions(
            name="modelomoto",
            options={"ordering": ["nombre_modelo"]},
        ),
        migrations.AddField(
            model_name="moto",
            name="color",
            field=models.CharField(blank=True, max_length=60),
        ),
        migrations.AddField(
            model_name="moto",
            name="estado",
            field=models.CharField(
                choices=[("disponible", "Disponible"), ("reservada", "Reservada"), ("vendida", "Vendida"), ("inactiva", "Inactiva")],
                default="disponible",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="moto",
            name="modelo_moto",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="motos", to="motos.modelomoto"),
        ),
        migrations.RunPython(forwards_assign_modelo_moto, backwards_noop),
        migrations.AlterField(
            model_name="moto",
            name="modelo_moto",
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="motos", to="motos.modelomoto"),
        ),
        migrations.RemoveField(
            model_name="moto",
            name="categoria",
        ),
        migrations.RemoveField(
            model_name="moto",
            name="cilindrada",
        ),
        migrations.RemoveField(
            model_name="moto",
            name="modelo_ref",
        ),
    ]

