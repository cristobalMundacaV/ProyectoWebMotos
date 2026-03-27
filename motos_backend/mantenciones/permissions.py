from rest_framework.permissions import BasePermission


class IsOperationalStaff(BasePermission):
    message = "No tienes permisos para realizar esta accion."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        perfil = getattr(user, "perfil_usuario", None)
        rol = getattr(perfil, "rol", "")
        return rol in {"superadmin", "admin", "encargado"}
