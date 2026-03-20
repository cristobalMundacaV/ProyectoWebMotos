import { useMemo, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getCoords(items, width, height, padding) {
  if (!items.length) return { points: [], max: 0 };
  const values = items.map((item) => Number(item.value || 0));
  const max = Math.max(...values, 1);
  const drawableWidth = width - padding.left - padding.right;
  const drawableHeight = height - padding.top - padding.bottom;

  const points = items.map((item, index) => {
    const x = padding.left + (items.length === 1 ? drawableWidth / 2 : (index / (items.length - 1)) * drawableWidth);
    const y = padding.top + drawableHeight - ((Number(item.value || 0) / max) * drawableHeight);
    return {
      x,
      y,
      value: Number(item.value || 0),
      label: item.label,
      variationPct: item.variationPct,
    };
  });
  return { points, max };
}

function getTicks(max, count = 4) {
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i));
}

function getLabelIndexes(length) {
  if (length <= 6) return Array.from({ length }, (_, i) => i);
  return [...new Set([0, Math.floor(length * 0.25), Math.floor(length * 0.5), Math.floor(length * 0.75), length - 1])];
}

export default function LineChartCard({ title, subtitle = "", items = [], loading = false, averageValue = null }) {
  const pointSpacing = items.length > 24 ? 26 : 34;
  const width = Math.max(760, Math.min(1360, (items.length - 1) * pointSpacing + 74));
  const height = 280;
  const padding = { top: 18, right: 10, bottom: 34, left: 34 };
  const [hoverIndex, setHoverIndex] = useState(null);

  const chart = useMemo(() => getCoords(items, width, height, padding), [items]);
  const { points, max } = chart;
  const ticks = useMemo(() => getTicks(max, 4), [max]);
  const activePoint = hoverIndex === null ? null : points[hoverIndex] || null;

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = points.length
    ? `${polyline} ${points[points.length - 1].x},${height - padding.bottom} ${points[0].x},${height - padding.bottom}`
    : "";

  const labelIndexes = getLabelIndexes(points.length);
  const drawableWidth = width - padding.left - padding.right;
  const drawableHeight = height - padding.top - padding.bottom;
  const avgLineY =
    averageValue !== null && averageValue !== undefined && max > 0
      ? padding.top + drawableHeight - ((Number(averageValue) / max) * drawableHeight)
      : null;

  function handleMouseMove(event) {
    if (!points.length) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const rawX = event.clientX - bounds.left;
    const relativeX = clamp((rawX / bounds.width) * width, padding.left, width - padding.right);
    const ratio = (relativeX - padding.left) / Math.max(drawableWidth, 1);
    const index = Math.round(ratio * (points.length - 1));
    setHoverIndex(clamp(index, 0, points.length - 1));
  }

  return (
    <article className="admin-panel-card admin-analytics-chart-card admin-analytics-chart-card-line">
      <div className="admin-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="admin-analytics-card-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      {loading ? (
        <div className="admin-analytics-skeleton-line">
          <span />
        </div>
      ) : items.length === 0 ? (
        <p className="admin-empty">Sin datos para mostrar.</p>
      ) : (
        <div
          className="admin-analytics-line-wrap"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="admin-analytics-line-svg"
            onMouseMove={handleMouseMove}
          >
            {ticks.map((tick) => {
              const y = padding.top + drawableHeight - ((tick / Math.max(max, 1)) * drawableHeight);
              return (
                <g key={`y-${tick}`}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="admin-analytics-grid-line" />
                  <text x={padding.left - 8} y={y + 4} textAnchor="end" className="admin-analytics-axis-text">
                    {tick}
                  </text>
                </g>
              );
            })}

            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} className="admin-analytics-axis-line" />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} className="admin-analytics-axis-line" />

            {avgLineY !== null ? (
              <line x1={padding.left} y1={avgLineY} x2={width - padding.right} y2={avgLineY} className="admin-analytics-avg-line" />
            ) : null}

            {labelIndexes.map((idx) => {
              const point = points[idx];
              if (!point) return null;
              return (
                <text key={`x-${idx}`} x={point.x} y={height - 10} textAnchor="middle" className="admin-analytics-axis-text">
                  {point.label}
                </text>
              );
            })}

            {area ? <polygon points={area} className="admin-analytics-area" /> : null}
            {polyline ? <polyline points={polyline} className="admin-analytics-line" /> : null}

            {points.map((point, index) => {
              const showPoint = point.value > 0 || points.length <= 12 || index === hoverIndex;
              if (!showPoint) return null;
              return (
                <circle
                  key={`${point.label}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={index === hoverIndex ? 4.8 : 3.2}
                  className={index === hoverIndex ? "admin-analytics-point active" : "admin-analytics-point"}
                />
              );
            })}

            {activePoint ? (
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={height - padding.bottom}
                className="admin-analytics-hover-line"
              />
            ) : null}
          </svg>

          {activePoint ? (
            <div className="admin-analytics-tooltip" style={{ left: `${(activePoint.x / width) * 100}%` }}>
              <span>{activePoint.label}</span>
              <strong>{activePoint.value} visitas</strong>
              {activePoint.variationPct !== null && activePoint.variationPct !== undefined ? (
                <b className={activePoint.variationPct >= 0 ? "up" : "down"}>
                  {activePoint.variationPct >= 0 ? "+" : ""}
                  {activePoint.variationPct}%
                </b>
              ) : (
                <b className="flat">Sin base previa</b>
              )}
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
