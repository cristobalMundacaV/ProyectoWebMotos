import { useEffect, useState } from "react";
import { fetchAdminBootstrapData } from "../../dashboard/services/dashboardService";

export default function useAdminBootstrap({
  bootstrapMotoData,
  bootstrapProductosData,
  bootstrapContacto,
  pushToast,
  fetchUsersList,
  fetchMantencionesList,
  fetchHorariosMantencionList,
  setAdminUsersLoadError,
  setMantencionesLoadError,
  setHorariosLoadError,
  setDashboard,
  setAdminUsers,
  setAdminUsersLoading,
  setMantenciones,
  setMantencionesLoading,
  setHorariosMantencion,
  setHorariosMantencionLoading,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchAdminBootstrapData();
        if (!isMounted) return;

        setDashboard({
          motos: data.motos,
          productosIndumentaria: data.productosIndumentaria,
          productosAccesorios: data.productosAccesorios,
          categoriasIndumentaria: data.categoriasIndumentaria,
          categoriasAccesorios: data.categoriasAccesorios,
        });

        bootstrapMotoData({
          metaMotos: data.metaMotos,
          marcasMotosList: data.marcasMotosList,
          modelosMotoList: data.modelosMotoList,
          categoriasMotoList: data.categoriasMotoList,
        });

        bootstrapProductosData({
          marcasAccMotosList: data.marcasAccMotosList,
          marcasAccRiderList: data.marcasAccRiderList,
          categoriasAccMotosData: data.categoriasAccMotosData,
          categoriasAccRiderData: data.categoriasAccRiderData,
          accesoriosMotosList: data.accesoriosMotosList,
          accesoriosMotosMetaData: data.accesoriosMotosMetaData,
          accesoriosRiderList: data.accesoriosRiderList,
          accesoriosRiderMetaData: data.accesoriosRiderMetaData,
        });

        bootstrapContacto(data.contactoAdmin || {}, { loadError: data.contactoAdminLoadError });

        await fetchUsersList().catch((error) => {
          if (!isMounted) return;
          setAdminUsersLoadError(error?.message || "No se pudo cargar la lista de usuarios.");
        });

        await fetchMantencionesList().catch((error) => {
          if (!isMounted) return;
          setMantencionesLoadError(error?.message || "No se pudo cargar la lista de mantenciones.");
        });

        await fetchHorariosMantencionList().catch((error) => {
          if (!isMounted) return;
          setHorariosLoadError(error?.message || "No se pudo cargar la configuracion de horarios.");
        });
      } finally {
        if (isMounted) {
          setLoading(false);
          setAdminUsersLoading(false);
          setMantencionesLoading(false);
          setHorariosMantencionLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [
    bootstrapContacto,
    bootstrapMotoData,
    bootstrapProductosData,
    fetchHorariosMantencionList,
    fetchMantencionesList,
    fetchUsersList,
    setAdminUsersLoadError,
    setAdminUsersLoading,
    setHorariosLoadError,
    setDashboard,
    setHorariosMantencionLoading,
    setMantencionesLoadError,
    setMantencionesLoading,
  ]);

  return { loading };
}
