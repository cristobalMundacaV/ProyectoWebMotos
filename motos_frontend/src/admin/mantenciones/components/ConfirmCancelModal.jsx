export default function ConfirmCancelModal({
  isOpen,
  isSaving,
  confirmation,
  title = "Confirmar cancelacion",
  onClose,
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
        <h3>{title}</h3>
        <p className="admin-confirm-modal-text">
          Vas a cancelar el mantenimiento de <strong>{confirmation.moto}</strong> del{" "}
          <strong>{confirmation.fecha}</strong> a las <strong>{confirmation.hora}</strong>.
        </p>
        <p className="admin-confirm-modal-subtext">
          Esta accion cambiara el estado a <strong>Cancelado</strong>.
        </p>

        <div className="admin-confirm-modal-actions">
          <button type="button" className="btn-back" disabled={isSaving} onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn-delete" disabled={isSaving} onClick={onConfirm}>
            {confirmation.actionLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

