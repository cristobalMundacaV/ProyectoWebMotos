export default function CancelMantencionModal({
  isOpen,
  actionLabel,
  moto,
  fecha,
  hora,
  motivo,
  error,
  isSaving,
  isReagendacion,
  onMotivoChange,
  onSubmit,
  onCancel,
}) {
  if (!isOpen) return null;

  const modalTitle = isReagendacion ? "Reagendacion" : actionLabel;
  const confirmLabel = isReagendacion ? "Reagendar" : actionLabel;

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{modalTitle}</h2>
          <button
            type="button"
            className="admin-modal-close"
            disabled={isSaving}
            onClick={onCancel}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="admin-cancel-modal-info">
            <div>
              <strong>Moto:</strong>
              <span>{moto}</span>
            </div>
            <div>
              <strong>Fecha:</strong>
              <span>{fecha}</span>
            </div>
            <div>
              <strong>Hora:</strong>
              <span>{hora}</span>
            </div>
          </div>

          {!isReagendacion && (
            <div className="admin-cancel-modal-form">
              <label htmlFor="motivo-cancelacion">
                Motivo de cancelación
                <textarea
                  id="motivo-cancelacion"
                  className="admin-cancel-modal-textarea"
                  value={motivo}
                  onChange={(e) => onMotivoChange(e.target.value)}
                  placeholder="Describe el motivo de cancelación..."
                  disabled={isSaving}
                  rows={4}
                />
              </label>
            </div>
          )}

          {isReagendacion && (
            <div className="admin-cancel-modal-alert">
              <strong>Confirmacion</strong>
              <p>¿Estas seguro que quieres que el cliente reagende su hora?</p>
            </div>
          )}

          {error && <p className="admin-cancel-modal-error">{error}</p>}
        </div>

        <div className="admin-cancel-modal-footer">
          <button
            type="button"
            className="admin-modal-cancel-btn"
            disabled={isSaving}
            onClick={onCancel}
          >
            Volver
          </button>
          <button
            type="button"
            className="admin-modal-action-btn admin-primary-action"
            disabled={isSaving}
            onClick={onSubmit}
          >
            {isSaving ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
