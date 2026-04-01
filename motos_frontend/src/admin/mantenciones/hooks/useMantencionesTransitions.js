import { useCallback, useEffect, useMemo, useState } from "react";
import { extractErrorMessage, formatDate, formatIntegerCL, sanitizeIntegerInput, sanitizeRutInput, toWholeNumber } from "../utils/mantencionesViewUtils";

export default function useMantencionesTransitions({ savingById, onAcceptSolicitud, onUpdateMantencion }) {
  const [editsById, setEditsById] = useState({});
  const [editableFinalizadaById, setEditableFinalizadaById] = useState({});
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [ingresoConfirm, setIngresoConfirm] = useState(null);
  const [ingresoError, setIngresoError] = useState("");
  const [deliverConfirm, setDeliverConfirm] = useState(null);
  const [deliverError, setDeliverError] = useState("");

  const isCancelConfirmSaving = cancelConfirm ? Boolean(savingById[cancelConfirm.id]) : false;
  const isIngresoConfirmSaving = ingresoConfirm ? savingById[ingresoConfirm.id] === "ingreso" : false;
  const isDeliverConfirmSaving = deliverConfirm ? savingById[deliverConfirm.id] === "deliver" : false;

  const getDraft = useCallback(
    (item) => {
      const base = {
        estado: item.estado,
        costo_total: item.costo_total === null || item.costo_total === undefined ? "" : String(toWholeNumber(item.costo_total)),
        kilometraje_ingreso: item.kilometraje_ingreso ?? "",
        diagnostico: item.diagnostico ?? "",
        trabajo_realizado: item.trabajo_realizado ?? "",
        observaciones: item.observaciones ?? "",
      };
      const edit = editsById[item.id] || {};
      return { ...base, ...edit };
    },
    [editsById]
  );

  const setDraftField = useCallback((id, field, value) => {
    setEditsById((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }, []);

  const buildEditablePayload = useCallback((item, estadoSiguiente = item.estado) => {
    const draft = getDraft(item);
    const edits = editsById[item.id] || {};
    const payload = {
      estado: estadoSiguiente,
      kilometraje_ingreso:
        draft.kilometraje_ingreso === "" || draft.kilometraje_ingreso === null
          ? null
          : Number.parseInt(draft.kilometraje_ingreso, 10),
      diagnostico: draft.diagnostico ?? item.diagnostico ?? "",
      trabajo_realizado: draft.trabajo_realizado ?? item.trabajo_realizado ?? "",
      observaciones: draft.observaciones ?? item.observaciones ?? "",
    };

    if (Object.prototype.hasOwnProperty.call(edits, "costo_total")) {
      const rawCosto = String(draft.costo_total ?? "").trim();
      payload.costo_total = rawCosto === "" ? null : Number.parseInt(rawCosto, 10) || 0;
    }

    return payload;
  }, [editsById, getDraft]);

  const hasPendingChanges = useCallback(
    (item) => {
      const draft = getDraft(item);

      const currentKilometraje =
        draft.kilometraje_ingreso === "" || draft.kilometraje_ingreso === null
          ? null
          : Number.parseInt(String(draft.kilometraje_ingreso), 10);
      const baseKilometraje =
        item.kilometraje_ingreso === "" || item.kilometraje_ingreso === null
          ? null
          : Number.parseInt(String(item.kilometraje_ingreso), 10);

      const currentDiagnostico = draft.diagnostico ?? "";
      const currentTrabajo = draft.trabajo_realizado ?? "";
      const currentObservaciones = draft.observaciones ?? "";

      const baseDiagnostico = item.diagnostico ?? "";
      const baseTrabajo = item.trabajo_realizado ?? "";
      const baseObservaciones = item.observaciones ?? "";

      if (currentKilometraje !== baseKilometraje) return true;
      if (currentDiagnostico !== baseDiagnostico) return true;
      if (currentTrabajo !== baseTrabajo) return true;
      if (currentObservaciones !== baseObservaciones) return true;

      const currentCosto = String(draft.costo_total ?? "").trim();
      const baseCosto =
        item.costo_total === null || item.costo_total === undefined ? "" : String(toWholeNumber(item.costo_total));
      if (currentCosto !== baseCosto) return true;

      return false;
    },
    [getDraft]
  );

  const canEditRecord = useCallback((itemId) => Boolean(editableFinalizadaById[itemId]), [editableFinalizadaById]);

  const setEditableRecord = useCallback((itemId, value) => {
    setEditableFinalizadaById((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  }, []);

  const resetEditableRecords = useCallback(() => {
    setEditableFinalizadaById({});
  }, []);

  const openCancelConfirm = useCallback((item, actionLabel = "Cancelar mantenimiento") => {
    const moto = item?.moto_cliente_detalle || {};
    setCancelConfirm({
      id: item.id,
      actionLabel,
      moto: `${moto.marca || "-"} ${moto.modelo || "-"}`.trim(),
      fecha: formatDate(item.fecha_ingreso),
      hora: item.hora_ingreso ? String(item.hora_ingreso).slice(0, 5) : "-",
    });
  }, []);

  const closeCancelConfirm = useCallback(() => {
    setCancelConfirm(null);
  }, []);

  const submitCancelConfirm = useCallback(async () => {
    if (!cancelConfirm) return;
    const targetId = cancelConfirm.id;
    try {
      await onUpdateMantencion(targetId, { estado: "cancelado" }, "cancel");
      setCancelConfirm(null);
    } catch {
      // Keep modal open so operator can retry after backend errors.
    }
  }, [cancelConfirm, onUpdateMantencion]);

  const approveSolicitud = useCallback((itemId) => onAcceptSolicitud(itemId, "approve"), [onAcceptSolicitud]);

  const openIngresoConfirm = useCallback((item) => {
    const moto = item?.moto_cliente_detalle || {};
    setIngresoError("");
    setIngresoConfirm({
      id: item.id,
      moto: `${moto.marca || "-"} ${moto.modelo || "-"}`.trim(),
      fecha: formatDate(item.fecha_ingreso),
      hora: item.hora_ingreso ? String(item.hora_ingreso).slice(0, 5) : "-",
      kilometraje: sanitizeIntegerInput(moto.kilometraje_actual ?? item.kilometraje_ingreso ?? ""),
    });
  }, []);

  const closeIngresoConfirm = useCallback(() => {
    setIngresoConfirm(null);
    setIngresoError("");
  }, []);

  const setIngresoKilometraje = useCallback((value) => {
    setIngresoError("");
    const clean = sanitizeIntegerInput(value);
    setIngresoConfirm((prev) => (prev ? { ...prev, kilometraje: clean } : prev));
  }, []);

  const submitIngresoConfirm = useCallback(async () => {
    if (!ingresoConfirm) return;
    const targetId = ingresoConfirm.id;
    const km = Number.parseInt(String(ingresoConfirm.kilometraje ?? "").trim(), 10);
    if (!Number.isFinite(km) || km < 0) {
      setIngresoError("Ingresa un kilometraje valido.");
      return;
    }

    try {
      await onUpdateMantencion(targetId, { estado: "en_proceso", kilometraje_ingreso: km }, "ingreso");
      setIngresoConfirm(null);
      setIngresoError("");
    } catch (error) {
      setIngresoError(extractErrorMessage(error, "No se pudo confirmar el ingreso. Revisa los datos e intenta de nuevo."));
    }
  }, [ingresoConfirm, onUpdateMantencion]);

  const openEntregaConfirm = useCallback((item) => {
    const moto = item?.moto_cliente_detalle || {};
    const draft = getDraft(item);
    setDeliverError("");
    setDeliverConfirm({
      id: item.id,
      moto: `${moto.marca || "-"} ${moto.modelo || "-"}`.trim(),
      rutRetira: "",
      nombreRetira: "",
      valorCobrado: sanitizeIntegerInput(draft.costo_total ?? item.costo_total ?? ""),
      observacionesBase: (draft.observaciones ?? item.observaciones ?? "").trim(),
    });
  }, [getDraft]);

  const closeEntregaConfirm = useCallback(() => {
    setDeliverConfirm(null);
    setDeliverError("");
  }, []);

  const setEntregaField = useCallback((field, value) => {
    setDeliverError("");
    const normalized = field === "rutRetira" ? sanitizeRutInput(value) : field === "valorCobrado" ? sanitizeIntegerInput(value) : value;
    setDeliverConfirm((prev) => (prev ? { ...prev, [field]: normalized } : prev));
  }, []);

  const submitEntregaConfirm = useCallback(async () => {
    if (!deliverConfirm) return;
    const targetId = deliverConfirm.id;
    const rutRetira = String(deliverConfirm.rutRetira || "").trim();
    const nombreRetira = String(deliverConfirm.nombreRetira || "").trim();
    const valor = Number.parseInt(String(deliverConfirm.valorCobrado || "").trim(), 10);

    if (!rutRetira) {
      setDeliverError("Ingresa el RUT de quien retira.");
      return;
    }
    if (!nombreRetira) {
      setDeliverError("Ingresa el nombre de quien retira.");
      return;
    }
    if (!Number.isFinite(valor) || valor < 0) {
      setDeliverError("Ingresa un valor cobrado valido.");
      return;
    }

    const retiroNote = `Entrega a ${nombreRetira} (RUT: ${rutRetira}). Valor cobrado: ${formatIntegerCL(valor)}.`;
    const observaciones = [deliverConfirm.observacionesBase, retiroNote].filter(Boolean).join(" | ");

    try {
      await onUpdateMantencion(
        targetId,
        {
          estado: "entregada",
          costo_total: valor,
          observaciones,
        },
        "deliver"
      );
      setDeliverConfirm(null);
      setDeliverError("");
    } catch (error) {
      setDeliverError(extractErrorMessage(error, "No se pudo confirmar la entrega. Revisa los datos e intenta de nuevo."));
    }
  }, [deliverConfirm, onUpdateMantencion]);

  const updateItemEstado = useCallback(
    async ({ item, estado, action }) => {
      try {
        await onUpdateMantencion(item.id, buildEditablePayload(item, estado), action);
      } catch {
        // Error toast is handled by useMantencionesAdmin; avoid unhandled rejections on click handlers.
      }
    },
    [buildEditablePayload, onUpdateMantencion]
  );

  const clearAllModalState = useCallback(() => {
    setCancelConfirm(null);
    setIngresoConfirm(null);
    setIngresoError("");
    setDeliverConfirm(null);
    setDeliverError("");
  }, []);

  useEffect(() => {
    if (!cancelConfirm) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !isCancelConfirmSaving) {
        setCancelConfirm(null);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [cancelConfirm, isCancelConfirmSaving]);

  useEffect(() => {
    if (!ingresoConfirm) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !isIngresoConfirmSaving) {
        setIngresoConfirm(null);
        setIngresoError("");
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [ingresoConfirm, isIngresoConfirmSaving]);

  useEffect(() => {
    if (!deliverConfirm) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !isDeliverConfirmSaving) {
        setDeliverConfirm(null);
        setDeliverError("");
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [deliverConfirm, isDeliverConfirmSaving]);

  return useMemo(
    () => ({
      getDraft,
      hasPendingChanges,
      setDraftField,
      buildEditablePayload,
      canEditRecord,
      setEditableRecord,
      resetEditableRecords,
      cancelConfirm,
      isCancelConfirmSaving,
      openCancelConfirm,
      closeCancelConfirm,
      submitCancelConfirm,
      ingresoConfirm,
      ingresoError,
      isIngresoConfirmSaving,
      openIngresoConfirm,
      closeIngresoConfirm,
      setIngresoKilometraje,
      submitIngresoConfirm,
      deliverConfirm,
      deliverError,
      isDeliverConfirmSaving,
      openEntregaConfirm,
      closeEntregaConfirm,
      setEntregaField,
      submitEntregaConfirm,
      approveSolicitud,
      updateItemEstado,
      clearAllModalState,
    }),
    [
      approveSolicitud,
      buildEditablePayload,
      canEditRecord,
      cancelConfirm,
      closeCancelConfirm,
      closeEntregaConfirm,
      closeIngresoConfirm,
      deliverConfirm,
      deliverError,
      getDraft,
      hasPendingChanges,
      ingresoConfirm,
      ingresoError,
      isCancelConfirmSaving,
      isDeliverConfirmSaving,
      isIngresoConfirmSaving,
      openCancelConfirm,
      openEntregaConfirm,
      openIngresoConfirm,
      resetEditableRecords,
      setDraftField,
      setEditableRecord,
      setEntregaField,
      setIngresoKilometraje,
      submitCancelConfirm,
      submitEntregaConfirm,
      submitIngresoConfirm,
      updateItemEstado,
      clearAllModalState,
    ]
  );
}
