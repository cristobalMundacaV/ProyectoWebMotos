import calendar
from datetime import date, datetime, time, timedelta

from django.db.models import Count, Q
from django.db.models.functions import ExtractHour

from .models import HorarioMantencion, Mantencion


def month_range(year: int, month: int) -> tuple[date, date]:
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])
    return first_day, last_day


def _sum_capacity_for_month(start_date: date, end_date: date) -> int:
    horarios = list(HorarioMantencion.objects.filter(activo=True))
    if not horarios:
        return 0

    by_weekday = {}
    for item in horarios:
        by_weekday.setdefault(item.dia_semana, []).append(item)

    capacity = 0
    current = start_date
    while current <= end_date:
        weekday = current.weekday()
        for bloque in by_weekday.get(weekday, []):
            inicio = datetime.combine(current, bloque.hora_inicio)
            fin = datetime.combine(current, bloque.hora_fin)
            if fin <= inicio:
                continue
            total_minutes = int((fin - inicio).total_seconds() // 60)
            if bloque.intervalo_minutos <= 0:
                continue
            slots = total_minutes // bloque.intervalo_minutos
            capacity += slots * max(int(bloque.cupos_por_bloque or 1), 1)
        current += timedelta(days=1)
    return capacity


def get_monthly_kpis(year: int, month: int) -> dict:
    start_date, end_date = month_range(year, month)
    reservations = Mantencion.objects.filter(fecha_ingreso__gte=start_date, fecha_ingreso__lte=end_date)
    total_agendadas = reservations.count()

    # Cupos comprometidos del mes: ignora canceladas.
    total_ocupadas = reservations.exclude(estado=Mantencion.ESTADO_CANCELADA).count()
    total_disponibles = _sum_capacity_for_month(start_date, end_date)
    ocupacion_pct = round((total_ocupadas / total_disponibles) * 100, 2) if total_disponibles else 0

    peak_hours_qs = (
        reservations.exclude(hora_ingreso__isnull=True)
        .annotate(hora=ExtractHour("hora_ingreso"))
        .values("hora")
        .annotate(total=Count("id"))
        .order_by("-total", "hora")
    )
    peak_hours = [
        {"hora": f"{int(row['hora']):02d}:00", "total": row["total"]}
        for row in peak_hours_qs
        if row["hora"] is not None
    ]

    servicios = (
        reservations.values("tipo_mantencion")
        .annotate(total=Count("id"))
        .order_by("-total", "tipo_mantencion")
    )

    canceladas = reservations.filter(estado=Mantencion.ESTADO_CANCELADA).count()
    no_asistio = reservations.filter(estado=Mantencion.ESTADO_NO_ASISTIO).count()
    cancelacion_pct = round((canceladas / total_agendadas) * 100, 2) if total_agendadas else 0
    no_asistencia_pct = round((no_asistio / total_agendadas) * 100, 2) if total_agendadas else 0

    previous_year = year if month > 1 else year - 1
    previous_month = month - 1 if month > 1 else 12
    prev_start, prev_end = month_range(previous_year, previous_month)
    prev_total = Mantencion.objects.filter(fecha_ingreso__gte=prev_start, fecha_ingreso__lte=prev_end).count()
    growth_pct = round(((total_agendadas - prev_total) / prev_total) * 100, 2) if prev_total else None

    return {
        "year": year,
        "month": month,
        "total_agendadas_mes": total_agendadas,
        "ocupacion_pct": ocupacion_pct,
        "horas_peak": peak_hours,
        "servicios_mas_solicitados": list(servicios),
        "tasa_no_asistencia_pct": no_asistencia_pct,
        "tasa_cancelacion_pct": cancelacion_pct,
        "crecimiento_mensual_pct": growth_pct,
        "mes_anterior_total": prev_total,
    }
