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
      <div className="admin-clientes-table-wrap">
        <table className="admin-clientes-table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAdminClientes.items.map((cliente, index) => {
              const joined = cliente?.date_joined ? new Date(cliente.date_joined).toLocaleDateString("es-CL") : "-";
              return (
                <tr key={cliente?.id || `cliente-row-${index}`}>
                  <td>{cliente?.first_name || "-"}</td>
                  <td>{cliente?.last_name || "-"}</td>
                  <td>{cliente?.email || "-"}</td>
                  <td>{cliente?.telefono || "-"}</td>
                  <td>{joined}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AdminPagination pagination={paginatedAdminClientes} onPageChange={onPageChange} />
    </>
  );
}
