import ConfirmCancelModal from "./ConfirmCancelModal";
import ClienteDatosModal from "./ClienteDatosModal";
import IngresoModal from "./IngresoModal";
import EntregaModal from "./EntregaModal";

export default function MantencionesModalHost({ activeSection, transitions, clienteDatosItem, onCloseClienteDatos }) {
  const cancelTitle = activeSection === "mantenciones_solicitudes" ? "Confirmar anulacion" : "Confirmar cancelacion";

  return (
    <>
      <ConfirmCancelModal
        isOpen={Boolean(transitions.cancelConfirm)}
        isSaving={transitions.isCancelConfirmSaving}
        confirmation={transitions.cancelConfirm}
        title={cancelTitle}
        onClose={transitions.closeCancelConfirm}
        onConfirm={transitions.submitCancelConfirm}
      />

      <IngresoModal
        isOpen={Boolean(transitions.ingresoConfirm)}
        isSaving={transitions.isIngresoConfirmSaving}
        confirmation={transitions.ingresoConfirm}
        error={transitions.ingresoError}
        onClose={transitions.closeIngresoConfirm}
        onKilometrajeChange={transitions.setIngresoKilometraje}
        onConfirm={transitions.submitIngresoConfirm}
      />

      <EntregaModal
        isOpen={Boolean(transitions.deliverConfirm)}
        isSaving={transitions.isDeliverConfirmSaving}
        confirmation={transitions.deliverConfirm}
        error={transitions.deliverError}
        onClose={transitions.closeEntregaConfirm}
        onFieldChange={transitions.setEntregaField}
        onConfirm={transitions.submitEntregaConfirm}
      />

      <ClienteDatosModal
        isOpen={Boolean(clienteDatosItem)}
        item={clienteDatosItem}
        onClose={onCloseClienteDatos}
      />
    </>
  );
}

