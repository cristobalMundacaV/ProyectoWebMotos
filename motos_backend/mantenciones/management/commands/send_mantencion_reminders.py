import logging
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from mantenciones.models import Mantencion
from mantenciones.notifications import get_recipient_email, send_mantencion_reminder_email


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Envia recordatorios de mantencion para las horas del dia siguiente."

    def handle(self, *args, **options):
        tomorrow = timezone.localdate() + timedelta(days=1)
        eligible_states = [
            Mantencion.ESTADO_SOLICITUD,
            Mantencion.ESTADO_APROBADO,
        ]

        pending = list(
            Mantencion.objects.select_related("moto_cliente", "moto_cliente__cliente")
            .filter(
                fecha_ingreso=tomorrow,
                estado__in=eligible_states,
                reminder_sent_at__isnull=True,
            )
            .order_by("hora_ingreso", "id")
        )

        if not pending:
            self.stdout.write(self.style.SUCCESS("No hay recordatorios pendientes para enviar."))
            return

        sent = 0
        failed = 0

        for mantencion in pending:
            recipient_email = get_recipient_email(mantencion)
            if not recipient_email:
                failed += 1
                logger.warning(
                    "Mantencion sin email para recordatorio: mantencion_id=%s",
                    mantencion.id,
                )
                continue

            try:
                send_mantencion_reminder_email(mantencion=mantencion, recipient_email=recipient_email)
            except Exception:
                failed += 1
                logger.exception(
                    "Error enviando recordatorio de mantencion_id=%s",
                    mantencion.id,
                )
                continue

            with transaction.atomic():
                Mantencion.objects.filter(id=mantencion.id, reminder_sent_at__isnull=True).update(
                    reminder_sent_at=timezone.now()
                )
            sent += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Recordatorios enviados: {sent}. Fallidos/sin email: {failed}."
            )
        )

