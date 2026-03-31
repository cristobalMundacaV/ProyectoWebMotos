import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function roleLabel(value) {
  const map = {
    superadmin: "Super Admin",
    admin: "Administrador",
    encargado: "Encargado",
    cliente: "Cliente",
  };
  return map[String(value || "").toLowerCase()] || "Usuario";
}

export default function AdminTopbar({
  onLogout,
  onToggleSidebar,
  isSidebarOpen = false,
  user = null,
  onSaveProfile,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    telefono: "",
  });
  const menuRef = useRef(null);
  const goToSiteHome = (event) => {
    if (event) event.preventDefault();
    window.location.assign("/");
  };

  const displayName = useMemo(() => {
    const full = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return full || user?.username || "Usuario";
  }, [user?.first_name, user?.last_name, user?.username]);

  useEffect(() => {
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
    });
  }, [user?.first_name, user?.last_name, user?.username, user?.email, user?.telefono]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClickOutside = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setIsOpen(false);
      setIsEditing(false);
    };
    const handleEsc = (event) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      setIsEditing(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
    if (isEditing) setIsEditing(false);
  }

  function onChangeField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    if (!onSaveProfile || saving) return;
    setSaving(true);
    const ok = await onSaveProfile({
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      email: form.email,
      telefono: form.telefono,
    });
    setSaving(false);
    if (ok) {
      setIsEditing(false);
      setIsOpen(false);
    }
  }

  return (
    <header className="admin-topbar">
      <Link to="/" className="admin-brand" onClick={goToSiteHome}>
        <img src="/images/logo.svg" alt="Delanoe Motos" className="admin-brand-logo" />
        <div>
          <p>Panel de administracion</p>
          <span>Control de catalogo y contenido</span>
        </div>
      </Link>

      <div className="admin-topbar-actions">
        <Link to="/" className="admin-topbar-link admin-topbar-link-pill" onClick={goToSiteHome}>
          Ver sitio
        </Link>

        <div className="admin-topbar-user-menu" ref={menuRef}>
          <button
            type="button"
            className="admin-topbar-user-icon"
            aria-label="Abrir menu de usuario"
            title="Menu de usuario"
            onClick={toggleMenu}
            aria-expanded={isOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </button>

          {isOpen && (
            <div className="admin-user-dropdown">
              <div className="admin-user-dropdown-header">
                <strong>{displayName}</strong>
                <span>{roleLabel(user?.rol || user?.role)}</span>
              </div>

              {!isEditing ? (
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
                    <button type="button" className="admin-user-btn" onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </button>
                    <button type="button" className="admin-user-btn danger" onClick={onLogout}>
                      Cerrar sesion
                    </button>
                  </div>
                </div>
              ) : (
                <form className="admin-user-dropdown-form" onSubmit={handleSaveProfile}>
                  <label>
                    Nombres
                    <input name="first_name" value={form.first_name} onChange={onChangeField} required />
                  </label>
                  <label>
                    Apellidos
                    <input name="last_name" value={form.last_name} onChange={onChangeField} required />
                  </label>
                  <label>
                    Usuario
                    <input name="username" value={form.username} onChange={onChangeField} required />
                  </label>
                  <label>
                    Email
                    <input name="email" type="email" value={form.email} onChange={onChangeField} />
                  </label>
                  <label>
                    Teléfono
                    <input name="telefono" value={form.telefono} onChange={onChangeField} required />
                  </label>
                  <div className="admin-user-dropdown-actions">
                    <button type="button" className="admin-user-btn" onClick={() => setIsEditing(false)} disabled={saving}>
                      Cancelar
                    </button>
                    <button type="submit" className="admin-user-btn save" disabled={saving}>
                      {"Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
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

