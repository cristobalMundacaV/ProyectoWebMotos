import { formatIntegerCL } from "../utils/mantencionesViewUtils";

export default function IngresoModal({
  isOpen,
  isSaving,
  confirmation,
  error,
  onClose,
  onKilometrajeChange,
  onConfirm,
}) {
  if (!isOpen || !confirmation) return null;

  return (
    <div
      className="admin-confirm-modal-overlay"
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <section className="admin-confirm-modal" onClick={(event) => event.stopPropagation()}>
        <img src="/images/informacion.png" alt="Informacion" className="admin-confirm-modal-image" />
        <h3>Confirmar ingreso a taller</h3>
        <p className="admin-confirm-modal-text">
          Vas a ingresar al taller la motocicleta <strong>{confirmation.moto}</strong> del{" "}
          <strong>{confirmation.fecha}</strong> a las <strong>{confirmation.hora}</strong>.
        </p>
        <p className="admin-confirm-modal-subtext">
          Ingresa el kilometraje actual para cambiar el estado a <strong>En proceso</strong>.
        </p>

        <label className="admin-confirm-modal-field">
          Kilometraje actual
          <input
            type="text"
            inputMode="numeric"
            value={formatIntegerCL(confirmation.kilometraje)}
            disabled={isSaving}
            onChange={(event) => onKilometrajeChange(event.target.value)}
          />
        </label>
        {error ? <p className="admin-confirm-modal-error">{error}</p> : null}

        <div className="admin-confirm-modal-actions">
          <button type="button" className="btn-back" disabled={isSaving} onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn-delete" disabled={isSaving} onClick={onConfirm}>
            Ingresar
          </button>
        </div>
      </section>
    </div>
  );
}

