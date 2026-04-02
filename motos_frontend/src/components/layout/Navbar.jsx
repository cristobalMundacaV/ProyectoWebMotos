import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredToken,
  getStoredUser,
  hasAdminAccess,
  logoutUser,
  updateCurrentUser,
  updateStoredUser,
} from "../../services/authService";
import { isValidChilePhone, normalizeChilePhoneInput } from "../../services/phoneUtils";
import "../../styles/layout.css";

function roleLabel(value) {
  const map = {
    superadmin: "Super Admin",
    admin: "Administrador",
    encargado: "Encargado",
    cliente: "Cliente",
  };
  return map[String(value || "").toLowerCase()] || "Usuario";
}

export default function Navbar() {
  const [user, setUser] = useState(() => {
    const token = getStoredToken();
    return token ? getStoredUser() : null;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMaintenanceMenuOpen, setIsMaintenanceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    telefono: "",
  });

  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const canAccessAdminPanel = hasAdminAccess(user);
  const isMaintenanceRoute = location.pathname.startsWith("/mantenimiento");
  const supportsHover =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false;

  const displayName = useMemo(() => {
    const full = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return full || user?.username || "Usuario";
  }, [user?.first_name, user?.last_name, user?.username]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMaintenanceMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsEditingProfile(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMenuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [isMenuOpen]);

  useEffect(() => {
    setProfileForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      email: user?.email || "",
      telefono: normalizeChilePhoneInput(user?.telefono || ""),
    });
  }, [user?.first_name, user?.last_name, user?.username, user?.email, user?.telefono]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    let active = true;
    fetchCurrentUser()
      .then((response) => {
        if (!active) return;
        const current = response?.user || response;
        setUser(current);
        updateStoredUser(current);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!userMenuRef.current || userMenuRef.current.contains(event.target)) return;
      setIsUserMenuOpen(false);
      setIsEditingProfile(false);
    };

    const handleEsc = (event) => {
      if (event.key !== "Escape") return;
      setIsUserMenuOpen(false);
      setIsEditingProfile(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isUserMenuOpen]);

  async function handleLogout() {
    try {
      logoutUser().catch(() => {});
    } catch {}
    clearAuthSession();
    setUser(null);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsEditingProfile(false);
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

  function handleMaintenanceMenuToggle() {
    setIsMaintenanceMenuOpen((prev) => !prev);
  }

  function handleMaintenanceMenuOpen() {
    if (!supportsHover) return;
    setIsMaintenanceMenuOpen(true);
  }

  function handleMaintenanceMenuClose() {
    if (!supportsHover) return;
    setIsMaintenanceMenuOpen(false);
  }

  function handleMaintenanceLinkClick() {
    setIsMaintenanceMenuOpen(false);
    setIsMenuOpen(false);
  }

  function handleProfileInputChange(event) {
    const { name, value } = event.target;
    if (name === "telefono") {
      setProfileForm((prev) => ({ ...prev, telefono: normalizeChilePhoneInput(value) }));
      return;
    }
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    if (!user?.id || profileSaving) return;
    setProfileSaving(true);
    setProfileError("");

    try {
      const normalizedTelefono = normalizeChilePhoneInput(profileForm.telefono, { allowEmpty: true });
      if (!isValidChilePhone(normalizedTelefono)) {
        setProfileError("El telefono debe comenzar con +56 y contener 9 digitos adicionales.");
        return;
      }

      const response = await updateCurrentUser({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        username: profileForm.username,
        email: profileForm.email,
        telefono: normalizedTelefono,
      });
      const updatedUser = response?.user || response;
      setUser(updatedUser);
      updateStoredUser(updatedUser);
      setIsEditingProfile(false);
    } catch (error) {
      const message = error?.response?.data?.detail || "No se pudo actualizar el perfil.";
      setProfileError(String(message));
    } finally {
      setProfileSaving(false);
    }
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
            onMouseEnter={handleMaintenanceMenuOpen}
            onMouseLeave={handleMaintenanceMenuClose}
          >
            <button
              type="button"
              className={`nav-dropdown-trigger ${isMaintenanceRoute ? "active" : ""}`}
              aria-expanded={isMaintenanceMenuOpen}
              onClick={handleMaintenanceMenuToggle}
            >
              Mantenimiento
            </button>
            <div className="nav-dropdown-menu">
              <Link to="/mantenimiento/agendar" onClick={handleMaintenanceLinkClick}>
                Agendar Hora
              </Link>
              <Link to="/mantenimiento/consultar" onClick={handleMaintenanceLinkClick}>
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
            {!user && (
              <Link className="btn-nav btn-nav-subtle" to="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </nav>

        <div className="nav-actions">
        {user ? (
          <div className="admin-topbar-user-menu nav-user-menu" ref={userMenuRef}>
            <button
              type="button"
              className="admin-topbar-user-icon"
              aria-label="Abrir menu de usuario"
              title="Menu de usuario"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-expanded={isUserMenuOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="admin-user-dropdown">
                <div className="admin-user-dropdown-header">
                  <strong>{displayName}</strong>
                  <span>{roleLabel(user?.rol || user?.role)}</span>
                </div>

                {!isEditingProfile ? (
                  <div className="admin-user-dropdown-content">
                    <p>
                      <span>Usuario</span>
                      <strong>{user?.username || "-"}</strong>
                    </p>
                    <p>
                      <span>Email</span>
                      <strong>{user?.email || "-"}</strong>
                    </p>
                    <p>
                      <span>Teléfono</span>
                      <strong>{user?.telefono || "-"}</strong>
                    </p>
                    <div className="admin-user-dropdown-actions">
                      <button type="button" className="admin-user-btn" onClick={() => setIsEditingProfile(true)}>
                        Editar perfil
                      </button>
                      <button type="button" className="admin-user-btn danger" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="admin-user-dropdown-form" onSubmit={handleSaveProfile}>
                    <label>
                      Nombres
                      <input name="first_name" value={profileForm.first_name} onChange={handleProfileInputChange} required />
                    </label>
                    <label>
                      Apellidos
                      <input name="last_name" value={profileForm.last_name} onChange={handleProfileInputChange} required />
                    </label>
                    <label>
                      Usuario
                      <input name="username" value={profileForm.username} onChange={handleProfileInputChange} required />
                    </label>
                    <label>
                      Email
                      <input name="email" type="email" value={profileForm.email} onChange={handleProfileInputChange} />
                    </label>
                    <label>
                      Teléfono
                      <input name="telefono" value={profileForm.telefono} onChange={handleProfileInputChange} inputMode="numeric" maxLength={12} required />
                    </label>
                    {profileError ? <p className="nav-profile-error">{profileError}</p> : null}
                    <div className="admin-user-dropdown-actions">
                      <button type="button" className="admin-user-btn" onClick={() => setIsEditingProfile(false)} disabled={profileSaving}>
                        Cancelar
                      </button>
                      <button type="submit" className="admin-user-btn save" disabled={profileSaving}>
                        {profileSaving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="btn-nav btn-nav-subtle nav-desktop-admin" to="/login">
              Login
            </Link>
            <Link className="admin-topbar-user-icon nav-login-icon" to="/login" aria-label="Ir a login" title="Login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </Link>
          </>
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
