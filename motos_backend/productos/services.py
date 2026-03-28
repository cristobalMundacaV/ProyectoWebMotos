from __future__ import annotations

from typing import Iterable, Sequence

from django.db import transaction
from django.db.models import Max

from core.audit import create_audit_log, serialize_instance_for_audit
from .models import CompatibilidadProductoMoto, ImagenProducto, Producto


def _to_file_list(files: Iterable | None) -> list:
    if not files:
        return []
    return [f for f in files if f]


def _lock_producto(producto_id: int) -> Producto:
    return Producto.objects.select_for_update().get(pk=producto_id)


def _append_gallery_images(producto: Producto, files: Sequence) -> None:
    files = _to_file_list(files)
    if not files:
        return

    locked_producto = _lock_producto(producto.id)
    current_max_order = locked_producto.imagenes.aggregate(max_order=Max("orden")).get("max_order") or 0

    created_first = None
    for index, image_file in enumerate(files, start=1):
        created = ImagenProducto.objects.create(
            producto=locked_producto,
            imagen=image_file,
            orden=current_max_order + index,
        )
        if created_first is None:
            created_first = created

    if created_first and not locked_producto.imagen_principal:
        locked_producto.imagen_principal = created_first.imagen
        locked_producto.save(update_fields=["imagen_principal"])


def _sync_main_image(producto: Producto) -> None:
    locked_producto = _lock_producto(producto.id)
    main_image_name = str(getattr(locked_producto.imagen_principal, "name", "") or "").strip()
    first_gallery_image = locked_producto.imagenes.order_by("orden", "id").first()

    # Compatibilidad con productos legacy sin registros en galeria.
    if not first_gallery_image and main_image_name:
        return

    if main_image_name:
        has_main_in_gallery = locked_producto.imagenes.filter(imagen=main_image_name).exists()
        if has_main_in_gallery:
            return

    locked_producto.imagen_principal = first_gallery_image.imagen if first_gallery_image else None
    locked_producto.save(update_fields=["imagen_principal"])


def _replace_compatibilidades(producto: Producto, moto_ids: Sequence[int] | None) -> None:
    if moto_ids is None:
        return

    unique_moto_ids = sorted(set(int(moto_id) for moto_id in moto_ids))
    CompatibilidadProductoMoto.objects.filter(producto=producto).delete()
    if unique_moto_ids:
        CompatibilidadProductoMoto.objects.bulk_create(
            [
                CompatibilidadProductoMoto(producto=producto, moto_id=moto_id)
                for moto_id in unique_moto_ids
            ],
            ignore_conflicts=True,
        )


def create_producto_with_relations(
    *,
    serializer,
    gallery_files: Sequence | None = None,
    actor=None,
    metadata: dict | None = None,
) -> Producto:
    validated_data = dict(serializer.validated_data)
    moto_ids = validated_data.pop("compatibilidad_motos", [])

    with transaction.atomic():
        producto = Producto.objects.create(**validated_data)
        _replace_compatibilidades(producto, moto_ids)
        _append_gallery_images(producto, gallery_files)
        _sync_main_image(producto)
        producto_refreshed = Producto.objects.get(pk=producto.pk)
        create_audit_log(
            action="create",
            entity="productos.Producto",
            entity_id=producto_refreshed.pk,
            before=None,
            after=serialize_instance_for_audit(producto_refreshed),
            actor=actor,
            metadata=metadata,
        )
        return producto_refreshed


def update_producto_with_relations(
    *,
    serializer,
    gallery_files: Sequence | None = None,
    image_ids_to_delete: set[int] | None = None,
    compatibilidad_motos: Sequence[int] | None = None,
    actor=None,
    metadata: dict | None = None,
) -> Producto:
    with transaction.atomic():
        locked_producto = _lock_producto(serializer.instance.id)
        before = serialize_instance_for_audit(locked_producto)
        serializer.instance = locked_producto
        producto = serializer.save()

        _replace_compatibilidades(producto, compatibilidad_motos)

        if image_ids_to_delete:
            producto.imagenes.filter(id__in=image_ids_to_delete).delete()

        _append_gallery_images(producto, gallery_files)
        _sync_main_image(producto)
        producto_refreshed = Producto.objects.get(pk=producto.pk)
        create_audit_log(
            action="update",
            entity="productos.Producto",
            entity_id=producto_refreshed.pk,
            before=before,
            after=serialize_instance_for_audit(producto_refreshed),
            actor=actor,
            metadata=metadata,
        )
        return producto_refreshed
