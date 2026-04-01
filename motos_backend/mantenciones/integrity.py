from datetime import timedelta
import logging

from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from .models import Mantencion, MantencionEstadoHistorial
from .notifications import (
    get_recipient_email,
    send_mantencion_no_asistencia_email,
    send_mantencion_reagendacion_email,
)


logger = logging.getLogger(__name__)


def mark_expired_unaccepted_requests() -> int:
    now_local = timezone.localtime()
    today = now_local.date()
    now_time = now_local.time().replace(microsecond=0)
    no_show_cutoff = now_local - timedelta(hours=1)
    no_show_cutoff_date = no_show_cutoff.date()
    no_show_cutoff_time = no_show_cutoff.time().replace(microsecond=0)

    expired_filter = Q(fecha_ingreso__lt=today) | Q(fecha_ingreso=today, hora_ingreso__lt=now_time)
    no_show_filter = Q(fecha_ingreso__lt=no_show_cutoff_date) | Q(
        fecha_ingreso=no_show_cutoff_date,
        hora_ingreso__lte=no_show_cutoff_time,
    )

    with transaction.atomic():
        expired_unaccepted = list(
            Mantencion.objects.select_for_update()
            .filter(estado=Mantencion.ESTADO_SOLICITUD)
            .filter(expired_filter)
            .only("id", "estado")
        )
        expired_unaccepted_ids = [row.id for row in expired_unaccepted]
        expired_unaccepted_for_email = list(
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
            .filter(id__in=expired_unaccepted_ids)
        )
        expired_no_show = list(
            Mantencion.objects.select_for_update()
            .filter(estado=Mantencion.ESTADO_APROBADO)
            .exclude(hora_ingreso__isnull=True)
            .filter(no_show_filter)
            .only("id", "estado")
        )
        expired_no_show_ids = [row.id for row in expired_no_show]
        expired_no_show_for_email = list(
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
            .filter(id__in=expired_no_show_ids)
        )
        if not expired_unaccepted and not expired_no_show:
            return 0

        now_utc = timezone.now()
        if expired_unaccepted:
            Mantencion.objects.filter(id__in=expired_unaccepted_ids).update(
                estado=Mantencion.ESTADO_REAGENDACION,
                updated_at=now_utc,
            )
        if expired_no_show:
            Mantencion.objects.filter(id__in=expired_no_show_ids).update(
                estado=Mantencion.ESTADO_INASISTENCIA,
                updated_at=now_utc,
            )

        if expired_unaccepted_for_email:
            def _send_expired_reagendacion_notifications():
                for mantencion in expired_unaccepted_for_email:
                    recipient_email = get_recipient_email(mantencion)
                    if not recipient_email:
                        continue
                    try:
                        send_mantencion_reagendacion_email(
                            mantencion=mantencion,
                            recipient_email=recipient_email,
                        )
                    except Exception:
                        logger.exception(
                            "Error enviando correo de reagendacion por solicitud vencida para mantencion_id=%s",
                            mantencion.id,
                        )

            transaction.on_commit(_send_expired_reagendacion_notifications)

        if expired_no_show_for_email:
            def _send_no_show_notifications():
                for mantencion in expired_no_show_for_email:
                    recipient_email = get_recipient_email(mantencion)
                    if not recipient_email:
                        continue
                    try:
                        send_mantencion_no_asistencia_email(
                            mantencion=mantencion,
                            recipient_email=recipient_email,
                        )
                    except Exception:
                        logger.exception(
                            "Error enviando correo de inasistencia para mantencion_id=%s",
                            mantencion.id,
                        )

            transaction.on_commit(_send_no_show_notifications)

        MantencionEstadoHistorial.objects.bulk_create(
            [
                MantencionEstadoHistorial(
                    mantencion_id=row.id,
                    estado_anterior=row.estado,
                    estado_nuevo=Mantencion.ESTADO_REAGENDACION,
                    changed_by=None,
                    fuente=MantencionEstadoHistorial.FUENTE_API,
                    observacion="Solicitud vencida: requiere reagendar una nueva hora",
                )
                for row in expired_unaccepted
            ]
            + [
                MantencionEstadoHistorial(
                    mantencion_id=row.id,
                    estado_anterior=row.estado,
                    estado_nuevo=Mantencion.ESTADO_INASISTENCIA,
                    changed_by=None,
                    fuente=MantencionEstadoHistorial.FUENTE_API,
                    observacion="Mantencion aprobada sin ingreso en la hora de gracia",
                )
                for row in expired_no_show
            ]
        )
        return len(expired_unaccepted) + len(expired_no_show)
