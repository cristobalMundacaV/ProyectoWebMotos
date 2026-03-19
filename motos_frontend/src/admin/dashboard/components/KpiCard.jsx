export default function KpiCard({ title, value, subtitle, trend, loading = false }) {
  return (
    <article className="admin-analytics-kpi-card">
      <p className="admin-analytics-kpi-title">{title}</p>
      <strong className={loading ? "admin-analytics-kpi-value loading" : "admin-analytics-kpi-value"}>
        {loading ? "..." : value}
      </strong>
      {subtitle ? <span className="admin-analytics-kpi-subtitle">{subtitle}</span> : null}
      {trend ? <small className={`admin-analytics-kpi-trend ${trend >= 0 ? "up" : "down"}`}>{trend >= 0 ? "+" : ""}{trend}%</small> : null}
    </article>
  );
}
