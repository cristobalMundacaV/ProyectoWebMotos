import { useMemo } from "react";
import useAdminDomainInstances from "./useAdminDomainInstances";
import useAdminSectionProps from "./useAdminSectionProps";
import useAdminModalProps from "./useAdminModalProps";

const MARCA_SECTION_CONFIG = {
  marcas_motos: {
    tipo: "moto",
    titulo: "Marcas de motos",
    subtitulo: "Usadas para el catalogo de motos",
  },
  marcas_acc_motos: {
    tipo: "accesorio_moto",
    titulo: "Marcas de accesorios motos",
    subtitulo: "Usadas en accesorios para la moto",
  },
  marcas_acc_rider: {
    tipo: "accesorio_rider",
    titulo: "Marcas de indumentaria",
    subtitulo: "Usadas en productos de indumentaria rider",
  },
};

export default function useAdminDomains({
  activeSection,
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
  const activeMarcaConfig = useMemo(
    () => MARCA_SECTION_CONFIG[activeSection] || MARCA_SECTION_CONFIG.marcas_motos,
    [activeSection]
  );

  const { loading, domains } = useAdminDomainInstances({
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
  });

  const sectionPropsMap = useAdminSectionProps({
    activeSection,
    loading,
    dashboard,
    activeMarcaConfig,
    domains,
  });

  const modalPropsMap = useAdminModalProps({
    fallbackImage,
    domains,
  });

  return {
    loading,
    sectionRouterProps: {
      activeSection,
      sectionPropsMap,
    },
    modalHostProps: {
      modalPropsMap,
    },
  };
}
