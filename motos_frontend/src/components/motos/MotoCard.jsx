import { Link, useNavigate } from "react-router-dom";
import { buildMediaUrl } from "../../services/apiConfig";
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
  const navigate = useNavigate();
  const formatUppercase = (value) => String(value || "-").toUpperCase();
  const modelo = moto.modelo || moto.nombre;
  const canShowOverlayActions = isAdmin && showAdminOverlayActions && (onEdit || onDelete);
  const canShowBottomDelete = isAdmin && showBottomDeleteAction && onDelete;
  const detailPath = `/moto/${moto.slug}`;
  const useLinkCard = !canShowOverlayActions && !canShowBottomDelete;

  function goToDetail() {
    navigate(detailPath);
  }

  const cardBody = (
    <>
      <div className="moto-card-img-container">
        <img src={buildMediaUrl(moto.imagen_principal)} alt={modelo} />

        {canShowOverlayActions && (
          <div className="moto-card-admin-actions" onClick={(event) => event.stopPropagation()}>
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
        <div className="moto-card-content-row">
          <div className="moto-card-main-specs">
            <p className="marca-nombre">{formatUppercase(moto.marca_nombre)}</p>
            <h3>{modelo}</h3>
            <p className="categoria">{formatUppercase(moto.categoria_nombre)}</p>
            <p className="precio">${Number(moto.precio).toLocaleString("es-CL")}</p>
          </div>

          <div className="moto-card-info moto-card-info-side">
            <p>Cilindrada: {moto.cilindrada}cc</p>
            <p>Año: {moto.anio}</p>
          </div>
        </div>

        <div className="moto-card-actions moto-card-actions-full">
          {useLinkCard ? (
            <span className="moto-card-detail-pill">Detalles</span>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToDetail();
              }}
            >
              Detalles
            </button>
          )}

          {canShowBottomDelete && (
            <button
              type="button"
              className="moto-card-delete-btn"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(moto);
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (useLinkCard) {
    return (
      <Link to={detailPath} className="moto-card moto-card-clickable moto-card-link" aria-label={`Ver detalles de ${modelo}`}>
        {cardBody}
      </Link>
    );
  }

  return (
    <div
      className="moto-card moto-card-clickable"
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToDetail();
        }
      }}
    >
      {cardBody}
    </div>
  );
}
