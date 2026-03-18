import api from "./api";

export async function agendarMantencion(payload) {
  const response = await api.post("/api/mantenciones/agendar/", payload);
  return response.data;
}
