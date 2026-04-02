import { useCallback, useEffect, useMemo, useState } from "react";
import { getDisponibilidadMantenciones } from "../../../services/mantencionesService";
import { subscribeRealtime } from "../../../services/realtimeSocket";
import {
  activarDiaCalendarioMantencion,
  bloquearDiaCalendarioMantencion,
  clearHorariosMantencionAdmin,
  toggleHoraCalendarioMantencion,
} from "../services/mantencionesAdminService";
import {
  addMonths,
  extractErrorMessage,
  isChileanHolidayDate,
  toIsoDate,
} from "../utils/mantencionesViewUtils";

function parseLocalIsoDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  const parsed = new Date(year, (month || 1) - 1, day || 1);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function getMonthDateRange(calendarMonth) {
  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  return {
    from: toIsoDate(monthStart),
    to: toIsoDate(monthEnd),
  };
}

function buildInitialCalendarMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function useMantencionesCalendar({ activeSection, horarios }) {
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(buildInitialCalendarMonth);
  const [dayBlockConfirm, setDayBlockConfirm] = useState(null);
  const [dayBlockSaving, setDayBlockSaving] = useState(false);
  const [dayBlockError, setDayBlockError] = useState("");
  const [dayActivateModalOpen, setDayActivateModalOpen] = useState(false);
  const [dayActivateSaving, setDayActivateSaving] = useState(false);
  const [dayActivateError, setDayActivateError] = useState("");
  const [dayActivateForm, setDayActivateForm] = useState({
    hora_inicio: "09:00",
    hora_fin: "18:00",
    intervalo_minutos: "60",
    cupos_por_bloque: "1",
  });
  const [slotToggleConfirm, setSlotToggleConfirm] = useState(null);
  const [slotToggleSaving, setSlotToggleSaving] = useState(false);
  const [slotToggleError, setSlotToggleError] = useState("");
  const [clearHorasModalOpen, setClearHorasModalOpen] = useState(false);
  const [clearHorasSaving, setClearHorasSaving] = useState(false);
  const [clearHorasError, setClearHorasError] = useState("");

  const availabilityMap = useMemo(() => {
    const map = {};
    availabilityDays.forEach((day) => {
      map[day.fecha] = day;
    });
    return map;
  }, [availabilityDays]);

  const selectedCalendarDay = useMemo(() => availabilityMap[selectedCalendarDate] || null, [availabilityMap, selectedCalendarDate]);

  const calendarMonthLabel = useMemo(
    () => calendarMonth.toLocaleDateString("es-CL", { month: "long", year: "numeric" }),
    [calendarMonth]
  );
  const canGoPrevMonth = true;
  const canGoNextMonth = true;

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayIso = toIsoDate(new Date());
    const cells = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ key: `empty-${year}-${month}-${i}`, empty: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const iso = toIsoDate(date);
      const info = availabilityMap[iso];
      const isHoliday = isChileanHolidayDate(date);
      const totalSlots = Array.isArray(info?.horas) ? info.horas.length : 0;
      const availableSlots = Array.isArray(info?.horas) ? info.horas.filter((slot) => slot.disponible).length : 0;
      const occupiedSlots = Array.isArray(info?.horas)
        ? info.horas.filter((slot) => !slot.disponible && !slot.desactivada).length
        : 0;

      cells.push({
        key: iso,
        iso,
        day,
        hasSchedule: Boolean(info),
        isHoliday,
        hasAvailable: availableSlots > 0,
        totalSlots,
        availableSlots,
        occupiedSlots,
        isToday: iso === todayIso,
      });
    }

    return cells;
  }, [availabilityMap, calendarMonth]);

  const monthSummary = useMemo(
    () =>
      calendarCells.reduce(
        (accumulator, cell) => {
          if (cell.empty || !cell.hasSchedule) return accumulator;
          accumulator.daysWithSchedule += 1;
          accumulator.totalSlots += cell.totalSlots;
          accumulator.availableSlots += cell.availableSlots;
          accumulator.occupiedSlots += cell.occupiedSlots;
          if (cell.hasAvailable) {
            accumulator.daysAvailable += 1;
          } else {
            accumulator.daysFull += 1;
          }
          return accumulator;
        },
        {
          daysWithSchedule: 0,
          daysAvailable: 0,
          daysFull: 0,
          totalSlots: 0,
          availableSlots: 0,
          occupiedSlots: 0,
        }
      ),
    [calendarCells]
  );

  const selectedCalendarIsHoliday = useMemo(() => {
    if (!selectedCalendarDate) return false;
    const parsed = parseLocalIsoDate(selectedCalendarDate);
    if (!parsed) return false;
    return isChileanHolidayDate(parsed);
  }, [selectedCalendarDate]);

  const refreshCalendarAvailability = useCallback(
    async ({ silent = false } = {}) => {
      if (activeSection !== "horarios_calendario" || document.hidden) return;
      if (!silent) setCalendarLoading(true);
      setCalendarError("");
      try {
        const { from, to } = getMonthDateRange(calendarMonth);
        const data = await getDisponibilidadMantenciones({ from, to });
        const days = Array.isArray(data?.slots) ? data.slots : [];
        setAvailabilityDays(days);
        if (days.length > 0) {
          setSelectedCalendarDate((prev) => {
            if (prev && days.some((day) => day.fecha === prev)) return prev;
            const firstFromVisibleMonth = days.find((day) => {
              const parsed = parseLocalIsoDate(day.fecha);
              return (
                parsed &&
                parsed.getFullYear() === calendarMonth.getFullYear() &&
                parsed.getMonth() === calendarMonth.getMonth()
              );
            });
            return firstFromVisibleMonth?.fecha || days[0].fecha;
          });
        } else {
          setSelectedCalendarDate("");
        }
      } catch {
        setAvailabilityDays([]);
        setSelectedCalendarDate("");
        setCalendarError("No se pudo cargar la disponibilidad del calendario.");
      } finally {
        if (!silent) setCalendarLoading(false);
      }
    },
    [activeSection, calendarMonth]
  );

  useEffect(() => {
    if (activeSection !== "horarios_calendario") return undefined;
    let mounted = true;

    refreshCalendarAvailability();

    const unsubscribe = subscribeRealtime((event) => {
      if (!mounted || document.hidden) return;
      if (!event?.type) return;
      const eventType = String(event.type);
      if (eventType === "availability_updated" || eventType === "schedule_updated") {
        refreshCalendarAvailability({ silent: true });
      }
    });

    const onVisibilityChange = () => {
      if (!document.hidden) {
        refreshCalendarAvailability({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      mounted = false;
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [activeSection, refreshCalendarAvailability]);


  useEffect(() => {
    if (!dayBlockConfirm) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !dayBlockSaving) {
        setDayBlockConfirm(null);
        setDayBlockError("");
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [dayBlockConfirm, dayBlockSaving]);

  useEffect(() => {
    if (!dayActivateModalOpen) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !dayActivateSaving) {
        setDayActivateModalOpen(false);
        setDayActivateError("");
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [dayActivateModalOpen, dayActivateSaving]);

  useEffect(() => {
    if (!slotToggleConfirm) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !slotToggleSaving) {
        setSlotToggleConfirm(null);
        setSlotToggleError("");
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [slotToggleConfirm, slotToggleSaving]);

  useEffect(() => {
    if (!clearHorasModalOpen) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape" && !clearHorasSaving) {
        setClearHorasModalOpen(false);
        setClearHorasError("");
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [clearHorasModalOpen, clearHorasSaving]);

  useEffect(() => {
    setDayBlockError("");
    setDayActivateError("");
    setSlotToggleError("");
    setClearHorasError("");
    setDayBlockConfirm(null);
    setSlotToggleConfirm(null);
  }, [selectedCalendarDate]);

  const executeDayBlocking = useCallback(
    async (confirmWithBookings = false) => {
      if (!selectedCalendarDate) return;
      setDayBlockSaving(true);
      setDayBlockError("");
      try {
        await bloquearDiaCalendarioMantencion({
          fecha: selectedCalendarDate,
          observacion: "Dia bloqueado desde calendario de disponibilidad",
          ...(confirmWithBookings ? { confirm_with_bookings: true } : {}),
        });
        setDayBlockConfirm(null);
        await refreshCalendarAvailability({ silent: true });
      } catch (error) {
        const needsConfirmation = error?.response?.status === 409 && Boolean(error?.response?.data?.needs_confirmation);
        if (needsConfirmation && !confirmWithBookings) {
          setDayBlockConfirm({
            fecha: selectedCalendarDate,
            bookingsCount: Number(error?.response?.data?.bookings_count || 0),
          });
          return;
        }
        setDayBlockError(extractErrorMessage(error, "No se pudo desactivar el dia seleccionado."));
      } finally {
        setDayBlockSaving(false);
      }
    },
    [refreshCalendarAvailability, selectedCalendarDate]
  );

  const buildDefaultActivationForm = useCallback(
    (targetDateIso) => {
      const fallback = {
        hora_inicio: "09:00",
        hora_fin: "18:00",
        intervalo_minutos: "60",
        cupos_por_bloque: "1",
      };
      if (!targetDateIso) return fallback;

      const parsed = parseLocalIsoDate(targetDateIso);
      if (!parsed) return fallback;
      const weekday = (parsed.getDay() + 6) % 7;
      const base = [...horarios]
        .filter((item) => Number(item?.dia_semana ?? -1) === weekday)
        .sort((a, b) => String(a?.hora_inicio || "").localeCompare(String(b?.hora_inicio || "")))[0];
      if (!base) return fallback;

      return {
        hora_inicio: String(base.hora_inicio || fallback.hora_inicio).slice(0, 5),
        hora_fin: String(base.hora_fin || fallback.hora_fin).slice(0, 5),
        intervalo_minutos: String(base.intervalo_minutos ?? fallback.intervalo_minutos),
        cupos_por_bloque: String(base.cupos_por_bloque ?? fallback.cupos_por_bloque),
      };
    },
    [horarios]
  );

  const openActivateDayModal = useCallback(() => {
    setDayActivateError("");
    setDayActivateForm(buildDefaultActivationForm(selectedCalendarDate));
    setDayActivateModalOpen(true);
  }, [buildDefaultActivationForm, selectedCalendarDate]);

  const executeDayActivation = useCallback(async () => {
    if (!selectedCalendarDate) return;
    setDayActivateSaving(true);
    setDayActivateError("");

    try {
      await activarDiaCalendarioMantencion({
        fecha: selectedCalendarDate,
        hora_inicio: dayActivateForm.hora_inicio,
        hora_fin: dayActivateForm.hora_fin,
        intervalo_minutos: Number.parseInt(String(dayActivateForm.intervalo_minutos || "0"), 10),
        cupos_por_bloque: Number.parseInt(String(dayActivateForm.cupos_por_bloque || "0"), 10),
      });
      setDayActivateModalOpen(false);
      await refreshCalendarAvailability({ silent: true });
    } catch (error) {
      setDayActivateError(extractErrorMessage(error, "No se pudo activar el dia seleccionado."));
    } finally {
      setDayActivateSaving(false);
    }
  }, [dayActivateForm, refreshCalendarAvailability, selectedCalendarDate]);

  const executeSlotToggle = useCallback(
    async (slot, action, confirmWithBookings = false) => {
      if (!selectedCalendarDate || !slot?.hora) return;
      setSlotToggleSaving(true);
      setSlotToggleError("");

      try {
        await toggleHoraCalendarioMantencion({
          fecha: selectedCalendarDate,
          hora: slot.hora,
          action,
          ...(confirmWithBookings ? { confirm_with_bookings: true } : {}),
        });
        setSlotToggleConfirm(null);
        await refreshCalendarAvailability({ silent: true });
      } catch (error) {
        const needsConfirmation = error?.response?.status === 409 && Boolean(error?.response?.data?.needs_confirmation);
        if (needsConfirmation && action === "block" && !confirmWithBookings) {
          setSlotToggleConfirm({
            hora: slot.hora,
            bookingsCount: Number(error?.response?.data?.bookings_count || 0),
          });
          return;
        }
        setSlotToggleError(extractErrorMessage(error, "No se pudo actualizar la hora seleccionada."));
      } finally {
        setSlotToggleSaving(false);
      }
    },
    [refreshCalendarAvailability, selectedCalendarDate]
  );

  const goToPrevMonth = useCallback(() => {
    setCalendarMonth((prev) => addMonths(prev, -1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCalendarMonth((prev) => addMonths(prev, 1));
  }, []);

  const closeDayBlockConfirm = useCallback(() => {
    setDayBlockConfirm(null);
    setDayBlockError("");
  }, []);

  const closeDayActivateModal = useCallback(() => {
    setDayActivateModalOpen(false);
    setDayActivateError("");
  }, []);

  const closeSlotToggleConfirm = useCallback(() => {
    setSlotToggleConfirm(null);
    setSlotToggleError("");
  }, []);

  const openClearHorasModal = useCallback(() => {
    setClearHorasError("");
    setClearHorasModalOpen(true);
  }, []);

  const closeClearHorasModal = useCallback(() => {
    setClearHorasModalOpen(false);
    setClearHorasError("");
  }, []);

  const executeClearAllHoras = useCallback(async () => {
    setClearHorasSaving(true);
    setClearHorasError("");
    try {
      await clearHorariosMantencionAdmin();
      setClearHorasModalOpen(false);
      await refreshCalendarAvailability({ silent: true });
    } catch (error) {
      setClearHorasError(extractErrorMessage(error, "No se pudieron limpiar todas las horas de atencion."));
    } finally {
      setClearHorasSaving(false);
    }
  }, [refreshCalendarAvailability]);

  const handleDayActivateFieldChange = useCallback((field, value) => {
    setDayActivateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
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
    clearHorasModalOpen,
    clearHorasSaving,
    clearHorasError,
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
    openClearHorasModal,
    closeClearHorasModal,
    executeClearAllHoras,
    handleDayActivateFieldChange,
  };
}
