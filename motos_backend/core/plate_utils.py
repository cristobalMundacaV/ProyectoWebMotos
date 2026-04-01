import re

# Chilean motorcycle plate format: 3 consonants + 2 digits (example: TKG30).
MOTORCYCLE_PLATE_REGEX = re.compile(r"^[BCDFGHJKLMNPRSTVWXYZ]{3}\d{2}$")


def normalize_chile_motorcycle_plate(value: str) -> str:
    cleaned = "".join(ch for ch in str(value or "").upper() if ch.isalnum())
    return cleaned[:5]


def is_valid_chile_motorcycle_plate(value: str) -> bool:
    normalized = normalize_chile_motorcycle_plate(value)
    return bool(MOTORCYCLE_PLATE_REGEX.fullmatch(normalized))
