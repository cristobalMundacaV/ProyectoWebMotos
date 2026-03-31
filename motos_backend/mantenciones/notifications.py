from __future__ import annotations

from datetime import date, timedelta, time
from typing import Iterable

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone

from .models import Mantencion


def _format_fecha(fecha: date | None) -> str:
    if not fecha:
        return "-"
    return fecha.strftime("%d-%m-%Y")


def _format_hora(hora: time | None) -> str:
    if not hora:
        return "-"
    return hora.strftime("%H:%M")


def _format_tipo(tipo: str) -> str:
    value = (tipo or "").replace("_", " ").strip()
    if not value:
        return "-"
    return value[:1].upper() + value[1:]


def _safe_full_name(mantencion: Mantencion) -> str:
    moto_cliente = getattr(mantencion, "moto_cliente", None)
    snapshot_name = ""
    if moto_cliente:
        snapshot_name = f"{(moto_cliente.cliente_nombres or '').strip()} {(moto_cliente.cliente_apellidos or '').strip()}".strip()
    if snapshot_name:
        return snapshot_name

    user = getattr(getattr(mantencion, "moto_cliente", None), "cliente", None)
    if not user:
        return "cliente"
    full_name = user.get_full_name().strip() if hasattr(user, "get_full_name") else ""
    return full_name or getattr(user, "username", "") or "cliente"


def get_recipient_email(mantencion: Mantencion) -> str:
    snapshot_email = (getattr(getattr(mantencion, "moto_cliente", None), "cliente_email", "") or "").strip().lower()
    if snapshot_email:
        return snapshot_email
    user = getattr(getattr(mantencion, "moto_cliente", None), "cliente", None)
    email = (getattr(user, "email", "") or "").strip().lower()
    return email


def _build_rows(mantencion: Mantencion, extra_rows: Iterable[tuple[str, str]] | None = None) -> list[tuple[str, str]]:
    moto = mantencion.moto_cliente
    rows: list[tuple[str, str]] = [
        ("Fecha", _format_fecha(mantencion.fecha_ingreso)),
        ("Hora", _format_hora(mantencion.hora_ingreso)),
        ("Marca", moto.marca or "-"),
        ("Modelo", moto.modelo or "-"),
        ("Matricula", moto.matricula or "-"),
        ("Tipo de mantenimiento", _format_tipo(mantencion.tipo_mantencion)),
    ]
    if extra_rows:
        rows.extend(extra_rows)
    return rows


def _build_plain_rows(rows: list[tuple[str, str]]) -> str:
    return "\n".join([f"- {label}: {value}" for label, value in rows])


def _build_html_rows(rows: list[tuple[str, str]]) -> str:
    html_rows: list[str] = []
    for index, (label, value) in enumerate(rows):
        border = 'border-bottom:1px solid #e5e7eb;' if index < len(rows) - 1 else ""
        html_rows.append(
            (
                "<tr>"
                f'<td style="padding:10px 12px;background:#f8fafc;font-weight:600;{border}">{label}</td>'
                f'<td style="padding:10px 12px;{border}">{value}</td>'
                "</tr>"
            )
        )
    return "".join(html_rows)


def _build_plain_body(title: str, intro: str, mantencion: Mantencion, outro: str, extra_rows: Iterable[tuple[str, str]] | None = None) -> str:
    cliente_nombre = _safe_full_name(mantencion)
    rows = _build_rows(mantencion, extra_rows=extra_rows)
    return (
        f"Hola {cliente_nombre},\n\n"
        f"{intro}\n\n"
        f"{_build_plain_rows(rows)}\n\n"
        f"{outro}\n\n"
        f"Atentamente,\n{settings.COMPANY_NAME}\n"
        f"Contacto: {settings.COMPANY_SUPPORT_EMAIL}"
        + (f" | {settings.COMPANY_SUPPORT_PHONE}" if settings.COMPANY_SUPPORT_PHONE else "")
    )


def _build_html_body(title: str, intro: str, mantencion: Mantencion, outro: str, extra_rows: Iterable[tuple[str, str]] | None = None) -> str:
    cliente_nombre = _safe_full_name(mantencion)
    rows = _build_rows(mantencion, extra_rows=extra_rows)
    html_rows = _build_html_rows(rows)
    return f"""
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:640px;max-width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#111827;padding:20px 24px;">
                <div style="font-size:18px;font-weight:700;color:#ffffff;">{settings.COMPANY_NAME}</div>
                <div style="font-size:13px;color:#cbd5e1;margin-top:6px;">{title}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.5;">Hola <strong>{cliente_nombre}</strong>,</p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
                  {intro}
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                  {html_rows}
                </table>

                <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#334155;">
                  {outro}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#64748b;">
                {settings.COMPANY_NAME} | {settings.COMPANY_SUPPORT_EMAIL}
                {" | " + settings.COMPANY_SUPPORT_PHONE if settings.COMPANY_SUPPORT_PHONE else ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
""".strip()


def _send_notification_email(
    *,
    mantencion: Mantencion,
    recipient_email: str,
    subject: str,
    title: str,
    intro: str,
    outro: str,
    extra_rows: Iterable[tuple[str, str]] | None = None,
) -> None:
    text_body = _build_plain_body(
        title=title,
        intro=intro,
        mantencion=mantencion,
        outro=outro,
        extra_rows=extra_rows,
    )
    html_body = _build_html_body(
        title=title,
        intro=intro,
        mantencion=mantencion,
        outro=outro,
        extra_rows=extra_rows,
    )

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=False)


def send_mantencion_confirmation_email(*, mantencion: Mantencion, recipient_email: str) -> None:
    _send_notification_email(
        mantencion=mantencion,
        recipient_email=recipient_email,
        subject=f"Solicitud de mantenimiento | {settings.COMPANY_NAME}",
        title="Solicitud de mantenimiento",
        intro="Hemos recibido tu solicitud. Este es el detalle de tu hora agendada:",
        outro="Se ha agendado tu solicitud para esta hora. Te llegara un correo si la hora es aceptada por nuestro equipo.",
    )


def send_mantencion_approved_email(*, mantencion: Mantencion, recipient_email: str) -> None:
    _send_notification_email(
        mantencion=mantencion,
        recipient_email=recipient_email,
        subject=f"Hora confirmada | {settings.COMPANY_NAME}",
        title="Solicitud confirmada",
        intro="Tu solicitud de mantenimiento fue confirmada por nuestro equipo.",
        outro="Te esperamos en la fecha y hora indicadas.",
    )


def send_mantencion_canceled_email(*, mantencion: Mantencion, recipient_email: str) -> None:
    _send_notification_email(
        mantencion=mantencion,
        recipient_email=recipient_email,
        subject=f"Solicitud anulada | {settings.COMPANY_NAME}",
        title="Solicitud anulada",
        intro="Tu solicitud de mantenimiento fue anulada.",
        outro="Si deseas una nueva hora, agenda nuevamente desde Agendar hora.",
    )


def send_mantencion_finalized_email(*, mantencion: Mantencion, recipient_email: str) -> None:
    _send_notification_email(
        mantencion=mantencion,
        recipient_email=recipient_email,
        subject=f"Moto lista para retiro | {settings.COMPANY_NAME}",
        title="Mantenimiento finalizado",
        intro="Tu mantenimiento ha finalizado y tu moto esta lista para su retiro.",
        outro="Puedes coordinar el retiro por nuestros canales oficiales.",
    )


def send_mantencion_reagendacion_email(*, mantencion: Mantencion, recipient_email: str) -> None:
    _send_notification_email(
        mantencion=mantencion,
        recipient_email=recipient_email,
        subject=f"Atencion reagendada | {settings.COMPANY_NAME}",
        title="Atencion no disponible en la fecha original",
        intro="No podremos atenderte en la fecha/hora originalmente reservada.",
        outro="Debes reagendar una nueva hora ingresando nuevamente a Agendar hora.",
    )


def send_mantencion_reminder_email(*, mantencion: Mantencion, recipient_email: str) -> None:
    tomorrow = timezone.localdate() + timedelta(days=1)
    intro = "Este es un recordatorio de tu mantenimiento programado para manana."
    if mantencion.fecha_ingreso != tomorrow:
        intro = "Este es un recordatorio de tu mantenimiento programado."

    _send_notification_email(
        mantencion=mantencion,
        recipient_email=recipient_email,
        subject=f"Recordatorio de mantenimiento | {settings.COMPANY_NAME}",
        title="Recordatorio de hora agendada",
        intro=intro,
        outro="Si no puedes asistir, recuerda gestionar tu hora con anticipacion.",
    )
