export function normalizePrecioInput(rawValue) {
  return String(rawValue || "").replace(/\D/g, "");
}

export function normalizePrecioFromApi(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") return String(Math.trunc(value));
  const text = String(value).trim();
  if (/^\d+[.,]\d{1,2}$/.test(text)) {
    const normalized = Number(text.replace(",", "."));
    if (Number.isFinite(normalized)) return String(Math.trunc(normalized));
  }
  return normalizePrecioInput(text);
}

export function formatPrecioDisplay(value) {
  if (value === null || value === undefined || value === "") return "";
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function getFileNameFromPath(pathValue) {
  const raw = String(pathValue || "").trim();
  if (!raw) return "";
  const noQuery = raw.split("?")[0];
  const lastSegment = noQuery.split("/").pop()?.split("\\").pop() || "";
  try {
    return decodeURIComponent(lastSegment);
  } catch {
    return lastSegment;
  }
}

export function resolveOptionIdByNombre(options, explicitId, explicitNombre, normalizeCompareLabel) {
  if (explicitId !== undefined && explicitId !== null && explicitId !== "") {
    return String(explicitId);
  }
  const target = normalizeCompareLabel(explicitNombre);
  if (!target) return "";
  const match = options.find((item) => normalizeCompareLabel(item.nombre) === target);
  return match ? String(match.id) : "";
}

