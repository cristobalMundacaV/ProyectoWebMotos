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
  const [isMaintenanceMenuOpen, setIsMaintenanceMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const canAccessAdminPanel = hasAdminAccess(user);
  const isMaintenanceRoute = location.pathname.startsWith("/mantenimiento");

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMaintenanceMenuOpen(false);
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

  function rememberHomeScrollTarget(target) {
    sessionStorage.setItem("homeScrollTarget", JSON.stringify({ id: target, ts: Date.now() }));
  }

  function scrollHomeSection(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - (navbarHeight + 10));
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo" aria-label="Ir al inicio">
          <img src="/images/logo.svg" alt="Motos" className="logo-image" />
        </Link>

        <nav className={isMenuOpen ? "open" : ""} aria-label="Navegacion principal">
          <Link
            to="/"
            onClick={(event) => {
              if (location.pathname === "/") {
                event.preventDefault();
                scrollHomeSection("inicio");
              }
              rememberHomeScrollTarget("inicio");
              setIsMenuOpen(false);
            }}
          >
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
          <div
            className={`nav-dropdown ${isMaintenanceMenuOpen ? "open" : ""}`}
            onMouseEnter={() => setIsMaintenanceMenuOpen(true)}
            onMouseLeave={() => setIsMaintenanceMenuOpen(false)}
          >
            <button
              type="button"
              className={`nav-dropdown-trigger ${isMaintenanceRoute ? "active" : ""}`}
              aria-expanded={isMaintenanceMenuOpen}
              onClick={() => setIsMaintenanceMenuOpen((prev) => !prev)}
            >
              Mantenimiento
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/mantenimiento/agendar" onClick={() => setIsMenuOpen(false)}>
                Agendar Hora
              </Link>
              <Link to="/mantenimiento/consultar" onClick={() => setIsMenuOpen(false)}>
                Consultar hora
              </Link>
            </div>
          </div>
          <Link
            to="/"
            onClick={(event) => {
              if (location.pathname === "/") {
                event.preventDefault();
                scrollHomeSection("contacto");
              }
              rememberHomeScrollTarget("contacto");
              setIsMenuOpen(false);
            }}
          >
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
