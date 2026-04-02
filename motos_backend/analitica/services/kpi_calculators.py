from __future__ import annotations

from dataclasses import asdict
from datetime import date, datetime, time, timedelta
from typing import Any

from django.db.models import Count, Min
from django.db.models.functions import TruncDay, TruncHour, TruncMonth, TruncWeek
from django.utils.text import slugify

from analitica.models import CatalogoEvento
from mantenciones.models import HorarioMantencion, Mantencion
from motos.models import Moto

from .kpi_registry import KPI_REGISTRY, KPIDefinition
from .time_resolution import GlobalPeriodContext, Window, resolve_comparison_window, resolve_granularity, resolve_time_window


def _value_to_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return None


def _normalize_key(value: str) -> str:
    raw = (value or "").strip().lower()
    if not raw:
        return ""
    return "".join(ch for ch in raw if ch.isalnum())


def _add_months(value: date, months: int) -> date:
    month_index = (value.year * 12 + (value.month - 1)) + months
    year = month_index // 12
    month = (month_index % 12) + 1
    return date(year, month, 1)


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
            current += timedelta(days=7)
        else:
            current += timedelta(days=1)
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


def _growth_previous_label(period_key: str) -> str:
    labels = {
        "today": "ayer",
        "this_week": "semana pasada",
        "this_month": "mes pasado",
        "this_year": "año pasado",
        "last_year": "periodo anual anterior equivalente",
        "last_9_months": "9 meses anteriores equivalentes",
        "last_6_months": "6 meses anteriores equivalentes",
        "last_3_months": "3 meses anteriores equivalentes",
        "last_30_days": "30 dias anteriores",
        "last_7_days": "7 dias anteriores",
        "all": "bloque historico anterior equivalente",
    }
    return labels.get(period_key, "periodo anterior equivalente")


def _base_contract(
    definition: KPIDefinition,
    window: Window,
    comparison_window: Window | None,
    sample_size: int,
    granularity: str,
) -> dict[str, Any]:
    return {
        "kpi_key": definition.kpi_key,
        "value": None,
        "display": None,
        "meta": {
            "name": definition.nombre,
            "type": definition.tipo,
            "time_mode": definition.time_mode,
            "window": window.as_dict(),
            "comparison_window": comparison_window.as_dict() if comparison_window else None,
            "sample_size": int(sample_size),
            "granularity": granularity,
            "fallback_policy": definition.fallback_policy,
            "decision_support": definition.business_decision,
        },
        "quality_flags": [],
        "empty_reason": None,
    }


def _apply_fallback_policy(contract: dict[str, Any], definition: KPIDefinition, current_window: Window) -> tuple[dict[str, Any], Window]:
    sample_size = int(contract["meta"].get("sample_size") or 0)
    if sample_size >= definition.min_sample_size:
        return contract, current_window

    contract["quality_flags"].append("low_sample")
    policy = definition.fallback_policy
    if policy == "fallback_rolling_30d":
        fallback_window = Window(start=current_window.end - timedelta(days=29), end=current_window.end)
        contract["quality_flags"].append("fallback_rolling_30d")
        return contract, fallback_window
    if policy == "fallback_rolling_90d":
        fallback_window = Window(start=current_window.end - timedelta(days=89), end=current_window.end)
        contract["quality_flags"].append("fallback_rolling_90d")
        return contract, fallback_window
    if policy == "expand_window_to_180d":
        fallback_window = Window(start=current_window.end - timedelta(days=179), end=current_window.end)
        contract["quality_flags"].append("fallback_rolling_180d")
        return contract, fallback_window
    if policy == "mark_low_sample_no_percentage":
        contract["quality_flags"].append("no_percentage_due_low_sample")
        return contract, current_window
    return contract, current_window


class DashboardSummaryBuilder:
    def __init__(self, period_context: GlobalPeriodContext):
        self.period_context = period_context
        self.period = period_context.key
        self.today = period_context.window.end
        self.moto_category_maps = _build_moto_category_maps()
        self.results: dict[str, dict[str, Any]] = {}

    def _catalog_views_qs(self, window: Window):
        return CatalogoEvento.objects.filter(
            tipo_evento=CatalogoEvento.EVENTO_VISTA_DETALLE,
            created_at__date__gte=window.start,
            created_at__date__lte=window.end,
        )

    def _mant_qs(self, window: Window):
        return Mantencion.objects.filter(fecha_ingreso__gte=window.start, fecha_ingreso__lte=window.end)

    def _sample_size_for(self, definition: KPIDefinition, window: Window) -> int:
        mant_keys = {
            "mantenciones_agendadas",
            "crecimiento_vs_periodo_anterior",
            "ocupacion_taller",
            "horas_peak",
            "tipo_servicio_mas_solicitado",
            "tasa_cancelaciones",
            "tasa_no_show",
            "clientes_nuevos",
            "clientes_recurrentes",
            "crecimiento_mensual_reservas",
        }
        if definition.kpi_key in mant_keys:
            return self._mant_qs(window).count()
        return self._catalog_views_qs(window).count()

    def _calculate_for_definition(self, definition: KPIDefinition) -> dict[str, Any]:
        window = resolve_time_window(definition, self.period_context)
        comparison_window = resolve_comparison_window(definition, window)
        granularity = resolve_granularity(window.days, definition)
        sample_size = self._sample_size_for(definition, window)

        contract = _base_contract(definition, window, comparison_window, sample_size, granularity)
        contract, effective_window = _apply_fallback_policy(contract, definition, window)
        if effective_window != window:
            contract["meta"]["window_effective"] = effective_window.as_dict()
            window = effective_window
            granularity = resolve_granularity(window.days, definition)
            comparison_window = resolve_comparison_window(definition, window)
            contract["meta"]["granularity"] = granularity
            contract["meta"]["comparison_window"] = comparison_window.as_dict() if comparison_window else None

        calc_map = {
            "mantenciones_agendadas": self._calc_mantenciones_agendadas,
            "crecimiento_vs_periodo_anterior": self._calc_crecimiento,
            "ocupacion_taller": self._calc_ocupacion,
            "modelo_mas_visto": self._calc_modelo_mas_visto,
            "top_5_modelos": self._calc_top_modelos,
            "categorias_mas_vistas": self._calc_categorias,
            "tendencia_visitas": self._calc_tendencia_visitas,
            "horas_peak": self._calc_horas_peak,
            "tipo_servicio_mas_solicitado": self._calc_tipos_servicio,
            "tasa_cancelaciones": self._calc_tasa_cancelaciones,
            "tasa_no_show": self._calc_tasa_no_show,
            "clientes_nuevos": self._calc_clientes_nuevos,
            "clientes_recurrentes": self._calc_clientes_recurrentes,
            "crecimiento_mensual_reservas": self._calc_crecimiento_mensual_reservas,
        }
        return calc_map[definition.kpi_key](contract, window, comparison_window)

    def _calc_mantenciones_agendadas(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        total = self._mant_qs(window).count()
        contract["value"] = total
        contract["display"] = f"{total} mantenciones"
        if total == 0:
            contract["empty_reason"] = "no_reservas_in_period"
        return contract

    def _calc_crecimiento(self, contract: dict[str, Any], window: Window, comparison_window: Window | None):
        current_total = self._mant_qs(window).count()
        previous_label = _growth_previous_label(self.period)
        contract["meta"]["comparison_label"] = previous_label

        first_data_date = self.period_context.first_data_date
        has_comparable_previous_window = bool(
            comparison_window and (
                first_data_date is None or comparison_window.end >= first_data_date
            )
        )
        if not has_comparable_previous_window:
            contract["quality_flags"].append("no_comparable_previous_period")
            contract["meta"]["comparison_window"] = None
            contract["meta"]["current_total"] = current_total
            contract["meta"]["previous_total"] = 0
            contract["display"] = "Sin base previa comparable"
            contract["value"] = None
            contract["empty_reason"] = "no_comparable_previous_period"
            return contract

        prev_total = self._mant_qs(comparison_window).count()
        contract["meta"]["current_total"] = current_total
        contract["meta"]["previous_total"] = prev_total
        if prev_total == 0 and current_total > 0:
            contract["quality_flags"].append("prev_period_zero")
            contract["display"] = "Nuevo crecimiento"
            contract["value"] = None
            return contract
        if prev_total == 0 and current_total == 0:
            contract["quality_flags"].append("no_activity")
            contract["display"] = "0%"
            contract["value"] = 0.0
            contract["empty_reason"] = "no_current_and_previous_activity"
            return contract
        growth = round(((current_total - prev_total) / prev_total) * 100, 2)
        contract["value"] = growth
        contract["display"] = f"{growth}%"
        return contract

    def _calc_ocupacion(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        reservadas = (
            self._mant_qs(window)
            .filter(estado__in=Mantencion.ESTADOS_CUPO_OCUPADO)
            .exclude(estado=Mantencion.ESTADO_ENTREGADA)
            .count()
        )
        capacity_by_hour, capacity_total = _compute_capacity_by_hour(window.start, window.end)
        contract["meta"]["capacity_total"] = capacity_total
        contract["meta"]["reserved_slots"] = reservadas
        contract["meta"]["capacity_by_hour"] = capacity_by_hour
        if capacity_total <= 0:
            contract["quality_flags"].append("no_capacity_configured")
            contract["display"] = "Sin capacidad configurada"
            contract["value"] = 0.0
            contract["empty_reason"] = "no_schedule_capacity"
            return contract
        pct = round((reservadas / capacity_total) * 100, 2)
        contract["value"] = pct
        contract["display"] = f"{pct}%"
        return contract

    def _calc_modelo_mas_visto(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        most = (
            self._catalog_views_qs(window)
            .filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
            .values("entidad_id", "entidad_slug", "entidad_nombre")
            .annotate(total=Count("id"))
            .order_by("-total", "entidad_nombre")
            .first()
        )
        if not most:
            contract["display"] = "Sin datos"
            contract["value"] = None
            contract["empty_reason"] = "no_model_views_in_window"
            return contract
        contract["value"] = most
        contract["display"] = most.get("entidad_nombre") or most.get("entidad_slug") or "Sin nombre"
        return contract

    def _calc_top_modelos(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        top = list(
            self._catalog_views_qs(window)
            .filter(tipo_entidad=CatalogoEvento.TIPO_MOTO)
            .values("entidad_id", "entidad_slug", "entidad_nombre")
            .annotate(total=Count("id"))
            .order_by("-total", "entidad_nombre")[:5]
        )
        contract["value"] = [
            {
                "modelo": item.get("entidad_nombre") or item.get("entidad_slug") or "Sin nombre",
                "total": int(item.get("total") or 0),
            }
            for item in top
        ]
        contract["display"] = str(len(top))
        if not top:
            contract["empty_reason"] = "no_model_views_in_window"
        return contract

    def _calc_categorias(self, contract: dict[str, Any], window: Window, comparison_window: Window | None):
        current_qs = self._catalog_views_qs(window)
        prev_qs = self._catalog_views_qs(comparison_window) if comparison_window else CatalogoEvento.objects.none()
        categories_current = _get_moto_category_totals(current_qs, self.moto_category_maps)
        categories_prev = _get_moto_category_totals(prev_qs, self.moto_category_maps)
        total_moto_views = max(current_qs.filter(tipo_entidad=CatalogoEvento.TIPO_MOTO).count(), 1)
        result = []
        for categoria, total in sorted(categories_current.items(), key=lambda item: (-item[1], item[0].lower()))[:8]:
            prev_total = int(categories_prev.get(categoria, 0))
            if prev_total == 0 and total > 0:
                trend_direction = "up"
                trend_pct = None
            elif prev_total == 0:
                trend_direction = "flat"
                trend_pct = 0.0
            else:
                delta = round(((total - prev_total) / prev_total) * 100, 2)
                trend_direction = "up" if delta > 0 else "down" if delta < 0 else "flat"
                trend_pct = delta
            result.append(
                {
                    "categoria": categoria,
                    "total": int(total),
                    "share_pct": round((int(total) / total_moto_views) * 100, 2),
                    "trend_direction": trend_direction,
                    "trend_pct": trend_pct,
                    "previous_total": prev_total,
                }
            )
        contract["value"] = result
        contract["display"] = str(len(result))
        if not result:
            contract["empty_reason"] = "no_category_views_in_window"
        return contract

    def _calc_tendencia_visitas(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        granularity = contract["meta"]["granularity"]
        qs = self._catalog_views_qs(window)
        trunc_map = {
            "hour": TruncHour,
            "day": TruncDay,
            "week": TruncWeek,
            "month": TruncMonth,
        }
        trunc = trunc_map[granularity]
        rows = list(
            qs.annotate(periodo=trunc("created_at"))
            .values("periodo")
            .annotate(total=Count("id"))
            .order_by("periodo")
        )
        if granularity == "hour":
            points = []
            prev = None
            for row in rows:
                periodo = row.get("periodo")
                if not periodo:
                    continue
                total = int(row.get("total") or 0)
                variation = None if prev in (None, 0) else round(((total - prev) / prev) * 100, 2)
                points.append(
                    {
                        "period_start": periodo.isoformat(),
                        "label": periodo.strftime("%Y-%m-%d %H:00"),
                        "total": total,
                        "variation_pct": variation,
                    }
                )
                prev = total
        else:
            mode = "month" if granularity == "month" else "week" if granularity == "week" else "day"
            trend_map = {
                _value_to_date(row["periodo"]): int(row["total"])
                for row in rows
                if _value_to_date(row.get("periodo"))
            }
            buckets = _iter_buckets(window.start, window.end, mode)
            points = []
            prev = None
            for bucket in buckets:
                total = int(trend_map.get(bucket, 0))
                variation = None if prev in (None, 0) else round(((total - prev) / prev) * 100, 2)
                points.append(
                    {
                        "period_start": bucket.isoformat(),
                        "label": _format_bucket_label(bucket, mode),
                        "total": total,
                        "variation_pct": variation,
                    }
                )
                prev = total
        contract["value"] = points
        contract["display"] = str(len(points))
        contract["meta"]["average_total"] = round(sum(point["total"] for point in points) / len(points), 2) if points else 0.0
        if not points:
            contract["empty_reason"] = "no_visit_events_in_window"
        return contract

    def _calc_horas_peak(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        reservadas_qs = (
            self._mant_qs(window)
            .filter(estado__in=Mantencion.ESTADOS_CUPO_OCUPADO)
            .exclude(estado=Mantencion.ESTADO_ENTREGADA)
        )
        capacity_by_hour, _ = _compute_capacity_by_hour(window.start, window.end)
        rows = list(
            reservadas_qs.exclude(hora_ingreso__isnull=True)
            .values("hora_ingreso")
            .annotate(total=Count("id"))
            .order_by("-total", "hora_ingreso")
        )
        result = []
        for row in rows:
            slot = row.get("hora_ingreso")
            if not slot:
                continue
            label = slot.strftime("%H:%M")
            total = int(row.get("total") or 0)
            capacidad_slot = int(capacity_by_hour.get(label, 0))
            ocupacion_slot = round((total / capacidad_slot) * 100, 2) if capacidad_slot else 0.0
            result.append(
                {
                    "hora": label,
                    "total_reservas": total,
                    "capacidad": capacidad_slot,
                    "ocupacion_pct": ocupacion_slot,
                    "is_critical": ocupacion_slot >= 80.0,
                }
            )
        result = sorted(result, key=lambda item: (-item["total_reservas"], item["hora"]))[:8]
        contract["value"] = result
        contract["display"] = str(len(result))
        if not result:
            contract["empty_reason"] = "no_booked_hours_in_window"
        return contract

    def _calc_tipos_servicio(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        rows = list(
            self._mant_qs(window)
            .values("tipo_mantencion")
            .annotate(total=Count("id"))
            .order_by("-total", "tipo_mantencion")
        )
        contract["value"] = [{"tipo_mantencion": row["tipo_mantencion"], "total": int(row["total"])} for row in rows]
        contract["display"] = str(len(rows))
        if not rows:
            contract["empty_reason"] = "no_service_requests_in_window"
        return contract

    def _calc_tasa_cancelaciones(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        qs = self._mant_qs(window)
        total = qs.count()
        canceladas = qs.filter(estado=Mantencion.ESTADO_CANCELADO).count()
        if total < KPI_REGISTRY["tasa_cancelaciones"].min_sample_size:
            contract["quality_flags"].append("insufficient_sample_for_stable_rate")
        if total == 0:
            contract["value"] = None
            contract["display"] = "Muestra insuficiente"
            contract["empty_reason"] = "no_reservations_for_rate"
            return contract
        pct = round((canceladas / total) * 100, 2)
        contract["value"] = pct
        contract["display"] = f"{pct}%"
        contract["meta"]["numerator"] = canceladas
        contract["meta"]["denominator"] = total
        return contract

    def _calc_tasa_no_show(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        qs = self._mant_qs(window)
        total = qs.count()
        no_show = qs.filter(estado=Mantencion.ESTADO_INASISTENCIA).count()
        if total < KPI_REGISTRY["tasa_no_show"].min_sample_size:
            contract["quality_flags"].append("insufficient_sample_for_stable_rate")
        if total == 0:
            contract["value"] = None
            contract["display"] = "Muestra insuficiente"
            contract["empty_reason"] = "no_reservations_for_rate"
            return contract
        pct = round((no_show / total) * 100, 2)
        contract["value"] = pct
        contract["display"] = f"{pct}%"
        contract["meta"]["numerator"] = no_show
        contract["meta"]["denominator"] = total
        return contract

    def _calc_clientes_nuevos(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        qs = self._mant_qs(window)
        clientes_ids = list(qs.values_list("moto_cliente__cliente_id", flat=True).distinct())
        if not clientes_ids:
            contract["value"] = 0
            contract["display"] = "0"
            contract["empty_reason"] = "no_clients_in_window"
            contract["meta"]["total_unicos"] = 0
            return contract
        stats = (
            Mantencion.objects.filter(moto_cliente__cliente_id__in=clientes_ids)
            .values("moto_cliente__cliente_id")
            .annotate(first_fecha=Min("fecha_ingreso"))
        )
        nuevos = sum(1 for row in stats if window.start <= row["first_fecha"] <= window.end)
        contract["value"] = nuevos
        contract["display"] = str(nuevos)
        contract["meta"]["total_unicos"] = len(clientes_ids)
        return contract

    def _calc_clientes_recurrentes(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        qs = self._mant_qs(window)
        clientes_ids = list(qs.values_list("moto_cliente__cliente_id", flat=True).distinct())
        if not clientes_ids:
            contract["value"] = 0
            contract["display"] = "0"
            contract["empty_reason"] = "no_clients_in_window"
            contract["meta"]["total_unicos"] = 0
            return contract
        stats = (
            Mantencion.objects.filter(moto_cliente__cliente_id__in=clientes_ids)
            .values("moto_cliente__cliente_id")
            .annotate(first_fecha=Min("fecha_ingreso"))
        )
        recurrentes = sum(1 for row in stats if row["first_fecha"] < window.start)
        contract["value"] = recurrentes
        contract["display"] = str(recurrentes)
        contract["meta"]["total_unicos"] = len(clientes_ids)
        return contract

    def _calc_crecimiento_mensual_reservas(self, contract: dict[str, Any], window: Window, _comparison_window: Window | None):
        series_start = window.start.replace(day=1)
        rows = list(
            Mantencion.objects.filter(fecha_ingreso__gte=series_start, fecha_ingreso__lte=window.end)
            .annotate(periodo=TruncMonth("fecha_ingreso"))
            .values("periodo")
            .annotate(total=Count("id"))
            .order_by("periodo")
        )
        monthly_map = {
            _value_to_date(row["periodo"]).replace(day=1): int(row["total"])
            for row in rows
            if _value_to_date(row.get("periodo"))
        }
        months = _iter_buckets(series_start, window.end.replace(day=1), "month")
        series = []
        previous_total = None
        for idx, month_bucket in enumerate(months):
            total = monthly_map.get(month_bucket, 0)
            if previous_total is None:
                growth_month = None
                growth_label = "base"
            elif previous_total == 0 and total > 0:
                growth_month = None
                growth_label = "nuevo_periodo_activo"
            elif previous_total == 0:
                growth_month = 0.0
                growth_label = "sin_actividad"
            else:
                growth_month = round(((total - previous_total) / previous_total) * 100, 2)
                growth_label = "up" if growth_month > 0 else "down" if growth_month < 0 else "flat"
            window_slice = [monthly_map.get(months[i], 0) for i in range(max(0, idx - 2), idx + 1)]
            moving_avg_3 = round(sum(window_slice) / len(window_slice), 2) if window_slice else 0.0
            series.append(
                {
                    "period_start": month_bucket.isoformat(),
                    "label": month_bucket.strftime("%Y-%m"),
                    "total_reservas": total,
                    "growth_pct": growth_month,
                    "growth_label": growth_label,
                    "moving_avg_3": moving_avg_3,
                }
            )
            previous_total = total
        max_month = max((item["total_reservas"] for item in series), default=0)
        for item in series:
            item["is_peak"] = max_month > 0 and item["total_reservas"] == max_month
        contract["value"] = series
        contract["display"] = str(len(series))
        if not series:
            contract["empty_reason"] = "no_monthly_data"
        return contract

    def build(self) -> dict[str, Any]:
        for key, definition in KPI_REGISTRY.items():
            self.results[key] = self._calculate_for_definition(definition)

        total_mantenciones = int(self.results["mantenciones_agendadas"]["value"] or 0)
        crecimiento_contract = self.results["crecimiento_vs_periodo_anterior"]
        ocupacion_contract = self.results["ocupacion_taller"]
        modelo_mas_visto_contract = self.results["modelo_mas_visto"]
        tasa_cancelaciones = self.results["tasa_cancelaciones"]
        tasa_no_show = self.results["tasa_no_show"]
        clientes_recurrentes = self.results["clientes_recurrentes"]
        clientes_nuevos = self.results["clientes_nuevos"]
        clientes_total_unicos = max(
            int(clientes_recurrentes["meta"].get("total_unicos") or 0),
            int(clientes_nuevos["meta"].get("total_unicos") or 0),
        )
        solicitudes_mantencion_global = Mantencion.objects.filter(estado=Mantencion.ESTADO_SOLICITUD).count()

        growth_value = crecimiento_contract["value"]
        growth_label = "normal"
        if "no_comparable_previous_period" in crecimiento_contract["quality_flags"]:
            growth_label = "sin_base_previa"
        elif "prev_period_zero" in crecimiento_contract["quality_flags"]:
            growth_label = "nuevo_crecimiento"
        elif "no_activity" in crecimiento_contract["quality_flags"]:
            growth_label = "sin_actividad"

        payload = {
            "period": self.period,
            "range": self.period_context.window.as_dict(),
            "previous_range": crecimiento_contract["meta"].get("comparison_window"),
            "kpis": {
                "total_mantenciones": total_mantenciones,
                "solicitudes_mantencion": int(solicitudes_mantencion_global or 0),
                "growth_pct": growth_value,
                "growth_label": growth_label,
                "growth_comparison_label": crecimiento_contract["meta"].get("comparison_label") or "periodo anterior equivalente",
                "ocupacion_pct": ocupacion_contract["value"] or 0.0,
                "horas_reservadas": int(ocupacion_contract["meta"].get("reserved_slots") or 0),
                "horas_disponibles": int(ocupacion_contract["meta"].get("capacity_total") or 0),
                "capacidad_total_mensual": int(ocupacion_contract["meta"].get("capacity_total") or 0),
                "horas_restantes": max(
                    int(ocupacion_contract["meta"].get("capacity_total") or 0)
                    - int(ocupacion_contract["meta"].get("reserved_slots") or 0),
                    0,
                ),
                "cancelaciones_pct": tasa_cancelaciones["value"] if tasa_cancelaciones["value"] is not None else 0.0,
                "no_asistencia_pct": tasa_no_show["value"] if tasa_no_show["value"] is not None else 0.0,
                "clientes_recurrentes": int(clientes_recurrentes["value"] or 0),
                "clientes_nuevos": int(clientes_nuevos["value"] or 0),
                "clientes_total_unicos": clientes_total_unicos,
                "modelo_mas_visto": modelo_mas_visto_contract["value"],
                "total_visitas_catalogo": int(self.results["tendencia_visitas"]["meta"].get("sample_size") or 0),
            },
            "top_modelos_moto": self.results["top_5_modelos"]["value"] or [],
            "categorias_moto": self.results["categorias_mas_vistas"]["value"] or [],
            "visitas_trend": {
                "group_by": self.results["tendencia_visitas"]["meta"].get("granularity"),
                "average_total": self.results["tendencia_visitas"]["meta"].get("average_total", 0.0),
                "points": self.results["tendencia_visitas"]["value"] or [],
            },
            "horas_peak": self.results["horas_peak"]["value"] or [],
            "servicios": self.results["tipo_servicio_mas_solicitado"]["value"] or [],
            "reservas_mensuales": self.results["crecimiento_mensual_reservas"]["value"] or [],
            "kpi_contracts": self.results,
            "kpi_matrix": {key: asdict(definition) for key, definition in KPI_REGISTRY.items()},
        }
        payload["range"] = {"start": payload["range"]["from"], "end": payload["range"]["to"]}
        comparison_window = payload.get("previous_range") or {}
        payload["previous_range"] = {
            "start": comparison_window.get("from"),
            "end": comparison_window.get("to"),
        }
        return payload
