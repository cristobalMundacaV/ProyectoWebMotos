import smtplib

from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend as DjangoSMTPEmailBackend


class EmailBackend(DjangoSMTPEmailBackend):
    """
    SMTP backend with configurable HELO/EHLO hostname for providers
    that reject local machine names.
    """

    def open(self):
        if self.connection:
            return False

        connection_params = {"local_hostname": settings.EMAIL_HELO_NAME}
        if self.timeout is not None:
            connection_params["timeout"] = self.timeout
        if self.ssl_keyfile is not None:
            connection_params["keyfile"] = self.ssl_keyfile
        if self.ssl_certfile is not None:
            connection_params["certfile"] = self.ssl_certfile

        try:
            self.connection = self.connection_class(
                self.host,
                self.port,
                **connection_params,
            )

            if not self.use_ssl and self.use_tls:
                self.connection.starttls(context=self.ssl_context)
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except OSError:
            if not self.fail_silently:
                raise
