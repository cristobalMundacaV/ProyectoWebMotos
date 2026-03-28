from __future__ import annotations

from datetime import date

from django.core.cache import cache

from analitica.models import CatalogoEvento
from mantenciones.models import Mantencion

from .kpi_calculators import DashboardSummaryBuilder
from .time_resolution import resolve_global_period_context


def _resolve_first_data_date(today: date) -> date:
    catalog_first = CatalogoEvento.objects.order_by("created_at").values_list("created_at", flat=True).first()
    mant_first = Mantencion.objects.order_by("fecha_ingreso").values_list("fecha_ingreso", flat=True).first()
    candidates = []
    if catalog_first:
        candidates.append(getattr(catalog_first, "date", lambda: catalog_first)())
    if mant_first:
        candidates.append(mant_first)
    return min(candidates) if candidates else today


def build_dashboard_summary(period: str) -> dict:
    today = date.today()
    first_data_date = _resolve_first_data_date(today)
    period_context = resolve_global_period_context(period, today=today, first_data_date=first_data_date)

    cache_key = (
        f"analytics:dashboard-summary:v3:"
        f"{period_context.key}:{period_context.window.start}:{period_context.window.end}:{today.isoformat()}"
    )
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    payload = DashboardSummaryBuilder(period_context=period_context).build()
    cache.set(cache_key, payload, timeout=60 * 10)
    return payload

