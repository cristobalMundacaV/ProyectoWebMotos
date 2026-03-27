from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from .models import Mantencion, MantencionEstadoHistorial


def mark_expired_unaccepted_requests() -> int:
    now_local = timezone.localtime()
    today = now_local.date()
    now_time = now_local.time().replace(microsecond=0)

    expired_filter = Q(fecha_ingreso__lt=today) | Q(fecha_ingreso=today, hora_ingreso__lt=now_time)

    with transaction.atomic():
        expired = list(
            Mantencion.objects.select_for_update()
            .filter(estado=Mantencion.ESTADO_SOLICITUD)
            .filter(expired_filter)
            .only("id", "estado")
        )
        if not expired:
            return 0

        mantencion_ids = [row.id for row in expired]
        Mantencion.objects.filter(id__in=mantencion_ids).update(
            estado=Mantencion.ESTADO_NO_ACEPTADO,
            updated_at=timezone.now(),
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
                for row in expired
            ]
        )
        return len(expired)
