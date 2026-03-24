export const API_BASE_URL = "/api";

export function buildFallbackImageDataUrl({ width = 600, height = 600, text = "Sin Imagen" } = {}) {
  const safeWidth = Number(width) || 600;
  const safeHeight = Number(height) || 600;
  const safeText = String(text || "Sin Imagen");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}">
      <rect width="100%" height="100%" fill="#efefef"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="28">
        ${safeText}
      </text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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
