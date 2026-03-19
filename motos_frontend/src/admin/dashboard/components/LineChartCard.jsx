function buildPoints(items, width, height, padding) {
  if (!items.length) return "";
  const values = items.map((item) => Number(item.value || 0));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const drawableWidth = width - padding * 2;
  const drawableHeight = height - padding * 2;
  const range = Math.max(max - min, 1);

  return items
    .map((item, index) => {
      const x = padding + (items.length === 1 ? drawableWidth / 2 : (index / (items.length - 1)) * drawableWidth);
      const y = padding + drawableHeight - (((Number(item.value || 0) - min) / range) * drawableHeight);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function LineChartCard({ title, items = [], loading = false }) {
  const width = 640;
  const height = 220;
  const padding = 22;
  const points = buildPoints(items, width, height, padding);

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
        <>
          <div className="admin-analytics-line-wrap">
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="admin-analytics-line-svg">
              <polyline points={points} className="admin-analytics-line" />
            </svg>
          </div>
          <div className="admin-analytics-line-labels">
            {items.map((item, index) => (
              <div key={`${item.label}-${index}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
