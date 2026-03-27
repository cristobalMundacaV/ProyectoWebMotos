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

const SIDEBAR_STRUCTURE = {
  dashboard: {
    label: "Dashboard",
    icon: "dashboard",
    directValue: "resumen",
    roles: ["admin", "mecanico", "cliente"],
  },
  blocks: [
    {
      id: "catalogo",
      title: "Catalogo",
      groups: [
        {
          label: "Motos",
          icon: "motos",
          roles: ["admin", "mecanico"],
          items: [
            { label: "Crear motos", value: "motos", roles: ["admin", "mecanico"] },
            { label: "Ver catalogo", to: "/catalogo", roles: ["admin", "mecanico"] },
          ],
        },
        {
          label: "Productos",
          icon: "productos",
          roles: ["admin", "mecanico"],
          items: [
            { label: "Indumentaria Rider", kind: "heading" },
            { label: "Crear indumentaria rider", value: "accesorios_rider", roles: ["admin", "mecanico"] },
            { label: "Ver catalogo", to: "/indumentaria", roles: ["admin", "mecanico"] },
            { label: "Accesorios de moto", kind: "heading" },
            { label: "Crear accesorios de moto", value: "accesorios_motos", roles: ["admin", "mecanico"] },
            { label: "Ver catalogo", to: "/accesorios", roles: ["admin", "mecanico"] },
          ],
        },
        {
          label: "Fichas tecnicas",
          icon: "fichas_tecnicas",
          roles: ["admin", "mecanico"],
          items: [{ label: "Resumen general", value: "fichas_resumen", roles: ["admin", "mecanico"] }],
        },
      ],
    },
    {
      id: "operacion",
      title: "Operacion",
      groups: [
        {
          label: "Mantenimiento",
          icon: "mantenciones",
          roles: ["admin", "mecanico"],
          items: [
            { label: "Solicitudes de Mantencion", value: "mantenciones_solicitudes", roles: ["admin", "mecanico"] },
            { label: "Fichas Historicas", value: "mantenciones_historicas", roles: ["admin", "mecanico"] },
          ],
        },
        {
          label: "Taller",
          icon: "taller",
          roles: ["admin", "mecanico"],
          items: [
            { label: "Etapa de Diagnostico", value: "taller_mantenciones_dia", roles: ["admin", "mecanico"] },
            { label: "Motos en Taller", value: "taller_en_taller", roles: ["admin", "mecanico"] },
          ],
        },
        {
          label: "Horarios",
          icon: "horarios",
          roles: ["admin", "mecanico"],
          items: [
            { label: "Horario de la Semana", value: "horarios_operativos", roles: ["admin", "mecanico"] },
            { label: "Calendario de disponibilidad", value: "horarios_calendario", roles: ["admin", "mecanico"] },
          ],
        },
      ],
    },
    {
      id: "gestion",
      title: "Gestion",
      groups: [
        {
          label: "Usuarios",
          icon: "usuarios",
          roles: ["admin"],
          items: [
            { label: "Crear Usuario", value: "crear_usuario", roles: ["admin"] },
            { label: "Lista de usuarios", value: "lista_usuarios", roles: ["admin"] },
          ],
        },
        {
          label: "Mantenedores",
          icon: "mantenedores",
          roles: ["admin"],
          items: [
            { label: "Motos", kind: "heading" },
            { label: "Marca", value: "marcas_motos", roles: ["admin"] },
            { label: "Modelo", value: "modelos_motos", roles: ["admin"] },
            { label: "Categoria", value: "categoria_motos", roles: ["admin"] },
            { label: "Accesorios de moto", kind: "heading" },
            { label: "Marca", value: "marcas_acc_motos", roles: ["admin"] },
            { label: "Categoria", value: "categorias_acc_motos", roles: ["admin"] },
            { label: "Indumentaria rider", kind: "heading" },
            { label: "Marca", value: "marcas_acc_rider", roles: ["admin"] },
            { label: "Categoria", value: "categorias_acc_rider", roles: ["admin"] },
          ],
        },
      ],
    },
    {
      id: "sistema",
      title: "Sistema",
      groups: [
        {
          label: "Configuracion",
          icon: "categorias",
          roles: ["admin"],
          items: [{ label: "Contacto y datos del sitio", value: "contacto", roles: ["admin"] }],
        },
      ],
    },
  ],
};

function normalizeRole(value) {
  const role = String(value || "admin")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (["mecanico", "mecanica", "tecnico", "taller"].includes(role)) return "mecanico";
  if (["cliente", "user", "usuario"].includes(role)) return "cliente";
  if (
    [
      "admin",
      "administrador",
      "administradora",
      "superadmin",
      "staff",
      "owner",
      "gerente",
      "jefe",
    ].includes(role)
  ) {
    return "admin";
  }
  return "admin";
}

function hasRoleAccess(roles, currentRole) {
  if (!Array.isArray(roles) || roles.length === 0) return true;
  return roles.includes(currentRole);
}

function getVisibleNavigation(userRole) {
  const currentRole = normalizeRole(userRole);
  const visibleBlocks = SIDEBAR_STRUCTURE.blocks
    .map((block) => {
      const visibleGroups = block.groups
        .filter((group) => hasRoleAccess(group.roles, currentRole))
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.kind === "heading" || hasRoleAccess(item.roles, currentRole)),
        }))
        .filter((group) => group.items.some((item) => item.kind !== "heading"));
      return {
        ...block,
        groups: visibleGroups,
      };
    })
    .filter((block) => block.groups.length > 0);

  return {
    dashboard: hasRoleAccess(SIDEBAR_STRUCTURE.dashboard.roles, currentRole) ? SIDEBAR_STRUCTURE.dashboard : null,
    blocks: visibleBlocks,
  };
}

function flattenVisibleGroups(visibleNavigation) {
  return visibleNavigation.blocks.flatMap((block) => block.groups);
}

function getGroupLabelBySection(section, visibleNavigation) {
  const groups = flattenVisibleGroups(visibleNavigation);
  const group = groups.find((item) => item.items.some((subItem) => subItem.value && subItem.value === section));
  return group?.label || "";
}

export default function AdminSidebar({
  activeSection,
  onChangeSection,
  className = "",
  onNavigate,
  onLogout,
  userRole = "admin",
}) {
  const navigate = useNavigate();
  const visibleNavigation = useMemo(() => getVisibleNavigation(userRole), [userRole]);
  const groups = useMemo(() => flattenVisibleGroups(visibleNavigation), [visibleNavigation]);
  const activeGroupLabel = useMemo(
    () => getGroupLabelBySection(activeSection, visibleNavigation),
    [activeSection, visibleNavigation]
  );
  const [expandedGroup, setExpandedGroup] = useState(activeGroupLabel || groups[0]?.label || "");

  useEffect(() => {
    if (!activeGroupLabel) return;
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

        {visibleNavigation.dashboard && (
          <div className="admin-sidebar-nav admin-sidebar-dashboard-nav">
            <div className="admin-sidebar-module">
              <button
                type="button"
                className={
                  activeSection === visibleNavigation.dashboard.directValue
                    ? "admin-sidebar-module-trigger active"
                    : "admin-sidebar-module-trigger"
                }
                onClick={() => handleSelectSection("Dashboard", visibleNavigation.dashboard.directValue)}
              >
                <span className="admin-sidebar-module-icon">
                  <SidebarIcon kind={visibleNavigation.dashboard.icon} />
                </span>
                <span className="admin-sidebar-module-label">{visibleNavigation.dashboard.label}</span>
              </button>
            </div>
          </div>
        )}

        <nav className="admin-sidebar-nav">
          {visibleNavigation.blocks.map((block) => (
            <section key={block.id} className="admin-sidebar-section" aria-label={block.title}>
              <p className="admin-sidebar-section-title">{block.title}</p>
              {block.groups.map((group) => {
                const isOpen = expandedGroup === group.label;
                const hasActiveItem = group.items.some((item) => item.value && item.value === activeSection);

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
                        {group.items.map((item) =>
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
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </nav>

        <div className="admin-sidebar-quick-actions">
          <button type="button" className="admin-sidebar-link" onClick={() => handleExternalNavigate("Navegacion", "/")}>
            Ver sitio
          </button>
          <button type="button" className="admin-sidebar-link admin-sidebar-link-danger" onClick={onLogout}>
            Cerrar sesion
          </button>
        </div>
      </div>
    </aside>
  );
}
