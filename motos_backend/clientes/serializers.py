from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from .models import PerfilUsuario


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        error_messages={
            "required": "El correo electronico es obligatorio.",
            "blank": "El correo electronico es obligatorio.",
            "invalid": "Ingresa un correo electronico valido.",
        }
    )
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            "required": "La contraseña es obligatoria.",
            "blank": "La contraseña es obligatoria.",
            "min_length": "La contraseña debe tener al menos 8 caracteres.",
        },
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            "required": "Debes confirmar la contraseña.",
            "blank": "Debes confirmar la contraseña.",
            "min_length": "La contraseña debe tener al menos 8 caracteres.",
        },
    )
    telefono = serializers.CharField(
        max_length=30,
        error_messages={
            "required": "El telefono es obligatorio.",
            "blank": "El telefono es obligatorio.",
        },
    )

    class Meta:
        model = User
        fields = ["email", "telefono", "password", "confirm_password", "first_name", "last_name"]

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("El correo ya esta registrado.")
        return email

    def validate_telefono(self, value):
        telefono = value.strip()
        if not telefono:
            raise serializers.ValidationError("El telefono es obligatorio.")
        if PerfilUsuario.objects.filter(telefono=telefono).exists():
            raise serializers.ValidationError("El telefono ya esta registrado.")
        return telefono

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Las contraseñas no coinciden."})
        return attrs

    def _generate_username(self, email: str, first_name: str, last_name: str) -> str:
        local_part = (email.split("@")[0] if "@" in email else "").strip().lower()
        if not local_part:
            composed = f"{first_name}.{last_name}".strip(". ").lower().replace(" ", ".")
            local_part = composed or "cliente"

        base = local_part[:130] or "cliente"
        candidate = base
        suffix = 1
        while User.objects.filter(username__iexact=candidate).exists():
            candidate = f"{base}-{suffix}"[:150]
            suffix += 1
        return candidate

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        telefono = validated_data.pop("telefono", "").strip()
        password = validated_data.pop("password")
        with transaction.atomic():
            user = User(**validated_data)
            user.email = user.email.lower()
            user.username = self._generate_username(
                user.email,
                (validated_data.get("first_name") or "").strip(),
                (validated_data.get("last_name") or "").strip(),
            )
            user.set_password(password)
            user.save()
            PerfilUsuario.objects.update_or_create(
                user=user,
                defaults={"rol": PerfilUsuario.ROL_CLIENTE, "telefono": telefono},
            )
        return user


class AdminUserCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "El correo es obligatorio.",
            "blank": "El correo es obligatorio.",
            "invalid": "Ingresa un correo valido.",
        },
    )
    telefono = serializers.CharField(max_length=30)
    rol = serializers.ChoiceField(
        choices=[
            PerfilUsuario.ROL_ADMIN,
            PerfilUsuario.ROL_ENCARGADO,
            PerfilUsuario.ROL_SUPERADMIN,
        ],
        default=PerfilUsuario.ROL_ENCARGADO,
        required=False,
    )
    password = serializers.CharField(write_only=True, min_length=4)
    confirm_password = serializers.CharField(write_only=True, min_length=4)

    def validate_username(self, value):
        username = value.strip()
        if not username:
            raise serializers.ValidationError("El nombre de usuario es obligatorio.")
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("El nombre de usuario ya existe.")
        return username

    def validate_email(self, value):
        email = value.strip().lower()
        if not email:
            raise serializers.ValidationError("El correo es obligatorio.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("El correo ya esta registrado.")
        return email

    def validate_telefono(self, value):
        telefono = value.strip()
        if not telefono:
            raise serializers.ValidationError("El telefono es obligatorio.")
        if PerfilUsuario.objects.filter(telefono=telefono).exists():
            raise serializers.ValidationError("El telefono ya esta registrado.")
        return telefono

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        confirm_password = validated_data.pop("confirm_password")
        del confirm_password

        password = validated_data.pop("password")
        telefono = validated_data.pop("telefono")
        rol = validated_data.pop("rol", PerfilUsuario.ROL_ENCARGADO)

        with transaction.atomic():
            user = User(
                username=validated_data["username"],
                first_name=validated_data["first_name"].strip(),
                last_name=validated_data["last_name"].strip(),
                email=validated_data.get("email", ""),
            )
            user.is_staff = rol in {
                PerfilUsuario.ROL_ADMIN,
                PerfilUsuario.ROL_ENCARGADO,
                PerfilUsuario.ROL_SUPERADMIN,
            }
            user.is_superuser = rol == PerfilUsuario.ROL_SUPERADMIN
            user.set_password(password)
            user.save()

            PerfilUsuario.objects.update_or_create(
                user=user,
                defaults={
                    "telefono": telefono.strip(),
                    "rol": rol,
                },
            )
        return user
