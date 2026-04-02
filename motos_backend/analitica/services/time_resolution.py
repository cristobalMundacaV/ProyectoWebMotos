from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta

from django.utils import timezone

from .kpi_registry import KPIDefinition, KPITimeMode


@dataclass(frozen=True)
class Window:
    start: date
    end: date

    @property
    def days(self) -> int:
        return max((self.end - self.start).days + 1, 1)

    def as_dict(self) -> dict[str, str]:
        return {"from": self.start.isoformat(), "to": self.end.isoformat()}


@dataclass(frozen=True)
class GlobalPeriodContext:
    key: str
    window: Window
    first_data_date: date | None = None


def _first_day_of_month(value: date) -> date:
    return value.replace(day=1)


def _last_day_of_month(value: date) -> date:
    next_month = _add_months(_first_day_of_month(value), 1)
    return next_month - timedelta(days=1)


def _add_months(value: date, months: int) -> date:
    month_index = (value.year * 12 + (value.month - 1)) + months
    year = month_index // 12
    month = (month_index % 12) + 1
    return date(year, month, 1)


def _resolve_all_period_start(today: date, first_data_date: date | None) -> date:
    if first_data_date:
        return min(first_data_date, today)
    return today


def resolve_global_period_context(
    period: str,
    *,
    today: date | None = None,
    first_data_date: date | None = None,
) -> GlobalPeriodContext:
    today = today or timezone.localdate()
    normalized = (period or "this_month").strip().lower()

    if normalized == "today":
        return GlobalPeriodContext(key=normalized, window=Window(today, today), first_data_date=first_data_date)
    if normalized == "this_week":
        start = today - timedelta(days=today.weekday())
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "last_7_days":
        start = today - timedelta(days=6)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "last_30_days":
        start = today - timedelta(days=29)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "last_3_months":
        start = _add_months(_first_day_of_month(today), -2)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "last_6_months":
        start = _add_months(_first_day_of_month(today), -5)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "last_9_months":
        start = _add_months(_first_day_of_month(today), -8)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "last_year":
        start = _add_months(_first_day_of_month(today), -11)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    if normalized == "this_year":
        start = date(today.year, 1, 1)
        end = date(today.year, 12, 31)
        return GlobalPeriodContext(key=normalized, window=Window(start, end), first_data_date=first_data_date)
    if normalized == "all":
        start = _resolve_all_period_start(today, first_data_date)
        return GlobalPeriodContext(key=normalized, window=Window(start, today), first_data_date=first_data_date)
    start = _first_day_of_month(today)
    end = _last_day_of_month(today)
    return GlobalPeriodContext(key="this_month", window=Window(start, end), first_data_date=first_data_date)


def resolve_time_window(
    definition: KPIDefinition,
    global_context: GlobalPeriodContext,
    *,
    now_tz: datetime | None = None,
) -> Window:
    now_tz = now_tz or timezone.localtime()
    today = now_tz.date()

    if definition.time_mode == KPITimeMode.REALTIME:
        start = today
        end = today + timedelta(days=max(definition.default_window_days - 1, 0))
        return Window(start=start, end=end)
    if definition.time_mode == KPITimeMode.PERIOD:
        return global_context.window
    if definition.time_mode == KPITimeMode.ROLLING:
        end = today
        start = end - timedelta(days=max(definition.default_window_days - 1, 0))
        return Window(start=start, end=end)
    if definition.time_mode == KPITimeMode.FIXED_WINDOW:
        end = _first_day_of_month(today)
        start = _add_months(end, -11)
        return Window(start=start, end=today)
    return global_context.window


def resolve_granularity(window_days: int, definition: KPIDefinition) -> str:
    if "month" in definition.allowed_granularity and definition.time_mode == KPITimeMode.FIXED_WINDOW:
        return "month"
    if window_days <= 2 and "hour" in definition.allowed_granularity:
        return "hour"
    if window_days <= 90 and "day" in definition.allowed_granularity:
        return "day"
    if window_days <= 365 and "week" in definition.allowed_granularity:
        return "week"
    if "month" in definition.allowed_granularity:
        return "month"
    return definition.allowed_granularity[0]


def resolve_comparison_window(definition: KPIDefinition, current_window: Window) -> Window | None:
    if definition.comparison_rule == "none":
        return None
    if definition.comparison_rule in {"previous_equivalent_period", "rolling_baseline"}:
        prev_end = current_window.start - timedelta(days=1)
        prev_start = prev_end - timedelta(days=current_window.days - 1)
        return Window(start=prev_start, end=prev_end)
    if definition.comparison_rule == "month_over_month":
        current_month_start = _first_day_of_month(current_window.start)
        prev_start = _add_months(current_month_start, -1)
        prev_end = current_month_start - timedelta(days=1)
        return Window(start=prev_start, end=prev_end)
    return None
