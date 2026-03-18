import { useEffect, useMemo, useState } from "react";

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
        <path d="M14.7 6.3a4.2 4.2 0 0 0 3.5 5.9l-7.6 7.6a2.2 2.2 0 0 1-3.1 0l-.3-.3a2.2 2.2 0 0 1 0-3.1l7.6-7.6a4.2 4.2 0 0 0-.1-5.8z" />
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
    items: [{ label: "Resumen", value: "resumen" }],
  },
  {
    label: "Motos",
    icon: "motos",
    items: [
      { label: "Marcas", value: "marcas_motos" },
      { label: "Categorias", value: "categoria_motos" },
      { label: "Motos", value: "motos" },
    ],
  },
  {
    label: "Categorias",
    icon: "categorias",
    items: [
      { label: "Cat. Accesorios de Moto", value: "categorias_acc_motos" },
      { label: "Cat. Indumentaria Rider", value: "categorias_acc_rider" },
    ],
  },
  {
    label: "Marcas",
    icon: "marcas",
    items: [
      { label: "Marcas Acc. Motos", value: "marcas_acc_motos" },
      { label: "Marcas Indumentaria", value: "marcas_acc_rider" },
    ],
  },
  {
    label: "Productos",
    icon: "productos",
    items: [
      { label: "Accesorios moto", value: "accesorios_motos" },
      { label: "Equipamiento rider", value: "accesorios_rider" },
    ],
  },
  {
    label: "Usuarios",
    icon: "usuarios",
    items: [
      { label: "Lista de Usuarios", value: "lista_usuarios" },
      { label: "Crear Usuario", value: "crear_usuario" },
    ],
  },
  {
    label: "Mantenimiento",
    icon: "mantenciones",
    items: [
      { label: "Solicitudes", value: "mantenciones_solicitudes" },
      { label: "En curso", value: "mantenciones_en_curso" },
      { label: "Fichas", value: "mantenciones_fichas" },
    ],
  },
  {
    label: "Configuracion",
    icon: "categorias",
    items: [{ label: "Contacto y datos del sitio", value: "contacto" }],
  },
];

function getGroupLabelBySection(section) {
  const group = navigationGroups.find((item) => item.items.some((subItem) => subItem.value === section));
  return group?.label || navigationGroups[0].label;
}

export default function AdminSidebar({ activeSection, onChangeSection, className = "", onNavigate }) {
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

  return (
    <aside className={`admin-sidebar ${className}`.trim()}>
      <div className="admin-sidebar-card">
        <p className="admin-sidebar-eyebrow">Navegacion</p>
        <nav className="admin-sidebar-nav">
          {navigationGroups.map((group) => {
            const isOpen = expandedGroup === group.label;
            const hasActiveItem = group.items.some((item) => item.value === activeSection);

            return (
              <div key={group.label} className={isOpen ? "admin-sidebar-module open" : "admin-sidebar-module"}>
                <button
                  type="button"
                  className={hasActiveItem ? "admin-sidebar-module-trigger active" : "admin-sidebar-module-trigger"}
                  onClick={() => toggleGroup(group.label)}
                  aria-expanded={isOpen}
                >
                  <span className="admin-sidebar-module-icon">
                    <SidebarIcon kind={group.icon} />
                  </span>
                  <span className="admin-sidebar-module-label">{group.label}</span>
                  <span className={isOpen ? "admin-sidebar-module-caret open" : "admin-sidebar-module-caret"}>v</span>
                </button>

                {isOpen && (
                  <div className="admin-sidebar-subnav">
                    {group.items.map((item) => (
                      <button
                        key={`${group.label}-${item.value}`}
                        type="button"
                        className={
                          activeSection === item.value
                            ? "admin-sidebar-link admin-sidebar-sublink active"
                            : "admin-sidebar-link admin-sidebar-sublink"
                        }
                        onClick={() => handleSelectSection(group.label, item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}


