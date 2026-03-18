import api from "./api";

/** Retorna el listado completo de motos desde el backend */
export async function getMotos() {
  const res = await api.get("/api/motos/");
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export async function getMotoAdminMeta() {
  const res = await api.get("/api/motos/meta/");
  const payload = res.data || {};
  const modelosRaw = Array.isArray(payload.modelos) ? payload.modelos : [];
  const modelos = modelosRaw.map((item) => ({
    ...item,
    marca_nombre: item.marca_nombre || item["marca__nombre"] || "",
  }));

  return {
    ...payload,
    modelos,
  };
}

export async function createMoto(payload) {
  const res = await api.post("/api/motos/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateMoto(id, payload) {
  const res = await api.patch(`/api/motos/${id}/`, payload);
  return res.data;
}

export async function deleteMoto(id) {
  await api.delete(`/api/motos/${id}/`);
}

export async function getCategoriasMoto() {
  const res = await api.get("/api/motos/categorias/");
  return res.data;
}

export async function createCategoriaMoto(payload) {
  const res = await api.post("/api/motos/categorias/", payload);
  return res.data;
}

export async function updateCategoriaMoto(id, payload) {
  const res = await api.patch(`/api/motos/categorias/${id}/`, payload);
  return res.data;
}

export async function deleteCategoriaMoto(id) {
  await api.delete(`/api/motos/categorias/${id}/`);
}

export async function getMarcasAdmin({ tipo } = {}) {
  const params = {};
  if (tipo) params.tipo = tipo;

  const res = await api.get("/api/motos/marcas/", { params });
  return res.data;
}

export async function createMarca(payload, { tipo } = {}) {
  const params = {};
  if (tipo) params.tipo = tipo;

  const res = await api.post("/api/motos/marcas/", payload, { params });
  return res.data;
}

export async function updateMarca(id, payload) {
  const res = await api.patch(`/api/motos/marcas/${id}/`, payload);
  return res.data;
}

export async function deleteMarca(id) {
  await api.delete(`/api/motos/marcas/${id}/`);
}

export async function getModelosMoto() {
  const res = await api.get("/api/motos/modelos/");
  return res.data;
}

export async function createModeloMoto(payload) {
  const res = await api.post("/api/motos/modelos/", payload);
  return res.data;
}

export async function updateModeloMoto(id, payload) {
  const res = await api.patch(`/api/motos/modelos/${id}/`, payload);
  return res.data;
}

export async function deleteModeloMoto(id) {
  await api.delete(`/api/motos/modelos/${id}/`);
}

/**
 * Retorna una moto por slug.
 * El backend no expone endpoint de detalle individual,
 * por lo que se busca localmente dentro del listado completo.
 */
export async function getMotoBySlug(slug) {
  const motos = await getMotos();
  const listado = Array.isArray(motos) ? motos : [];
  return listado.find((m) => m.slug === slug) || null;
}
