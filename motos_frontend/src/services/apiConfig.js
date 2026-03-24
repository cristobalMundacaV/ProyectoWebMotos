export const API_BASE_URL = "/api";

export function buildFallbackImageDataUrl({ width = 600, height = 600, text = "Sin Imagen" } = {}) {
  // Mantiene la firma para compatibilidad, pero devolvemos un recurso local
  // para evitar bloqueos CSP con data URLs en produccion.
  void width;
  void height;
  void text;
  return "/images/sin-imagen.svg";
}

function isIpHost(host = "") {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(String(host));
}

function buildCurrentOriginUrl(urlObj, fallbackRaw) {
  if (typeof window === "undefined") return fallbackRaw;
  return `${window.location.origin}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
}

export function buildMediaUrl(path) {
  if (!path) return "";

  const raw = String(path).trim();
  const isBrowser = typeof window !== "undefined";
  const isHttpsPage = isBrowser && window.location.protocol === "https:";

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsedRaw = new URL(raw);

      // Evita mixed content (http en pagina https)
      if (isHttpsPage && parsedRaw.protocol === "http:") {
        return buildCurrentOriginUrl(parsedRaw, raw);
      }

      // Evita errores de certificado por dominio/IP en HTTPS
      if (isHttpsPage && isIpHost(parsedRaw.hostname)) {
        return buildCurrentOriginUrl(parsedRaw, raw);
      }
    } catch {
      // Si no parsea, dejamos la URL como viene
    }

    return raw;
  }

  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;

  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (/^https?:\/\//i.test(apiUrl)) {
    try {
      const parsedApiUrl = new URL(apiUrl);

      // En HTTPS evitamos origen inseguro (http) o por IP
      if (isHttpsPage && (parsedApiUrl.protocol === "http:" || isIpHost(parsedApiUrl.hostname))) {
        return normalizedPath;
      }

      return `${parsedApiUrl.origin}${normalizedPath}`;
    } catch {
      // fallback a ruta relativa si VITE_API_URL es invalida
    }
  }

  return normalizedPath;
}
