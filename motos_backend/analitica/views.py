from datetime import date, timedelta

from django.db.models import Count, Min
from django.db.models.functions import TruncDay, TruncMonth, TruncYear
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from clientes.permissions import has_admin_access
from mantenciones.analytics import get_monthly_kpis
from mantenciones.models import Mantencion
from .models import CatalogoEvento
from .serializers import CatalogoEventoCreateSerializer


def _get_client_ip(request) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return (request.META.get("REMOTE_ADDR") or "").strip()


class CatalogoEventoCreateAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CatalogoEventoCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session_id = serializer.validated_data.get("session_id") or ""
        if not session_id:
            if not request.session.session_key:
                request.session.create()
            session_id = request.session.session_key or ""

        user = request.user if getattr(request, "user", None) and request.user.is_authenticated else None
        ip = _get_client_ip(request) or None
        user_agent = (request.META.get("HTTP_USER_AGENT") or "")[:1000]
        origen = serializer.validated_data.get("origen") or request.META.get("HTTP_REFERER", "")[:255]

        CatalogoEvento.objects.create(
            tipo_evento=serializer.validated_data["tipo_evento"],
            tipo_entidad=serializer.validated_data["tipo_entidad"],
            entidad_id=serializer.validated_data.get("entidad_id"),
            entidad_slug=serializer.validated_data.get("entidad_slug", ""),
            entidad_nombre=serializer.validated_data.get("entidad_nombre", ""),
            usuario=user,
            session_id=session_id,
            ip_address=ip,
            user_agent=user_agent,
            origen=origen,
            metadata=serializer.validated_data.get("metadata") or {},
        )
        return Response({"ok": True}, status=status.HTTP_201_CREATED)


def _parse_date(value: str, fallback: date) -> date:
    if not value:
        return fallback
    try:
        return date.fromisoformat(value)
    except ValueError:
        return fallback


def _parse_int(value, fallback: int, *, min_value: int, max_value: int) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return fallback
    return max(min_value, min(max_value, parsed))


class CatalogoDashboardAnalyticsAPIView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_admin_access(request.user):
            return Response({"detail": "Solo administradores pueden acceder a esta analitica."}, status=403)

        today = date.today()
        default_start = today - timedelta(days=30)
        start = _parse_date(request.query_params.get("start"), default_start)
        end = _parse_date(request.query_params.get("end"), today)
        if start > end:
            start, end = end, start

        group_by = (request.query_params.get("group_by") or "day").strip().lower()
        if group_by not in {"day", "month", "year"}:
            group_by = "day"

        qs = CatalogoEvento.objects.filter(
            tipo_evento=CatalogoEvento.EVENTO_VISTA_DETALLE,
            created_at__date__gte=start,
            created_at__date__lte=end,
        )

        total_views = qs.count()

        most_viewed_moto = (
            qs.filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
            .values("entidad_id", "entidad_slug", "entidad_nombre")
            .annotate(total=Count("id"))
            .order_by("-total", "entidad_nombre")
            .first()
        )

        top_5_motos = list(
            qs.filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
            .values("entidad_id", "entidad_slug", "entidad_nombre")
            .annotate(total=Count("id"))
            .order_by("-total", "entidad_nombre")[:5]
        )

        top_5_entidades = list(
            qs.values("tipo_entidad", "entidad_id", "entidad_slug", "entidad_nombre")
            .annotate(total=Count("id"))
            .order_by("-total", "tipo_entidad", "entidad_nombre")[:5]
        )

        trunc = TruncDay if group_by == "day" else TruncMonth if group_by == "month" else TruncYear
        trend = list(
            qs.annotate(periodo=trunc("created_at"))
            .values("periodo")
            .annotate(total=Count("id"))
            .order_by("periodo")
        )

        by_category_raw = (
            qs.values("tipo_entidad")
            .annotate(total=Count("id"))
            .order_by("tipo_entidad")
        )
        by_category = {
            "motos": 0,
            "indumentaria": 0,
            "accesorios": 0,
        }
        for row in by_category_raw:
            tipo = row["tipo_entidad"]
            if tipo == CatalogoEvento.TIPO_MOTO:
                by_category["motos"] = row["total"]
            elif tipo == CatalogoEvento.TIPO_INDUMENTARIA:
                by_category["indumentaria"] = row["total"]
            elif tipo == CatalogoEvento.TIPO_ACCESORIO:
                by_category["accesorios"] = row["total"]

        categorias_moto = list(
            qs.filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
            .exclude(metadata__categoria__isnull=True)
            .exclude(metadata__categoria__exact="")
            .values("metadata__categoria")
            .annotate(total=Count("id"))
            .order_by("-total", "metadata__categoria")[:8]
        )

        return Response(
            {
                "range": {"start": start.isoformat(), "end": end.isoformat()},
                "group_by": group_by,
                "total_views": total_views,
                "most_viewed_moto": most_viewed_moto,
                "top_5_motos": top_5_motos,
                "top_5_entidades": top_5_entidades,
                "visitas_por_categoria": by_category,
                "visitas_por_categoria_moto": [
                    {"categoria": item["metadata__categoria"], "total": item["total"]}
                    for item in categorias_moto
                ],
                "trend": [
                    {"period": item["periodo"].date().isoformat(), "total": item["total"]}
                    for item in trend
                    if item.get("periodo")
                ],
            },
            status=status.HTTP_200_OK,
        )


class MantencionesDashboardAnalyticsAPIView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_admin_access(request.user):
            return Response({"detail": "Solo administradores pueden acceder a esta analitica."}, status=403)

        today = date.today()
        year = _parse_int(request.query_params.get("year"), today.year, min_value=2000, max_value=2100)
        month = _parse_int(request.query_params.get("month"), today.month, min_value=1, max_value=12)
        monthly_kpis = get_monthly_kpis(year=year, month=month)

        # Serie de crecimiento mensual (ultimos 12 meses incluyendo actual).
        months = []
        current_year = year
        current_month = month
        for _ in range(12):
            months.append((current_year, current_month))
            if current_month == 1:
                current_month = 12
                current_year -= 1
            else:
                current_month -= 1
        months.reverse()

        monthly_series = []
        for y, m in months:
            month_total = Mantencion.objects.filter(fecha_ingreso__year=y, fecha_ingreso__month=m).count()
            monthly_series.append({"year": y, "month": m, "total_agendadas": month_total})

        peak_hours = (
            Mantencion.objects.filter(fecha_ingreso__year=year, fecha_ingreso__month=month)
            .exclude(hora_ingreso__isnull=True)
            .values("hora_ingreso")
            .annotate(total=Count("id"))
            .order_by("-total", "hora_ingreso")[:6]
        )

        # Clientes recurrentes vs nuevos (en el mes seleccionado, por cliente unico).
        month_start = date(year, month, 1)
        month_reservations = Mantencion.objects.filter(fecha_ingreso__year=year, fecha_ingreso__month=month)
        clientes_mes_ids = month_reservations.values_list("moto_cliente__cliente_id", flat=True).distinct()
        clientes_stats = (
            Mantencion.objects.filter(moto_cliente__cliente_id__in=clientes_mes_ids)
            .values("moto_cliente__cliente_id")
            .annotate(first_fecha=Min("fecha_ingreso"))
        )
        recurrentes = sum(1 for row in clientes_stats if row["first_fecha"] < month_start)
        nuevos = sum(1 for row in clientes_stats if row["first_fecha"] >= month_start)

        return Response(
            {
                "kpis_mensuales": monthly_kpis,
                "agendadas_ultimos_12_meses": monthly_series,
                "horas_peak_top_6": [
                    {"hora": item["hora_ingreso"].strftime("%H:%M"), "total": item["total"]}
                    for item in peak_hours
                    if item.get("hora_ingreso")
                ],
                "clientes": {
                    "recurrentes": recurrentes,
                    "nuevos": nuevos,
                    "total_unicos_mes": recurrentes + nuevos,
                },
            },
            status=status.HTTP_200_OK,
        )
