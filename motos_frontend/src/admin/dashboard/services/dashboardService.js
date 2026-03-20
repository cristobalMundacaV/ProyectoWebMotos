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

function toIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

function firstDayOfMonth(value) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function addMonths(value, months) {
  return new Date(value.getFullYear(), value.getMonth() + months, 1);
}

function getPeriodRange(period) {
  const now = new Date();
  if (period === "last_3_months") {
    return { start: toIsoDate(addMonths(firstDayOfMonth(now), -2)), end: toIsoDate(now), groupBy: "month" };
  }
  if (period === "last_6_months") {
    return { start: toIsoDate(addMonths(firstDayOfMonth(now), -5)), end: toIsoDate(now), groupBy: "month" };
  }
  if (period === "last_year") {
    return { start: toIsoDate(addMonths(firstDayOfMonth(now), -11)), end: toIsoDate(now), groupBy: "month" };
  }
  return { start: toIsoDate(firstDayOfMonth(now)), end: toIsoDate(now), groupBy: "day" };
}

function buildMonthlySeriesLegacy(monthlyRows = []) {
  const ordered = [...monthlyRows].sort((a, b) => `${a.year}-${a.month}`.localeCompare(`${b.year}-${b.month}`));
  let previous = null;
  return ordered.map((row, index) => {
    const total = Number(row.total_agendadas || 0);
    let growthPct = null;
    let growthLabel = "base";
    if (previous !== null && previous > 0) {
      growthPct = Number((((total - previous) / previous) * 100).toFixed(2));
      growthLabel = growthPct > 0 ? "up" : growthPct < 0 ? "down" : "flat";
    } else if (previous === 0 && total > 0) {
      growthLabel = "nuevo_periodo_activo";
    } else if (previous === 0 && total === 0) {
      growthPct = 0;
      growthLabel = "sin_actividad";
    }
    const slice = ordered.slice(Math.max(0, index - 2), index + 1);
    const movingAvg3 = slice.length ? Number((slice.reduce((sum, item) => sum + Number(item.total_agendadas || 0), 0) / slice.length).toFixed(2)) : 0;
    previous = total;
    return {
      period_start: `${row.year}-${String(row.month).padStart(2, "0")}-01`,
      label: `${row.year}-${String(row.month).padStart(2, "0")}`,
      total_reservas: total,
      growth_pct: growthPct,
      growth_label: growthLabel,
      moving_avg_3: movingAvg3,
    };
  });
}

function mapLegacyToSummary({ period, catalogo, mantenciones, range }) {
  const kpis = mantenciones?.kpis_mensuales || {};
  const trendRows = Array.isArray(catalogo?.trend) ? catalogo.trend : [];
  let prev = null;
  const trendPoints = trendRows.map((item) => {
    const total = Number(item.total || 0);
    const variation = prev !== null && prev !== 0 ? Number((((total - prev) / prev) * 100).toFixed(2)) : null;
    prev = total;
    return {
      period_start: item.period,
      label: item.period,
      total,
      variation_pct: variation,
    };
  });

  const monthlySeries = buildMonthlySeriesLegacy(mantenciones?.agendadas_ultimos_12_meses || []);
  const maxMonth = Math.max(...monthlySeries.map((item) => item.total_reservas), 0);
  monthlySeries.forEach((item) => {
    item.is_peak = maxMonth > 0 && item.total_reservas === maxMonth;
  });

  return {
    period,
    range: { start: range.start, end: range.end },
    previous_range: { start: "-", end: "-" },
    kpis: {
      total_mantenciones: Number(kpis.total_agendadas_mes || 0),
      growth_pct: kpis.crecimiento_mensual_pct,
      growth_label: kpis.crecimiento_mensual_pct === null ? "nuevo_periodo_activo" : "normal",
      ocupacion_pct: Number(kpis.ocupacion_pct || 0),
      horas_reservadas: Number(kpis.horas_reservadas_mes || 0),
      horas_disponibles: Number(kpis.horas_disponibles_mes || 0),
      capacidad_total_mensual: Number(kpis.horas_disponibles_mes || 0),
      horas_restantes: Number(kpis.horas_disponibles_restantes_mes || 0),
      cancelaciones_pct: Number(kpis.tasa_cancelacion_pct || 0),
      no_asistencia_pct: Number(kpis.tasa_no_asistencia_pct || 0),
      clientes_recurrentes: Number(mantenciones?.clientes?.recurrentes || 0),
      clientes_nuevos: Number(mantenciones?.clientes?.nuevos || 0),
      clientes_total_unicos: Number(mantenciones?.clientes?.total_unicos_mes || 0),
      modelo_mas_visto: catalogo?.most_viewed_moto || null,
      total_visitas_catalogo: Number(catalogo?.total_views || 0),
    },
    top_modelos_moto: (catalogo?.top_5_motos || []).map((item) => ({
      modelo: item.entidad_nombre || item.entidad_slug || "Sin nombre",
      total: Number(item.total || 0),
    })),
    categorias_moto: (catalogo?.visitas_por_categoria_moto || []).map((item) => ({
      categoria: item.categoria || "Sin categoria",
      total: Number(item.total || 0),
      share_pct: 0,
      trend_direction: "flat",
      trend_pct: null,
      previous_total: 0,
    })),
    visitas_trend: {
      group_by: catalogo?.group_by || range.groupBy,
      average_total: trendPoints.length ? Number((trendPoints.reduce((sum, item) => sum + item.total, 0) / trendPoints.length).toFixed(2)) : 0,
      points: trendPoints,
    },
    horas_peak: (mantenciones?.horas_peak_top_6 || []).map((item) => ({
      hora: item.hora,
      total_reservas: Number(item.total || 0),
      capacidad: 0,
      ocupacion_pct: 0,
      is_critical: false,
    })),
    servicios: (kpis?.servicios_mas_solicitados || []).map((item) => ({
      tipo_mantencion: item.tipo_mantencion,
      total: Number(item.total || 0),
    })),
    reservas_mensuales: monthlySeries,
    __legacy: true,
  };
}

export async function fetchDashboardAnalytics({ period = "this_month", year, month, start, end, groupBy } = {}) {
  try {
    return await fetchDashboardSummary({ period });
  } catch (_error) {
    // Fallback defensivo al esquema anterior.
    const range = getPeriodRange(period);
    const now = new Date();
    const [catalogo, mantenciones] = await Promise.all([
      fetchCatalogoAnalytics({
        start: start || range.start,
        end: end || range.end,
        groupBy: groupBy || range.groupBy,
      }),
      fetchMantencionesAnalytics({
        year: year || now.getFullYear(),
        month: month || now.getMonth() + 1,
      }),
    ]);
    return mapLegacyToSummary({ period, catalogo, mantenciones, range });
  }
}
