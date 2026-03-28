from __future__ import annotations

from typing import Iterable, Sequence

from django.db import transaction
from django.db.models import Max

from core.audit import create_audit_log, serialize_instance_for_audit
from .models import ImagenMoto, ModeloMoto, Moto


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


def create_or_update_moto_with_gallery(
    *,
    serializer,
    gallery_files: Sequence | None = None,
    actor=None,
    metadata: dict | None = None,
) -> Moto:
    with transaction.atomic():
        action = "create" if serializer.instance is None else "update"
        before = None
        if serializer.instance is not None:
            locked_moto = Moto.objects.select_for_update().get(pk=serializer.instance.pk)
            serializer.instance = locked_moto
            before = serialize_instance_for_audit(locked_moto)

        moto = serializer.save()
        append_moto_gallery_images(moto, gallery_files)
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
