export const API_BASE_URL = "/api";

export function buildFallbackImageDataUrl({ width = 600, height = 600, text = "Sin Imagen" } = {}) {
  // Mantiene la firma para compatibilidad, pero devolvemos un recurso local
  // para evitar bloqueos CSP con data URLs en produccion.
  void width;
  void height;
  void text;
  return "/images/sin-imagen.svg";
}

export function buildMediaUrl(path) {
  if (!path) return "";

  const raw = String(path).trim();

  if (/^https?:\/\//i.test(raw)) {
    // Evita mixed content cuando el sitio corre en HTTPS y la imagen viene en HTTP.
    if (typeof window !== "undefined" && window.location.protocol === "https:" && raw.startsWith("http://")) {
      return raw.replace(/^http:\/\//i, "https://");
    }
    return raw;
  }

  const normalizedPath = String(path).startsWith("/") ? path : `/${path}`;

  // Si existe VITE_API_URL absoluto, usamos su origen para media en producción.
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (/^https?:\/\//i.test(apiUrl)) {
    try {
      const apiOrigin = new URL(apiUrl).origin;
      return `${apiOrigin}${normalizedPath}`;
    } catch {
      // fallback a ruta relativa si VITE_API_URL es inválida
    }
  }

  return normalizedPath;
}
