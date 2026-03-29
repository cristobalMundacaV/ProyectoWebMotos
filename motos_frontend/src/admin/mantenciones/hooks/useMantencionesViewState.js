import { useCallback, useState } from "react";

const INITIAL_MOBILE_PICKER_STATE = {
  solicitudes: false,
  fichas: false,
  historicas: false,
};

export default function useMantencionesViewState() {
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [selectedFichaId, setSelectedFichaId] = useState(null);
  const [tallerEstadoFilter, setTallerEstadoFilter] = useState("en_proceso");
  const [selectedHistoricaId, setSelectedHistoricaId] = useState(null);
  const [selectedHistoricoCliente, setSelectedHistoricoCliente] = useState("");
  const [solicitudesTab, setSolicitudesTab] = useState("por_aprobar");
  const [mobilePickerOpen, setMobilePickerOpen] = useState(INITIAL_MOBILE_PICKER_STATE);
  const [showHorarioForm, setShowHorarioForm] = useState(false);

  const handleSolicitudesTabChange = useCallback((value) => {
    setSolicitudesTab(value);
    setSelectedSolicitudId(null);
    setMobilePickerOpen((prev) => ({
      ...prev,
      solicitudes: false,
    }));
  }, []);

  const handleTallerEstadoFilterChange = useCallback((value) => {
    setTallerEstadoFilter(value);
    setSelectedFichaId(null);
    setMobilePickerOpen((prev) => ({
      ...prev,
      fichas: false,
    }));
  }, []);

  const handleHistoricoClienteChange = useCallback((value) => {
    setSelectedHistoricoCliente(value);
    setSelectedHistoricaId(null);
    setMobilePickerOpen((prev) => ({
      ...prev,
      historicas: false,
    }));
  }, []);

  const handleToggleMobilePicker = useCallback((pickerKey) => {
    setMobilePickerOpen((prev) => ({
      ...prev,
      [pickerKey]: !prev[pickerKey],
    }));
  }, []);

  const handleCloseMobilePicker = useCallback((pickerKey) => {
    setMobilePickerOpen((prev) => ({
      ...prev,
      [pickerKey]: false,
    }));
  }, []);

  return {
    selectedSolicitudId,
    selectedFichaId,
    tallerEstadoFilter,
    selectedHistoricaId,
    selectedHistoricoCliente,
    solicitudesTab,
    mobilePickerOpen,
    showHorarioForm,
    setSelectedSolicitudId,
    setSelectedFichaId,
    setTallerEstadoFilter,
    setSelectedHistoricaId,
    setSelectedHistoricoCliente,
    setShowHorarioForm,
    setMobilePickerOpen,
    handleSolicitudesTabChange,
    handleTallerEstadoFilterChange,
    handleHistoricoClienteChange,
    handleToggleMobilePicker,
    handleCloseMobilePicker,
  };
}
