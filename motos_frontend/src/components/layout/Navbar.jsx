import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/layout.css";

/** Navbar compartido por todas las paginas */
export default function Navbar() {
  const [user, setUser] = useState(() => {
    const token = getStoredToken();
    return token ? getStoredUser() : null;
  });
  const navigate = useNavigate();
  const canAccessAdminPanel = hasAdminAccess(user);

  function handleLogout() {
    clearAuthSession();
    setUser(null);
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <img src="/images/logo.svg" alt="Motos" className="logo-image" />
      </Link>

      <nav>
        <Link to="/#inicio">Inicio</Link>
        <Link to="/catalogo">Motos</Link>
        <Link to="/equipamiento/indumentaria">Indumentaria Rider</Link>
        <Link to="/equipamiento/accesorios">Accesorios Motos</Link>

        <Link to="/#contacto">Contacto</Link>
        {canAccessAdminPanel && (
          <Link to="/admin-panel" className="nav-admin-link">
            Admin Panel
          </Link>
        )}
      </nav>

      {user ? (
        <div className="nav-user">
          <div className="nav-user-meta">
            <span className="nav-user-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </span>
            <span className="nav-username">{user.username}</span>
          </div>
          <button type="button" className="btn-nav btn-nav-logout" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      ) : (
        <Link className="btn-nav" to="/login">
          Admin
        </Link>
      )}
    </header>
  );
}
