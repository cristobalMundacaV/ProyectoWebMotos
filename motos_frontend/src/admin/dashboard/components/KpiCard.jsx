function isNumeric(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatTrendValue(value) {
  if (!isNumeric(value)) return "";
  const abs = Math.abs(value);
  return `${abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(2)}%`;
}

export default function KpiCard({ title, value, subtitle, trend, loading = false, supportText = "" }) {
  const trendIsValid = isNumeric(trend);
  const trendIsUp = trend >= 0;

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
        {supportText ? <span className="admin-analytics-kpi-support">{supportText}</span> : null}
        {trendIsValid ? (
          <small className={`admin-analytics-kpi-trend ${trendIsUp ? "up" : "down"}`}>
            <span className="admin-analytics-kpi-trend-arrow">{trendIsUp ? "↗" : "↘"}</span>
            {formatTrendValue(trend)} vs mes anterior
          </small>
        ) : null}
      </div>
    </article>
  );
}
