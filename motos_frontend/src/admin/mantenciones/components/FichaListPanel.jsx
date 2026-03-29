import { formatDate, getStatusPillClass, statusLabel } from "../utils/mantencionesViewUtils";

export default function FichaListPanel({ items, selectedId, onSelect, emptyText, loading }) {
  return (
    <aside className="admin-mantencion-fichas-list">
      {items.map((item) => {
        const moto = item?.moto_cliente_detalle || {};
        const isActive = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={isActive ? "admin-mantencion-ficha-item active" : "admin-mantencion-ficha-item"}
            onClick={() => onSelect(item.id)}
          >
            <div className="admin-mantencion-ficha-item-top">
              <strong>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</strong>
              <span className={`admin-status-pill ${getStatusPillClass(item.estado)}`}>{statusLabel(item.estado)}</span>
            </div>
            <span>{moto.cliente_nombre || "Cliente"}</span>
            <small>{formatDate(item.fecha_ingreso)}</small>
          </button>
        );
      })}

      {!loading && items.length === 0 && <p className="admin-empty">{emptyText}</p>}
    </aside>
  );
}

