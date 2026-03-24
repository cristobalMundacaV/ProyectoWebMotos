import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function SidebarIcon({ kind }) {
  if (kind === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="12" width="4" height="8" rx="1.2" />
        <rect x="10" y="8" width="4" height="12" rx="1.2" />
        <rect x="17" y="4" width="4" height="16" rx="1.2" />
      </svg>
    );
  }

  if (kind === "motos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        <path d="M9 18h6l-3-7h-3l-2 4h2l1-2 1.2 3z" />
      </svg>
    );
  }

  if (kind === "modelos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }

  if (kind === "categorias") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="8" height="7" rx="1.4" />
        <rect x="13" y="4" width="8" height="7" rx="1.4" />
        <rect x="3" y="13" width="8" height="7" rx="1.4" />
        <rect x="13" y="13" width="8" height="7" rx="1.4" />
      </svg>
    );
  }

  if (kind === "mantenedores") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="8" height="7" rx="1.4" />
        <rect x="13" y="4" width="8" height="7" rx="1.4" />
        <rect x="3" y="13" width="8" height="7" rx="1.4" />
        <rect x="13" y="13" width="8" height="7" rx="1.4" />
      </svg>
    );
  }

  if (kind === "marcas") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h8l8 8-6 6-8-8V6z" />
        <circle cx="9" cy="9" r="1.4" />
      </svg>
    );
  }

  if (kind === "productos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 8v8l8 4 8-4V8" />
      </svg>
    );
  }

  if (kind === "usuarios") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 18c0-3 2.5-5 6-5s6 2 6 5" />
        <circle cx="18" cy="9" r="2.2" />
        <path d="M14.5 18c.4-1.8 1.8-3 3.8-3 1.2 0 2.3.4 3.2 1.1" />
      </svg>
    );
  }

  if (kind === "mantenciones") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.2" />
        <path d="M12 7.8v4.5l3 2" />
      </svg>
    );
  }

  if (kind === "taller") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.7 6.3a4.2 4.2 0 0 0 3.5 5.9l-7.6 7.6a2.2 2.2 0 0 1-3.1 0l-.3-.3a2.2 2.2 0 0 1 0-3.1l7.6-7.6a4.2 4.2 0 0 0-.1-5.8z" />
      </svg>
    );
  }

  if (kind === "horarios") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="17" rx="2.4" />
        <path d="M8 2v4M16 2v4M3 9h18" />
        <path d="M12 12v4l2.6 1.6" />
      </svg>
    );
  }

  if (kind === "fichas_tecnicas") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="3.5" width="16" height="17" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h18v4H3zM3 10h18v4H3zM3 15h18v4H3z" />
    </svg>
  );
}

const navigationGroups = [
  {
    label: "Dashboard",
    icon: "dashboard",
    directValue: "resumen",
    items: [],
  },
  {
    label: "Motos",
    icon: "motos",
    items: [
      { label: "Crear motos", value: "motos" },
      { label: "Ver Catalogo", to: "/catalogo" },
    ],
  },
  {
    label: "Productos",
    icon: "productos",
    items: [
      { label: "Indumentaria Rider", kind: "heading" },
      { label: "Crear indumentaria rider", value: "accesorios_rider" },
      { label: "Ver catalogo", to: "/indumentaria" },
      { label: "Accesorios de moto", kind: "heading" },
      { label: "Crear accesorios de moto", value: "accesorios_motos" },
      { label: "Ver catalogo", to: "/accesorios" },
    ],
  },
  {
    label: "Mantenimiento",
    icon: "mantenciones",
    items: [
      { label: "Solicitudes de Mantencion", value: "mantenciones_solicitudes" },
      { label: "Fichas Historicas", value: "mantenciones_historicas" },
    ],
  },
  {
    label: "Taller",
    icon: "taller",
    items: [
      { label: "Etapa de Diagnostico", value: "taller_mantenciones_dia" },
      { label: "Motos en Taller", value: "taller_en_taller" },
      { label: "Por Entregar", value: "taller_por_entregar" },
    ],
  },
  {
    label: "Horarios",
    icon: "horarios",
    items: [
      { label: "Horario de la Semana", value: "horarios_operativos" },
      { label: "Calendario de disponibilidad", value: "horarios_calendario" },
    ],
  },
  {
    label: "Usuarios",
    icon: "usuarios",
    items: [
      { label: "Crear Usuario", value: "crear_usuario" },
    ],
  },
  {
    label: "Mantenedores",
    icon: "mantenedores",
    items: [
      { label: "Motos", kind: "heading" },
      { label: "Marca", value: "marcas_motos" },
      { label: "Modelo", value: "modelos_motos" },
      { label: "Categoria", value: "categoria_motos" },
      { label: "Accesorios de moto", kind: "heading" },
      { label: "Marca", value: "marcas_acc_motos" },
      { label: "Categoria", value: "categorias_acc_motos" },
      { label: "Indumentaria rider", kind: "heading" },
      { label: "Marca", value: "marcas_acc_rider" },
      { label: "Categoria", value: "categorias_acc_rider" },
    ],
  },
  {
    label: "Fichas tecnicas",
    icon: "fichas_tecnicas",
    items: [
      { label: "Resumen general", value: "fichas_resumen" },
      { label: "Secciones", value: "fichas_secciones" },
      { label: "Items", value: "fichas_items" },
    ],
  },
  {
    label: "Configuracion",
    icon: "categorias",
    items: [{ label: "Contacto y datos del sitio", value: "contacto" }],
  },
];

function getGroupLabelBySection(section) {
  const group = navigationGroups.find((item) =>
    item.directValue === section || item.items.some((subItem) => subItem.value && subItem.value === section)
  );
  return group?.label || navigationGroups[0].label;
}

export default function AdminSidebar({ activeSection, onChangeSection, className = "", onNavigate, onLogout }) {
  const navigate = useNavigate();
  const activeGroupLabel = useMemo(() => getGroupLabelBySection(activeSection), [activeSection]);
  const [expandedGroup, setExpandedGroup] = useState(activeGroupLabel);

  useEffect(() => {
    setExpandedGroup(activeGroupLabel);
  }, [activeGroupLabel]);

  function toggleGroup(groupLabel) {
    setExpandedGroup((prev) => (prev === groupLabel ? null : groupLabel));
  }

  function handleSelectSection(groupLabel, sectionValue) {
    setExpandedGroup(groupLabel);
    onChangeSection(sectionValue);
    onNavigate?.();
  }

  function handleExternalNavigate(groupLabel, path) {
    setExpandedGroup(groupLabel);
    onNavigate?.();
    navigate(path);
  }

  return (
    <aside className={`admin-sidebar ${className}`.trim()}>
      <div className="admin-sidebar-card">
        <p className="admin-sidebar-eyebrow">Navegacion</p>
        <nav className="admin-sidebar-nav">
          {navigationGroups.map((group) => {
            const isDirect = Boolean(group.directValue);
            const isOpen = expandedGroup === group.label;
            const hasActiveItem = isDirect
              ? group.directValue === activeSection
              : group.items.some((item) => item.value && item.value === activeSection);

            return (
              <div key={group.label} className={isOpen ? "admin-sidebar-module open" : "admin-sidebar-module"}>
                <button
                  type="button"
                  className={hasActiveItem ? "admin-sidebar-module-trigger active" : "admin-sidebar-module-trigger"}
                  onClick={() => {
                    if (isDirect) {
                      handleSelectSection(group.label, group.directValue);
                      return;
                    }
                    toggleGroup(group.label);
                  }}
                  aria-expanded={isDirect ? undefined : isOpen}
                >
                  <span className="admin-sidebar-module-icon">
                    <SidebarIcon kind={group.icon} />
                  </span>
                  <span className="admin-sidebar-module-label">{group.label}</span>
                  {!isDirect && (
                    <span className={isOpen ? "admin-sidebar-module-caret open" : "admin-sidebar-module-caret"}>v</span>
                  )}
                </button>

                {!isDirect && isOpen && (
                  <div className="admin-sidebar-subnav">
                    {group.items.map((item) => (
                      item.kind === "heading" ? (
                        <p key={`${group.label}-${item.label}`} className="admin-sidebar-subtitle">
                          {item.label}
                        </p>
                      ) : (
                        <button
                          key={`${group.label}-${item.value || item.to}`}
                          type="button"
                          className={
                            activeSection === item.value
                              ? "admin-sidebar-link admin-sidebar-sublink active"
                              : "admin-sidebar-link admin-sidebar-sublink"
                          }
                          onClick={() =>
                            item.to
                              ? handleExternalNavigate(group.label, item.to)
                              : handleSelectSection(group.label, item.value)
                          }
                        >
                          {item.label}
                        </button>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-quick-actions">
          <button type="button" className="admin-sidebar-link" onClick={() => handleExternalNavigate("Navegacion", "/")}>
            Ver sitio
          </button>
          <button type="button" className="admin-sidebar-link admin-sidebar-link-danger" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}


