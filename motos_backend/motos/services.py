from __future__ import annotations

from typing import Iterable, Sequence

from django.db import transaction
from django.db.models import Max

from core.audit import create_audit_log, serialize_instance_for_audit
from .models import ImagenMoto, ModeloMoto, Moto

MAX_MOTO_GALLERY_IMAGES = 3


def _to_file_list(files: Iterable | None) -> list:
    if not files:
        return []
    return [f for f in files if f]


def _lock_moto(moto_id: int) -> Moto:
    return Moto.objects.select_for_update().get(pk=moto_id)


def append_moto_gallery_images(moto: Moto, files: Sequence | None = None) -> None:
    files = _to_file_list(files)
    if not files:
        return

    locked_moto = _lock_moto(moto.id)
    current_images_count = locked_moto.imagenes.count()
    remaining_slots = max(0, MAX_MOTO_GALLERY_IMAGES - current_images_count)
    if remaining_slots <= 0:
        return
    files = list(files)[:remaining_slots]
    if not files:
        return
    current_max_order = locked_moto.imagenes.aggregate(max_order=Max("orden")).get("max_order") or 0

    created_first = None
    for index, image_file in enumerate(files, start=1):
        created = ImagenMoto.objects.create(
            moto=locked_moto,
            imagen=image_file,
            orden=current_max_order + index,
        )
        if created_first is None:
            created_first = created

    if created_first and not locked_moto.imagen_principal:
        locked_moto.imagen_principal = created_first.imagen
        locked_moto.save(update_fields=["imagen_principal"])


def _normalize_keep_ids(keep_ids: Iterable | None = None) -> list[int]:
    normalized = []
    if not keep_ids:
        return normalized

    for raw_id in keep_ids:
        try:
            normalized.append(int(raw_id))
        except (TypeError, ValueError):
            continue

    return normalized


def sync_moto_gallery_images(moto: Moto, keep_ids: Iterable | None = None, files: Sequence | None = None) -> None:
    locked_moto = _lock_moto(moto.id)
    normalized_keep_ids = _normalize_keep_ids(keep_ids)

    if keep_ids is not None:
        locked_moto.imagenes.exclude(id__in=normalized_keep_ids).delete()

    append_moto_gallery_images(locked_moto, files)


def update_moto_primary_image(moto: Moto, *, remove_primary_image: bool = False) -> None:
    if not remove_primary_image:
        return

    locked_moto = _lock_moto(moto.id)
    if locked_moto.imagen_principal:
        locked_moto.imagen_principal = None
        locked_moto.save(update_fields=["imagen_principal"])


def create_or_update_moto_with_gallery(
    *,
    serializer,
    gallery_files: Sequence | None = None,
    gallery_keep_ids: Iterable | None = None,
    remove_primary_image: bool = False,
    actor=None,
    metadata: dict | None = None,
) -> Moto:
    with transaction.atomic():
        is_create = serializer.instance is None
        action = "create" if is_create else "update"
        before = None
        if not is_create:
            locked_moto = Moto.objects.select_for_update().get(pk=serializer.instance.pk)
            serializer.instance = locked_moto
            before = serialize_instance_for_audit(locked_moto)

        moto = serializer.save()
        if is_create:
            append_moto_gallery_images(moto, gallery_files)
        else:
            sync_moto_gallery_images(moto, keep_ids=gallery_keep_ids, files=gallery_files)
            if "imagen_principal" not in serializer.validated_data:
                update_moto_primary_image(moto, remove_primary_image=remove_primary_image)
        moto_refreshed = Moto.objects.get(pk=moto.pk)
        create_audit_log(
            action=action,
            entity="motos.Moto",
            entity_id=moto_refreshed.pk,
            before=before,
            after=serialize_instance_for_audit(moto_refreshed),
            actor=actor,
            metadata=metadata,
        )
        return moto_refreshed


def update_modelo_and_sync_motos(*, serializer, actor=None, metadata: dict | None = None) -> ModeloMoto:
    with transaction.atomic():
        modelo = ModeloMoto.objects.select_for_update().get(pk=serializer.instance.pk)
        before = serialize_instance_for_audit(modelo)
        serializer.instance = modelo
        updated_modelo = serializer.save()
        Moto.objects.filter(modelo_moto=updated_modelo).update(modelo=updated_modelo.nombre_modelo)
        create_audit_log(
            action="update",
            entity="motos.ModeloMoto",
            entity_id=updated_modelo.pk,
            before=before,
            after=serialize_instance_for_audit(updated_modelo),
            actor=actor,
            metadata=metadata,
        )
        return updated_modelo
