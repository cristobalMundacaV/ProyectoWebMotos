const MOTORCYCLE_PLATE_REGEX = /^[BCDFGHJKLMNPRSTVWXYZ]{3}\d{2}$/;

export function normalizePatenteMotoChile(value) {
  const cleaned = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return cleaned.slice(0, 5);
}

export function isValidPatenteMotoChile(value) {
  const normalized = normalizePatenteMotoChile(value);
  return MOTORCYCLE_PLATE_REGEX.test(normalized);
}
