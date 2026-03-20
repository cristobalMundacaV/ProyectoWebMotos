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
  truncateValue = false,
}) {
  const trendIsValid = isNumeric(trend);
  const trendIsUp = trend >= 0;
  const valueLabel = loading ? undefined : String(value ?? "");
  const valueClassName = [
    "admin-analytics-kpi-value",
    loading ? "loading" : "",
    truncateValue ? "truncate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="admin-analytics-kpi-card">
      <p className="admin-analytics-kpi-title">{title}</p>
      <div className="admin-analytics-kpi-body">
        {valueBadge && !loading ? (
          <span
            className={`admin-analytics-kpi-value-badge ${trendIsValid ? (trendIsUp ? "up" : "down") : "flat"}`}
            title={valueLabel}
          >
            {value}
          </span>
        ) : (
          <strong className={valueClassName} title={valueLabel}>
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
