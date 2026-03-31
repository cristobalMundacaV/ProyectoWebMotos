from datetime import timedelta

from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from .models import Mantencion, MantencionEstadoHistorial


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
        expired_no_show = list(
            Mantencion.objects.select_for_update()
            .filter(estado=Mantencion.ESTADO_APROBADO)
            .exclude(hora_ingreso__isnull=True)
            .filter(no_show_filter)
            .only("id", "estado")
        )
        if not expired_unaccepted and not expired_no_show:
            return 0

        now_utc = timezone.now()
        if expired_unaccepted:
            Mantencion.objects.filter(id__in=[row.id for row in expired_unaccepted]).update(
                estado=Mantencion.ESTADO_NO_ACEPTADO,
                updated_at=now_utc,
            )
        if expired_no_show:
            Mantencion.objects.filter(id__in=[row.id for row in expired_no_show]).update(
                estado=Mantencion.ESTADO_INASISTENCIA,
                updated_at=now_utc,
            )

        MantencionEstadoHistorial.objects.bulk_create(
            [
                MantencionEstadoHistorial(
                    mantencion_id=row.id,
                    estado_anterior=row.estado,
                    estado_nuevo=Mantencion.ESTADO_NO_ACEPTADO,
                    changed_by=None,
                    fuente=MantencionEstadoHistorial.FUENTE_API,
                    observacion="Solicitud no aceptada antes de la hora agendada",
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
