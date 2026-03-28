from datetime import date, time, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from mantenciones.models import HorarioMantencion, Mantencion, VehiculoCliente

from .models import CatalogoEvento
from .services.kpi_registry import KPI_REGISTRY, KPITimeMode
from .services.time_resolution import resolve_global_period_context, resolve_granularity, resolve_time_window


class DashboardAnalyticsContractTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.admin = user_model.objects.create_user(username="admin", password="test123", is_staff=True)
        self.cliente = user_model.objects.create_user(username="cliente", password="test123")
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

        self.vehiculo = VehiculoCliente.objects.create(
            cliente=self.cliente,
            matricula="AA1111",
            marca="VOGE",
            modelo="R625",
            anio=2026,
            kilometraje_actual=1200,
        )

        today = date.today()
        HorarioMantencion.objects.create(
            dia_semana=today.weekday(),
            hora_inicio=time(9, 0),
            hora_fin=time(13, 0),
            intervalo_minutos=60,
            cupos_por_bloque=1,
            activo=True,
        )

        Mantencion.objects.create(
            moto_cliente=self.vehiculo,
            rut_cliente="11111111-1",
            fecha_ingreso=today,
            hora_ingreso=time(9, 0),
            kilometraje_ingreso=1200,
            tipo_mantencion=Mantencion.TIPO_PREVENTIVA,
            motivo="Prueba",
            costo_total=Decimal("1000.00"),
            estado=Mantencion.ESTADO_APROBADO,
        )
        Mantencion.objects.create(
            moto_cliente=self.vehiculo,
            rut_cliente="11111111-1",
            fecha_ingreso=today - timedelta(days=2),
            hora_ingreso=time(10, 0),
            kilometraje_ingreso=1205,
            tipo_mantencion=Mantencion.TIPO_CORRECTIVA,
            motivo="Prueba cancelacion",
            costo_total=Decimal("1200.00"),
            estado=Mantencion.ESTADO_CANCELADO,
        )

        CatalogoEvento.objects.create(
            tipo_evento=CatalogoEvento.EVENTO_VISTA_DETALLE,
            tipo_entidad=CatalogoEvento.TIPO_MOTO,
            entidad_id=1,
            entidad_slug="r625",
            entidad_nombre="R625",
            metadata={"categoria": "Naked"},
        )

    def test_dashboard_summary_includes_unified_contract(self):
        response = self.client.get("/api/analitica/dashboard-summary/?period=today")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("kpi_contracts", data)
        self.assertIn("kpi_matrix", data)
        self.assertIn("mantenciones_agendadas", data["kpi_contracts"])
        contract = data["kpi_contracts"]["mantenciones_agendadas"]
        self.assertIn("value", contract)
        self.assertIn("display", contract)
        self.assertIn("meta", contract)
        self.assertIn("quality_flags", contract)
        self.assertIn("empty_reason", contract)

    def test_prev_period_zero_uses_semantic_label(self):
        Mantencion.objects.all().delete()
        today = date.today()
        Mantencion.objects.create(
            moto_cliente=self.vehiculo,
            rut_cliente="11111111-1",
            fecha_ingreso=today,
            hora_ingreso=time(9, 0),
            kilometraje_ingreso=1300,
            tipo_mantencion=Mantencion.TIPO_PREVENTIVA,
            motivo="Nueva actividad",
            costo_total=Decimal("1500.00"),
            estado=Mantencion.ESTADO_APROBADO,
        )
        response = self.client.get("/api/analitica/dashboard-summary/?period=today")
        data = response.json()
        growth = data["kpi_contracts"]["crecimiento_vs_periodo_anterior"]
        self.assertIn("prev_period_zero", growth["quality_flags"])
        self.assertIsNone(growth["value"])

    def test_time_resolution_rules(self):
        context = resolve_global_period_context("today", today=date.today())
        realtime_window = resolve_time_window(KPI_REGISTRY["ocupacion_taller"], context)
        self.assertGreaterEqual(realtime_window.days, 1)
        self.assertEqual(KPI_REGISTRY["ocupacion_taller"].time_mode, KPITimeMode.REALTIME)
        self.assertEqual(resolve_granularity(2, KPI_REGISTRY["tendencia_visitas"]), "hour")
        self.assertEqual(resolve_granularity(20, KPI_REGISTRY["tendencia_visitas"]), "day")
        self.assertEqual(resolve_granularity(120, KPI_REGISTRY["tendencia_visitas"]), "week")
        self.assertEqual(resolve_granularity(500, KPI_REGISTRY["tendencia_visitas"]), "month")
