import api from "./api";

async function postWithFallback(primaryUrl, fallbackUrl, payload) {
  try {
    return await api.post(primaryUrl, payload);
  } catch (error) {
    if (error?.response?.status !== 404 || !fallbackUrl) {
      throw error;
    }
    return api.post(fallbackUrl, payload);
  }
}

export async function agendarMantencion(payload) {
  const response = await postWithFallback("/api/mantenciones/agendar/", "/mantenciones/agendar/", payload);
  return response.data;
}
