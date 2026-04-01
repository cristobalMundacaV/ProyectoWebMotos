from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.db.models.deletion import ProtectedError, RestrictedError
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from core.phone_utils import normalize_chile_phone
from core.realtime import broadcast_realtime_event

from .models import PerfilUsuario
from .password_reset_email import send_password_reset_email
from .permissions import ADMIN_ALLOWED_ROLES, IsBackofficeAdmin, get_user_role
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
@permission_classes([AllowAny])
def register_user(request):
	serializer = UserRegisterSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	try:
		with transaction.atomic():
			user = serializer.save()
	except IntegrityError:
		return Response(
			{"detail": "No se pudo registrar el usuario por conflicto de integridad."},
			status=status.HTTP_409_CONFLICT,
		)
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
@permission_classes([AllowAny])
def login_user(request):
	username_or_email = (request.data.get("username") or request.data.get("email") or "").strip()
	password = request.data.get("password") or ""

	if not username_or_email or not password:
		return Response(
			{"detail": "Debes enviar usuario/correo y contraseña."},
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


@api_view(["GET", "PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
	if request.method == "GET":
		return Response({"user": _serialize_user(request.user)})

	data = request.data
	first_name = (data.get("first_name") or "").strip()
	last_name = (data.get("last_name") or "").strip()
	username = (data.get("username") or "").strip()
	email = (data.get("email") or "").strip()
	telefono = (data.get("telefono") or "").strip()
	current_email = (request.user.email or "").strip()
	current_telefono = (getattr(getattr(request.user, "perfil_usuario", None), "telefono", "") or "").strip()
	current_role = get_user_role(request.user)
	is_cliente = current_role == PerfilUsuario.ROL_CLIENTE

	if not first_name or not last_name:
		return Response(
			{"detail": "Nombres y apellidos son obligatorios."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	if not is_cliente and not username:
		return Response(
			{"detail": "El nombre de usuario es obligatorio."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	try:
		telefono = normalize_chile_phone(telefono, required=True)
	except ValueError as exc:
		return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

	if username and User.objects.filter(username__iexact=username).exclude(id=request.user.id).exists():
		return Response({"detail": "El nombre de usuario ya esta en uso."}, status=status.HTTP_400_BAD_REQUEST)

	if email and email.lower() != current_email.lower() and User.objects.filter(email__iexact=email).exclude(id=request.user.id).exists():
		return Response({"detail": "El correo ya esta en uso."}, status=status.HTTP_400_BAD_REQUEST)

	if telefono and telefono != current_telefono and PerfilUsuario.objects.filter(telefono=telefono).exclude(user_id=request.user.id).exists():
		return Response({"detail": "El telefono ya esta en uso."}, status=status.HTTP_400_BAD_REQUEST)

	try:
		with transaction.atomic():
			request.user.first_name = first_name
			request.user.last_name = last_name
			if username:
				request.user.username = username
			request.user.email = email
			request.user.save()

			PerfilUsuario.objects.update_or_create(
				user=request.user,
				defaults={"telefono": telefono, "rol": get_user_role(request.user)},
			)
	except IntegrityError:
		return Response(
			{"detail": "No se pudo actualizar el perfil por conflicto de integridad."},
			status=status.HTTP_409_CONFLICT,
		)

	request.user.refresh_from_db()
	return Response({"detail": "Perfil actualizado correctamente.", "user": _serialize_user(request.user)})


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsBackofficeAdmin])
def admin_list_clientes(request):
	clientes = (
		User.objects.select_related("perfil_usuario")
		.filter(Q(perfil_usuario__rol=PerfilUsuario.ROL_CLIENTE) | (Q(is_staff=False) & Q(is_superuser=False)))
		.order_by("-date_joined", "-id")
	)

	results = []
	for user in clientes:
		payload = _serialize_user(user)
		payload.pop("username", None)
		payload["date_joined"] = user.date_joined.isoformat() if user.date_joined else None
		results.append(payload)

	return Response({"clientes": results})


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
@permission_classes([IsAuthenticated, IsBackofficeAdmin])
def admin_create_user(request):
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
	try:
		with transaction.atomic():
			user = serializer.save()
	except IntegrityError:
		return Response(
			{"detail": "No se pudo crear el usuario por conflicto de integridad."},
			status=status.HTTP_409_CONFLICT,
		)

	# Ensure an explicit role is always persisted even for special cases.
	perfil = getattr(user, "perfil_usuario", None)
	if not perfil:
		PerfilUsuario.objects.update_or_create(
			user=user,
			defaults={"rol": PerfilUsuario.ROL_ENCARGADO, "telefono": ""},
		)

	transaction.on_commit(lambda: broadcast_realtime_event("user_created", {"id": user.id}))

	return Response(
		{
			"detail": "Usuario creado correctamente.",
			"user": _serialize_user(user),
		},
		status=status.HTTP_201_CREATED,
	)


@api_view(["PATCH", "DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsBackofficeAdmin])
def admin_manage_user(request, user_id: int):
	try:
		target_user = User.objects.select_related("perfil_usuario").get(id=user_id)
	except User.DoesNotExist:
		return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

	if request.method == "DELETE":
		if request.user.id == target_user.id:
			return Response(
				{"detail": "No puedes eliminar tu propio usuario."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		try:
			with transaction.atomic():
				PerfilUsuario.objects.filter(user=target_user).delete()
				target_user.delete()
		except (ProtectedError, RestrictedError):
			return Response(
				{"detail": "No se puede eliminar el usuario porque tiene registros asociados."},
				status=status.HTTP_409_CONFLICT,
			)
		transaction.on_commit(lambda: broadcast_realtime_event("user_deleted", {"id": user_id}))
		return Response(status=status.HTTP_204_NO_CONTENT)

	data = request.data

	first_name = (data.get("first_name") or "").strip()
	last_name = (data.get("last_name") or "").strip()
	username = (data.get("username") or "").strip()
	email = (data.get("email") or "").strip()
	telefono = (data.get("telefono") or "").strip()
	rol = (data.get("rol") or "").strip().lower()

	if not first_name or not last_name or not username or not email or not telefono or not rol:
		return Response(
			{"detail": "Nombres, apellidos, username, correo, telefono y rol son obligatorios."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	try:
		telefono = normalize_chile_phone(telefono, required=True)
	except ValueError as exc:
		return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

	if rol not in ADMIN_ALLOWED_ROLES:
		return Response({"detail": "Rol invalido."}, status=status.HTTP_400_BAD_REQUEST)

	if User.objects.filter(username__iexact=username).exclude(id=target_user.id).exists():
		return Response({"detail": "El username ya esta en uso."}, status=status.HTTP_400_BAD_REQUEST)

	if User.objects.filter(email__iexact=email).exclude(id=target_user.id).exists():
		return Response({"detail": "El correo ya esta en uso."}, status=status.HTTP_400_BAD_REQUEST)

	if telefono and PerfilUsuario.objects.filter(telefono=telefono).exclude(user_id=target_user.id).exists():
		return Response({"detail": "El telefono ya esta en uso."}, status=status.HTTP_400_BAD_REQUEST)

	try:
		with transaction.atomic():
			target_user.first_name = first_name
			target_user.last_name = last_name
			target_user.username = username
			target_user.email = email
			target_user.is_staff = rol in {PerfilUsuario.ROL_ADMIN, PerfilUsuario.ROL_SUPERADMIN}
			target_user.is_superuser = rol == PerfilUsuario.ROL_SUPERADMIN
			target_user.save()

			PerfilUsuario.objects.update_or_create(
				user=target_user,
				defaults={"rol": rol, "telefono": telefono},
			)
	except IntegrityError:
		return Response(
			{"detail": "No se pudo actualizar el usuario por conflicto de integridad."},
			status=status.HTTP_409_CONFLICT,
		)

	target_user.refresh_from_db()
	transaction.on_commit(lambda: broadcast_realtime_event("user_updated", {"id": target_user.id}))
	return Response({"detail": "Usuario actualizado correctamente.", "user": _serialize_user(target_user)})


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_request(request):
	email = (request.data.get("email") or "").strip().lower()
	if not email:
		return Response(
			{"detail": "Debes ingresar un correo valido."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	user = User.objects.filter(email__iexact=email).first()
	if user and user.is_active:
		uid = urlsafe_base64_encode(force_bytes(user.pk))
		token = default_token_generator.make_token(user)
		reset_url = f"{settings.FRONTEND_URL}/recuperar-contrasena/confirmar?uid={uid}&token={token}"
		full_name = user.get_full_name().strip() or user.username or "cliente"
		try:
			send_password_reset_email(
				recipient_email=email,
				full_name=full_name,
				reset_url=reset_url,
			)
		except Exception:
			return Response(
				{"detail": "No se pudo enviar el correo de recuperacion en este momento."},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

	return Response(
		{"detail": "Si el correo existe, enviaremos un enlace de recuperacion."},
		status=status.HTTP_200_OK,
	)


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_confirm(request):
	uid = (request.data.get("uid") or "").strip()
	token = (request.data.get("token") or "").strip()
	new_password = request.data.get("new_password") or ""
	confirm_password = request.data.get("confirm_password") or ""

	if not uid or not token:
		return Response({"detail": "Enlace de recuperacion invalido."}, status=status.HTTP_400_BAD_REQUEST)

	if len(new_password) < 8:
		return Response(
			{"detail": "La contraseña debe tener al menos 8 caracteres."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	if new_password != confirm_password:
		return Response(
			{"detail": "Las contraseñas no coinciden."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	try:
		user_id = force_str(urlsafe_base64_decode(uid))
		user = User.objects.get(pk=user_id)
	except (TypeError, ValueError, OverflowError, User.DoesNotExist):
		return Response({"detail": "Enlace de recuperacion invalido."}, status=status.HTTP_400_BAD_REQUEST)

	if not default_token_generator.check_token(user, token):
		return Response({"detail": "El enlace de recuperacion expiro o no es valido."}, status=status.HTTP_400_BAD_REQUEST)

	user.set_password(new_password)
	user.save(update_fields=["password"])

	return Response({"detail": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)
