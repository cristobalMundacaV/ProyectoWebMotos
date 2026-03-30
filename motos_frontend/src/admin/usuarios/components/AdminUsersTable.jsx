import AdminPagination from "../../shared/components/AdminPagination";

export default function AdminUsersTable({
  adminUsers,
  adminUsersLoading,
  paginatedAdminUsers,
  onEditUser,
  onDeleteUser,
  onPageChange,
}) {
  if (adminUsersLoading) {
    return <p className="admin-empty">Cargando usuarios...</p>;
  }
  if (adminUsers.length === 0) {
    return <p className="admin-empty">No hay usuarios registrados.</p>;
  }

  function formatRoleLabel(roleValue) {
    const raw = String(roleValue || "").trim().toLowerCase();
    if (!raw) return "-";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return (
    <>
      <div className="admin-table">
        {paginatedAdminUsers.items.map((user, index) => {
          const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
          return (
            <div
              key={user?.id || user?.username || `user-row-${index}`}
              className="admin-table-row admin-moto-table-row admin-moto-table-row-actions"
            >
              <div className="admin-moto-table-cell">
                <strong>{fullName || user?.username || "Sin nombre"}</strong>
                <span>@{user?.username || "-"}</span>
              </div>
              <div className="admin-moto-table-cell">
                <strong>{formatRoleLabel(user?.rol || user?.role)}</strong>
                <span>{user?.email || user?.telefono || "Sin contacto"}</span>
              </div>
              <div className="admin-row-actions">
                <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onEditUser(user)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onDeleteUser(user)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <AdminPagination pagination={paginatedAdminUsers} onPageChange={onPageChange} />
    </>
  );
}
