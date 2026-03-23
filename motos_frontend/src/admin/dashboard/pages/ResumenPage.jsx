import { useEffect, useMemo, useState } from "react";
import KpiCard from "../components/KpiCard";
import GaugeKpiCard from "../components/GaugeKpiCard";
import BarChartCard from "../components/BarChartCard";
import LineChartCard from "../components/LineChartCard";
import { fetchDashboardAnalytics } from "../services/dashboardService";

const PERIOD_OPTIONS = [
  { value: "today", label: "Hoy" },
  { value: "this_week", label: "Esta semana" },
  { value: "this_month", label: "Este mes" },
  { value: "last_3_months", label: "Ultimos 3 meses" },
  { value: "last_6_months", label: "Ultimos 6 meses" },
  { value: "last_9_months", label: "Ultimos 9 meses" },
  { value: "last_year", label: "Ultimo ano" },
  { value: "all", label: "Todos" },
];

const WINDOW_BY_GROUP = {
  day: 30,
  week: 8,
  month: 12,
};

function applyWindow(points = [], groupBy = "day") {
  const size = WINDOW_BY_GROUP[groupBy] || points.length;
  if (points.length <= size) return points;
  return points.slice(-size);
}

function smartStart(points = [], { trimLeadingZeros = true, keepContext = true, minVisible = 8 } = {}) {
  if (!trimLeadingZeros || points.length === 0) return points;
  const firstWithData = points.findIndex((item) => Number(item.value || 0) > 0);
  const safeMinVisible = Math.min(points.length, Math.max(3, minVisible));
  if (firstWithData === -1) return points.slice(-safeMinVisible);
  if (firstWithData <= 0) return points.slice(-safeMinVisible);
  const startIndex = keepContext ? Math.max(firstWithData - 1, 0) : firstWithData;
  const startByWindow = Math.max(points.length - safeMinVisible, 0);
  return points.slice(Math.min(startIndex, startByWindow));
}

function monthNameFromIso(iso) {
  const value = String(iso || "");
  const year = value.slice(0, 4);
  const month = value.slice(5, 7);
  const map = {
    "01": "Enero",
    "02": "Febrero",
    "03": "Marzo",
    "04": "Abril",
    "05": "Mayo",
    "06": "Junio",
    "07": "Julio",
    "08": "Agosto",
    "09": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre",
  };
  return `${map[month] || "Mes"} ${year || ""}`.trim();
}

function formatShortDate(iso) {
  const value = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(value.getTime())) return iso || "-";
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function getPeriodSubtitle(period, range) {
  const start = range?.start || "";
  const end = range?.end || "";

  if (!start || !end) return "Periodo seleccionado";
  if (period === "today") return `Hoy, ${formatShortDate(start)}`;
  if (period === "this_week") return `Semana actual: ${formatShortDate(start)} a ${formatShortDate(end)}`;
  if (period === "this_month") return `En ${monthNameFromIso(start)}`;
  if (period === "all") return `Todo el historial desde ${formatShortDate(start)}`;
  return `${formatShortDate(start)} a ${formatShortDate(end)}`;
}

function formatMantenciones(value) {
  const total = Number(value || 0);
  if (total === 1) return "1 mantencion";
  return `${total} mantenciones`;
}

export default function ResumenPage() {
  const [period, setPeriod] = useState("this_month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchDashboardAnalytics({ period });
        if (!active) return;
        if (data?.__legacy) {
          setError("");
        }
        setSummary(data);
      } catch (_error) {
        if (!active) return;
        setError("No se pudieron cargar las metricas del dashboard.");
        setSummary(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [period]);

  const kpis = summary?.kpis || {};
  const range = summary?.range || {};
  const periodSubtitle = getPeriodSubtitle(period, range);

  const topMotos = useMemo(
    () => (summary?.top_modelos_moto || []).map((item) => ({ label: item.modelo, value: item.total })),
    [summary?.top_modelos_moto]
  );

  const categoriasMoto = useMemo(
    () =>
      (summary?.categorias_moto || []).map((item) => ({
        label: item.categoria,
        value: item.total,
        percent: item.share_pct,
        trend: item.trend_direction,
        meta: item.trend_pct !== null && item.trend_pct !== undefined
          ? `${item.trend_pct >= 0 ? "+" : ""}${item.trend_pct}% vs periodo anterior`
          : "Nuevo periodo activo",
      })),
    [summary?.categorias_moto]
  );

  const visitasTrend = useMemo(
    () => {
      const raw = (summary?.visitas_trend?.points || []).map((item) => ({
        label: item.label,
        value: item.total,
        variationPct: item.variation_pct,
      }));
      const grouped = summary?.visitas_trend?.group_by || "day";
      const windowed = period === "all" ? raw : applyWindow(raw, grouped);
      return smartStart(windowed, { trimLeadingZeros: true, keepContext: true });
    },
    [period, summary?.visitas_trend?.points, summary?.visitas_trend?.group_by]
  );

  const horasPeak = useMemo(
    () =>
      (summary?.horas_peak || []).map((item) => ({
        label: item.hora,
        value: item.total_reservas,
        percent: item.ocupacion_pct,
        critical: item.is_critical,
        meta: `${item.total_reservas} reservas | ${item.ocupacion_pct}% ocupacion`,
      })),
    [summary?.horas_peak]
  );

  const servicios = useMemo(
    () =>
      (summary?.servicios || []).map((item) => ({
        label: item.tipo_mantencion,
        value: item.total,
      })),
    [summary?.servicios]
  );

  const reservasMensuales = useMemo(
    () => {
      const raw = (summary?.reservas_mensuales || []).map((item) => ({
        label: item.label,
        value: item.total_reservas,
        variationPct: item.growth_pct,
      }));
      const windowed = applyWindow(raw, "month");
      return smartStart(windowed, { trimLeadingZeros: true, keepContext: true });
    },
    [summary?.reservas_mensuales]
  );

  return (
    <div className="admin-dashboard-stack admin-analytics-dashboard">
      <section className="admin-hero-card">
        <div>
          <h1>Bienvenido al dashboard</h1>
        </div>
      </section>

      <section className="admin-panel-card admin-analytics-filter-card">
        <div className="admin-analytics-filters">
          <label>
            Periodo global
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error ? <section className="admin-panel-card"><p className="admin-empty">{error}</p></section> : null}

      <section className="admin-analytics-kpi-grid admin-analytics-kpi-grid-main">
        <KpiCard
          title="Mantenciones agendadas"
          value={formatMantenciones(kpis.total_mantenciones)}
          subtitle={periodSubtitle}
          supportText={`${kpis.total_mantenciones ?? 0} reservas en el periodo`}
          loading={loading}
          truncateValue
        />
        <KpiCard
          title="Crecimiento vs periodo anterior"
          value={kpis.growth_label === "nuevo_periodo_activo" ? "Nuevo periodo activo" : `${kpis.growth_pct ?? 0}%`}
          subtitle="Comparacion del mismo largo temporal"
          trend={kpis.growth_label === "nuevo_periodo_activo" ? null : Number(kpis.growth_pct ?? 0)}
          valueBadge
          supportText={`Rango previo: ${summary?.previous_range?.start || "-"} a ${summary?.previous_range?.end || "-"}`}
          loading={loading}
        />
        <GaugeKpiCard
          title="Ocupacion del taller"
          value={kpis.ocupacion_pct ?? 0}
          subtitle="Horas reservadas vs capacidad disponible"
          supportText={`${kpis.horas_reservadas ?? 0}/${kpis.horas_disponibles ?? 0} horas (${kpis.horas_restantes ?? 0} restantes)`}
          loading={loading}
        />
        <KpiCard
          title="Modelo mas visto del periodo"
          value={kpis.modelo_mas_visto?.entidad_nombre || "Sin datos"}
          subtitle={`${kpis.modelo_mas_visto?.total || 0} visitas`}
          supportText={`${kpis.total_visitas_catalogo ?? 0} visitas totales del catalogo`}
          loading={loading}
          truncateValue
        />
      </section>

      <section className="admin-analytics-grid two-cols admin-analytics-row">
        <BarChartCard
          title="Top 5 modelos de moto mas vistos"
          subtitle="Ranking de interes del periodo"
          items={topMotos}
          loading={loading}
        />
        <BarChartCard
          title="Categorias de motos mas vistas"
          subtitle="Participacion sobre visitas de motos"
          items={categoriasMoto}
          horizontal
          loading={loading}
        />
      </section>

      <section className="admin-analytics-grid admin-analytics-row">
        <LineChartCard
          title="Tendencia de visitas"
          subtitle="Serie temporal continua segun periodo seleccionado"
          items={visitasTrend}
          averageValue={
            visitasTrend.length
              ? visitasTrend.reduce((sum, item) => sum + Number(item.value || 0), 0) / visitasTrend.length
              : 0
          }
          loading={loading}
        />
      </section>

      <section className="admin-analytics-grid two-cols admin-analytics-row">
        <BarChartCard
          title="Horas peak del taller"
          subtitle="Ranking por demanda y ocupacion"
          items={horasPeak}
          horizontal
          loading={loading}
        />
        <BarChartCard
          title="Tipo de servicio mas solicitado"
          subtitle="Distribucion de reservas por servicio"
          items={servicios}
          horizontal
          loading={loading}
        />
      </section>

      <section className="admin-analytics-kpi-grid compact admin-analytics-row">
        <KpiCard
          title="Tasa de cancelaciones"
          value={`${kpis.cancelaciones_pct ?? 0}%`}
          subtitle="Sobre reservas del periodo"
          supportText="Indicador de desercion"
          loading={loading}
        />
        <KpiCard
          title="Tasa de no asistencia"
          value={`${kpis.no_asistencia_pct ?? 0}%`}
          subtitle="Sobre reservas del periodo"
          supportText="Impacto operativo en agenda"
          loading={loading}
        />
        <KpiCard
          title="Clientes recurrentes"
          value={kpis.clientes_recurrentes ?? 0}
          subtitle={`${kpis.clientes_recurrentes ?? 0} de ${kpis.clientes_total_unicos ?? 0} clientes unicos`}
          supportText="Con historial previo a este periodo"
          loading={loading}
        />
        <KpiCard
          title="Clientes nuevos"
          value={kpis.clientes_nuevos ?? 0}
          subtitle={`${kpis.clientes_nuevos ?? 0} de ${kpis.clientes_total_unicos ?? 0} clientes unicos`}
          supportText="Primera reserva en el periodo"
          loading={loading}
        />
      </section>

      <section className="admin-analytics-grid admin-analytics-row">
        <LineChartCard
          title="Crecimiento mensual de reservas"
          subtitle="Serie mensual con comportamiento de crecimiento"
          items={reservasMensuales}
          averageValue={
            reservasMensuales.length
              ? reservasMensuales.reduce((sum, item) => sum + Number(item.value || 0), 0) /
                reservasMensuales.length
              : 0
          }
          loading={loading}
        />
      </section>
    </div>
  );
}
