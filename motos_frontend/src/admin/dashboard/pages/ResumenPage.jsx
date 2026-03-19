import { useEffect, useMemo, useState } from "react";
import KpiCard from "../components/KpiCard";
import BarChartCard from "../components/BarChartCard";
import LineChartCard from "../components/LineChartCard";
import SummaryTableCard from "../components/SummaryTableCard";
import { fetchDashboardAnalytics } from "../services/dashboardService";

const TREND_OPTIONS = [
  { value: "day", label: "Dia" },
  { value: "month", label: "Mes" },
  { value: "year", label: "Anio" },
];

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function toIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

function getMonthRange(year, month) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  return {
    start: toIsoDate(first),
    end: toIsoDate(last),
  };
}

function buildYearOptions(baseYear = new Date().getFullYear()) {
  const options = [];
  for (let year = baseYear - 4; year <= baseYear + 1; year += 1) {
    options.push(year);
  }
  return options;
}

function formatGrowth(value) {
  if (value === null || value === undefined) return "N/A";
  return `${value > 0 ? "+" : ""}${value}%`;
}

export default function ResumenPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [trendGroupBy, setTrendGroupBy] = useState("day");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({
    catalogo: {},
    mantenciones: {},
  });

  useEffect(() => {
    let active = true;
    const range = getMonthRange(year, month);

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchDashboardAnalytics({
          year,
          month,
          start: range.start,
          end: range.end,
          groupBy: trendGroupBy,
        });
        if (!active) return;
        setAnalytics(data);
      } catch (_error) {
        if (!active) return;
        setError("No se pudieron cargar las metricas del dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [year, month, trendGroupBy]);

  const catalogo = analytics.catalogo || {};
  const mantenciones = analytics.mantenciones || {};
  const kpis = mantenciones.kpis_mensuales || {};

  const topMotos = useMemo(
    () => (catalogo.top_5_motos || []).map((item) => ({ label: item.entidad_nombre || item.entidad_slug || "Sin nombre", value: item.total || 0 })),
    [catalogo.top_5_motos]
  );

  const trendData = useMemo(
    () => (catalogo.trend || []).map((item) => ({ label: item.period, value: item.total })),
    [catalogo.trend]
  );

  const visitasCategoriaRows = useMemo(() => {
    const base = catalogo.visitas_por_categoria || {};
    return [
      { label: "Motos", value: base.motos || 0 },
      { label: "Indumentaria", value: base.indumentaria || 0 },
      { label: "Accesorios", value: base.accesorios || 0 },
    ];
  }, [catalogo.visitas_por_categoria]);

  const peakHours = useMemo(
    () => (mantenciones.horas_peak_top_6 || []).map((item) => ({ label: item.hora, value: item.total || 0 })),
    [mantenciones.horas_peak_top_6]
  );

  const servicios = useMemo(
    () => (kpis.servicios_mas_solicitados || []).map((item) => ({ label: item.tipo_mantencion, value: item.total || 0 })),
    [kpis.servicios_mas_solicitados]
  );

  const crecimientoMensual = useMemo(
    () =>
      (mantenciones.agendadas_ultimos_12_meses || []).map((item) => ({
        label: `${String(item.month).padStart(2, "0")}/${String(item.year).slice(-2)}`,
        value: item.total_agendadas || 0,
      })),
    [mantenciones.agendadas_ultimos_12_meses]
  );

  const clientes = mantenciones.clientes || {};
  const modelMasVisto = catalogo.most_viewed_moto?.entidad_nombre || "Sin datos";

  return (
    <div className="admin-dashboard-stack admin-analytics-dashboard">
      <section className="admin-panel-card admin-analytics-filter-card">
        <div className="admin-card-header">
          <h2>Dashboard gerencial</h2>
          <span>Analitica comercial y operacional</span>
        </div>
        <div className="admin-analytics-filters">
          <label>
            Anio
            <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {buildYearOptions().map((optionYear) => (
                <option key={optionYear} value={optionYear}>
                  {optionYear}
                </option>
              ))}
            </select>
          </label>
          <label>
            Mes
            <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
              {MONTHS.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tendencia
            <select value={trendGroupBy} onChange={(event) => setTrendGroupBy(event.target.value)}>
              {TREND_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error ? <section className="admin-panel-card"><p className="admin-empty">{error}</p></section> : null}

      <section className="admin-analytics-kpi-grid">
        <KpiCard title="Mantenciones del mes" value={kpis.total_agendadas_mes ?? 0} subtitle={`${MONTHS[month - 1]} ${year}`} loading={loading} />
        <KpiCard title="Crecimiento vs mes anterior" value={formatGrowth(kpis.crecimiento_mensual_pct)} trend={kpis.crecimiento_mensual_pct} loading={loading} />
        <KpiCard title="Ocupacion del taller" value={`${kpis.ocupacion_pct ?? 0}%`} subtitle="Horas reservadas vs disponibles" loading={loading} />
        <KpiCard title="Modelo mas visto del mes" value={modelMasVisto} subtitle={catalogo.most_viewed_moto ? `${catalogo.most_viewed_moto.total} visitas` : "Sin visitas"} loading={loading} />
      </section>

      <section className="admin-analytics-grid two-cols">
        <BarChartCard title="Top 5 modelos de moto mas vistos" items={topMotos} loading={loading} />
        <SummaryTableCard title="Visitas por categoria" rows={visitasCategoriaRows} loading={loading} />
      </section>

      <section className="admin-analytics-grid">
        <LineChartCard title="Tendencia de visitas" items={trendData} loading={loading} />
      </section>

      <section className="admin-analytics-grid two-cols">
        <BarChartCard title="Horas peak mas solicitadas" items={peakHours} horizontal loading={loading} />
        <BarChartCard title="Tipo de servicio mas solicitado" items={servicios} loading={loading} />
      </section>

      <section className="admin-analytics-kpi-grid compact">
        <KpiCard title="Tasa de cancelaciones" value={`${kpis.tasa_cancelacion_pct ?? 0}%`} loading={loading} />
        <KpiCard title="Tasa de no asistencia" value={`${kpis.tasa_no_asistencia_pct ?? 0}%`} loading={loading} />
        <KpiCard title="Clientes recurrentes" value={clientes.recurrentes ?? 0} subtitle={`De ${clientes.total_unicos_mes ?? 0} clientes unicos`} loading={loading} />
        <KpiCard title="Clientes nuevos" value={clientes.nuevos ?? 0} subtitle="Primera reserva en el periodo" loading={loading} />
      </section>

      <section className="admin-analytics-grid">
        <LineChartCard title="Crecimiento mensual de reservas" items={crecimientoMensual} loading={loading} />
      </section>
    </div>
  );
}
