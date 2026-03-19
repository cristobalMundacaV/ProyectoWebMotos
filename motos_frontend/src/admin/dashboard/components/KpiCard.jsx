export default function KpiCard({ title, value, subtitle, trend, loading = false }) {
  return (
    <article className="admin-analytics-kpi-card">
      <p className="admin-analytics-kpi-title">{title}</p>
      <div className="admin-analytics-kpi-body">
        <strong className={loading ? "admin-analytics-kpi-value loading" : "admin-analytics-kpi-value"}>
          {loading ? "..." : value}
        </strong>
      </div>
      <div className="admin-analytics-kpi-foot">
        {subtitle ? <span className="admin-analytics-kpi-subtitle">{subtitle}</span> : null}
        {trend !== null && trend !== undefined ? (
          <small className={`admin-analytics-kpi-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "+" : ""}
            {trend}%
          </small>
        ) : null}
      </div>
    </article>
  );
}
