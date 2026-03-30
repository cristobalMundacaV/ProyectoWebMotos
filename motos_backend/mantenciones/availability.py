from __future__ import annotations

from collections import defaultdict
from datetime import date, time, timedelta

from django.db.models import Count
from django.utils import timezone

from .chile_holidays import is_chilean_holiday
from .integrity import mark_expired_unaccepted_requests
from .models import (
    HorarioMantencion,
    Mantencion,
    MantencionDiaBloqueado,
    MantencionHoraBloqueada,
    MantencionHorarioFecha,
)

MAX_DISPONIBILIDAD_DAYS_AHEAD = 31


def _to_minutes(value: time) -> int:
    return value.hour * 60 + value.minute


def _from_minutes(value: int) -> time:
    hour = value // 60
    minute = value % 60
    return time(hour=hour, minute=minute)


def get_disponibilidad(
    days_ahead: int = 21,
    *,
    start_date: date | None = None,
    end_date: date | None = None,
) -> list[dict]:
    mark_expired_unaccepted_requests()
    today = timezone.localdate()
    now_local = timezone.localtime()

    if start_date is None and end_date is None:
        start_date = today
        end_date = today + timedelta(days=max(days_ahead, 1) - 1)
    else:
        start_date = start_date or today
        end_date = end_date or (start_date + timedelta(days=max(days_ahead, 1) - 1))

    start_date = max(start_date, today)
    max_end_date = today + timedelta(days=MAX_DISPONIBILIDAD_DAYS_AHEAD - 1)
    end_date = min(end_date, max_end_date)

    if start_date > end_date:
        return []

    horarios = (
        HorarioMantencion.objects.filter(activo=True)
        .order_by("dia_semana", "hora_inicio")
        .all()
    )
    ocupadas = (
        Mantencion.objects.filter(
            fecha_ingreso__gte=start_date,
            fecha_ingreso__lte=end_date,
            hora_ingreso__isnull=False,
        )
        .exclude(
            estado__in=[
                Mantencion.ESTADO_CANCELADO,
                Mantencion.ESTADO_NO_ACEPTADO,
                Mantencion.ESTADO_REAGENDACION,
            ]
        )
        .values("fecha_ingreso", "hora_ingreso")
        .annotate(total=Count("id"))
    )
    ocupadas_map = {
        (row["fecha_ingreso"], row["hora_ingreso"]): row["total"]
        for row in ocupadas
    }
    fechas_bloqueadas = set(
        MantencionDiaBloqueado.objects.filter(
            bloqueado=True,
            fecha__gte=start_date,
            fecha__lte=end_date,
        ).values_list("fecha", flat=True)
    )
    horarios_por_fecha = {
        item.fecha: item
        for item in MantencionHorarioFecha.objects.filter(
            activo=True,
            fecha__gte=start_date,
            fecha__lte=end_date,
        ).all()
    }
    horas_bloqueadas_map: dict[tuple[date, time], bool] = {
        (item.fecha, item.hora): True
        for item in MantencionHoraBloqueada.objects.filter(
            bloqueado=True,
            fecha__gte=start_date,
            fecha__lte=end_date,
        ).all()
    }
    if not horarios and not horarios_por_fecha:
        return []

    grouped_horarios = defaultdict(list)
    for horario in horarios:
        grouped_horarios[horario.dia_semana].append(horario)

    disponibilidad: list[dict] = []
    for offset in range((end_date - start_date).days + 1):
        current_date = start_date + timedelta(days=offset)
        horario_exacto = horarios_por_fecha.get(current_date)

        if current_date in fechas_bloqueadas:
            continue
        if is_chilean_holiday(current_date) and not horario_exacto:
            continue

        if horario_exacto:
            bloques = [horario_exacto]
        else:
            bloques = grouped_horarios.get(current_date.weekday(), [])
        if not bloques:
            continue

        capacity_by_hour: dict[time, int] = {}
        for bloque in bloques:
            start_min = _to_minutes(bloque.hora_inicio)
            end_min = _to_minutes(bloque.hora_fin)
            if end_min <= start_min or bloque.intervalo_minutos <= 0:
                continue

            for minute in range(start_min, end_min, bloque.intervalo_minutos):
                slot_time = _from_minutes(minute)
                if current_date == today and slot_time <= now_local.time():
                    continue

                capacity_by_hour[slot_time] = capacity_by_hour.get(slot_time, 0) + int(bloque.cupos_por_bloque or 0)

        if capacity_by_hour:
            horas = []
            for slot_time, total_capacity in sorted(capacity_by_hour.items(), key=lambda item: item[0]):
                is_blocked = horas_bloqueadas_map.get((current_date, slot_time), False)
                reserved_count = ocupadas_map.get((current_date, slot_time), 0)
                cupos_disponibles = max(total_capacity - reserved_count, 0)
                horas.append(
                    {
                        "hora": slot_time.strftime("%H:%M"),
                        "cupos_disponibles": 0 if is_blocked else cupos_disponibles,
                        "disponible": (cupos_disponibles > 0) and not is_blocked,
                        "desactivada": bool(is_blocked),
                    }
                )
            disponibles = sum(1 for item in horas if item["disponible"])
            disponibilidad.append(
                {
                    "fecha": current_date.isoformat(),
                    "horas": horas,
                    "has_disponibles": disponibles > 0,
                }
            )

    return disponibilidad


def slot_disponible(fecha: date, hora: time) -> bool:
    if fecha < timezone.localdate():
        return False

    day_slots = get_disponibilidad(days_ahead=MAX_DISPONIBILIDAD_DAYS_AHEAD)
    fecha_text = fecha.isoformat()
    hora_text = hora.strftime("%H:%M")
    for day in day_slots:
        if day["fecha"] != fecha_text:
            continue
        return any(item["hora"] == hora_text and item["disponible"] for item in day["horas"])
    return False
