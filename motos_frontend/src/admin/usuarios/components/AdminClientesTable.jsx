import AdminPagination from "../../shared/components/AdminPagination";

export default function AdminClientesTable({
  adminClientes,
  adminClientesLoading,
  paginatedAdminClientes,
  onPageChange,
}) {
  if (adminClientesLoading) {
    return <p className="admin-empty">Cargando clientes...</p>;
  }

  if (!Array.isArray(adminClientes) || adminClientes.length === 0) {
    return <p className="admin-empty">No hay clientes registrados.</p>;
  }

  return (
    <>
      <div className="admin-table">
        {paginatedAdminClientes.items.map((cliente, index) => {
          const fullName = `${cliente?.first_name || ""} ${cliente?.last_name || ""}`.trim();
          const joined = cliente?.date_joined ? new Date(cliente.date_joined).toLocaleDateString("es-CL") : "-";
          return (
            <div
              key={cliente?.id || cliente?.username || `cliente-row-${index}`}
              className="admin-table-row admin-moto-table-row"
            >
              <div className="admin-moto-table-cell">
                <strong>{fullName || cliente?.username || "Sin nombre"}</strong>
                <span>@{cliente?.username || "-"}</span>
              </div>
              <div className="admin-moto-table-cell">
                <strong>{cliente?.email || "Sin correo"}</strong>
                <span>{cliente?.telefono || "Sin telefono"}</span>
              </div>
              <div className="admin-moto-table-cell">
                <strong>{cliente?.rol || "cliente"}</strong>
                <span>Registro: {joined}</span>
              </div>
            </div>
          );
        })}
      </div>
      <AdminPagination pagination={paginatedAdminClientes} onPageChange={onPageChange} />
    </>
  );
}
