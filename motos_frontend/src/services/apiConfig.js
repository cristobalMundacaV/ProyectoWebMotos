const DEFAULT_API_URL = "http://127.0.0.1:8000/api";

function normalizeUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

const runtimeDefaultApiUrl =
  typeof window !== "undefined" && window.location?.origin
    ? `${window.location.origin}/api`
    : DEFAULT_API_URL;

const configuredApiUrl = normalizeUrl(import.meta.env.VITE_API_URL || runtimeDefaultApiUrl);

export const API_BASE_URL = configuredApiUrl.replace(/\/api$/, "");

export function buildMediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = String(path).startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
