import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession, getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/layout.css";

/** Navbar compartido por todas las paginas */
export default function Navbar() {
  const [user, setUser] = useState(() => {
    const token = getStoredToken();
    return token ? getStoredUser() : null;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const canAccessAdminPanel = hasAdminAccess(user);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMenuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [isMenuOpen]);

  function handleLogout() {
    clearAuthSession();
    setUser(null);
    setIsMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo" aria-label="Ir al inicio">
          <img src="/images/logo.svg" alt="Motos" className="logo-image" />
        </Link>

        <nav className={isMenuOpen ? "open" : ""} aria-label="Navegacion principal">
          <Link to="/#inicio" onClick={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
          <Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>
            Motos
          </Link>
          <Link to="/equipamiento/indumentaria" onClick={() => setIsMenuOpen(false)}>
            Indumentaria Rider
          </Link>
          <Link to="/equipamiento/accesorios" onClick={() => setIsMenuOpen(false)}>
            Accesorios Motos
          </Link>
          <Link to="/#contacto" onClick={() => setIsMenuOpen(false)}>
            Contacto
          </Link>
          {canAccessAdminPanel && (
            <Link to="/admin-panel" className="nav-admin-link" onClick={() => setIsMenuOpen(false)}>
              Admin Panel
            </Link>
          )}

          <div className="nav-mobile-session">
            {user ? (
              <button type="button" className="btn-nav btn-nav-logout" onClick={handleLogout}>
                Cerrar sesion
              </button>
            ) : (
              <Link className="btn-nav btn-nav-subtle" to="/login" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>
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
            <button type="button" className="btn-nav btn-nav-logout nav-user-logout-desktop" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        ) : (
          <Link className="btn-nav btn-nav-subtle nav-desktop-admin" to="/login">
            Admin
          </Link>
        )}

        <button
          type="button"
          className={isMenuOpen ? "nav-menu-toggle open" : "nav-menu-toggle"}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <button
        type="button"
        className={isMenuOpen ? "nav-backdrop open" : "nav-backdrop"}
        aria-label="Cerrar menu"
        onClick={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
