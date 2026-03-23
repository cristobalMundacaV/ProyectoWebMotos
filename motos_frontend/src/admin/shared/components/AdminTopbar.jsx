import { Link } from "react-router-dom";

export default function AdminTopbar({ onLogout, onToggleSidebar, isSidebarOpen = false }) {
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
        <span className="admin-topbar-user-icon" aria-label="Usuario administrador" title="Usuario administrador">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
          </svg>
        </span>
        <button type="button" className="admin-primary-action" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>

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
    </header>
  );
}
