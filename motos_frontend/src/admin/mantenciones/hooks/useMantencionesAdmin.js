import { useCallback, useEffect, useState } from "react";
import { getMantencionesAdmin, updateMantencionAdmin } from "../services/mantencionesAdminService";

const MANTENCIONES_SECTIONS = new Set([
  "mantenciones_solicitudes",
  "mantenciones_fichas",
  "mantenciones_historicas",
  "taller_en_taller",
]);

export default function useMantencionesAdmin({ activeSection, pushToast, getErrorText }) {
  const [mantenciones, setMantenciones] = useState([]);
  const [mantencionesLoading, setMantencionesLoading] = useState(true);
  const [mantencionSavingById, setMantencionSavingById] = useState({});

  const fetchMantencionesList = useCallback(async () => {
    const rows = await getMantencionesAdmin();
    setMantenciones(rows);
    return rows;
  }, []);

  useEffect(() => {
    if (!MANTENCIONES_SECTIONS.has(activeSection)) return;
    let isMounted = true;
    setMantencionesLoading(true);

    getMantencionesAdmin()
      .then((rows) => {
        if (!isMounted) return;
        setMantenciones(rows);
      })
      .catch((error) => {
        if (!isMounted) return;
        setMantenciones([]);
        pushToast(getErrorText(error, "No se pudo cargar la lista de mantenciones."), "error");
      })
      .finally(() => {
        if (isMounted) setMantencionesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSection, getErrorText, pushToast]);

  const handleAcceptMantencionSolicitud = useCallback(
    async (mantencionId, actionKey = "approve") => {
      setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: actionKey }));
      try {
        const updated = await updateMantencionAdmin(mantencionId, { estado: "aprobado" });
        setMantenciones((prev) => prev.map((item) => (item.id === mantencionId ? updated : item)));
        pushToast("Hora aprobada. La solicitud quedo en estado aprobado.", "success");
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo aceptar la solicitud de mantencion."), "error");
      } finally {
        setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: "" }));
      }
    },
    [getErrorText, pushToast]
  );

  const handleUpdateMantencion = useCallback(
    async (mantencionId, payload, actionKey = "update") => {
      setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: actionKey }));
      try {
        const updated = await updateMantencionAdmin(mantencionId, payload);
        setMantenciones((prev) => prev.map((item) => (item.id === mantencionId ? updated : item)));
        if (payload?.estado === "cancelado") {
          pushToast("Solicitud anulada correctamente.", "success");
        } else {
          pushToast("Mantencion actualizada correctamente.", "success");
        }
      } catch (error) {
        pushToast(getErrorText(error, "No se pudo actualizar la mantencion."), "error");
      } finally {
        setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: "" }));
      }
    },
    [getErrorText, pushToast]
  );

  return {
    mantenciones,
    setMantenciones,
    mantencionesLoading,
    setMantencionesLoading,
    mantencionSavingById,
    fetchMantencionesList,
    handleAcceptMantencionSolicitud,
    handleUpdateMantencion,
  };
}
