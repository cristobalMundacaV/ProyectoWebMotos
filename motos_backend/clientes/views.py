from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import PerfilUsuario
from .permissions import ADMIN_ALLOWED_ROLES, get_user_role, has_admin_access
from .serializers import AdminUserCreateSerializer, UserRegisterSerializer


def _serialize_user(user: User):
	perfil = getattr(user, "perfil_usuario", None)
	telefono = perfil.telefono if perfil else ""
	rol = get_user_role(user)

	return {
		"id": user.id,
		"username": user.username,
		"email": user.email,
		"first_name": user.first_name,
		"last_name": user.last_name,
		"telefono": telefono,
		"rol": rol,
		"is_staff": user.is_staff,
		"is_superuser": user.is_superuser,
	}


@api_view(["POST"])
def register_user(request):
	serializer = UserRegisterSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	user = serializer.save()
	refresh = RefreshToken.for_user(user)
	access = refresh.access_token
	return Response(
		{
			"token": str(access),
			"access": str(access),
			"refresh": str(refresh),
			"user": _serialize_user(user),
		},
		status=status.HTTP_201_CREATED,
	)


@api_view(["POST"])
def login_user(request):
	username_or_email = (request.data.get("username") or request.data.get("email") or "").strip()
	password = request.data.get("password") or ""

	if not username_or_email or not password:
		return Response(
			{"detail": "Debes enviar usuario/correo y contrasena."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	candidate_username = username_or_email
	if "@" in username_or_email:
		user_by_email = User.objects.filter(email__iexact=username_or_email).first()
		if user_by_email:
			candidate_username = user_by_email.username
	else:
		user_by_username = User.objects.filter(username__iexact=username_or_email).first()
		if user_by_username:
			candidate_username = user_by_username.username

	user = authenticate(request, username=candidate_username, password=password)
	if not user:
		return Response({"detail": "Credenciales invalidas."}, status=status.HTTP_400_BAD_REQUEST)

	refresh = RefreshToken.for_user(user)
	access = refresh.access_token
	return Response(
		{
			"token": str(access),
			"access": str(access),
			"refresh": str(refresh),
			"user": _serialize_user(user),
		}
	)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
	return Response({"user": _serialize_user(request.user)})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
	refresh_token = request.data.get("refresh")
	if refresh_token:
		try:
			RefreshToken(refresh_token).blacklist()
		except TokenError:
			return Response(
				{"detail": "Refresh token invalido o expirado."},
				status=status.HTTP_400_BAD_REQUEST,
			)

	return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def admin_create_user(request):
	if not has_admin_access(request.user):
		return Response(
			{"detail": "Solo administradores pueden crear usuarios."},
			status=status.HTTP_403_FORBIDDEN,
		)

	if request.method == "GET":
		users = (
			User.objects.select_related("perfil_usuario")
			.filter(
				Q(is_superuser=True)
				| Q(is_staff=True)
				| Q(perfil_usuario__rol__in=ADMIN_ALLOWED_ROLES)
			)
			.order_by("-id")
		)
		return Response({"users": [_serialize_user(user) for user in users]})

	serializer = AdminUserCreateSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	user = serializer.save()

	# Ensure an explicit role is always persisted even for special cases.
	perfil = getattr(user, "perfil_usuario", None)
	if not perfil:
		PerfilUsuario.objects.update_or_create(
			user=user,
			defaults={"rol": PerfilUsuario.ROL_ENCARGADO, "telefono": ""},
		)

	return Response(
		{
			"detail": "Usuario creado correctamente.",
			"user": _serialize_user(user),
		},
		status=status.HTTP_201_CREATED,
	)
