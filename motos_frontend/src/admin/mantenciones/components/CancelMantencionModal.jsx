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

  const modalTitle = isReagendacion ? "Reagendacion" : "Confirmar cancelacion";
  const confirmLabel = isReagendacion ? "Reagendar" : actionLabel;

  return (
    <div
      className="admin-confirm-modal-overlay"
      onClick={() => {
        if (!isSaving) onCancel();
      }}
    >
      <section className="admin-confirm-modal" onClick={(event) => event.stopPropagation()}>
        <img src="/images/informacion.png" alt="Informacion" className="admin-confirm-modal-image" />
        <h3>{modalTitle}</h3>
        <p className="admin-confirm-modal-text">
          {isReagendacion
            ? "¿Estas seguro que quieres que el cliente reagende su hora?"
            : `Vas a cancelar el mantenimiento de ${moto} del ${fecha} a las ${hora}.`}
        </p>

        <div>
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

          {error && <p className="admin-cancel-modal-error">{error}</p>}
        </div>

        <div className="admin-cancel-modal-footer">
          <button
            type="button"
            className="btn-back"
            disabled={isSaving}
            onClick={onCancel}
          >
            Volver
          </button>
          <button
            type="button"
            className={isReagendacion ? "btn-confirm" : "btn-delete"}
            disabled={isSaving}
            onClick={onSubmit}
          >
            {isSaving ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
