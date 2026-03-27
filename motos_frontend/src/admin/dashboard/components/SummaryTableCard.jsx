export default function SummaryTableCard({ title, rows = [], loading = false }) {
  return (
    <article className="admin-panel-card admin-analytics-chart-card">
      <div className="admin-card-header">
        <h2>{title}</h2>
      </div>
      {loading ? (
        null
      ) : rows.length === 0 ? (
        <p className="admin-empty">Sin datos para mostrar.</p>
      ) : (
        <div className="admin-analytics-table">
          {rows.map((row) => (
            <div key={row.label} className="admin-analytics-table-row">
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
