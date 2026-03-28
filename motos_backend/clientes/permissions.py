from .models import PerfilUsuario
from rest_framework.permissions import BasePermission, SAFE_METHODS

ADMIN_ALLOWED_ROLES = {
    PerfilUsuario.ROL_SUPERADMIN,
    PerfilUsuario.ROL_ADMIN,
    PerfilUsuario.ROL_ENCARGADO,
}


def get_user_role(user):
    if not user or not user.is_authenticated:
        return None

    if user.is_superuser:
        return PerfilUsuario.ROL_SUPERADMIN

    perfil = getattr(user, "perfil_usuario", None)
    if perfil and perfil.rol:
        return perfil.rol

    if user.is_staff:
        return PerfilUsuario.ROL_ADMIN

    return PerfilUsuario.ROL_CLIENTE


def has_admin_access(user):
    if not user or not user.is_authenticated:
        return False

    if user.is_superuser or user.is_staff:
        return True

    perfil = getattr(user, "perfil_usuario", None)
    if not perfil:
        return False

    return perfil.rol in ADMIN_ALLOWED_ROLES


class IsCatalogAdmin(BasePermission):
    """
    Permiso estricto para endpoints de administracion de catalogo.
    """

    message = "Solo administradores pueden realizar esta accion."

    def has_permission(self, request, view):
        return has_admin_access(request.user)


class IsCatalogAdminOrReadOnly(BasePermission):
    """
    Permite lectura publica y restringe mutaciones a administradores.
    """

    message = "Solo administradores pueden modificar el catalogo."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return has_admin_access(request.user)


class IsBackofficeAdmin(BasePermission):
    """
    Permiso transversal para endpoints administrativos fuera del catalogo.
    """

    message = "Solo administradores pueden realizar esta operacion."

    def has_permission(self, request, view):
        return has_admin_access(request.user)
