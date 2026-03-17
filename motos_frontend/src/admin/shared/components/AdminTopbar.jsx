import { Link } from "react-router-dom";

export default function AdminTopbar({ onLogout }) {
  return (
    <header className="admin-topbar">
      <Link to="/" className="admin-brand">
        <img src="/images/logo.svg" alt="Delanoe Motos" className="admin-brand-logo" />
        <div>
          <p>Panel de administracion</p>
          <span>Control de catalogo y contenido</span>
        </div>
      </Link>

      <div className="admin-topbar-actions">
        <Link to="/" className="admin-topbar-link">
          Ver sitio
        </Link>
        <button type="button" className="admin-primary-action" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>
    </header>
  );
}
