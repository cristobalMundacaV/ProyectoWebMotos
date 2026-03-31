from __future__ import annotations

from django.conf import settings
from django.core.mail import EmailMultiAlternatives


def send_password_reset_email(*, recipient_email: str, full_name: str, reset_url: str) -> None:
    subject = f"Recuperacion de contraseña | {settings.COMPANY_NAME}"
    title = "Recuperacion de contraseña"
    intro = (
        "Recibimos una solicitud para restablecer la contraseña de tu cuenta. "
        "Si fuiste tu, usa el siguiente enlace para continuar:"
    )
    outro = (
        "Este enlace expirara pronto por seguridad. Si no solicitaste este cambio, "
        "puedes ignorar este correo."
    )

    text_body = (
        f"Hola {full_name},\n\n"
        f"{intro}\n\n"
        f"{reset_url}\n\n"
        f"{outro}\n\n"
        f"Atentamente,\n{settings.COMPANY_NAME}\n"
        f"Contacto: {settings.COMPANY_SUPPORT_EMAIL}"
        + (f" | {settings.COMPANY_SUPPORT_PHONE}" if settings.COMPANY_SUPPORT_PHONE else "")
    )

    html_body = f"""
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
                <p style="margin:0 0 14px;font-size:16px;line-height:1.5;">Hola <strong>{full_name}</strong>,</p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
                  {intro}
                </p>
                <p style="margin:0 0 18px;">
                  <a href="{reset_url}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">
                    Cambiar contraseña
                  </a>
                </p>
                <p style="margin:0 0 12px;font-size:13px;color:#64748b;word-break:break-all;">
                  Si el boton no funciona, copia y pega este enlace:<br />
                  {reset_url}
                </p>
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

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=False)

