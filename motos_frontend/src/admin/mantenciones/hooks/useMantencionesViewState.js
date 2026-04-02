import { useCallback, useState } from "react";
import {
  HISTORICO_ESTADO_FILTER_OPTIONS,
  HISTORICO_FECHA_FILTER_OPTIONS,
} from "../constants/mantencionesUiConstants";

const INITIAL_MOBILE_PICKER_STATE = {
  solicitudes: false,
  fichas: false,
  historicas: false,
};

const HISTORICO_FECHA_ALLOWED = new Set(HISTORICO_FECHA_FILTER_OPTIONS.map((option) => option.value));
const HISTORICO_ESTADO_ALLOWED = new Set(HISTORICO_ESTADO_FILTER_OPTIONS.map((option) => option.value));

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
  }, []);

  const handleHistoricoEstadoFilterChange = useCallback((value) => {
    const normalizedValue = HISTORICO_ESTADO_ALLOWED.has(value) ? value : "";
    setHistoricoEstadoFilter((prev) => {
      if (prev === normalizedValue) return prev;
      return normalizedValue;
    });
  }, []);

  const handleHistoricoFechaFilterChange = useCallback((value) => {
    const normalizedValue = HISTORICO_FECHA_ALLOWED.has(value) ? value : "todos";
    setHistoricoFechaFilter((prev) => {
      if (prev === normalizedValue) return prev;
      return normalizedValue;
    });
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
