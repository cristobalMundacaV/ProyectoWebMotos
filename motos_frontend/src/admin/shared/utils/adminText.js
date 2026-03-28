export function buildSlug(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function limitSlug(value, maxLength = 50) {
  if (!value) return "";
  const safe = String(value).slice(0, maxLength);
  return safe.replace(/(^-|-$)+/g, "");
}

export function normalizeUppercaseLabel(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

export function normalizeTitleCaseForInput(value) {
  const raw = String(value || "").replace(/\t/g, " ");
  return raw
    .split(/(\s+)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part)) return part;
      if (/^[A-Z0-9-]+$/.test(part) && /[A-Z]/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

export function normalizeTitleCaseLabel(value) {
  return normalizeTitleCaseForInput(value)
    .trim()
    .replace(/\s+/g, " ");
}

export function normalizeCategoryLabel(value) {
  return normalizeTitleCaseLabel(value);
}

export function normalizeCompareLabel(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function forceBrandTokenInName(value, brandName) {
  const normalized = normalizeTitleCaseForInput(value);
  const normalizedBrand = normalizeUppercaseLabel(brandName);
  if (!normalizedBrand) return normalized;

  return normalized
    .split(/(\s+)/)
    .map((part) => (normalizeCompareLabel(part) === normalizeCompareLabel(normalizedBrand) ? normalizedBrand : part))
    .join("");
}

export function normalizeAdminUsersResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function translateBackendMessage(message) {
  if (!message) return "";
  const text = String(message).trim();
  const normalized = text.toLowerCase();
  const maxLengthMatch = normalized.match(/ensure this field has no more than (\d+) characters/);

  if (normalized.includes("this field is required")) return "Este campo es obligatorio.";
  if (maxLengthMatch) return `Este campo no puede superar ${maxLengthMatch[1]} caracteres.`;
  if (normalized.includes("already exists")) return "Ya existe un registro con ese valor.";
  if (normalized.includes("slug")) return "El slug ya existe. Cambia el nombre para generar uno diferente.";
  if (normalized.includes("not found")) return "No se encontro el recurso solicitado.";
  if (normalized.includes("invalid")) return "El dato ingresado no es valido.";
  if (normalized.includes("must be a number")) return "Debe ingresar un numero valido.";
  if (normalized.includes("permission denied")) return "No tienes permisos para realizar esta accion.";
  if (normalized.includes("authentication credentials were not provided")) return "Debes iniciar sesion para continuar.";

  return text;
}

