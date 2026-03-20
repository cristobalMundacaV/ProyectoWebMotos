function isNumeric(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export default function KpiCard({
  title,
  value,
  subtitle,
  trend,
  loading = false,
  supportText = "",
  valueBadge = false,
}) {
  const trendIsValid = isNumeric(trend);
  const trendIsUp = trend >= 0;

  return (
    <article className="admin-analytics-kpi-card">
      <p className="admin-analytics-kpi-title">{title}</p>
      <div className="admin-analytics-kpi-body">
        {valueBadge && !loading ? (
          <span className={`admin-analytics-kpi-value-badge ${trendIsValid ? (trendIsUp ? "up" : "down") : "flat"}`}>
            {value}
          </span>
        ) : (
          <strong className={loading ? "admin-analytics-kpi-value loading" : "admin-analytics-kpi-value"}>
            {loading ? "..." : value}
          </strong>
        )}
      </div>
      <div className="admin-analytics-kpi-foot">
        {subtitle ? <span className="admin-analytics-kpi-subtitle">{subtitle}</span> : null}
        {supportText ? <span className="admin-analytics-kpi-support">{supportText}</span> : null}
      </div>
    </article>
  );
}
