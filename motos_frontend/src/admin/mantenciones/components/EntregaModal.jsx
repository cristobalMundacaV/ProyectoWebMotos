import { formatIntegerCL } from "../utils/mantencionesViewUtils";

export default function EntregaModal({
  isOpen,
  isSaving,
  confirmation,
  error,
  onClose,
  onFieldChange,
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
        <h3>Confirmar entrega</h3>
        <p className="admin-confirm-modal-text">
          Registraras la entrega de <strong>{confirmation.moto}</strong>.
        </p>
        <p className="admin-confirm-modal-subtext">
          Completa los datos de retiro para cambiar el estado a <strong>Entregado</strong>.
        </p>

        <label className="admin-confirm-modal-field">
          RUT de la persona que retira
          <input
            type="text"
            value={confirmation.rutRetira}
            disabled={isSaving}
            onChange={(event) => onFieldChange("rutRetira", event.target.value)}
          />
        </label>

        <label className="admin-confirm-modal-field">
          Nombre de la persona que retira
          <input
            type="text"
            value={confirmation.nombreRetira}
            disabled={isSaving}
            onChange={(event) => onFieldChange("nombreRetira", event.target.value)}
          />
        </label>

        <label className="admin-confirm-modal-field">
          Valor cobrado
          <div className="admin-currency-input-wrapper">
            <span className="admin-currency-symbol">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatIntegerCL(confirmation.valorCobrado)}
              disabled={isSaving}
              onChange={(event) => onFieldChange("valorCobrado", event.target.value)}
              placeholder="0"
            />
          </div>
        </label>

        {error ? <p className="admin-confirm-modal-error">{error}</p> : null}

        <div className="admin-confirm-modal-actions">
          <button type="button" className="btn-back" disabled={isSaving} onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn-confirm" disabled={isSaving} onClick={onConfirm}>
            Entregar
          </button>
        </div>
      </section>
    </div>
  );
}

