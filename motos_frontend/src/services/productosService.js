import api from "./api";

export async function getProductos({ tipo, motoSlug, order } = {}) {
	const params = {};
	if (tipo) params.tipo = tipo;
	if (motoSlug) params.moto = motoSlug;
	if (order) params.order = order;

	const response = await api.get("/tienda/productos/", { params });
	return response.data;
}

export async function getCategoriasProducto({ tipo } = {}) {
	const params = {};
	if (tipo) params.tipo = tipo;

	const response = await api.get("/tienda/categorias/", { params });
	return response.data;
}

export async function getMotosCompatibles({ tipo } = {}) {
	const params = {};
	if (tipo) params.tipo = tipo;

	const response = await api.get("/tienda/motos-compatibles/", { params });
	return response.data;
}

export async function getCategoriasIndumentariaAdmin() {
	const response = await api.get("/catalogo/indumentaria/categorias/");
	return response.data;
}

export async function createCategoriaIndumentaria(payload) {
	const response = await api.post("/catalogo/indumentaria/categorias/", payload);
	return response.data;
}

export async function getCategoriasAccesoriosMotosAdmin() {
	const response = await api.get("/catalogo/accesorios-moto/categorias/");
	return response.data;
}

export async function createCategoriaAccesoriosMotos(payload) {
	const response = await api.post("/catalogo/accesorios-moto/categorias/", payload);
	return response.data;
}

/**
 * Retorna un producto por slug.
 * Como no hay endpoint de detalle individual, busca en ambos listados.
 */
export async function getProductoBySlug(slug) {
	const [indumentaria, accesorios] = await Promise.all([
		getProductos({ tipo: "indumentaria" }).catch(() => []),
		getProductos({ tipo: "accesorios" }).catch(() => []),
	]);
	const all = [...(Array.isArray(indumentaria) ? indumentaria : []), ...(Array.isArray(accesorios) ? accesorios : [])];
	return all.find((item) => item.slug === slug) || null;
}

export async function updateCategoriaAccesoriosMotos(id, payload) {
	const response = await api.patch(`/catalogo/accesorios-moto/categorias/${id}/`, payload);
	return response.data;
}

export async function deleteCategoriaAccesoriosMotos(id) {
	await api.delete(`/catalogo/accesorios-moto/categorias/${id}/`);
}

export async function getCategoriasAccesoriosRiderAdmin() {
	const response = await api.get("/catalogo/accesorios-rider/categorias/");
	return response.data;
}

export async function createCategoriaAccesoriosRider(payload) {
	const response = await api.post("/catalogo/accesorios-rider/categorias/", payload);
	return response.data;
}

export async function updateCategoriaAccesoriosRider(id, payload) {
	const response = await api.patch(`/catalogo/accesorios-rider/categorias/${id}/`, payload);
	return response.data;
}

export async function deleteCategoriaAccesoriosRider(id) {
	await api.delete(`/catalogo/accesorios-rider/categorias/${id}/`);
}

export async function getAccesoriosMotosAdmin() {
	const response = await api.get("/tienda/admin/accesorios-motos/");
	return response.data;
}

export async function getAccesoriosMotosMeta() {
	const response = await api.get("/tienda/admin/accesorios-motos/meta/");
	return response.data;
}

export async function createAccesorioMoto(payload) {
	const response = await api.post("/tienda/admin/accesorios-motos/", payload, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
}

export async function getAccesoriosRiderAdmin() {
	const response = await api.get("/tienda/admin/accesorios-rider/");
	return response.data;
}

export async function getAccesoriosRiderMeta() {
	const response = await api.get("/tienda/admin/accesorios-rider/meta/");
	return response.data;
}

export async function createAccesorioRider(payload) {
	const response = await api.post("/tienda/admin/accesorios-rider/", payload, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
}

export async function updateProductoAdmin(id, payload) {
	const config = payload instanceof FormData
		? { headers: { "Content-Type": "multipart/form-data" } }
		: undefined;
	const response = await api.patch(`/tienda/admin/productos/${id}/`, payload, config);
	return response.data;
}

export async function deleteProductoAdmin(id) {
	await api.delete(`/tienda/admin/productos/${id}/`);
}

export async function getContactoPublico() {
	const response = await api.get("/tienda/contacto/");
	return response.data;
}

export async function getContactoAdmin() {
	const response = await api.get("/tienda/admin/contacto/");
	return response.data;
}

export async function updateContactoAdmin(payload) {
	const response = await api.put("/tienda/admin/contacto/", payload);
	return response.data;
}
