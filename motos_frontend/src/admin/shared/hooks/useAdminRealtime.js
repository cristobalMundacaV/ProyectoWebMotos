import { useEffect } from "react";
import { subscribeRealtime } from "../../../services/realtimeSocket";

export default function useAdminRealtime({
  activeSection,
  fetchUsersList,
  fetchMantencionesList,
  fetchHorariosMantencionList,
}) {
  useEffect(() => {
    const isUsersSection = activeSection === "lista_usuarios" || activeSection === "crear_usuario";
    const isMantencionesSection =
      activeSection === "mantenciones_solicitudes" ||
      activeSection === "mantenciones_fichas" ||
      activeSection === "mantenciones_historicas" ||
      activeSection === "taller_en_taller";
    const isHorariosSection =
      activeSection === "horarios_operativos" ||
      activeSection === "mantenciones_horarios" ||
      activeSection === "horarios_calendario";

    if (!isUsersSection && !isMantencionesSection && !isHorariosSection) return undefined;

    let mounted = true;

    const unsubscribe = subscribeRealtime((event) => {
      if (!mounted || !event?.type) return;
      const eventType = String(event.type);

      try {
        if (isUsersSection && ["user_created", "user_updated", "user_deleted"].includes(eventType)) {
          fetchUsersList({ background: true }).catch(() => {});
          return;
        }

        if (
          isMantencionesSection &&
          ["maintenance_created", "maintenance_updated", "maintenance_status_changed"].includes(eventType)
        ) {
          fetchMantencionesList().catch(() => {});
          return;
        }

        if (isHorariosSection && ["schedule_updated", "availability_updated"].includes(eventType)) {
          fetchHorariosMantencionList().catch(() => {});
        }
      } catch {
        // Actualizacion silenciosa para no saturar con toasts en tiempo real.
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [
    activeSection,
    fetchHorariosMantencionList,
    fetchMantencionesList,
    fetchUsersList,
  ]);
}
