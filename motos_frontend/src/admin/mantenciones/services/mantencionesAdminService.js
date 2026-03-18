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
  const response = await requestWithFallback("get", "/api/mantenciones/", "/mantenciones/");
  return normalizeList(response.data);
}

export async function updateMantencionAdmin(id, payload) {
  const response = await requestWithFallback(
    "patch",
    `/api/mantenciones/${id}/`,
    `/mantenciones/${id}/`,
    payload
  );
  return response.data;
}
