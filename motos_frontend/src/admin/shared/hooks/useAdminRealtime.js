import { useEffect } from "react";

export default function useAdminRealtime({
  activeSection,
  fetchUsersList,
  fetchMantencionesList,
  fetchHorariosMantencionList,
}) {
  useEffect(() => {
    const isUsersSection =
      activeSection === "lista_usuarios" ||
      activeSection === "crear_usuario";
    const isMantencionesSection =
      activeSection === "mantenciones_solicitudes" ||
      activeSection === "mantenciones_fichas" ||
      activeSection === "taller_en_taller";
    const isHorariosSection = activeSection === "horarios_operativos" || activeSection === "mantenciones_horarios";

    if (!isUsersSection && !isMantencionesSection && !isHorariosSection) return undefined;

    let mounted = true;

    const syncData = async () => {
      if (document.hidden || !mounted) return;
      try {
        if (isUsersSection) {
          await fetchUsersList({ background: true });
          if (!mounted) return;
        }

        if (isMantencionesSection) {
          await fetchMantencionesList();
          if (!mounted) return;
        }

        if (isHorariosSection) {
          await fetchHorariosMantencionList();
          if (!mounted) return;
        }
      } catch {
        // Actualizacion silenciosa para no saturar con toasts en tiempo real.
      }
    };

    const intervalId = window.setInterval(syncData, 12000);
    syncData();
    const onVisibilityChange = () => {
      if (!document.hidden) syncData();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    activeSection,
    fetchHorariosMantencionList,
    fetchMantencionesList,
    fetchUsersList,
  ]);
}
