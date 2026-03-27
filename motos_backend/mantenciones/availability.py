from __future__ import annotations

from collections import defaultdict
from datetime import date, time, timedelta

from django.db.models import Count
from django.utils import timezone

from .models import HorarioMantencion, Mantencion


def _to_minutes(value: time) -> int:
    return value.hour * 60 + value.minute


def _from_minutes(value: int) -> time:
    hour = value // 60
    minute = value % 60
    return time(hour=hour, minute=minute)


def get_disponibilidad(days_ahead: int = 21) -> list[dict]:
    today = timezone.localdate()
    now_local = timezone.localtime()
    end_date = today + timedelta(days=max(days_ahead, 1) - 1)

    horarios = (
        HorarioMantencion.objects.filter(activo=True)
        .order_by("dia_semana", "hora_inicio")
        .all()
    )
    if not horarios:
        return []

    ocupadas = (
        Mantencion.objects.filter(
            fecha_ingreso__gte=today,
            fecha_ingreso__lte=end_date,
            hora_ingreso__isnull=False,
        )
        .exclude(estado=Mantencion.ESTADO_CANCELADO)
        .values("fecha_ingreso", "hora_ingreso")
        .annotate(total=Count("id"))
    )
    ocupadas_map = {
        (row["fecha_ingreso"], row["hora_ingreso"]): row["total"]
        for row in ocupadas
    }

    grouped_horarios = defaultdict(list)
    for horario in horarios:
        grouped_horarios[horario.dia_semana].append(horario)

    disponibilidad: list[dict] = []
    for offset in range((end_date - today).days + 1):
        current_date = today + timedelta(days=offset)
        bloques = grouped_horarios.get(current_date.weekday(), [])
        if not bloques:
            continue

        horas_calculadas = []
        for bloque in bloques:
            start_min = _to_minutes(bloque.hora_inicio)
            end_min = _to_minutes(bloque.hora_fin)
            if end_min <= start_min or bloque.intervalo_minutos <= 0:
                continue

            for minute in range(start_min, end_min, bloque.intervalo_minutos):
                slot_time = _from_minutes(minute)
                if current_date == today and slot_time <= now_local.time():
                    continue

                reserved_count = ocupadas_map.get((current_date, slot_time), 0)
                cupos = bloque.cupos_por_bloque - reserved_count
                horas_calculadas.append(
                    {
                        "hora": slot_time.strftime("%H:%M"),
                        "cupos_disponibles": max(cupos, 0),
                        "disponible": cupos > 0,
                    }
                )

        if horas_calculadas:
            deduped = {}
            for item in horas_calculadas:
                hora = item["hora"]
                if hora not in deduped:
                    deduped[hora] = item
                else:
                    deduped[hora]["cupos_disponibles"] = max(
                        deduped[hora]["cupos_disponibles"],
                        item["cupos_disponibles"],
                    )
                    deduped[hora]["disponible"] = deduped[hora]["cupos_disponibles"] > 0

            horas = sorted(deduped.values(), key=lambda item: item["hora"])
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

    day_slots = get_disponibilidad(days_ahead=60)
    fecha_text = fecha.isoformat()
    hora_text = hora.strftime("%H:%M")
    for day in day_slots:
        if day["fecha"] != fecha_text:
            continue
        return any(item["hora"] == hora_text and item["disponible"] for item in day["horas"])
    return False
