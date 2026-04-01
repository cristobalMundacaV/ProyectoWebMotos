import { useEffect, useMemo } from "react";
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
  const buildClienteKey = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");

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
      const value = buildClienteKey(label);
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
    solicitudesTab,
    mobilePickerOpen,
    showHorarioForm,
    setSelectedSolicitudId,
    setSelectedFichaId,
    setSelectedHistoricaId,
    setShowHorarioForm,
    setMobilePickerOpen,
    handleSolicitudesTabChange,
    handleTallerEstadoFilterChange,
    handleHistoricoClienteChange,
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
  });
  const clearAllMantencionModals = transitions.clearAllModalState;

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
  }, [activeSection, clearAllMantencionModals]);

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
    () => (historicoClientes.some((item) => item.value === selectedHistoricoCliente) ? selectedHistoricoCliente : ""),
    [historicoClientes, selectedHistoricoCliente]
  );

  const fichasHistoricasByCliente = useMemo(() => {
    if (!selectedHistoricoClienteEffective) return [];
    return fichasHistoricas.filter((item) => {
      const clienteLabel = (item?.moto_cliente_detalle?.cliente_nombre || "").trim() || "Cliente sin nombre";
      return buildClienteKey(clienteLabel) === selectedHistoricoClienteEffective;
    });
  }, [fichasHistoricas, selectedHistoricoClienteEffective]);

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
          transitions={transitions}
          savingById={savingById}
        />
        <MantencionesModalHost activeSection={activeSection} transitions={transitions} />
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
          transitions={transitions}
          savingById={savingById}
        />
        <MantencionesModalHost activeSection={activeSection} transitions={transitions} />
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
          transitions={transitions}
          savingById={savingById}
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
