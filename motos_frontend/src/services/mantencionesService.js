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

async function getWithFallback(primaryUrl, fallbackUrl) {
  try {
    return await api.get(primaryUrl);
  } catch (error) {
    if (error?.response?.status !== 404 || !fallbackUrl) {
      throw error;
    }
    return api.get(fallbackUrl);
  }
}

export async function agendarMantencion(payload) {
  const response = await postWithFallback("/mantenciones/agendar/", "/mantenciones/agendar/", payload);
  return response.data;
}

export async function getDisponibilidadMantenciones(days = 21) {
  const response = await getWithFallback(
    `/mantenciones/disponibilidad/?days=${days}`,
    `/mantenciones/disponibilidad/?days=${days}`
  );
  return response.data;
}

export async function consultarMantencionesPorRut(rut) {
  const encodedRut = encodeURIComponent(rut);
  const response = await getWithFallback(
    `/mantenciones/consulta/?rut=${encodedRut}`,
    `/mantenciones/consulta/?rut=${encodedRut}`
  );
  return response.data;
}

export async function cancelarMantencionPorRut(mantencionId, rut) {
  const response = await postWithFallback(
    `/mantenciones/consulta/${mantencionId}/cancelar/`,
    `/mantenciones/consulta/${mantencionId}/cancelar/`,
    { rut }
  );
  return response.data;
}
