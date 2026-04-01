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

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{actionLabel}</h2>
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
          <div className="admin-modal-info">
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
            <div className="admin-modal-form-group">
              <label htmlFor="motivo-cancelacion">
                Motivo de cancelación
                <textarea
                  id="motivo-cancelacion"
                  className="admin-modal-textarea"
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
            <div className="admin-modal-alert">
              <strong>Reagendacion</strong>
              <p>El cliente recibira un correo notificando que debe reagendar su cita.</p>
            </div>
          )}

          {error && <p className="admin-modal-error">{error}</p>}
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-modal-cancel-btn"
            disabled={isSaving}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="admin-modal-action-btn admin-primary-action"
            disabled={isSaving}
            onClick={onSubmit}
          >
            {isSaving ? "Procesando..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
