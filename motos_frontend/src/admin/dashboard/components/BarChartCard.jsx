function safeMax(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map((item) => Number(item.value || 0)), 1);
}

const PRIMARY_BAR = "linear-gradient(90deg, #0e7490, #0369a1)";
const HIGHLIGHT_BAR = "linear-gradient(90deg, #0891b2, #0284c7)";

export default function BarChartCard({
  title,
  subtitle = "",
  items = [],
  horizontal = false,
  loading = false,
  stretch = false,
  footerText = "",
}) {
  const max = safeMax(items);
  const chartCardClassName = [
    "admin-panel-card",
    "admin-analytics-chart-card",
    stretch ? "admin-analytics-chart-card--fill" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={chartCardClassName}>
      <div className="admin-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="admin-analytics-card-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      <div className="admin-analytics-chart-card-content">
        {loading ? (
          <div className="admin-analytics-skeleton-list">
            <span />
            <span />
            <span />
          </div>
        ) : items.length === 0 ? (
          <p className="admin-empty">Sin datos para mostrar.</p>
        ) : (
          <div className={horizontal ? "admin-analytics-bars horizontal" : "admin-analytics-bars"}>
            {items.map((item, index) => {
              const value = Number(item.value || 0);
              const pct = Math.max(6, Math.round((value / max) * 100));
              const color = index === 0 ? HIGHLIGHT_BAR : PRIMARY_BAR;
              const sideMetric = item.percent !== null && item.percent !== undefined
                ? `${Number(item.percent).toFixed(1)}%`
                : null;
              const trend = item.trend || "flat";
              return (
                <div key={`${item.label}-${index}`} className={`admin-analytics-bar-row ${item.critical ? "critical" : ""}`}>
                  <span className="admin-analytics-bar-label">
                    {item.label}
                    {item.meta ? <small>{item.meta}</small> : null}
                  </span>
                  <div className="admin-analytics-bar-track">
                    <div
                      className="admin-analytics-bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <strong className="admin-analytics-bar-value">
                    {value}
                    {sideMetric ? <small>{sideMetric}</small> : null}
                    {item.trend ? (
                      <span className={`admin-analytics-mini-trend ${trend}`}>
                        {trend === "up" ? "^" : trend === "down" ? "v" : ">"}
                      </span>
                    ) : null}
                  </strong>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {!loading && footerText ? <p className="admin-analytics-card-subtitle admin-analytics-chart-footer">{footerText}</p> : null}
    </article>
  );
}
