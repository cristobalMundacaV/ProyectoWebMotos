import { Link } from "react-router-dom";
import "../../styles/motos.css";

/** Tarjeta reutilizable que muestra el resumen de una moto en el catalogo */
export default function MotoCard({
  moto,
  isAdmin = false,
  onEdit,
  onDelete,
  showAdminOverlayActions = true,
  showBottomDeleteAction = false,
}) {
  const modelo = moto.modelo || moto.nombre;
  const canShowOverlayActions = isAdmin && showAdminOverlayActions && (onEdit || onDelete);
  const canShowBottomDelete = isAdmin && showBottomDeleteAction && onDelete;

  return (
    <div className="moto-card">
      <div className="moto-card-img-container">
        <img src={`http://127.0.0.1:8000${moto.imagen_principal}`} alt={modelo} />

        {canShowOverlayActions && (
          <div className="moto-card-admin-actions">
            {onEdit && (
              <button type="button" className="moto-card-admin-btn edit" title="Editar" onClick={() => onEdit?.(moto)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                className="moto-card-admin-btn delete"
                title="Eliminar"
                onClick={() => onDelete?.(moto)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="moto-card-body">
        <p className="marca-nombre">{moto.marca_nombre}</p>
        <h3>{modelo}</h3>
        <p className="categoria">{moto.categoria_nombre || "-"}</p>
        <p className="precio">${Number(moto.precio).toLocaleString("es-CL")}</p>

        <div className="moto-card-bottom-row">
          <div className="moto-card-info">
            <p>Cilindrada: {moto.cilindrada}cc</p>
            <p>Anio: {moto.anio}</p>
          </div>

          <div className="moto-card-actions">
            <Link to={`/moto/${moto.slug}`}>
              <button>Detalles</button>
            </Link>

            {canShowBottomDelete && (
              <button type="button" className="moto-card-delete-btn" onClick={() => onDelete?.(moto)}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
