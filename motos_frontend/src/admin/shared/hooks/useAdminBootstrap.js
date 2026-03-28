import { useEffect, useState } from "react";
import { fetchAdminBootstrapData } from "../../dashboard/services/dashboardService";

export default function useAdminBootstrap({
  bootstrapMotoData,
  bootstrapProductosData,
  bootstrapContacto,
  fetchUsersList,
  fetchMantencionesList,
  fetchHorariosMantencionList,
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

        bootstrapContacto(data.contactoAdmin || {});

        await fetchUsersList().catch(() => {
          if (isMounted) setAdminUsers([]);
        });

        await fetchMantencionesList().catch(() => {
          if (isMounted) setMantenciones([]);
        });

        await fetchHorariosMantencionList().catch(() => {
          if (isMounted) setHorariosMantencion([]);
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
    setAdminUsers,
    setAdminUsersLoading,
    setDashboard,
    setHorariosMantencion,
    setHorariosMantencionLoading,
    setMantenciones,
    setMantencionesLoading,
  ]);

  return { loading };
}
