import CancelMantencionModal from "./CancelMantencionModal";
import ClienteDatosModal from "./ClienteDatosModal";
import IngresoModal from "./IngresoModal";
import EntregaModal from "./EntregaModal";

export default function MantencionesModalHost({ activeSection, transitions, clienteDatosItem, onCloseClienteDatos }) {
  const cancelTitle = transitions.cancelConfirm?.isReagendacion
    ? "Confirmar reagendacion"
    : activeSection === "mantenciones_solicitudes"
      ? "Confirmar anulacion"
      : "Confirmar cancelacion";

  return (
    <>
      <CancelMantencionModal
        isOpen={Boolean(transitions.cancelConfirm)}
        isSaving={transitions.isCancelConfirmSaving}
        actionLabel={transitions.cancelConfirm?.actionLabel || cancelTitle}
        moto={transitions.cancelConfirm?.moto || "-"}
        fecha={transitions.cancelConfirm?.fecha || "-"}
        hora={transitions.cancelConfirm?.hora || "-"}
        motivo={transitions.cancelMotivo}
        error={transitions.cancelError}
        isReagendacion={Boolean(transitions.cancelConfirm?.isReagendacion)}
        onMotivoChange={transitions.setCancelMotivo}
        onSubmit={transitions.submitCancelConfirm}
        onCancel={transitions.closeCancelConfirm}
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

