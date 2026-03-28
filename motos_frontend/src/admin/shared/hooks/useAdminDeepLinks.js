import { useEffect, useRef } from "react";

export default function useAdminDeepLinks({
  loading,
  locationSearch,
  activeSection,
  setActiveSection,
  dashboardMotos,
  accesoriosRiderAdmin,
  accesoriosMotosAdmin,
  handleMotoEdit,
  handleAccesorioRiderEdit,
  handleAccesorioMotoEdit,
  navigate,
  pushToast,
}) {
  const handledAdminDeepLinkRef = useRef("");

  useEffect(() => {
    if (loading) return;
    if (!locationSearch) return;

    const params = new URLSearchParams(locationSearch);
    const section = params.get("section");
    const entity = params.get("entity");
    const idRaw = params.get("id");
    const entityId = Number(idRaw);

    if (!section || !entity || !Number.isInteger(entityId) || entityId <= 0) return;

    const requestKey = `${section}:${entity}:${entityId}`;
    if (handledAdminDeepLinkRef.current === requestKey) return;

    if (activeSection !== section) {
      setActiveSection(section);
    }

    let opened = false;

    if (entity === "moto") {
      const moto = dashboardMotos.find((item) => item.id === entityId);
      if (moto) {
        handleMotoEdit(moto);
        opened = true;
      }
    } else if (entity === "rider") {
      const rider = accesoriosRiderAdmin.find((item) => item.id === entityId);
      if (rider) {
        handleAccesorioRiderEdit(rider);
        opened = true;
      }
    } else if (entity === "accesorio") {
      const accesorio = accesoriosMotosAdmin.find((item) => item.id === entityId);
      if (accesorio) {
        handleAccesorioMotoEdit(accesorio);
        opened = true;
      }
    }

    if (opened) {
      handledAdminDeepLinkRef.current = requestKey;
      navigate("/admin-panel", { replace: true });
      return;
    }

    handledAdminDeepLinkRef.current = requestKey;
    pushToast("No se encontro el registro a editar desde el catalogo.", "error");
    navigate("/admin-panel", { replace: true });
  }, [
    loading,
    locationSearch,
    activeSection,
    setActiveSection,
    dashboardMotos,
    accesoriosRiderAdmin,
    accesoriosMotosAdmin,
    handleMotoEdit,
    handleAccesorioRiderEdit,
    handleAccesorioMotoEdit,
    navigate,
    pushToast,
  ]);
}
