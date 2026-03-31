import { useEffect } from "react";
import useMotoAdmin from "../../motos/hooks/useMotoAdmin";
import useProductosAdmin from "../../productos/hooks/useProductosAdmin";
import useAdminUsers from "../../usuarios/hooks/useAdminUsers";
import useConfiguracionAdmin from "../../configuracion/hooks/useConfiguracionAdmin";
import useMantencionesAdmin from "../../mantenciones/hooks/useMantencionesAdmin";
import useHorariosAdmin from "../../mantenciones/hooks/useHorariosAdmin";
import useAdminEntityModals from "../../shared/hooks/useAdminEntityModals";
import useAdminBootstrap from "../../shared/hooks/useAdminBootstrap";
import useAdminDeepLinks from "../../shared/hooks/useAdminDeepLinks";
import useAdminRealtime from "../../shared/hooks/useAdminRealtime";
import useAdminModalEscape from "../../shared/hooks/useAdminModalEscape";
import useAdminEntityActions from "./useAdminEntityActions";
import useAdminCatalogBridge from "./useAdminCatalogBridge";

export default function useAdminDomainInstances({
  activeSection,
  activeMarcaConfig,
  setActiveSection,
  locationSearch,
  navigate,
  dashboard,
  setDashboard,
  fallbackImage,
  pushToast,
  dismissToast,
  getErrorText,
  clearInvalidFieldStyle,
  validateFormWithToast,
  normalizeUppercaseLabel,
  normalizeTitleCaseForInput,
  normalizeTitleCaseLabel,
  normalizeCategoryLabel,
  normalizeCompareLabel,
  buildSlug,
  limitSlug,
}) {
  const productos = useProductosAdmin({
    setDashboard,
    fallbackImage,
    clearInvalidFieldStyle,
    validateFormWithToast,
    pushToast,
    getErrorText,
  });

  const catalogBridge = useAdminCatalogBridge({
    setMarcasAccMotosAdmin: productos.setMarcasAccMotosAdmin,
    setAccesoriosMotosMeta: productos.setAccesoriosMotosMeta,
    setMarcasAccRiderAdmin: productos.setMarcasAccRiderAdmin,
    setAccesoriosRiderMeta: productos.setAccesoriosRiderMeta,
  });

  const motos = useMotoAdmin({
    setDashboard,
    activeSection,
    activeMarcaConfig,
    pushToast,
    getErrorText,
    validateFormWithToast,
    clearInvalidFieldStyle,
    normalizeUppercaseLabel,
    normalizeTitleCaseForInput,
    normalizeTitleCaseLabel,
    normalizeCategoryLabel,
    normalizeCompareLabel,
    buildSlug,
    limitSlug,
    fallbackImage,
    onCreateMarcaForProductoDomain: catalogBridge.onCreateMarcaForProductoDomain,
  });

  const users = useAdminUsers({
    pushToast,
    getErrorText,
    clearInvalidFieldStyle,
    validateFormWithToast,
  });
  const { setAdminUsersPage } = users;

  const configuracion = useConfiguracionAdmin({
    pushToast,
    getErrorText,
    clearInvalidFieldStyle,
    validateFormWithToast,
  });

  const mantenciones = useMantencionesAdmin({
    activeSection,
    pushToast,
    getErrorText,
  });

  const horarios = useHorariosAdmin({
    activeSection,
    pushToast,
    dismissToast,
    getErrorText,
  });

  const entityModals = useAdminEntityModals({
    setDashboard,
    motoMeta: motos.motoMeta,
    clearInvalidFieldStyle,
    normalizeUppercaseLabel,
    normalizeTitleCaseForInput,
    normalizeTitleCaseLabel,
    buildSlug,
    validateFormWithToast,
    getErrorText,
    pushToast,
    setMarcasMotosAdmin: motos.setMarcasMotosAdmin,
    setMotoMeta: motos.setMotoMeta,
    setMarcasAccMotosAdmin: productos.setMarcasAccMotosAdmin,
    setAccesoriosMotosMeta: productos.setAccesoriosMotosMeta,
    setMarcasAccRiderAdmin: productos.setMarcasAccRiderAdmin,
    setAccesoriosRiderMeta: productos.setAccesoriosRiderMeta,
    setCategoriasMoto: motos.setCategoriasMoto,
    setCategoriasAccMotosMeta: productos.setCategoriasAccMotosMeta,
    setCategoriasAccRiderMeta: productos.setCategoriasAccRiderMeta,
    setModelosMotosAdmin: motos.setModelosMotosAdmin,
  });

  const entityActions = useAdminEntityActions({
    activeSection,
    openEntityEditModal: entityModals.openEntityEditModal,
    openEntityDeleteModal: entityModals.openEntityDeleteModal,
  });

  const { loading } = useAdminBootstrap({
    bootstrapMotoData: motos.bootstrapMotoData,
    bootstrapProductosData: productos.bootstrapProductosData,
    bootstrapContacto: configuracion.bootstrapContacto,
    pushToast,
    fetchUsersList: users.fetchUsersList,
    fetchMantencionesList: mantenciones.fetchMantencionesList,
    fetchHorariosMantencionList: horarios.fetchHorariosMantencionList,
    setAdminUsersLoadError: users.setAdminUsersLoadError,
    setMantencionesLoadError: mantenciones.setMantencionesLoadError,
    setHorariosLoadError: horarios.setHorariosLoadError,
    setDashboard,
    setAdminUsers: users.setAdminUsers,
    setAdminUsersLoading: users.setAdminUsersLoading,
    setMantenciones: mantenciones.setMantenciones,
    setMantencionesLoading: mantenciones.setMantencionesLoading,
    setHorariosMantencion: horarios.setHorariosMantencion,
    setHorariosMantencionLoading: horarios.setHorariosMantencionLoading,
  });

  useAdminDeepLinks({
    loading,
    locationSearch,
    activeSection,
    setActiveSection,
    dashboardMotos: dashboard.motos,
    accesoriosRiderAdmin: productos.accesoriosRiderAdmin,
    accesoriosMotosAdmin: productos.accesoriosMotosAdmin,
    handleMotoEdit: motos.handleMotoEdit,
    handleAccesorioRiderEdit: productos.handleAccesorioRiderEdit,
    handleAccesorioMotoEdit: productos.handleAccesorioMotoEdit,
    navigate,
    pushToast,
  });

  useAdminRealtime({
    activeSection,
    fetchUsersList: users.fetchUsersList,
    fetchMantencionesList: mantenciones.fetchMantencionesList,
    fetchHorariosMantencionList: horarios.fetchHorariosMantencionList,
    setMantenciones: mantenciones.setMantenciones,
    setHorariosMantencion: horarios.setHorariosMantencion,
  });

  useAdminModalEscape({
    entityEditModal: entityModals.entityEditModal,
    entityDeleteModal: entityModals.entityDeleteModal,
    entityModalSaving: entityModals.entityModalSaving,
    closeEntityEditModal: entityModals.closeEntityEditModal,
    closeEntityDeleteModal: entityModals.closeEntityDeleteModal,
    motoEditModal: motos.motoEditModal,
    motoEditSaving: motos.motoEditSaving,
    closeMotoEditModal: motos.closeMotoEditModal,
    motoDeleteModal: motos.motoDeleteModal,
    motoDeleteSaving: motos.motoDeleteSaving,
    closeMotoDeleteModal: motos.closeMotoDeleteModal,
    accesorioMotoEditModal: productos.accesorioMotoEditModal,
    accesorioMotoEditSaving: productos.accesorioMotoEditSaving,
    closeAccesorioMotoEditModal: productos.closeAccesorioMotoEditModal,
    accesorioRiderEditModal: productos.accesorioRiderEditModal,
    accesorioRiderEditSaving: productos.accesorioRiderEditSaving,
    closeAccesorioRiderEditModal: productos.closeAccesorioRiderEditModal,
    productoDeleteModal: productos.productoDeleteModal,
    productoDeleteSaving: productos.productoDeleteSaving,
    closeProductoDeleteModal: productos.closeProductoDeleteModal,
    adminUserEditModal: users.adminUserEditModal,
    adminUserDeleteModal: users.adminUserDeleteModal,
    adminUserModalSaving: users.adminUserModalSaving,
    closeAdminUserEditModal: users.closeAdminUserEditModal,
    closeAdminUserDeleteModal: users.closeAdminUserDeleteModal,
  });

  useEffect(() => {
    if (activeSection === "lista_usuarios" || activeSection === "crear_usuario") {
      setAdminUsersPage(1);
    }
  }, [activeSection, setAdminUsersPage]);

  return {
    loading,
    domains: {
      motos,
      productos,
      users,
      configuracion,
      mantenciones,
      horarios,
      entityModals,
      entityActions,
    },
  };
}
