from __future__ import annotations

from datetime import date, time

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from .models import Mantencion


def _format_fecha(fecha: date) -> str:
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


def _build_subject() -> str:
    return f"Confirmacion de solicitud de mantencion | {settings.COMPANY_NAME}"


def _build_plain_body(mantencion: Mantencion, cliente_nombre: str) -> str:
    moto = mantencion.moto_cliente
    return (
        f"Hola {cliente_nombre},\n\n"
        "Hemos recibido tu solicitud de mantencion con el siguiente detalle:\n\n"
        f"- Fecha: {_format_fecha(mantencion.fecha_ingreso)}\n"
        f"- Hora: {_format_hora(mantencion.hora_ingreso)}\n"
        f"- Moto: {moto.marca} {moto.modelo}\n"
        f"- Matricula: {moto.matricula}\n"
        f"- Tipo: {_format_tipo(mantencion.tipo_mantencion)}\n\n"
        "Tu solicitud quedo registrada y sera gestionada por nuestro equipo.\n\n"
        f"Atentamente,\n{settings.COMPANY_NAME}\n"
        f"Contacto: {settings.COMPANY_SUPPORT_EMAIL}"
        + (f" | {settings.COMPANY_SUPPORT_PHONE}" if settings.COMPANY_SUPPORT_PHONE else "")
    )


def _build_html_body(mantencion: Mantencion, cliente_nombre: str) -> str:
    moto = mantencion.moto_cliente
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
                <div style="font-size:13px;color:#cbd5e1;margin-top:6px;">Confirmacion de solicitud de mantencion</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.5;">Hola <strong>{cliente_nombre}</strong>,</p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
                  Hemos recibido tu solicitud. Este es el detalle de tu hora agendada:
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                  <tr>
                    <td style="padding:10px 12px;background:#f8fafc;font-weight:600;border-bottom:1px solid #e5e7eb;">Fecha</td>
                    <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">{_format_fecha(mantencion.fecha_ingreso)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;background:#f8fafc;font-weight:600;border-bottom:1px solid #e5e7eb;">Hora</td>
                    <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">{_format_hora(mantencion.hora_ingreso)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;background:#f8fafc;font-weight:600;border-bottom:1px solid #e5e7eb;">Moto</td>
                    <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">{moto.marca} {moto.modelo}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;background:#f8fafc;font-weight:600;border-bottom:1px solid #e5e7eb;">Matricula</td>
                    <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">{moto.matricula}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;background:#f8fafc;font-weight:600;">Tipo de mantencion</td>
                    <td style="padding:10px 12px;">{_format_tipo(mantencion.tipo_mantencion)}</td>
                  </tr>
                </table>

                <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#334155;">
                  Si necesitas ayuda o reprogramar, responde este correo o contactanos por nuestros canales oficiales.
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


def send_mantencion_confirmation_email(*, mantencion: Mantencion, recipient_email: str, cliente_nombre: str) -> None:
    subject = _build_subject()
    text_body = _build_plain_body(mantencion=mantencion, cliente_nombre=cliente_nombre)
    html_body = _build_html_body(mantencion=mantencion, cliente_nombre=cliente_nombre)

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=False)
