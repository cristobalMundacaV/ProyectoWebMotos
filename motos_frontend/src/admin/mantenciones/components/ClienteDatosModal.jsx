function getClienteNombre(item) {
  const moto = item?.moto_cliente_detalle || {};
  const snapshot = `${moto.cliente_nombres || ""} ${moto.cliente_apellidos || ""}`.trim();
  return snapshot || moto.cliente_nombre || "-";
}

function getVehicleLabel(item) {
  const moto = item?.moto_cliente_detalle || {};
  return `${moto.marca || "-"} ${moto.modelo || "-"}`.trim();
}

export default function ClienteDatosModal({ isOpen, item, onClose }) {
  if (!isOpen || !item) return null;

  const moto = item?.moto_cliente_detalle || {};
  const rows = [
    ["Nombre completo", getClienteNombre(item)],
    ["RUT", item.rut_cliente || "-"],
    ["Correo", moto.cliente_email || "-"],
    ["Telefono", moto.cliente_telefono || "-"],
    ["Moto", getVehicleLabel(item)],
    ["Matricula", moto.matricula || "-"],
  ];

  return (
    <div className="admin-confirm-modal-overlay" onClick={onClose}>
      <section className="admin-confirm-modal admin-cliente-datos-modal" onClick={(event) => event.stopPropagation()}>
        <img src="/images/informacion.png" alt="Informacion" className="admin-confirm-modal-image" />
        <h3>Datos cliente</h3>
        <p className="admin-confirm-modal-subtext">Informacion de contacto y vehiculo asociado a la ficha seleccionada.</p>

        <div className="admin-cliente-datos-table-wrap">
          <table className="admin-cliente-datos-table" role="table" aria-label="Datos del cliente">
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-confirm-modal-actions">
          <button type="button" className="btn-back" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </section>
    </div>
  );
}
