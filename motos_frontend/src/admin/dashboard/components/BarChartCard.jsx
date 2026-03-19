function safeMax(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map((item) => Number(item.value || 0)), 1);
}

const BAR_COLORS = [
  "linear-gradient(90deg, #0ea5e9, #0284c7)",
  "linear-gradient(90deg, #22c55e, #16a34a)",
  "linear-gradient(90deg, #f59e0b, #d97706)",
  "linear-gradient(90deg, #a855f7, #7e22ce)",
  "linear-gradient(90deg, #ef4444, #dc2626)",
];

export default function BarChartCard({ title, items = [], horizontal = false, loading = false }) {
  const max = safeMax(items);

  return (
    <article className="admin-panel-card admin-analytics-chart-card">
      <div className="admin-card-header">
        <h2>{title}</h2>
      </div>
      {loading ? (
        <p className="admin-empty">Cargando datos...</p>
      ) : items.length === 0 ? (
        <p className="admin-empty">Sin datos para mostrar.</p>
      ) : (
        <div className={horizontal ? "admin-analytics-bars horizontal" : "admin-analytics-bars"}>
          {items.map((item, index) => {
            const value = Number(item.value || 0);
            const pct = Math.max(6, Math.round((value / max) * 100));
            const color = BAR_COLORS[index % BAR_COLORS.length];
            return (
              <div key={`${item.label}-${index}`} className="admin-analytics-bar-row">
                <span className="admin-analytics-bar-label">{item.label}</span>
                <div className="admin-analytics-bar-track">
                  <div
                    className="admin-analytics-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <strong className="admin-analytics-bar-value">{value}</strong>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
