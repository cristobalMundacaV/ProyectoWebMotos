import api from "./api";

const SESSION_KEY = "dm_analytics_session_id";

function buildSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getAnalyticsSessionId() {
  try {
    const current = window.localStorage.getItem(SESSION_KEY);
    if (current) return current;
    const next = buildSessionId();
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch (_error) {
    return buildSessionId();
  }
}

export async function trackCatalogView({
  tipoEntidad,
  entidadId,
  entidadSlug,
  entidadNombre,
  tipoEvento = "view_detail",
  origen = "",
  metadata = {},
}) {
  try {
    await api.post("/analitica/catalogo/eventos/", {
      tipo_evento: tipoEvento,
      tipo_entidad: tipoEntidad,
      entidad_id: entidadId ?? null,
      entidad_slug: entidadSlug || "",
      entidad_nombre: entidadNombre || "",
      session_id: getAnalyticsSessionId(),
      origen: origen || window.location.pathname,
      metadata,
    });
  } catch (_error) {
    // No bloquea la experiencia de usuario por errores de tracking.
  }
}
