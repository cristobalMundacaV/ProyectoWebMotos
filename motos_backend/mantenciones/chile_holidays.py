from __future__ import annotations

from datetime import date, timedelta


def _easter_sunday(year: int) -> date:
    """Computes Gregorian Easter Sunday for the given year."""
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


def _nearest_monday(target: date) -> date:
    # Chile transfers some holidays to Monday; nearest Monday is a pragmatic business rule.
    weekday = target.weekday()  # Monday=0
    previous_monday = target - timedelta(days=weekday)
    next_monday = previous_monday + timedelta(days=7)
    if (target - previous_monday) <= (next_monday - target):
        return previous_monday
    return next_monday


def get_chile_holidays_for_year(year: int) -> set[date]:
    easter = _easter_sunday(year)

    fixed = {
        date(year, 1, 1),   # Año nuevo
        date(year, 5, 1),   # Día del trabajo
        date(year, 5, 21),  # Glorias navales
        date(year, 6, 21),  # Pueblos indígenas
        date(year, 7, 16),  # Virgen del Carmen
        date(year, 8, 15),  # Asunción de la Virgen
        date(year, 9, 18),  # Independencia nacional
        date(year, 9, 19),  # Glorias del ejército
        date(year, 10, 31), # Iglesias evangélicas y protestantes
        date(year, 11, 1),  # Todos los santos
        date(year, 12, 8),  # Inmaculada concepción
        date(year, 12, 25), # Navidad
    }

    movable = {
        easter - timedelta(days=2),  # Viernes santo
        easter - timedelta(days=1),  # Sábado santo
        _nearest_monday(date(year, 6, 29)),  # San Pedro y San Pablo
        _nearest_monday(date(year, 10, 12)), # Encuentro de dos mundos
    }

    # Fiestas patrias extension rules commonly used in Chile.
    # If 18-Sep is Tuesday => 17-Sep holiday; if 18-Sep is Thursday => 20-Sep holiday.
    if date(year, 9, 18).weekday() == 1:
        movable.add(date(year, 9, 17))
    if date(year, 9, 18).weekday() == 3:
        movable.add(date(year, 9, 20))

    return fixed | movable


def is_chilean_holiday(value: date) -> bool:
    return value in get_chile_holidays_for_year(value.year)
