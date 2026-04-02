import { useCallback, useState } from "react";

const INITIAL_MOBILE_PICKER_STATE = {
  solicitudes: false,
  fichas: false,
  historicas: false,
};

const HISTORICO_FECHA_ALLOWED = new Set(["todos", "hoy", "semana", "mes", "aÃ±o"]);
const HISTORICO_ESTADO_ALLOWED = new Set(["", "en_proceso", "en_espera", "finalizado", "cancelado", "reagendacion", "entregada"]);

export default function useMantencionesViewState() {
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [selectedFichaId, setSelectedFichaId] = useState(null);
  const [tallerEstadoFilter, setTallerEstadoFilter] = useState("en_proceso");
  const [selectedHistoricaId, setSelectedHistoricaId] = useState(null);
  const [selectedHistoricoCliente, setSelectedHistoricoCliente] = useState("");
  const [historicoEstadoFilter, setHistoricoEstadoFilter] = useState("");
  const [historicoFechaFilter, setHistoricoFechaFilter] = useState("todos");
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
    setMobilePickerOpen((prev) => ({
      ...prev,
      historicas: false,
    }));
    setSelectedHistoricoCliente((prev) => {
      if (prev === value) return prev;
      return value;
    });
    setSelectedHistoricaId(null);
  }, []);

  const handleHistoricoEstadoFilterChange = useCallback((value) => {
    const normalizedValue = HISTORICO_ESTADO_ALLOWED.has(value) ? value : "";
    if (normalizedValue === historicoEstadoFilter) return;
    setHistoricoEstadoFilter(normalizedValue);
    setSelectedHistoricaId(null);
  }, [historicoEstadoFilter]);

  const handleHistoricoFechaFilterChange = useCallback((value) => {
    const normalizedValue = HISTORICO_FECHA_ALLOWED.has(value) ? value : "todos";
    if (normalizedValue === historicoFechaFilter) return;
    setHistoricoFechaFilter(normalizedValue);
    setSelectedHistoricaId(null);
  }, [historicoFechaFilter]);

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
    historicoEstadoFilter,
    historicoFechaFilter,
    solicitudesTab,
    mobilePickerOpen,
    showHorarioForm,
    setSelectedSolicitudId,
    setSelectedFichaId,
    setTallerEstadoFilter,
    setSelectedHistoricaId,
    setSelectedHistoricoCliente,
    setHistoricoEstadoFilter,
    setHistoricoFechaFilter,
    setShowHorarioForm,
    setMobilePickerOpen,
    handleSolicitudesTabChange,
    handleTallerEstadoFilterChange,
    handleHistoricoClienteChange,
    handleHistoricoEstadoFilterChange,
    handleHistoricoFechaFilterChange,
    handleToggleMobilePicker,
    handleCloseMobilePicker,
  };
}
