import api from "../../../services/api";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function getMantencionesAdmin() {
  const response = await api.get("/api/mantenciones/");
  return normalizeList(response.data);
}

export async function updateMantencionAdmin(id, payload) {
  const response = await api.patch(`/api/mantenciones/${id}/`, payload);
  return response.data;
}
