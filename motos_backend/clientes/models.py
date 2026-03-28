from django.db import models
from django.contrib.auth.models import User


class PerfilUsuario(models.Model):
    ROL_SUPERADMIN = "superadmin"
    ROL_ADMIN = "admin"
    ROL_ENCARGADO = "encargado"
    ROL_CLIENTE = "cliente"

    ROL_CHOICES = [
        (ROL_SUPERADMIN, "Super Admin"),
        (ROL_ADMIN, "Administrador"),
        (ROL_ENCARGADO, "Encargado"),
        (ROL_CLIENTE, "Cliente"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil_usuario")
    telefono = models.CharField(max_length=30, blank=True)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default=ROL_CLIENTE)

    class Meta:
        indexes = [
            models.Index(fields=["rol"], name="idx_perfilusuario_rol"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(rol=""),
                name="chk_perfilusuario_rol_not_empty",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} ({self.rol})"

class ContactoCliente(models.Model):
    moto = models.ForeignKey('motos.Moto', on_delete=models.SET_NULL, null=True, blank=True)
    producto = models.ForeignKey('productos.Producto', on_delete=models.SET_NULL, null=True, blank=True)

    nombres = models.CharField(max_length=120)
    apellidos = models.CharField(max_length=120)
    telefono = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    mensaje = models.TextField(blank=True)

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha_creacion", "-id"]
        indexes = [
            models.Index(fields=["fecha_creacion"], name="idx_contactocliente_fecha"),
            models.Index(fields=["moto"], name="idx_contactocliente_moto"),
            models.Index(fields=["producto"], name="idx_contactocliente_producto"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(nombres=""),
                name="chk_contactocliente_nombres_not_empty",
            ),
            models.CheckConstraint(
                condition=~models.Q(apellidos=""),
                name="chk_contactocliente_apellidos_not_empty",
            ),
            models.CheckConstraint(
                condition=~models.Q(telefono=""),
                name="chk_contactocliente_telefono_not_empty",
            ),
        ]

    def __str__(self):
        full_name = f"{self.nombres} {self.apellidos}".strip()
        return full_name or self.telefono
