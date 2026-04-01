import re


CHILE_PHONE_PREFIX = "+56"
CHILE_PHONE_DIGITS = 9


def normalize_chile_phone(raw_value, *, required=True):
    raw = str(raw_value or "").strip()
    if not raw:
        if required:
            raise ValueError("El telefono es obligatorio.")
        return ""

    digits = re.sub(r"\D", "", raw)
    if digits.startswith("56"):
        digits = digits[2:]

    if len(digits) != CHILE_PHONE_DIGITS:
        raise ValueError("El telefono debe comenzar con +56 y contener 9 digitos adicionales.")

    return f"{CHILE_PHONE_PREFIX}{digits}"
