from datetime import date, datetime, time, timedelta

from django.core.cache import cache
from django.db.models import Count, Min
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek, TruncYear
from django.utils.text import slugify
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from clientes.permissions import IsBackofficeAdmin
from mantenciones.analytics import get_monthly_kpis
from mantenciones.models import HorarioMantencion, Mantencion
from motos.models import Moto
from .models import CatalogoEvento
from .serializers import CatalogoEventoCreateSerializer
from .services.dashboard_service import build_dashboard_summary


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
        metadata = serializer.validated_data.get("metadata") or {}

        if serializer.validated_data["tipo_entidad"] == CatalogoEvento.TIPO_MOTO:
            categoria_actual = str(metadata.get("categoria") or "").strip()
            if not categoria_actual:
                entidad_id = serializer.validated_data.get("entidad_id")
                entidad_slug = (serializer.validated_data.get("entidad_slug") or "").strip()
                entidad_nombre = (serializer.validated_data.get("entidad_nombre") or "").strip()
                moto = None
                if entidad_id is not None:
                    moto = (
                        Moto.objects.select_related("modelo_moto__categoria")
                        .filter(id=entidad_id)
                        .first()
                    )
                if moto is None and entidad_slug:
                    moto = (
                        Moto.objects.select_related("modelo_moto__categoria")
                        .filter(slug__iexact=entidad_slug)
                        .first()
                    )
                if moto is None and entidad_nombre:
                    moto = (
                        Moto.objects.select_related("modelo_moto__categoria")
                        .filter(modelo__iexact=entidad_nombre)
                        .first()
                    )
                if moto is not None:
                    categoria_nombre = (getattr(getattr(moto, "modelo_moto", None), "categoria", None) or None)
                    categoria_nombre = categoria_nombre.nombre if categoria_nombre else ""
                    if categoria_nombre:
                        metadata = {**metadata, "categoria": categoria_nombre}

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
            metadata=metadata,
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


def _normalize_key(value: str) -> str:
    raw = (value or "").strip().lower()
    if not raw:
        return ""
    return "".join(ch for ch in raw if ch.isalnum())


def _first_day_of_month(value: date) -> date:
    return value.replace(day=1)


def _last_day_of_month(value: date) -> date:
    return _add_months(_first_day_of_month(value), 1) - timedelta(days=1)


def _add_months(value: date, months: int) -> date:
    month_index = (value.year * 12 + (value.month - 1)) + months
    year = month_index // 12
    month = (month_index % 12) + 1
    return date(year, month, 1)


def _resolve_all_period_start(today: date) -> date:
    catalog_first = _value_to_date(
        CatalogoEvento.objects.aggregate(first_created=Min("created_at")).get("first_created")
    )
    mant_first = Mantencion.objects.aggregate(first_fecha=Min("fecha_ingreso")).get("first_fecha")
    candidates = [value for value in [catalog_first, mant_first] if value]
    return min(candidates) if candidates else today


def _period_bounds(period: str, today: date) -> tuple[date, date, str]:
    period = (period or "this_month").strip().lower()
    if period == "today":
        return today, today, "day"
    if period == "this_week":
        start = today - timedelta(days=today.weekday())
        return start, today, "day"
    if period == "last_3_months":
        start = _add_months(_first_day_of_month(today), -2)
        return start, today, "week"
    if period == "last_6_months":
        start = _add_months(_first_day_of_month(today), -5)
        return start, today, "month"
    if period == "last_9_months":
        start = _add_months(_first_day_of_month(today), -8)
        return start, today, "month"
    if period == "last_year":
        start = _add_months(_first_day_of_month(today), -11)
        return start, today, "month"
    if period == "all":
        return _resolve_all_period_start(today), today, "month"
    start = _first_day_of_month(today)
    return start, today, "day"


def _previous_period_bounds(period: str, start: date, end: date) -> tuple[date, date]:
    normalized = (period or "this_month").strip().lower()

    # Para "este mes", comparamos siempre contra el mes calendario anterior completo.
    if normalized == "this_month":
        previous_month_start = _add_months(_first_day_of_month(start), -1)
        previous_month_end = start - timedelta(days=1)
        return previous_month_start, previous_month_end

    prev_end = start - timedelta(days=1)
    span_days = max((end - start).days + 1, 1)
    prev_start = prev_end - timedelta(days=span_days - 1)
    return prev_start, prev_end


def _bucket_start(value: date, group_by: str) -> date:
    if group_by == "week":
        return value - timedelta(days=value.weekday())
    if group_by == "month":
        return value.replace(day=1)
    return value


def _iter_buckets(start: date, end: date, group_by: str) -> list[date]:
    if start > end:
        return []
    current = _bucket_start(start, group_by)
    end_bucket = _bucket_start(end, group_by)
    buckets = []
    while current <= end_bucket:
        buckets.append(current)
        if group_by == "month":
            current = _add_months(current, 1)
        elif group_by == "week":
            current = current + timedelta(days=7)
        else:
            current = current + timedelta(days=1)
    return buckets


def _format_bucket_label(bucket: date, group_by: str) -> str:
    if group_by == "month":
        return bucket.strftime("%Y-%m")
    if group_by == "week":
        return f"Semana {bucket.strftime('%Y-%m-%d')}"
    return bucket.strftime("%Y-%m-%d")


def _build_moto_category_maps():
    moto_catalogo = list(
        Moto.objects.select_related("modelo_moto__categoria").values(
            "id",
            "slug",
            "modelo",
            "marca__nombre",
            "modelo_moto__nombre_modelo",
            "modelo_moto__categoria__nombre",
        )
    )
    categoria_by_id = {}
    categoria_by_slug = {}
    categoria_by_modelo = {}
    for moto in moto_catalogo:
        categoria = (moto.get("modelo_moto__categoria__nombre") or "").strip() or "Sin categoria"
        moto_id = moto.get("id")
        slug = (moto.get("slug") or "").strip().lower()
        modelo = (moto.get("modelo") or "").strip().lower()
        marca = (moto.get("marca__nombre") or "").strip().lower()
        modelo_ref = (moto.get("modelo_moto__nombre_modelo") or "").strip().lower()
        modelo_key = _normalize_key(modelo)
        marca_key = _normalize_key(marca)
        modelo_ref_key = _normalize_key(modelo_ref)
        marca_modelo_key = _normalize_key(f"{marca} {modelo}") if marca and modelo else ""
        marca_modelo_ref_key = _normalize_key(f"{marca} {modelo_ref}") if marca and modelo_ref else ""
        if moto_id is not None:
            categoria_by_id[moto_id] = categoria
        if slug:
            categoria_by_slug[slug] = categoria
            categoria_by_slug[slugify(slug)] = categoria
        if modelo:
            categoria_by_modelo[modelo] = categoria
            categoria_by_modelo[slugify(modelo)] = categoria
            if modelo_key:
                categoria_by_modelo[modelo_key] = categoria
        if modelo_ref:
            categoria_by_modelo[modelo_ref] = categoria
            categoria_by_modelo[slugify(modelo_ref)] = categoria
            if modelo_ref_key:
                categoria_by_modelo[modelo_ref_key] = categoria
        if marca_modelo_key:
            categoria_by_modelo[marca_modelo_key] = categoria
        if marca_modelo_ref_key:
            categoria_by_modelo[marca_modelo_ref_key] = categoria
        if marca_key and modelo_key:
            categoria_by_modelo[f"{marca_key}{modelo_key}"] = categoria
        if marca_key and modelo_ref_key:
            categoria_by_modelo[f"{marca_key}{modelo_ref_key}"] = categoria
    return categoria_by_id, categoria_by_slug, categoria_by_modelo


def _category_from_event_row(row: dict, maps: tuple[dict, dict, dict]) -> str:
    categoria_by_id, categoria_by_slug, categoria_by_modelo = maps
    metadata_row = row.get("metadata") or {}
    categoria = str(metadata_row.get("categoria") or "").strip()
    if categoria:
        return categoria

    entidad_id = row.get("entidad_id")
    entidad_slug = (row.get("entidad_slug") or "").strip().lower()
    entidad_nombre = (row.get("entidad_nombre") or "").strip().lower()
    entidad_nombre_key = _normalize_key(entidad_nombre)

    if entidad_id is not None:
        categoria = categoria_by_id.get(entidad_id, "")
    if not categoria and entidad_slug:
        categoria = categoria_by_slug.get(entidad_slug, "") or categoria_by_slug.get(slugify(entidad_slug), "")
    if not categoria and entidad_nombre:
        categoria = (
            categoria_by_modelo.get(entidad_nombre, "")
            or categoria_by_modelo.get(slugify(entidad_nombre), "")
            or categoria_by_modelo.get(entidad_nombre_key, "")
        )
    if not categoria and entidad_nombre_key:
        for modelo_key, categoria_modelo in categoria_by_modelo.items():
            if not modelo_key:
                continue
            if modelo_key in entidad_nombre_key or entidad_nombre_key in modelo_key:
                categoria = categoria_modelo
                break
    return categoria or "Sin categoria"


def _get_moto_category_totals(events_qs, maps: tuple[dict, dict, dict]) -> dict[str, int]:
    rows = list(
        events_qs.filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
        .values("metadata", "entidad_id", "entidad_slug", "entidad_nombre")
        .annotate(total=Count("id"))
        .order_by()
    )
    totals: dict[str, int] = {}
    for row in rows:
        categoria = _category_from_event_row(row, maps)
        totals[categoria] = totals.get(categoria, 0) + int(row.get("total") or 0)
    return totals


def _compute_capacity_by_hour(start: date, end: date) -> tuple[dict[str, int], int]:
    horarios = list(HorarioMantencion.objects.filter(activo=True).order_by("dia_semana", "hora_inicio"))
    if not horarios:
        return {}, 0

    by_weekday = {}
    for h in horarios:
        by_weekday.setdefault(h.dia_semana, []).append(h)

    capacity_by_hour: dict[str, int] = {}
    total_capacity = 0
    current = start
    while current <= end:
        for block in by_weekday.get(current.weekday(), []):
            start_min = block.hora_inicio.hour * 60 + block.hora_inicio.minute
            end_min = block.hora_fin.hour * 60 + block.hora_fin.minute
            if end_min <= start_min or int(block.intervalo_minutos or 0) <= 0:
                continue
            for minute in range(start_min, end_min, block.intervalo_minutos):
                slot_time = time(hour=minute // 60, minute=minute % 60)
                label = slot_time.strftime("%H:%M")
                cupos = max(int(block.cupos_por_bloque or 1), 1)
                capacity_by_hour[label] = capacity_by_hour.get(label, 0) + cupos
                total_capacity += cupos
        current += timedelta(days=1)
    return capacity_by_hour, total_capacity


def _value_to_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return None


class CatalogoDashboardAnalyticsAPIView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsBackofficeAdmin]

    def get(self, request):
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

        moto_events = list(
            qs.filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
            .values("metadata", "entidad_id", "entidad_slug", "entidad_nombre")
            .annotate(total=Count("id"))
            .order_by()
        )

        moto_catalogo = list(
            Moto.objects.select_related("modelo_moto__categoria").values(
                "id",
                "slug",
                "modelo",
                "marca__nombre",
                "modelo_moto__nombre_modelo",
                "modelo_moto__categoria__nombre",
            )
        )
        categoria_by_id = {}
        categoria_by_slug = {}
        categoria_by_modelo = {}
        for moto in moto_catalogo:
            categoria = (moto.get("modelo_moto__categoria__nombre") or "").strip() or "Sin categoria"
            moto_id = moto.get("id")
            slug = (moto.get("slug") or "").strip().lower()
            modelo = (moto.get("modelo") or "").strip().lower()
            marca = (moto.get("marca__nombre") or "").strip().lower()
            modelo_ref = (moto.get("modelo_moto__nombre_modelo") or "").strip().lower()
            modelo_key = _normalize_key(modelo)
            marca_key = _normalize_key(marca)
            modelo_ref_key = _normalize_key(modelo_ref)
            marca_modelo_key = _normalize_key(f"{marca} {modelo}") if marca and modelo else ""
            marca_modelo_ref_key = _normalize_key(f"{marca} {modelo_ref}") if marca and modelo_ref else ""
            if moto_id is not None:
                categoria_by_id[moto_id] = categoria
            if slug:
                categoria_by_slug[slug] = categoria
                categoria_by_slug[slugify(slug)] = categoria
            if modelo:
                categoria_by_modelo[modelo] = categoria
                categoria_by_modelo[slugify(modelo)] = categoria
                if modelo_key:
                    categoria_by_modelo[modelo_key] = categoria
            if modelo_ref:
                categoria_by_modelo[modelo_ref] = categoria
                categoria_by_modelo[slugify(modelo_ref)] = categoria
                if modelo_ref_key:
                    categoria_by_modelo[modelo_ref_key] = categoria
            if marca_modelo_key:
                categoria_by_modelo[marca_modelo_key] = categoria
            if marca_modelo_ref_key:
                categoria_by_modelo[marca_modelo_ref_key] = categoria
            if marca_key and modelo_key:
                categoria_by_modelo[f"{marca_key}{modelo_key}"] = categoria
            if marca_key and modelo_ref_key:
                categoria_by_modelo[f"{marca_key}{modelo_ref_key}"] = categoria

        categoria_totales = {}
        for row in moto_events:
            total = int(row.get("total") or 0)
            metadata_row = row.get("metadata") or {}
            categoria = str(metadata_row.get("categoria") or "").strip()

            if not categoria:
                entidad_id = row.get("entidad_id")
                entidad_slug = (row.get("entidad_slug") or "").strip().lower()
                entidad_nombre = (row.get("entidad_nombre") or "").strip().lower()
                entidad_nombre_key = _normalize_key(entidad_nombre)

                if entidad_id is not None:
                    categoria = categoria_by_id.get(entidad_id, "")
                if not categoria and entidad_slug:
                    categoria = categoria_by_slug.get(entidad_slug, "") or categoria_by_slug.get(slugify(entidad_slug), "")
                if not categoria and entidad_nombre:
                    categoria = (
                        categoria_by_modelo.get(entidad_nombre, "")
                        or categoria_by_modelo.get(slugify(entidad_nombre), "")
                        or categoria_by_modelo.get(entidad_nombre_key, "")
                    )
                if not categoria and entidad_nombre_key:
                    # Fallback tolerante para nombres con prefijos/sufijos (ej: "Voge 250RR").
                    for modelo_key, categoria_modelo in categoria_by_modelo.items():
                        if not modelo_key:
                            continue
                        if modelo_key in entidad_nombre_key or entidad_nombre_key in modelo_key:
                            categoria = categoria_modelo
                            break

            categoria = categoria or "Sin categoria"
            categoria_totales[categoria] = categoria_totales.get(categoria, 0) + total

        categorias_moto = sorted(
            [{"categoria": categoria, "total": total} for categoria, total in categoria_totales.items()],
            key=lambda item: (-item["total"], item["categoria"].lower()),
        )[:8]

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
                    {"categoria": item["categoria"], "total": item["total"]}
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
    permission_classes = [IsBackofficeAdmin]

    def get(self, request):
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


class DashboardSummaryAnalyticsAPIView(APIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsBackofficeAdmin]

    def get(self, request):
        period = (request.query_params.get("period") or "this_month").strip().lower()
        response_payload = build_dashboard_summary(period=period)
        return Response(response_payload, status=status.HTTP_200_OK)
