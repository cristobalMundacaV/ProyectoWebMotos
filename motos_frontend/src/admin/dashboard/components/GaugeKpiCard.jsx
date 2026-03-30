function getGaugeColor(value) {
  if (value > 70) return "danger";
  if (value >= 40) return "warning";
  return "safe";
}

export default function GaugeKpiCard({
  title,
  value = 0,
  subtitle = "",
  supportText = "",
  loading = false,
}) {
  const numericValue = Number(value || 0);
  const safeValue = Math.max(0, Math.min(100, numericValue));
  const gaugeColor = getGaugeColor(safeValue);
  const degrees = (safeValue / 100) * 180 - 90;
  const isOverCapacity = numericValue > 100;

  return (
    <article className="admin-analytics-kpi-card admin-analytics-gauge-card">
      <p className="admin-analytics-kpi-title">{title}</p>
      {loading ? (
        <div className="admin-analytics-skeleton-line"><span /></div>
      ) : (
        <div className="admin-analytics-gauge-wrap">
          <div className={`admin-analytics-gauge ${gaugeColor}`}>
            <div className="admin-analytics-gauge-track" />
            <div className="admin-analytics-gauge-fill" style={{ transform: `rotate(${degrees}deg)` }} />
            <div className="admin-analytics-gauge-center">
              <strong>{numericValue.toFixed(2)}%</strong>
            </div>
          </div>
        </div>
      )}
      <div className="admin-analytics-kpi-foot">
        {subtitle ? <span className="admin-analytics-kpi-subtitle">{subtitle}</span> : null}
        {supportText ? <span className="admin-analytics-kpi-support">{supportText}</span> : null}
        {isOverCapacity ? <span className="admin-analytics-kpi-support">Sobrecapacidad detectada</span> : null}
      </div>
    </article>
  );
}
