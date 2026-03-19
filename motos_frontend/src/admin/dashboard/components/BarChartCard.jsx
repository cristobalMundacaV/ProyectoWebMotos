function safeMax(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map((item) => Number(item.value || 0)), 1);
}

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
            return (
              <div key={`${item.label}-${index}`} className="admin-analytics-bar-row">
                <span className="admin-analytics-bar-label">{item.label}</span>
                <div className="admin-analytics-bar-track">
                  <div className="admin-analytics-bar-fill" style={horizontal ? { width: `${pct}%` } : { height: `${pct}%` }} />
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
