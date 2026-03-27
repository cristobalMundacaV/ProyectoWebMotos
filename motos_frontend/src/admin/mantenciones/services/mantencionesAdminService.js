import api from "../../../services/api";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

async function requestWithFallback(method, primaryUrl, fallbackUrl, payload) {
  try {
    return await api.request({ method, url: primaryUrl, data: payload });
  } catch (error) {
    if (error?.response?.status !== 404 || !fallbackUrl) {
      throw error;
    }
    return api.request({ method, url: fallbackUrl, data: payload });
  }
}

export async function getMantencionesAdmin() {
  const response = await requestWithFallback("get", "/mantenciones/", "/mantenciones/");
  return normalizeList(response.data);
}

export async function updateMantencionAdmin(id, payload) {
  const response = await requestWithFallback(
    "patch",
    `/mantenciones/${id}/`,
    `/mantenciones/${id}/`,
    payload
  );
  return response.data;
}

export async function getHorariosMantencionAdmin() {
  const response = await requestWithFallback("get", "/mantenciones/horarios/", "/mantenciones/horarios/");
  return normalizeList(response.data);
}

export async function createHorarioMantencionAdmin(payload) {
  const response = await requestWithFallback("post", "/mantenciones/horarios/", "/mantenciones/horarios/", payload);
  return response.data;
}

export async function updateHorarioMantencionAdmin(id, payload) {
  const response = await requestWithFallback(
    "patch",
    `/mantenciones/horarios/${id}/`,
    `/mantenciones/horarios/${id}/`,
    payload
  );
  return response.data;
}

export async function deleteHorarioMantencionAdmin(id) {
  await requestWithFallback("delete", `/mantenciones/horarios/${id}/`, `/mantenciones/horarios/${id}/`);
}

export async function bloquearDiaCalendarioMantencion(payload) {
  const response = await requestWithFallback(
    "post",
    "/mantenciones/disponibilidad/bloquear-dia/",
    "/mantenciones/disponibilidad/bloquear-dia/",
    payload
  );
  return response.data;
}
