from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from clientes.permissions import has_admin_access
from .models import ContactoSitio
from .serializers import ContactoSitioSerializer


def _get_or_create_contacto_sitio():
    contacto, _ = ContactoSitio.objects.get_or_create(
        id=1,
        defaults={
            "instagram": "@motosnuevamarca",
            "telefono": "+56 9 1234 5678",
            "ubicacion": "Tu ciudad, Chile",
        },
    )
    return contacto


@api_view(["GET"])
def contacto_publico(request):
    contacto = _get_or_create_contacto_sitio()
    serializer = ContactoSitioSerializer(contacto)
    return Response(serializer.data)


@api_view(["GET", "PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def admin_contacto(request):
    if not has_admin_access(request.user):
        return Response(
            {"detail": "Solo administradores pueden gestionar el contacto del sitio."},
            status=403,
        )

    contacto = _get_or_create_contacto_sitio()

    if request.method == "GET":
        serializer = ContactoSitioSerializer(contacto)
        return Response(serializer.data)

    serializer = ContactoSitioSerializer(contacto, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
