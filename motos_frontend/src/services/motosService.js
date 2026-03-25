import api from "./api";

/** Retorna el listado completo de motos desde el backend */
export async function getMotos() {
  const res = await api.get("/motos/");
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export async function getMotoAdminMeta() {
  const res = await api.get("/motos/meta/");
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
  const res = await api.post("/motos/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateMoto(id, payload) {
  const res = await api.patch(`/motos/${id}/`, payload);
  return res.data;
}

export async function deleteMoto(id) {
  await api.delete(`/motos/${id}/`);
}

export async function getCategoriasMoto() {
  const res = await api.get("/motos/categorias/");
  return res.data;
}

export async function createCategoriaMoto(payload) {
  const res = await api.post("/motos/categorias/", payload);
  return res.data;
}

export async function updateCategoriaMoto(id, payload) {
  const res = await api.patch(`/motos/categorias/${id}/`, payload);
  return res.data;
}

export async function deleteCategoriaMoto(id) {
  await api.delete(`/motos/categorias/${id}/`);
}

export async function getMarcasAdmin({ tipo } = {}) {
  const params = {};
  if (tipo) params.tipo = tipo;

  const res = await api.get("/motos/marcas/", { params });
  return res.data;
}

export async function createMarca(payload, { tipo } = {}) {
  const params = {};
  if (tipo) params.tipo = tipo;

  const res = await api.post("/motos/marcas/", payload, { params });
  return res.data;
}

export async function updateMarca(id, payload) {
  const res = await api.patch(`/motos/marcas/${id}/`, payload);
  return res.data;
}

export async function deleteMarca(id) {
  await api.delete(`/motos/marcas/${id}/`);
}

export async function getModelosMoto() {
  const res = await api.get("/motos/modelos/");
  return res.data;
}

export async function createModeloMoto(payload) {
  const res = await api.post("/motos/modelos/", payload);
  return res.data;
}

export async function updateModeloMoto(id, payload) {
  const normalizedPayload = { ...(payload || {}) };
  if (normalizedPayload.nombre && !normalizedPayload.nombre_modelo) {
    normalizedPayload.nombre_modelo = normalizedPayload.nombre;
  }
  const res = await api.patch(`/motos/modelos/${id}/`, normalizedPayload);
  return res.data;
}

export async function deleteModeloMoto(id) {
  await api.delete(`/motos/modelos/${id}/`);
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

export async function getMotoFichaTecnica(id) {
  const res = await api.get(`/motos/${id}/ficha/`);
  return res.data || null;
}

export async function getTiposAtributo({ seccion } = {}) {
  const params = {};
  if (seccion) params.seccion = seccion;
  const res = await api.get("/motos/ficha/tipos-atributo/", { params });
  return Array.isArray(res.data) ? res.data : [];
}

export async function createTipoAtributo(payload) {
  const res = await api.post("/motos/ficha/tipos-atributo/", payload);
  return res.data;
}

export async function updateTipoAtributo(id, payload) {
  const res = await api.patch(`/motos/ficha/tipos-atributo/${id}/`, payload);
  return res.data;
}

export async function deleteTipoAtributo(id) {
  await api.delete(`/motos/ficha/tipos-atributo/${id}/`);
}

export async function getValoresAtributoMoto({ moto } = {}) {
  const params = {};
  if (moto) params.moto = moto;
  const res = await api.get("/motos/ficha/valores/", { params });
  return Array.isArray(res.data) ? res.data : [];
}

export async function createValorAtributoMoto(payload) {
  const res = await api.post("/motos/ficha/valores/", payload);
  return res.data;
}

export async function updateValorAtributoMoto(id, payload) {
  const res = await api.patch(`/motos/ficha/valores/${id}/`, payload);
  return res.data;
}

export async function deleteValorAtributoMoto(id) {
  await api.delete(`/motos/ficha/valores/${id}/`);
}
