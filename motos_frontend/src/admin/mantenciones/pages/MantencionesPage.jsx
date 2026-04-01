import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ESTADOS_EN_TALLER,
  ESTADOS_SOLICITUD,
  ESTADOS_TALLER,
} from "../constants/mantencionesUiConstants";
import {
  getCreatedAtTimestamp,
  getMantencionSortTimestamp,
} from "../utils/mantencionesViewUtils";
import useMantencionesViewState from "../hooks/useMantencionesViewState";
import useMantencionesCalendar from "../hooks/useMantencionesCalendar";
import useCalendarioPanelModel from "../hooks/useCalendarioPanelModel";
import useMantencionesTransitions from "../hooks/useMantencionesTransitions";
import MantencionesModalHost from "../components/MantencionesModalHost";
import SolicitudesPanel from "../components/SolicitudesPanel";
import TallerPanel from "../components/TallerPanel";
import HistoricasPanel from "../components/HistoricasPanel";
import HorariosPanel from "../components/HorariosPanel";
import CalendarioPanel from "../components/CalendarioPanel";

export default function MantencionesPage({
  activeSection,
  loading,
  mantencionesLoadError = "",
  mantenciones,
  savingById,
  onAcceptSolicitud,
  onUpdateMantencion,
  onToast,
  horarios = [],
  horariosLoading = false,
  horariosLoadError = "",
  horarioForm,
  horarioSaving = false,
  onHorarioInputChange,
  onHorarioSubmit,
  onHorarioUpdate,
  onHorarioDelete,
}) {
  const normalizeTextKey = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");

  const getHistoricoClienteKey = (item) => {
    const moto = item?.moto_cliente_detalle || {};
    if (moto.cliente !== null && moto.cliente !== undefined && moto.cliente !== "") {
      return `cliente:${String(moto.cliente)}`;
    }
    if (moto.id !== null && moto.id !== undefined && moto.id !== "") {
      return `vehiculo:${String(moto.id)}`;
    }
    if (moto.cliente_email) {
      return `email:${normalizeTextKey(moto.cliente_email)}`;
    }
    const label = (moto.cliente_nombre || "").trim() || "Cliente sin nombre";
    return `nombre:${normalizeTextKey(label)}`;
  };

  const getDateRange = (filterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filterType) {
      case "hoy":
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
      case "semana":
        return { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
      case "mes":
        return { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
      case "año":
        return { start: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000), end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) };
      default:
        return null;
    }
  };

  const fichasHistoricas = useMemo(
    () =>
      mantenciones
        .filter((item) => !ESTADOS_SOLICITUD.includes(item.estado) && !ESTADOS_TALLER.includes(item.estado))
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(b) - getMantencionSortTimestamp(a) ||
            getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a) ||
            Number(b.id || 0) - Number(a.id || 0)
        ),
    [mantenciones]
  );

  const historicoClientes = useMemo(() => {
    const uniques = new Map();
    fichasHistoricas.forEach((item) => {
      const moto = item?.moto_cliente_detalle || {};
      const label = (moto.cliente_nombre || "").trim() || "Cliente sin nombre";
      const value = getHistoricoClienteKey(item);
      if (!value) return;
      if (!uniques.has(value)) uniques.set(value, { value, label });
    });
    return Array.from(uniques.values()).sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [fichasHistoricas]);

  const {
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
    setSelectedHistoricaId,
    setSelectedHistoricoCliente,
    setShowHorarioForm,
    setMobilePickerOpen,
    handleSolicitudesTabChange,
    handleTallerEstadoFilterChange,
    handleHistoricoClienteChange,
    handleHistoricoEstadoFilterChange,
    handleHistoricoFechaFilterChange,
    handleToggleMobilePicker,
    handleCloseMobilePicker,
  } = useMantencionesViewState();

  const {
    calendarLoading,
    calendarError,
    selectedCalendarDate,
    setSelectedCalendarDate,
    selectedCalendarDay,
    selectedCalendarIsHoliday,
    calendarMonthLabel,
    calendarCells,
    monthSummary,
    dayBlockConfirm,
    dayBlockSaving,
    dayBlockError,
    dayActivateModalOpen,
    dayActivateSaving,
    dayActivateError,
    dayActivateForm,
    slotToggleConfirm,
    slotToggleSaving,
    slotToggleError,
    goToPrevMonth,
    goToNextMonth,
    canGoPrevMonth,
    canGoNextMonth,
    openActivateDayModal,
    executeDayBlocking,
    executeDayActivation,
    executeSlotToggle,
    closeDayBlockConfirm,
    closeDayActivateModal,
    closeSlotToggleConfirm,
    handleDayActivateFieldChange,
  } = useMantencionesCalendar({
    activeSection,
    horarios,
  });

  const transitions = useMantencionesTransitions({
    savingById,
    onAcceptSolicitud,
    onUpdateMantencion,
    pushToast: onToast,
  });
  const [clienteDatosItem, setClienteDatosItem] = useState(null);
  const clearAllMantencionModals = transitions.clearAllModalState;

  const openClienteDatosModal = useCallback((item) => {
    if (!item) return;
    setClienteDatosItem(item);
  }, []);

  const closeClienteDatosModal = useCallback(() => {
    setClienteDatosItem(null);
  }, []);

  const calendarioPanelModel = useCalendarioPanelModel({
    calendarLoading,
    calendarError,
    selectedCalendarDate,
    setSelectedCalendarDate,
    selectedCalendarDay,
    selectedCalendarIsHoliday,
    calendarMonthLabel,
    calendarCells,
    monthSummary,
    dayBlockConfirm,
    dayBlockSaving,
    dayBlockError,
    dayActivateModalOpen,
    dayActivateSaving,
    dayActivateError,
    dayActivateForm,
    slotToggleConfirm,
    slotToggleSaving,
    slotToggleError,
    goToPrevMonth,
    goToNextMonth,
    canGoPrevMonth,
    canGoNextMonth,
    openActivateDayModal,
    executeDayBlocking,
    executeDayActivation,
    executeSlotToggle,
    closeDayBlockConfirm,
    closeDayActivateModal,
    closeSlotToggleConfirm,
    handleDayActivateFieldChange,
  });

  useEffect(() => {
    setMobilePickerOpen({
      solicitudes: false,
      fichas: false,
      historicas: false,
    });
  }, [activeSection, setMobilePickerOpen]);

  useEffect(() => {
    clearAllMantencionModals();
    setClienteDatosItem(null);
  }, [activeSection, clearAllMantencionModals]);

  useEffect(() => {
    if (!clienteDatosItem) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape") {
        setClienteDatosItem(null);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [clienteDatosItem]);

  useEffect(() => {
    transitions.resetEditableRecords();
  }, [selectedFichaId, tallerEstadoFilter, transitions]);

  const solicitudesPorAceptar = useMemo(
    () =>
      mantenciones
        .filter((item) => item.estado === "solicitud")
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(a) - getMantencionSortTimestamp(b) ||
            getCreatedAtTimestamp(a) - getCreatedAtTimestamp(b) ||
            Number(a.id || 0) - Number(b.id || 0)
        ),
    [mantenciones]
  );

  const solicitudesAceptadas = useMemo(
    () =>
      mantenciones
        .filter((item) => item.estado === "aprobado")
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(a) - getMantencionSortTimestamp(b) ||
            getCreatedAtTimestamp(a) - getCreatedAtTimestamp(b) ||
            Number(a.id || 0) - Number(b.id || 0)
        ),
    [mantenciones]
  );

  const solicitudes = useMemo(() => {
    if (solicitudesTab === "aprobadas") return solicitudesAceptadas;
    return solicitudesPorAceptar;
  }, [solicitudesAceptadas, solicitudesPorAceptar, solicitudesTab]);

  const solicitudesEmptyText = useMemo(() => {
    if (solicitudesTab === "aprobadas") return "No hay solicitudes aprobadas.";
    return "No hay solicitudes en estado solicitud.";
  }, [solicitudesTab]);

  const fichasEnTallerBase = useMemo(
    () =>
      mantenciones
        .filter((item) => ESTADOS_EN_TALLER.includes(item.estado))
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(b) - getMantencionSortTimestamp(a) ||
            getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a) ||
            Number(b.id || 0) - Number(a.id || 0)
        ),
    [mantenciones]
  );

  const fichasMantencion = useMemo(() => {
    if (tallerEstadoFilter === "por_entregar") {
      return fichasEnTallerBase.filter((item) => item.estado === "finalizado");
    }
    return fichasEnTallerBase.filter((item) => item.estado === tallerEstadoFilter);
  }, [fichasEnTallerBase, tallerEstadoFilter]);

  const fichasTallerEmptyText = useMemo(() => {
    const labelByFilter = {
      en_proceso: "en proceso",
      en_espera: "en espera",
      por_entregar: "por entregar",
    };
    return `No hay fichas en estado ${labelByFilter[tallerEstadoFilter] || "seleccionado"}.`;
  }, [tallerEstadoFilter]);

  const selectedHistoricoClienteEffective = useMemo(
    () => selectedHistoricoCliente,
    [selectedHistoricoCliente]
  );

  useEffect(() => {
    if (!selectedHistoricoCliente) return;
    if (loading) return;
    if (!historicoClientes.length) return;
    const stillExists = historicoClientes.some((item) => item.value === selectedHistoricoCliente);
    if (!stillExists) {
      setSelectedHistoricoCliente("");
    }
  }, [historicoClientes, loading, selectedHistoricoCliente, setSelectedHistoricoCliente]);

  const fichasHistoricasByCliente = useMemo(() => {
    if (!selectedHistoricoClienteEffective) return [];
    return fichasHistoricas.filter((item) => {
      if (getHistoricoClienteKey(item) !== selectedHistoricoClienteEffective) return false;

      if (historicoEstadoFilter && item.estado !== historicoEstadoFilter) return false;

      if (historicoFechaFilter !== "todos") {
        const dateRange = getDateRange(historicoFechaFilter);
        if (dateRange) {
          const itemDate = new Date(item.fecha_ingreso);
          itemDate.setHours(0, 0, 0, 0);
          if (itemDate < dateRange.start || itemDate > dateRange.end) return false;
        }
      }

      return true;
    });
  }, [fichasHistoricas, selectedHistoricoClienteEffective, historicoEstadoFilter, historicoFechaFilter]);

  const selectedSolicitud = useMemo(() => {
    const byId = solicitudes.find((item) => item.id === selectedSolicitudId);
    return byId || solicitudes[0] || null;
  }, [solicitudes, selectedSolicitudId]);

  const selectedFicha = useMemo(() => {
    const byId = fichasMantencion.find((item) => item.id === selectedFichaId);
    return byId || fichasMantencion[0] || null;
  }, [fichasMantencion, selectedFichaId]);

  const selectedHistorica = useMemo(() => {
    const byId = fichasHistoricasByCliente.find((item) => item.id === selectedHistoricaId);
    return byId || fichasHistoricasByCliente[0] || null;
  }, [fichasHistoricasByCliente, selectedHistoricaId]);

  useEffect(() => {
    if (!selectedHistoricaId) return;
    const existsInFilteredList = fichasHistoricasByCliente.some((item) => item.id === selectedHistoricaId);
    if (!existsInFilteredList) {
      setSelectedHistoricaId(null);
    }
  }, [fichasHistoricasByCliente, selectedHistoricaId, setSelectedHistoricaId]);

  if (activeSection === "mantenciones_solicitudes") {
    return (
      <>
        {mantencionesLoadError ? (
          <section className="admin-panel-card">
            <p className="admin-empty">{mantencionesLoadError}</p>
          </section>
        ) : null}
        <SolicitudesPanel
          loading={loading}
          solicitudes={solicitudes}
          solicitudesTab={solicitudesTab}
          selectedSolicitud={selectedSolicitud}
          solicitudesEmptyText={solicitudesEmptyText}
          onTabChange={handleSolicitudesTabChange}
          onSelectSolicitud={setSelectedSolicitudId}
          mobilePickerOpen={mobilePickerOpen}
          onToggleMobilePicker={handleToggleMobilePicker}
          onCloseMobilePicker={handleCloseMobilePicker}
          onOpenClienteDatos={openClienteDatosModal}
          transitions={transitions}
          savingById={savingById}
        />
        <MantencionesModalHost
          activeSection={activeSection}
          transitions={transitions}
          clienteDatosItem={clienteDatosItem}
          onCloseClienteDatos={closeClienteDatosModal}
        />
      </>
    );
  }

  if (activeSection === "mantenciones_fichas" || activeSection === "taller_en_taller") {
    return (
      <>
        {mantencionesLoadError ? (
          <section className="admin-panel-card">
            <p className="admin-empty">{mantencionesLoadError}</p>
          </section>
        ) : null}
        <TallerPanel
          loading={loading}
          fichasMantencion={fichasMantencion}
          tallerEstadoFilter={tallerEstadoFilter}
          selectedFicha={selectedFicha}
          fichasTallerEmptyText={fichasTallerEmptyText}
          onTallerEstadoFilterChange={handleTallerEstadoFilterChange}
          onSelectFicha={setSelectedFichaId}
          mobilePickerOpen={mobilePickerOpen}
          onToggleMobilePicker={handleToggleMobilePicker}
          onCloseMobilePicker={handleCloseMobilePicker}
          onOpenClienteDatos={openClienteDatosModal}
          transitions={transitions}
          savingById={savingById}
        />
        <MantencionesModalHost
          activeSection={activeSection}
          transitions={transitions}
          clienteDatosItem={clienteDatosItem}
          onCloseClienteDatos={closeClienteDatosModal}
        />
      </>
    );
  }

  if (activeSection === "mantenciones_historicas") {
    return (
      <>
        {mantencionesLoadError ? (
          <section className="admin-panel-card">
            <p className="admin-empty">{mantencionesLoadError}</p>
          </section>
        ) : null}
        <HistoricasPanel
          loading={loading}
          historicoClientes={historicoClientes}
          selectedHistoricoClienteEffective={selectedHistoricoClienteEffective}
          onHistoricoClienteChange={handleHistoricoClienteChange}
          fichasHistoricasByCliente={fichasHistoricasByCliente}
          selectedHistorica={selectedHistorica}
          onSelectHistorica={setSelectedHistoricaId}
          mobilePickerOpen={mobilePickerOpen}
          onToggleMobilePicker={handleToggleMobilePicker}
          onCloseMobilePicker={handleCloseMobilePicker}
          onOpenClienteDatos={openClienteDatosModal}
          historicoEstadoFilter={historicoEstadoFilter}
          onHistoricoEstadoFilterChange={handleHistoricoEstadoFilterChange}
          historicoFechaFilter={historicoFechaFilter}
          onHistoricoFechaFilterChange={handleHistoricoFechaFilterChange}
          transitions={transitions}
          savingById={savingById}
        />
        <MantencionesModalHost
          activeSection={activeSection}
          transitions={transitions}
          clienteDatosItem={clienteDatosItem}
          onCloseClienteDatos={closeClienteDatosModal}
        />
      </>
    );
  }

  if (activeSection === "horarios_operativos" || activeSection === "mantenciones_horarios") {
    return (
      <HorariosPanel
        horarios={horarios}
        horariosLoading={horariosLoading}
        horariosLoadError={horariosLoadError}
        showHorarioForm={showHorarioForm}
        onToggleHorarioForm={() => setShowHorarioForm((prev) => !prev)}
        horarioForm={horarioForm}
        horarioSaving={horarioSaving}
        onHorarioInputChange={onHorarioInputChange}
        onHorarioSubmit={onHorarioSubmit}
        onHorarioUpdate={onHorarioUpdate}
        onHorarioDelete={onHorarioDelete}
      />
    );
  }

  if (activeSection === "horarios_calendario") {
    return (
      <CalendarioPanel
        model={calendarioPanelModel}
      />
    );
  }

  return null;
}
