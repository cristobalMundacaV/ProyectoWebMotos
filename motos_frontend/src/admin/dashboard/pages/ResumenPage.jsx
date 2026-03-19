import { useEffect, useMemo, useState } from "react";
import KpiCard from "../components/KpiCard";
import BarChartCard from "../components/BarChartCard";
import LineChartCard from "../components/LineChartCard";
import SummaryTableCard from "../components/SummaryTableCard";
import { fetchDashboardAnalytics } from "../services/dashboardService";

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

function formatGrowth(value) {
  if (value === null || value === undefined) return "N/A";
  return `${value > 0 ? "+" : ""}${value}%`;
}

function parseIsoDate(iso) {
  const [year, month, day] = String(iso || "").split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ResumenPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
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
          groupBy: "day",
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
  }, [year, month]);

  const catalogo = analytics.catalogo || {};
  const mantenciones = analytics.mantenciones || {};
  const kpis = mantenciones.kpis_mensuales || {};

  const topMotos = useMemo(
    () => (catalogo.top_5_motos || []).map((item) => ({ label: item.entidad_nombre || item.entidad_slug || "Sin nombre", value: item.total || 0 })),
    [catalogo.top_5_motos]
  );

  const trendData = useMemo(
    () => {
      const raw = Array.isArray(catalogo.trend) ? catalogo.trend : [];
      const range = catalogo.range || {};
      const start = range.start ? parseIsoDate(range.start) : null;
      const end = range.end ? parseIsoDate(range.end) : null;

      if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return raw.map((item) => ({ label: item.period, value: item.total }));
      }

      const totalsByDay = new Map(raw.map((item) => [item.period, Number(item.total || 0)]));
      const rows = [];
      const cursor = new Date(start);
      while (cursor <= end) {
        const iso = formatIsoDate(cursor);
        rows.push({ label: iso, value: totalsByDay.get(iso) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      return rows;
    },
    [catalogo.trend, catalogo.range]
  );

  const visitasCategoriaRows = useMemo(() => {
    const categoriasMoto = Array.isArray(catalogo.visitas_por_categoria_moto)
      ? catalogo.visitas_por_categoria_moto
      : [];
    return categoriasMoto.map((item) => ({
      label: item.categoria || "Sin categoria",
      value: item.total || 0,
    }));
  }, [catalogo.visitas_por_categoria_moto]);

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
      <section className="admin-hero-card">
        <div>
          <h1>Bienvenido al dashboard gerencial</h1>
        </div>
      </section>

      {error ? <section className="admin-panel-card"><p className="admin-empty">{error}</p></section> : null}

      <section className="admin-analytics-kpi-grid">
        <KpiCard title="Mantenciones del mes" value={kpis.total_agendadas_mes ?? 0} subtitle={`${MONTHS[month - 1]} ${year}`} loading={loading} />
        <KpiCard title="Crecimiento vs mes anterior" value={formatGrowth(kpis.crecimiento_mensual_pct)} trend={kpis.crecimiento_mensual_pct} loading={loading} />
        <KpiCard
          title="Ocupacion del taller"
          value={`${kpis.horas_disponibles_restantes_mes ?? 0} horas`}
          subtitle="Horas disponibles restantes este mes"
          loading={loading}
        />
        <KpiCard title="Modelo mas visto del mes" value={modelMasVisto} subtitle={catalogo.most_viewed_moto ? `${catalogo.most_viewed_moto.total} visitas` : "Sin visitas"} loading={loading} />
      </section>

      <section className="admin-analytics-grid two-cols">
        <BarChartCard title="Top 5 modelos de moto mas vistos" items={topMotos} loading={loading} />
        <SummaryTableCard title="Categorias de motos mas clickeadas" rows={visitasCategoriaRows} loading={loading} />
      </section>

      <section className="admin-analytics-grid">
        <LineChartCard title="Tendencia de visitas" items={trendData} loading={loading} />
      </section>

      <section className="admin-analytics-grid two-cols">
        <BarChartCard title="Horas peak mas solicitadas" items={peakHours} horizontal loading={loading} />
        <BarChartCard title="Tipo de servicio mas solicitado" items={servicios} horizontal loading={loading} />
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
