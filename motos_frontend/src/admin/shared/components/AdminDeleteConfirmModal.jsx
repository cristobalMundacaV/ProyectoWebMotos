export default function AdminDeleteConfirmModal({
  isOpen,
  isSaving = false,
  title = "Confirmar eliminacion",
  message = "",
  confirmLabel = "Eliminar",
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="admin-confirm-modal-overlay"
      onClick={() => {
        if (!isSaving) onClose?.();
      }}
    >
      <section className="admin-confirm-modal" onClick={(event) => event.stopPropagation()}>
        <img src="/images/informacion.png" alt="Informacion" className="admin-confirm-modal-image" />
        <h3>{title}</h3>
        <p className="admin-confirm-modal-text">{message}</p>

        <div className="admin-confirm-modal-actions">
          <button type="button" className="btn-back" disabled={isSaving} onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn-delete" disabled={isSaving} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

