import { getMotoAdminMeta, getMotos, getCategoriasMoto, getMarcasAdmin, getModelosMoto } from "../../motos/services/motosAdminService";
import api from "../../../services/api";
import {
  getAccesoriosMotosAdmin,
  getAccesoriosMotosMeta,
  getAccesoriosRiderAdmin,
  getAccesoriosRiderMeta,
  getCategoriasAccesoriosMotosAdmin,
  getCategoriasAccesoriosRiderAdmin,
  getCategoriasProducto,
  getProductos,
} from "../../productos/services/productosAdminService";
import { getContactoAdmin } from "../../configuracion/services/configuracionAdminService";

export async function fetchAdminBootstrapData() {
  const [
    motos,
    productosIndumentaria,
    productosAccesorios,
    categoriasIndumentaria,
    categoriasAccesorios,
    metaMotos,
    marcasMotosList,
    marcasAccMotosList,
    marcasAccRiderList,
    modelosMotoList,
    categoriasMotoList,
    categoriasAccMotosData,
    categoriasAccRiderData,
    accesoriosMotosList,
    accesoriosMotosMetaData,
    accesoriosRiderList,
    accesoriosRiderMetaData,
    contactoAdmin,
  ] = await Promise.all([
    getMotos().catch(() => []),
    getProductos({ tipo: "indumentaria" }).catch(() => []),
    getProductos({ tipo: "accesorios" }).catch(() => []),
    getCategoriasProducto({ tipo: "indumentaria" }).catch(() => []),
    getCategoriasProducto({ tipo: "accesorios" }).catch(() => []),
    getMotoAdminMeta().catch(() => ({ marcas: [], categorias: [], modelos: [] })),
    getMarcasAdmin({ tipo: "moto" }).catch(() => []),
    getMarcasAdmin({ tipo: "accesorio_moto" }).catch(() => []),
    getMarcasAdmin({ tipo: "accesorio_rider" }).catch(() => []),
    getModelosMoto().catch(() => []),
    getCategoriasMoto().catch(() => []),
    getCategoriasAccesoriosMotosAdmin().catch(() => ({ categorias_padre: [], subcategorias: [] })),
    getCategoriasAccesoriosRiderAdmin().catch(() => ({ categorias_padre: [], subcategorias: [] })),
    getAccesoriosMotosAdmin().catch(() => []),
    getAccesoriosMotosMeta().catch(() => ({ subcategorias: [], marcas: [], motos: [] })),
    getAccesoriosRiderAdmin().catch(() => []),
    getAccesoriosRiderMeta().catch(() => ({ subcategorias: [], marcas: [] })),
    getContactoAdmin().catch(() => ({ instagram: "", telefono: "", ubicacion: "" })),
  ]);

  return {
    motos,
    productosIndumentaria,
    productosAccesorios,
    categoriasIndumentaria,
    categoriasAccesorios,
    metaMotos,
    marcasMotosList,
    marcasAccMotosList,
    marcasAccRiderList,
    modelosMotoList,
    categoriasMotoList,
    categoriasAccMotosData,
    categoriasAccRiderData,
    accesoriosMotosList,
    accesoriosMotosMetaData,
    accesoriosRiderList,
    accesoriosRiderMetaData,
    contactoAdmin,
  };
}

export async function fetchCatalogoAnalytics({ start, end, groupBy } = {}) {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  if (groupBy) params.group_by = groupBy;
  const response = await api.get("/api/analitica/dashboard/catalogo/", { params });
  return response.data;
}

export async function fetchMantencionesAnalytics({ year, month } = {}) {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  const response = await api.get("/api/analitica/dashboard/mantenciones/", { params });
  return response.data;
}

export async function fetchDashboardSummary({ period = "this_month" } = {}) {
  const response = await api.get("/api/analitica/dashboard-summary/", {
    params: { period },
  });
  return response.data;
}

export async function fetchDashboardAnalytics({ period = "this_month", year, month, start, end, groupBy } = {}) {
  try {
    return await fetchDashboardSummary({ period });
  } catch (_error) {
    // Fallback defensivo al esquema anterior.
    const [catalogo, mantenciones] = await Promise.all([
      fetchCatalogoAnalytics({ start, end, groupBy }),
      fetchMantencionesAnalytics({ year, month }),
    ]);
    return { catalogo, mantenciones, __legacy: true };
  }
}
