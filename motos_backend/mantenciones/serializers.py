from rest_framework import serializers

from .models import Mantencion, VehiculoCliente


class VehiculoClienteNestedSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()

    class Meta:
        model = VehiculoCliente
        fields = (
            "id",
            "cliente",
            "cliente_nombre",
            "matricula",
            "marca",
            "modelo",
            "anio",
            "kilometraje_actual",
        )

    def get_cliente_nombre(self, obj: VehiculoCliente) -> str:
        full_name = obj.cliente.get_full_name().strip() if hasattr(obj.cliente, "get_full_name") else ""
        return full_name or getattr(obj.cliente, "username", "")


class VehiculoClienteSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = VehiculoCliente
        fields = (
            "id",
            "cliente",
            "cliente_nombre",
            "matricula",
            "marca",
            "modelo",
            "anio",
            "kilometraje_actual",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def get_cliente_nombre(self, obj: VehiculoCliente) -> str:
        full_name = obj.cliente.get_full_name().strip() if hasattr(obj.cliente, "get_full_name") else ""
        return full_name or getattr(obj.cliente, "username", "")


class MantencionSerializer(serializers.ModelSerializer):
    moto_cliente_detalle = VehiculoClienteNestedSerializer(source="moto_cliente", read_only=True)

    class Meta:
        model = Mantencion
        fields = (
            "id",
            "moto_cliente",
            "moto_cliente_detalle",
            "fecha_ingreso",
            "kilometraje_ingreso",
            "tipo_mantencion",
            "motivo",
            "diagnostico",
            "trabajo_realizado",
            "costo_total",
            "estado",
            "fecha_entrega",
            "observaciones",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
