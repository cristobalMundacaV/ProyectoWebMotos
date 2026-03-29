import { ESTADO_OPTIONS } from "../constants/mantencionesUiConstants";

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-CL");
}

export function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusLabel(value) {
  const option = ESTADO_OPTIONS.find((item) => item.value === value);
  if (value === "solicitud") return "Solicitud";
  if (value === "aprobado") return "Aprobado";
  if (option?.label) return option.label;
  if (!value) return "-";
  const clean = String(value).replace(/[_-]+/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function getStatusPillClass(value) {
  if (value === "solicitud") return "status-ingresada";
  if (value === "aprobado") return "status-aceptada";
  if (value === "en_proceso") return "status-en-revision";
  if (value === "en_espera") return "status-esperando-repuestos";
  if (value === "finalizado") return "status-finalizada";
  if (value === "entregada") return "status-entregada";
  if (value === "cancelado") return "status-cancelada";
  if (value === "inasistencia" || value === "no_aceptado") return "status-no-asistio";
  return "";
}

export function formatReason(value) {
  if (!value) return "-";
  const clean = String(value).replace(/_/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function toWholeNumber(value) {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed)) return 0;
  return Math.trunc(parsed);
}

export function sanitizeIntegerInput(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}

export function sanitizeRutInput(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^0-9K.-]/g, "");
}

export function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export function formatIntegerCL(value) {
  const clean = String(value ?? "").replace(/[^\d]/g, "");
  if (!clean) return "";
  const parsed = Number.parseInt(clean, 10);
  if (!Number.isFinite(parsed)) return "";
  return parsed.toLocaleString("es-CL", { maximumFractionDigits: 0 });
}

export function parseDateTimestamp(value) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) return parsed;

  const match = String(value).match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (!match) return 0;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

export function formatLongDate(value, options = {}) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function getMantencionSortTimestamp(item) {
  const fechaTs = parseDateTimestamp(item?.fecha_ingreso);
  const horaRaw = item?.hora_ingreso ? String(item.hora_ingreso).slice(0, 5) : "";
  if (!horaRaw || !Number.isFinite(fechaTs)) return fechaTs || 0;
  const [hours, minutes] = horaRaw.split(":").map((part) => Number(part));
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return fechaTs || 0;
  return fechaTs + (hours * 60 + minutes) * 60 * 1000;
}

export function extractErrorMessage(error, fallback = "No se pudo procesar la solicitud.") {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();
  return fallback;
}

export function formatCuposLabel(value) {
  const total = Number.parseInt(String(value ?? "0"), 10);
  const safe = Number.isFinite(total) ? total : 0;
  return `${safe} ${safe === 1 ? "cupo" : "cupos"}`;
}

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function nearestMonday(date) {
  const weekday = (date.getDay() + 6) % 7;
  const previousMonday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday);
  const nextMonday = new Date(previousMonday.getFullYear(), previousMonday.getMonth(), previousMonday.getDate() + 7);
  const diffPrev = Math.abs(date.getTime() - previousMonday.getTime());
  const diffNext = Math.abs(nextMonday.getTime() - date.getTime());
  return diffPrev <= diffNext ? previousMonday : nextMonday;
}

export function isChileanHolidayDate(dateObj) {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return false;
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const easter = easterSunday(year);
  const easterMinusTwo = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() - 2);
  const easterMinusOne = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() - 1);
  const sanPedro = nearestMonday(new Date(year, 5, 29));
  const encuentro = nearestMonday(new Date(year, 9, 12));

  const fixed = new Set([
    `${year}-01-01`,
    `${year}-05-01`,
    `${year}-05-21`,
    `${year}-06-21`,
    `${year}-07-16`,
    `${year}-08-15`,
    `${year}-09-18`,
    `${year}-09-19`,
    `${year}-10-31`,
    `${year}-11-01`,
    `${year}-12-08`,
    `${year}-12-25`,
    toIsoDate(easterMinusTwo),
    toIsoDate(easterMinusOne),
    toIsoDate(sanPedro),
    toIsoDate(encuentro),
  ]);

  const sep18 = new Date(year, 8, 18);
  if (sep18.getDay() === 2) fixed.add(`${year}-09-17`);
  if (sep18.getDay() === 4) fixed.add(`${year}-09-20`);

  return fixed.has(key);
}

export function getCreatedAtTimestamp(item) {
  if (!item?.created_at) return 0;
  const parsed = Date.parse(item.created_at);
  return Number.isFinite(parsed) ? parsed : 0;
}
