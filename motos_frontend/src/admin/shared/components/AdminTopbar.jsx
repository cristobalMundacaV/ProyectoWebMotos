import { Link } from "react-router-dom";

export default function AdminTopbar({ onLogout, onToggleSidebar, isSidebarOpen = false }) {
  return (
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-mobile-menu-btn"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"}
        aria-expanded={isSidebarOpen}
      >
        <span />
        <span />
        <span />
      </button>

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
