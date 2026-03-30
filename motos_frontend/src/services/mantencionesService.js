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

export async function getDisponibilidadMantenciones(options = 21) {
  let query = "days=21";
  if (typeof options === "number") {
    query = `days=${options}`;
  } else if (options && typeof options === "object") {
    const from = String(options.from || "").trim();
    const to = String(options.to || "").trim();
    const days = Number.parseInt(String(options.days || ""), 10);
    if (from || to) {
      const params = [];
      if (from) params.push(`from=${encodeURIComponent(from)}`);
      if (to) params.push(`to=${encodeURIComponent(to)}`);
      query = params.join("&");
    } else if (Number.isFinite(days) && days > 0) {
      query = `days=${days}`;
    }
  }

  const response = await getWithFallback(
    `/mantenciones/disponibilidad/?${query}`,
    `/mantenciones/disponibilidad/?${query}`
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

export async function consultarMisMantenciones() {
  const response = await getWithFallback(
    "/mantenciones/consulta/cliente/",
    "/mantenciones/consulta/cliente/"
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

export async function cancelarMiMantencion(mantencionId) {
  const response = await postWithFallback(
    `/mantenciones/consulta/cliente/${mantencionId}/cancelar/`,
    `/mantenciones/consulta/cliente/${mantencionId}/cancelar/`,
    {}
  );
  return response.data;
}
