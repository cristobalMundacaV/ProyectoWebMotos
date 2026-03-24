import { useEffect, useMemo, useState } from "react";
import { getDisponibilidadMantenciones } from "../../../services/mantencionesService";

const ESTADO_OPTIONS = [
  { value: "en_revision", label: "En revision" },
  { value: "en_proceso", label: "En proceso" },
  { value: "esperando_repuestos", label: "Esperando repuestos" },
  { value: "finalizada", label: "Finalizada" },
  { value: "entregada", label: "Entregada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "no_asistio", label: "No asistio" },
];

const SOLICITUDES_TABS = [
  { value: "por_aceptar", label: "Por Aceptar", estado: "ingresada" },
  { value: "pendiente_ingreso", label: "Pendiente Ingreso", estado: "aceptada" },
];

const ESTADOS_SOLICITUD = ["ingresada", "aceptada"];
const ESTADOS_TALLER = ["en_revision", "en_proceso", "esperando_repuestos", "finalizada"];
const ESTADOS_EN_TALLER = ["en_revision", "en_proceso", "esperando_repuestos"];
const ESTADOS_POR_ENTREGAR = ["finalizada"];
const TALLER_ESTADO_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "en_revision", label: "En revision" },
  { value: "en_proceso", label: "En proceso" },
  { value: "esperando_repuestos", label: "Esperando repuestos" },
];

const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-CL");
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(value) {
  const option = ESTADO_OPTIONS.find((item) => item.value === value);
  if (value === "ingresada") return "Por aceptar";
  if (value === "aceptada") return "Por ingreso";
  if (option?.label) return option.label;
  if (!value) return "-";
  const clean = String(value).replace(/[_-]+/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getStatusPillClass(value) {
  if (value === "ingresada") return "status-ingresada";
  if (value === "aceptada") return "status-aceptada";
  if (value === "en_revision") return "status-en-revision";
  if (value === "en_proceso") return "status-en-proceso";
  if (value === "esperando_repuestos") return "status-esperando-repuestos";
  if (value === "finalizada") return "status-finalizada";
  if (value === "entregada") return "status-entregada";
  if (value === "cancelada") return "status-cancelada";
  if (value === "no_asistio") return "status-no-asistio";
  return "";
}

function formatReason(value) {
  if (!value) return "-";
  const clean = String(value).replace(/_/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getEstadoClass(value) {
  if (value === "aceptada") return "estado-aceptada";
  if (value === "ingresada") return "estado-ingresada";
  if (value === "en_revision") return "estado-en-revision";
  if (value === "en_proceso") return "estado-en-proceso";
  if (value === "esperando_repuestos") return "estado-esperando-repuestos";
  if (value === "finalizada") return "estado-finalizada";
  if (value === "entregada") return "estado-entregada";
  if (value === "cancelada") return "estado-cancelada";
  if (value === "no_asistio") return "estado-no-asistio";
  return "";
}

function toWholeNumber(value) {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed)) return 0;
  return Math.trunc(parsed);
}

function sanitizeIntegerInput(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function formatIntegerCL(value) {
  const clean = String(value ?? "").replace(/[^\d]/g, "");
  if (!clean) return "";
  const parsed = Number.parseInt(clean, 10);
  if (!Number.isFinite(parsed)) return "";
  return parsed.toLocaleString("es-CL", { maximumFractionDigits: 0 });
}

function parseDateTimestamp(value) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) return parsed;

  const match = String(value).match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (!match) return 0;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

function formatLongDate(value, options = {}) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  });
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function getMantencionSortTimestamp(item) {
  const fechaTs = parseDateTimestamp(item?.fecha_ingreso);
  const horaRaw = item?.hora_ingreso ? String(item.hora_ingreso).slice(0, 5) : "";
  if (!horaRaw || !Number.isFinite(fechaTs)) return fechaTs || 0;
  const [hours, minutes] = horaRaw.split(":").map((part) => Number(part));
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return fechaTs || 0;
  return fechaTs + (hours * 60 + minutes) * 60 * 1000;
}

function getMantencionDateIso(item) {
  if (!item?.fecha_ingreso) return "";
  const raw = String(item.fecha_ingreso).trim();
  const parts = raw.split("-");
  if (parts.length === 3 && parts[0].length === 4) return raw;

  const ts = parseDateTimestamp(raw);
  if (!Number.isFinite(ts) || ts <= 0) return "";
  return toIsoDate(new Date(ts));
}

function getCreatedAtTimestamp(item) {
  if (!item?.created_at) return 0;
  const parsed = Date.parse(item.created_at);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function MantencionesPage({
  activeSection,
  loading,
  mantenciones,
  savingById,
  onAcceptSolicitud,
  onUpdateMantencion,
  horarios = [],
  horariosLoading = false,
  horarioForm,
  horarioSaving = false,
  onHorarioInputChange,
  onHorarioSubmit,
  onHorarioUpdate,
  onHorarioDelete,
}) {
  const [editsById, setEditsById] = useState({});
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [selectedFichaId, setSelectedFichaId] = useState(null);
  const [tallerEstadoFilter, setTallerEstadoFilter] = useState("todos");
  const [selectedTallerDiaId, setSelectedTallerDiaId] = useState(null);
  const [selectedPorEntregarId, setSelectedPorEntregarId] = useState(null);
  const [selectedHistoricaId, setSelectedHistoricaId] = useState(null);
  const [selectedHistoricoCliente, setSelectedHistoricoCliente] = useState("");
  const [solicitudesTab, setSolicitudesTab] = useState("por_aceptar");
  const [mobilePickerOpen, setMobilePickerOpen] = useState({
    solicitudes: false,
    fichas: false,
    tallerDia: false,
    porEntregar: false,
    historicas: false,
  });
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [horarioEditsById, setHorarioEditsById] = useState({});
  const [showHorarioForm, setShowHorarioForm] = useState(false);

  const DIAS_LABEL = {
    0: "Lunes",
    1: "Martes",
    2: "Miercoles",
    3: "Jueves",
    4: "Viernes",
    5: "Sabado",
    6: "Domingo",
  };

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
      const totalSlots = Array.isArray(info?.horas) ? info.horas.length : 0;
      const availableSlots = Array.isArray(info?.horas) ? info.horas.filter((slot) => slot.disponible).length : 0;

      cells.push({
        key: iso,
        iso,
        day,
        hasSchedule: Boolean(info),
        hasAvailable: availableSlots > 0,
        totalSlots,
        availableSlots,
        occupiedSlots: Math.max(totalSlots - availableSlots, 0),
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

  useEffect(() => {
    if (activeSection !== "horarios_calendario") return undefined;

    let mounted = true;
    let intervalId = null;

    async function loadAvailability() {
      if (!mounted || document.hidden) return;
      setCalendarLoading(true);
      setCalendarError("");
      try {
        const data = await getDisponibilidadMantenciones(60);
        if (!mounted) return;
        const days = Array.isArray(data?.slots) ? data.slots : [];
        setAvailabilityDays(days);

        if (days.length > 0) {
          setSelectedCalendarDate((prev) => (prev && days.some((day) => day.fecha === prev) ? prev : days[0].fecha));
        } else {
          setSelectedCalendarDate("");
        }
      } catch (_error) {
        if (!mounted) return;
        setAvailabilityDays([]);
        setSelectedCalendarDate("");
        setCalendarError("No se pudo cargar la disponibilidad del calendario.");
      } finally {
        if (mounted) setCalendarLoading(false);
      }
    }

    loadAvailability();
    intervalId = window.setInterval(loadAvailability, 12000);

    const onVisibilityChange = () => {
      if (!document.hidden) loadAvailability();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mounted = false;
      if (intervalId) window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [activeSection]);

  useEffect(() => {
    setMobilePickerOpen({
      solicitudes: false,
      fichas: false,
      tallerDia: false,
      porEntregar: false,
      historicas: false,
    });
  }, [activeSection]);

  useEffect(() => {
    setSelectedSolicitudId(null);
  }, [solicitudesTab]);

  useEffect(() => {
    setSelectedFichaId(null);
  }, [tallerEstadoFilter]);

  const solicitudesBase = useMemo(
    () =>
      mantenciones
        .filter((item) => ESTADOS_SOLICITUD.includes(item.estado))
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(b) - getMantencionSortTimestamp(a) ||
            getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a) ||
            Number(b.id || 0) - Number(a.id || 0)
        ),
    [mantenciones]
  );

  const solicitudes = useMemo(() => {
    const selectedTab = SOLICITUDES_TABS.find((tab) => tab.value === solicitudesTab) || SOLICITUDES_TABS[0];
    return solicitudesBase.filter((item) => item.estado === selectedTab.estado);
  }, [solicitudesBase, solicitudesTab]);

  const solicitudesEmptyText = useMemo(() => {
    if (solicitudesTab === "pendiente_ingreso") return "No hay solicitudes pendientes de ingreso.";
    return "No hay solicitudes por aceptar.";
  }, [solicitudesTab]);

  const todayIso = useMemo(() => toIsoDate(new Date()), []);

  const mantencionesDelDia = useMemo(
    () =>
      mantenciones
        .filter((item) => getMantencionDateIso(item) === todayIso && item.estado === "aceptada")
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(b) - getMantencionSortTimestamp(a) ||
            getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a) ||
            Number(b.id || 0) - Number(a.id || 0)
        ),
    [mantenciones, todayIso]
  );

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

  const fichasPorEntregar = useMemo(
    () =>
      mantenciones
        .filter((item) => ESTADOS_POR_ENTREGAR.includes(item.estado))
        .sort(
          (a, b) =>
            getMantencionSortTimestamp(b) - getMantencionSortTimestamp(a) ||
            getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a) ||
            Number(b.id || 0) - Number(a.id || 0)
        ),
    [mantenciones]
  );

  const fichasMantencion = useMemo(() => {
    if (tallerEstadoFilter === "todos") return fichasEnTallerBase;
    return fichasEnTallerBase.filter((item) => item.estado === tallerEstadoFilter);
  }, [fichasEnTallerBase, tallerEstadoFilter]);

  const fichasTallerEmptyText = useMemo(() => {
    if (tallerEstadoFilter === "todos") return "No hay fichas en taller disponibles.";
    const currentFilter = TALLER_ESTADO_FILTERS.find((item) => item.value === tallerEstadoFilter);
    return `No hay fichas en estado ${currentFilter?.label?.toLowerCase() || "seleccionado"}.`;
  }, [tallerEstadoFilter]);

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
      const cliente = (moto.cliente_nombre || "").trim() || "Cliente sin nombre";
      if (!uniques.has(cliente)) uniques.set(cliente, cliente);
    });
    return Array.from(uniques.values()).sort((a, b) => a.localeCompare(b, "es"));
  }, [fichasHistoricas]);

  useEffect(() => {
    setSelectedHistoricoCliente((prev) => {
      if (prev && historicoClientes.includes(prev)) return prev;
      return "";
    });
  }, [historicoClientes]);

  const fichasHistoricasByCliente = useMemo(() => {
    if (!selectedHistoricoCliente) return [];
    return fichasHistoricas.filter((item) => {
      const cliente = (item?.moto_cliente_detalle?.cliente_nombre || "").trim() || "Cliente sin nombre";
      return cliente === selectedHistoricoCliente;
    });
  }, [fichasHistoricas, selectedHistoricoCliente]);

  useEffect(() => {
    setSelectedHistoricaId(null);
  }, [selectedHistoricoCliente]);

  const selectedSolicitud = useMemo(() => {
    const byId = solicitudes.find((item) => item.id === selectedSolicitudId);
    return byId || solicitudes[0] || null;
  }, [solicitudes, selectedSolicitudId]);

  const selectedFicha = useMemo(() => {
    const byId = fichasMantencion.find((item) => item.id === selectedFichaId);
    return byId || fichasMantencion[0] || null;
  }, [fichasMantencion, selectedFichaId]);

  const selectedTallerDia = useMemo(() => {
    const byId = mantencionesDelDia.find((item) => item.id === selectedTallerDiaId);
    return byId || mantencionesDelDia[0] || null;
  }, [mantencionesDelDia, selectedTallerDiaId]);

  const selectedPorEntregar = useMemo(() => {
    const byId = fichasPorEntregar.find((item) => item.id === selectedPorEntregarId);
    return byId || fichasPorEntregar[0] || null;
  }, [fichasPorEntregar, selectedPorEntregarId]);

  const selectedHistorica = useMemo(() => {
    const byId = fichasHistoricasByCliente.find((item) => item.id === selectedHistoricaId);
    return byId || fichasHistoricasByCliente[0] || null;
  }, [fichasHistoricasByCliente, selectedHistoricaId]);

  const horariosOrdenados = useMemo(
    () => {
      const agrupados = new Map();
      [...horarios]
        .sort((a, b) => Number(a.id ?? 0) - Number(b.id ?? 0))
        .forEach((item) => {
          agrupados.set(Number(item.dia_semana ?? 0), item);
        });

      return [...agrupados.values()].sort(
        (a, b) =>
          Number(a.dia_semana ?? 0) - Number(b.dia_semana ?? 0) ||
          String(a.hora_inicio || "").localeCompare(String(b.hora_inicio || ""))
      );
    },
    [horarios]
  );

  function getDraft(item) {
    const base = {
      estado: item.estado,
      costo_total: item.costo_total === null || item.costo_total === undefined ? "" : String(toWholeNumber(item.costo_total)),
      kilometraje_ingreso: item.kilometraje_ingreso ?? "",
      diagnostico: item.diagnostico ?? "",
      trabajo_realizado: item.trabajo_realizado ?? "",
      observaciones: item.observaciones ?? "",
    };
    const edit = editsById[item.id] || {};
    return { ...base, ...edit };
  }

  function setDraft(id, field, value) {
    setEditsById((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }

  function getHorarioDraft(item) {
    return (
      horarioEditsById[item.id] || {
        dia_semana: String(item.dia_semana ?? "0"),
        hora_inicio: item.hora_inicio?.slice(0, 5) || "",
        hora_fin: item.hora_fin?.slice(0, 5) || "",
        intervalo_minutos: String(item.intervalo_minutos ?? "60"),
        cupos_por_bloque: String(item.cupos_por_bloque ?? "1"),
        activo: true,
      }
    );
  }

  function setHorarioDraft(id, field, value) {
    setHorarioEditsById((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }

  function renderFichaList(items, selectedId, onSelect, emptyText) {
    return (
      <aside className="admin-mantencion-fichas-list">
        {items.map((item) => {
          const moto = item?.moto_cliente_detalle || {};
          const isActive = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? "admin-mantencion-ficha-item active" : "admin-mantencion-ficha-item"}
              onClick={() => onSelect(item.id)}
            >
              <div className="admin-mantencion-ficha-item-top">
                <strong>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</strong>
                <span className={`admin-status-pill ${getStatusPillClass(item.estado)}`}>{statusLabel(item.estado)}</span>
              </div>
              <span>{moto.cliente_nombre || "Cliente"}</span>
              <small>{formatDate(item.fecha_ingreso)}</small>
            </button>
          );
        })}

        {!loading && items.length === 0 && <p className="admin-empty">{emptyText}</p>}
        {loading && <p className="admin-empty">Cargando fichas...</p>}
      </aside>
    );
  }

  function getFichaMobileLabel(item) {
    const moto = item?.moto_cliente_detalle || {};
    return `${moto.marca || "-"} ${moto.modelo || "-"} - ${moto.cliente_nombre || "Cliente"}`;
  }

  function renderFichaMobilePicker(items, selectedId, onSelect, emptyText, pickerKey) {
    if (loading) {
      return <p className="admin-empty admin-mantencion-ficha-mobile-picker-empty">Cargando fichas...</p>;
    }

    if (!items.length) {
      return <p className="admin-empty admin-mantencion-ficha-mobile-picker-empty">{emptyText}</p>;
    }

    const selectedValue = selectedId != null ? String(selectedId) : String(items[0].id);
    const selectedItem = items.find((item) => String(item.id) === selectedValue);
    const isOpen = Boolean(mobilePickerOpen[pickerKey]);

    return (
      <div className="admin-mantencion-ficha-mobile-picker">
        <label>Seleccionar ficha</label>
        <button
          type="button"
          className={isOpen ? "admin-mantencion-mobile-trigger is-open" : "admin-mantencion-mobile-trigger"}
          onClick={() =>
            setMobilePickerOpen((prev) => ({
              ...prev,
              [pickerKey]: !prev[pickerKey],
            }))
          }
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{getFichaMobileLabel(selectedItem || items[0])}</span>
          <span aria-hidden="true">{isOpen ? "^" : "v"}</span>
        </button>

        {isOpen && (
          <div className="admin-mantencion-mobile-options" role="listbox" aria-label="Fichas disponibles">
            {items.map((item) => {
              const isActive = String(item.id) === selectedValue;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={isActive ? "admin-mantencion-mobile-option active" : "admin-mantencion-mobile-option"}
                  onClick={() => {
                    onSelect(item.id);
                    setMobilePickerOpen((prev) => ({
                      ...prev,
                      [pickerKey]: false,
                    }));
                  }}
                >
                  {getFichaMobileLabel(item)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderFichaDetail(item, mode) {
    if (!item) {
      return <p className="admin-empty">Selecciona una ficha para ver el detalle.</p>;
    }

    const moto = item?.moto_cliente_detalle || {};
    const draft = getDraft(item);
    const saving = Boolean(savingById[item.id]);
    const isSolicitud = mode === "solicitudes";
    const isTallerDia = mode === "taller_dia";
    const isPorEntregar = mode === "por_entregar";
    const isEditable = mode === "fichas" || mode === "taller_dia";
    const canEditKmIngreso = isTallerDia;
    const readOnly = !isEditable;
    const estadoActual = draft.estado || item.estado;
    const solicitudAceptada = item.estado === "aceptada";
    const estadoOptions = isTallerDia
      ? [
          { value: "aceptada", label: "Por ingreso" },
          { value: "en_revision", label: "Ingresada al taller" },
          { value: "no_asistio", label: "No asistio" },
          { value: "cancelada", label: "Cancelada" },
        ]
      : mode === "fichas"
        ? ESTADO_OPTIONS.filter((option) => option.value !== "no_asistio")
      : ESTADO_OPTIONS;
    const estadoOptionsForSelect = estadoOptions.some((option) => option.value === estadoActual)
      ? estadoOptions
      : [{ value: estadoActual, label: statusLabel(estadoActual) }, ...estadoOptions];

    return (
      <>
        <div className="admin-mantencion-ficha-head">
          <h3>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</h3>
          <span className={`admin-status-pill ${getStatusPillClass(item.estado)}`}>{statusLabel(item.estado)}</span>
        </div>

        {isSolicitud ? (
          <div className="admin-mantencion-ficha-grid">
            <div>
              <span>Marca</span>
              <strong>{moto.marca || "-"}</strong>
            </div>
            <div>
              <span>Modelo</span>
              <strong>{moto.modelo || "-"}</strong>
            </div>
            <div>
              <span>{"A\u00F1o"}</span>
              <strong>{moto.anio || "-"}</strong>
            </div>
            <div>
              <span>Matricula</span>
              <strong>{moto.matricula || "-"}</strong>
            </div>
            <div>
              <span>Cliente</span>
              <strong>{moto.cliente_nombre || "-"}</strong>
            </div>
            <div>
              <span>Tipo mantencion</span>
              <strong>{formatReason(item.tipo_mantencion)}</strong>
            </div>
            <div>
              <span>Fecha agendada</span>
              <strong>{formatDate(item.fecha_ingreso)}</strong>
            </div>
            <div>
              <span>Hora agendada</span>
              <strong>{item.hora_ingreso ? String(item.hora_ingreso).slice(0, 5) : "-"}</strong>
            </div>
            <div>
              <span>Fecha solicitud</span>
              <strong>{formatDateTime(item.created_at)}</strong>
            </div>
          </div>
        ) : (
          <div className="admin-mantencion-ficha-grid">
            <div>
              <span>Cliente</span>
              <strong>{moto.cliente_nombre || "-"}</strong>
            </div>
            <div>
              <span>Marca</span>
              <strong>{moto.marca || "-"}</strong>
            </div>
            <div>
              <span>Modelo</span>
              <strong>{moto.modelo || "-"}</strong>
            </div>
            <div>
              <span>Matricula</span>
              <strong>{moto.matricula || "-"}</strong>
            </div>
            <div>
              <span>{"A\u00F1o"}</span>
              <strong>{moto.anio || "-"}</strong>
            </div>
            <div>
              <span>Fecha ingreso</span>
              <strong>{formatDate(item.fecha_ingreso)}</strong>
            </div>
            <div>
              <span>Hora ingreso</span>
              <strong>{item.hora_ingreso ? String(item.hora_ingreso).slice(0, 5) : "-"}</strong>
            </div>
            <div>
              <span>Tipo mantencion</span>
              <strong>{formatReason(item.tipo_mantencion)}</strong>
            </div>
            {!isTallerDia && (
              <div>
                <span>Km ingreso</span>
                <strong>{formatIntegerCL(item.kilometraje_ingreso ?? "") || "-"}</strong>
              </div>
            )}
          </div>
        )}

        {isSolicitud ? (
          <></>
        ) : (
          <div className="admin-mantencion-ficha-controls">
            {isEditable && (
              <label>
                Estado
                <select
                  className={`admin-mantencion-estado-select ${getEstadoClass(estadoActual)}`}
                  value={estadoActual}
                  onChange={(event) => setDraft(item.id, "estado", event.target.value)}
                  disabled={saving}
                >
                  {estadoOptionsForSelect.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {canEditKmIngreso && (
              <label>
                Km ingreso
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatIntegerCL(draft.kilometraje_ingreso ?? "")}
                  onChange={(event) => setDraft(item.id, "kilometraje_ingreso", sanitizeIntegerInput(event.target.value))}
                  disabled={saving}
                />
              </label>
            )}

            {!isTallerDia && (
              <label>
                Valor cobrado
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatIntegerCL(isEditable ? draft.costo_total ?? "" : toWholeNumber(item.costo_total ?? 0))}
                  onChange={(event) => setDraft(item.id, "costo_total", sanitizeIntegerInput(event.target.value))}
                  disabled={saving || readOnly}
                />
              </label>
            )}

          </div>
        )}

        {isSolicitud ? (
          <div className="admin-mantencion-ficha-blocks admin-mantencion-ficha-blocks-solicitud">
            <article>
              <h4>Motivo de la solicitud</h4>
              <p>{item.motivo || "-"}</p>
            </article>
            <div className="admin-mantencion-ficha-actions admin-mantencion-ficha-actions-solicitud">
              <button
                type="button"
                className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                disabled={saving}
                onClick={() =>
                  solicitudAceptada
                    ? onUpdateMantencion(item.id, { estado: "en_revision" })
                    : onAcceptSolicitud(item.id)
                }
              >
                {saving ? (solicitudAceptada ? "Ingresando..." : "Aceptando...") : solicitudAceptada ? "Ingresar a taller" : "Aceptar hora"}
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-mantencion-ficha-blocks">
            <article>
              <h4>Motivo de ingreso</h4>
              <p>{item.motivo || "-"}</p>
            </article>
            <article>
              <h4>Diagnostico</h4>
              <textarea
                className="admin-mantencion-ficha-textarea"
                value={isEditable ? draft.diagnostico ?? "" : item.diagnostico ?? ""}
                onChange={(event) => setDraft(item.id, "diagnostico", event.target.value)}
                disabled={saving || readOnly}
                rows={4}
              />
            </article>
            <article>
              <h4>Trabajo realizado</h4>
              <textarea
                className="admin-mantencion-ficha-textarea"
                value={isEditable ? draft.trabajo_realizado ?? "" : item.trabajo_realizado ?? ""}
                onChange={(event) => setDraft(item.id, "trabajo_realizado", event.target.value)}
                disabled={saving || readOnly}
                rows={4}
              />
            </article>
            <article>
              <h4>Comentarios / Observaciones</h4>
              <textarea
                className="admin-mantencion-ficha-textarea"
                value={isEditable ? draft.observaciones ?? "" : item.observaciones ?? ""}
                onChange={(event) => setDraft(item.id, "observaciones", event.target.value)}
                disabled={saving || readOnly}
                rows={4}
              />
            </article>
          </div>
        )}

        {isEditable && (
          <div className="admin-mantencion-ficha-actions admin-mantencion-ficha-actions-bottom">
            <button
              type="button"
              className="admin-primary-action admin-mantencion-action-btn admin-mantencion-save-btn"
              disabled={saving}
              onClick={() =>
                onUpdateMantencion(item.id, {
                  estado: estadoActual,
                  kilometraje_ingreso:
                    draft.kilometraje_ingreso === "" || draft.kilometraje_ingreso === null
                      ? null
                      : Number.parseInt(draft.kilometraje_ingreso, 10),
                  costo_total: Number.parseInt(draft.costo_total ?? item.costo_total ?? 0, 10) || 0,
                  diagnostico: draft.diagnostico ?? item.diagnostico ?? "",
                  trabajo_realizado: draft.trabajo_realizado ?? item.trabajo_realizado ?? "",
                  observaciones: draft.observaciones ?? item.observaciones ?? "",
                })
              }
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        )}

        {isPorEntregar && (
          <div className="admin-mantencion-ficha-actions admin-mantencion-ficha-actions-bottom">
            <button
              type="button"
              className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
              disabled={saving}
              onClick={() => onUpdateMantencion(item.id, { estado: "entregada" })}
            >
              {saving ? "Marcando..." : "Marcar como Entregada"}
            </button>
          </div>
        )}
      </>
    );
  }

  if (activeSection === "mantenciones_solicitudes") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <div className="admin-mantencion-solicitudes-head">
              <h2>Solicitudes de mantencion</h2>
              <div className="admin-mantencion-tabs" role="tablist" aria-label="Filtros de solicitudes">
                {SOLICITUDES_TABS.map((tab) => {
                  const isActive = solicitudesTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={isActive ? "admin-mantencion-tab active" : "admin-mantencion-tab"}
                      onClick={() => setSolicitudesTab(tab.value)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="admin-mantencion-fichas-layout">
            {renderFichaMobilePicker(
              solicitudes,
              selectedSolicitud?.id,
              setSelectedSolicitudId,
              solicitudesEmptyText,
              "solicitudes"
            )}
            {renderFichaList(solicitudes, selectedSolicitud?.id, setSelectedSolicitudId, solicitudesEmptyText)}
            <div className="admin-mantencion-ficha-detail">{renderFichaDetail(selectedSolicitud, "solicitudes")}</div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "mantenciones_fichas" || activeSection === "taller_en_taller") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <div className="admin-mantencion-solicitudes-head">
              <h2>Motos en taller</h2>
              <div className="admin-mantencion-tabs" role="tablist" aria-label="Filtros por estado en taller">
                {TALLER_ESTADO_FILTERS.map((filter) => {
                  const isActive = tallerEstadoFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={isActive ? "admin-mantencion-tab active" : "admin-mantencion-tab"}
                      onClick={() => setTallerEstadoFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="admin-mantencion-fichas-layout">
            {renderFichaMobilePicker(
              fichasMantencion,
              selectedFicha?.id,
              setSelectedFichaId,
              fichasTallerEmptyText,
              "fichas"
            )}
            {renderFichaList(fichasMantencion, selectedFicha?.id, setSelectedFichaId, fichasTallerEmptyText)}
            <div className="admin-mantencion-ficha-detail">{renderFichaDetail(selectedFicha, "fichas")}</div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "taller_mantenciones_dia") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Etapa de Diagnostico</h2>
          </div>

          <div className="admin-mantencion-fichas-layout">
            {renderFichaMobilePicker(
              mantencionesDelDia,
              selectedTallerDia?.id,
              setSelectedTallerDiaId,
              "No hay mantenciones agendadas para hoy.",
              "tallerDia"
            )}
            {renderFichaList(
              mantencionesDelDia,
              selectedTallerDia?.id,
              setSelectedTallerDiaId,
              "No hay mantenciones agendadas para hoy."
            )}
            <div className="admin-mantencion-ficha-detail">{renderFichaDetail(selectedTallerDia, "taller_dia")}</div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "taller_por_entregar") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Por entregar</h2>
          </div>

          <div className="admin-mantencion-fichas-layout">
            {renderFichaMobilePicker(
              fichasPorEntregar,
              selectedPorEntregar?.id,
              setSelectedPorEntregarId,
              "No hay motos por entregar.",
              "porEntregar"
            )}
            {renderFichaList(
              fichasPorEntregar,
              selectedPorEntregar?.id,
              setSelectedPorEntregarId,
              "No hay motos por entregar."
            )}
            <div className="admin-mantencion-ficha-detail">{renderFichaDetail(selectedPorEntregar, "por_entregar")}</div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "mantenciones_historicas") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <div className="admin-mantencion-solicitudes-head">
              <h2>Fichas historicas</h2>
              <label className="admin-mantencion-historico-filter">
                Cliente
                <select
                  value={selectedHistoricoCliente}
                  onChange={(event) => setSelectedHistoricoCliente(event.target.value)}
                  disabled={!historicoClientes.length}
                >
                  <option value="">Seleccione un cliente</option>
                  {historicoClientes.map((cliente) => (
                    <option key={cliente} value={cliente}>
                      {cliente}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="admin-mantencion-fichas-layout">
            {renderFichaMobilePicker(
              fichasHistoricasByCliente,
              selectedHistorica?.id,
              setSelectedHistoricaId,
              selectedHistoricoCliente
                ? "No hay fichas historicas para este cliente."
                : "Seleccione un cliente para ver sus fichas historicas.",
              "historicas"
            )}
            {renderFichaList(
              fichasHistoricasByCliente,
              selectedHistorica?.id,
              setSelectedHistoricaId,
              selectedHistoricoCliente
                ? "No hay fichas historicas para este cliente."
                : "Seleccione un cliente para ver sus fichas historicas."
            )}
            <div className="admin-mantencion-ficha-detail">
              {selectedHistoricoCliente
                ? renderFichaDetail(selectedHistorica, "historicas")
                : <p className="admin-empty">Seleccione un cliente para ver el detalle.</p>}
            </div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "horarios_operativos" || activeSection === "mantenciones_horarios") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Horario de la Semana</h2>
            <button
              type="button"
              className="admin-primary-action"
              onClick={() => setShowHorarioForm((prev) => !prev)}
            >
              {showHorarioForm ? "Cerrar formulario" : "Agregar horario"}
            </button>
          </div>

          {showHorarioForm && (
            <form className="admin-moto-form admin-horario-create-form" onSubmit={onHorarioSubmit} noValidate>
              <label>
                Dia inicio
                <select name="dia_inicio" value={horarioForm?.dia_inicio ?? "0"} onChange={onHorarioInputChange} required>
                  {Object.entries(DIAS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Dia final
                <select name="dia_fin" value={horarioForm?.dia_fin ?? "0"} onChange={onHorarioInputChange} required>
                  {Object.entries(DIAS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Hora inicio
                <input type="time" name="hora_inicio" value={horarioForm?.hora_inicio ?? ""} onChange={onHorarioInputChange} required />
              </label>

              <label>
                Hora fin
                <input type="time" name="hora_fin" value={horarioForm?.hora_fin ?? ""} onChange={onHorarioInputChange} required />
              </label>

              <label>
                Intervalo (minutos)
                <input
                  type="number"
                  min="15"
                  step="15"
                  name="intervalo_minutos"
                  value={horarioForm?.intervalo_minutos ?? "60"}
                  onChange={onHorarioInputChange}
                  required
                />
              </label>

              <label>
                Horas por bloque
                <input
                  type="number"
                  min="1"
                  name="cupos_por_bloque"
                  value={horarioForm?.cupos_por_bloque ?? "1"}
                  onChange={onHorarioInputChange}
                  required
                />
              </label>

              <button type="submit" className="admin-primary-action" disabled={horarioSaving}>
                {horarioSaving ? "Guardando..." : "Guardar horario"}
              </button>
            </form>
          )}

          <div className="admin-table">
            {horariosOrdenados.map((item) => {
              const draft = getHorarioDraft(item);
              return (
                <div key={item.id} className="admin-horario-edit-card">
                  <div className="admin-horario-edit-grid">
                    <div className="admin-horario-edit-field admin-horario-edit-field-static">
                      <span>Dia</span>
                      <p>{DIAS_LABEL[item.dia_semana] || item.dia_semana}</p>
                    </div>
                    <div className="admin-horario-edit-field">
                      <span>Hora inicio</span>
                      <input
                        type="time"
                        value={draft.hora_inicio}
                        onChange={(event) => setHorarioDraft(item.id, "hora_inicio", event.target.value)}
                      />
                    </div>
                    <div className="admin-horario-edit-field">
                      <span>Hora fin</span>
                      <input
                        type="time"
                        value={draft.hora_fin}
                        onChange={(event) => setHorarioDraft(item.id, "hora_fin", event.target.value)}
                      />
                    </div>
                    <div className="admin-horario-edit-field">
                      <span>Horas por bloque</span>
                      <input
                        type="number"
                        min="1"
                        value={draft.cupos_por_bloque}
                        onChange={(event) => setHorarioDraft(item.id, "cupos_por_bloque", event.target.value)}
                        onBlur={() => {
                          if (String(draft.cupos_por_bloque ?? "").trim() === "") {
                            setHorarioDraft(item.id, "cupos_por_bloque", "1");
                          }
                        }}
                      />
                    </div>
                    <div className="admin-horario-edit-field admin-horario-edit-field-checkbox">
                      <span>{"\u00BFDisponible?"}</span>
                      <label className="admin-inline-checkbox">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                        />
                      </label>
                    </div>
                    <div className="admin-horario-edit-actions">
                      <button
                        type="button"
                        className="admin-primary-action admin-mantencion-action-btn admin-mantencion-save-btn"
                        onClick={() =>
                          onHorarioUpdate(item.id, {
                            dia_semana: Number(item.dia_semana ?? 0),
                            hora_inicio: draft.hora_inicio,
                            hora_fin: draft.hora_fin,
                            intervalo_minutos: toPositiveInteger(draft.intervalo_minutos, Number(item.intervalo_minutos ?? 60) || 60),
                            cupos_por_bloque: toPositiveInteger(draft.cupos_por_bloque, Number(item.cupos_por_bloque ?? 1) || 1),
                            activo: true,
                          })
                        }
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="admin-danger-action admin-mantencion-action-btn"
                        onClick={() => onHorarioDelete(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!horariosLoading && horarios.length === 0 && <p className="admin-empty">No hay horario de la semana configurado.</p>}
            {horariosLoading && <p className="admin-empty">Cargando horarios...</p>}
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "horarios_calendario") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <div>
              <h2>Calendario de disponibilidad</h2>
              <span>Vista mensual para revisar dias habilitados y el detalle de horas disponibles u ocupadas.</span>
            </div>
          </div>

          <div className="admin-horarios-calendar-layout">
            <section className="admin-horarios-calendar-card">
              <div className="admin-horarios-calendar-head">
                <div>
                  <p className="admin-horarios-calendar-kicker">Vista mensual</p>
                  <strong>{calendarMonthLabel}</strong>
                </div>
                <div className="admin-horarios-calendar-nav">
                  <button type="button" onClick={() => setCalendarMonth((prev) => addMonths(prev, -1))}>
                    {"<"}
                  </button>
                  <button type="button" onClick={() => setCalendarMonth((prev) => addMonths(prev, 1))}>
                    {">"}
                  </button>
                </div>
              </div>

              <div className="admin-horarios-calendar-summary">
                <article>
                  <span>Dias con agenda</span>
                  <strong>{monthSummary.daysWithSchedule}</strong>
                </article>
                <article>
                  <span>Dias con cupos</span>
                  <strong>{monthSummary.daysAvailable}</strong>
                </article>
                <article>
                  <span>Dias completos</span>
                  <strong>{monthSummary.daysFull}</strong>
                </article>
                <article>
                  <span>Horas ocupadas</span>
                  <strong>{monthSummary.occupiedSlots}</strong>
                </article>
              </div>

              <div className="admin-horarios-calendar-grid admin-horarios-calendar-weekdays">
                {WEEK_DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="admin-horarios-calendar-grid admin-horarios-calendar-days">
                {calendarCells.map((cell) => {
                  if (cell.empty) return <span key={cell.key} className="admin-horarios-calendar-empty" />;

                  const isSelected = selectedCalendarDate === cell.iso;
                  const className = [
                    "admin-horarios-day-btn",
                    cell.hasSchedule ? (cell.hasAvailable ? "available" : "occupied") : "inactive",
                    cell.isToday ? "today" : "",
                    isSelected ? "selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      className={className}
                      disabled={!cell.hasSchedule}
                      onClick={() => setSelectedCalendarDate(cell.iso)}
                      title={cell.hasSchedule ? formatLongDate(cell.iso) : "Sin horarios configurados"}
                    >
                      <strong>{cell.day}</strong>
                      <small>
                        {cell.hasSchedule
                          ? cell.hasAvailable
                            ? `${cell.availableSlots}/${cell.totalSlots} libres`
                            : "Completo"
                          : "Sin agenda"}
                      </small>
                    </button>
                  );
                })}
              </div>

              <div className="admin-horarios-calendar-legend">
                <span><i className="dot dot-available" />Disponible</span>
                <span><i className="dot dot-occupied" />Completo</span>
                <span><i className="dot dot-inactive" />Sin agenda</span>
              </div>

              {calendarLoading && <p className="admin-empty">Cargando calendario...</p>}
              {!calendarLoading && calendarError && <p className="admin-empty">{calendarError}</p>}
            </section>

            <aside className="admin-horarios-slots-card">
              <div className="admin-horarios-slots-head">
                <div>
                  <p className="admin-horarios-calendar-kicker">Detalle del dia</p>
                  <strong>{selectedCalendarDate ? formatLongDate(selectedCalendarDate) : "Selecciona un dia"}</strong>
                </div>
                {selectedCalendarDay && (
                  <span className={`admin-status-pill ${selectedCalendarDay.has_disponibles ? "status-aceptada" : "status-cancelada"}`}>
                    {selectedCalendarDay.has_disponibles ? "Con cupos" : "Completo"}
                  </span>
                )}
              </div>

              {selectedCalendarDay ? (
                <>
                  <div className="admin-horarios-day-stats">
                    <article>
                      <span>Total bloques</span>
                      <strong>{selectedCalendarDay.horas?.length || 0}</strong>
                    </article>
                    <article>
                      <span>Disponibles</span>
                      <strong>{selectedCalendarDay.horas?.filter((slot) => slot.disponible).length || 0}</strong>
                    </article>
                    <article>
                      <span>Ocupados</span>
                      <strong>{selectedCalendarDay.horas?.filter((slot) => !slot.disponible).length || 0}</strong>
                    </article>
                  </div>

                  <div className="admin-horarios-slot-list">
                    {(selectedCalendarDay.horas || []).map((slot) => (
                      <div
                        key={slot.hora}
                        className={slot.disponible ? "admin-horarios-slot-item available" : "admin-horarios-slot-item occupied"}
                      >
                        <div>
                          <strong>{slot.hora}</strong>
                          <span>{slot.disponible ? "Disponible" : "Ocupado"}</span>
                        </div>
                        <b>{slot.cupos_disponibles} cupos</b>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="admin-empty">Selecciona un dia del calendario para ver sus horas.</p>
              )}
            </aside>
          </div>
        </article>
      </section>
    );
  }

  return null;
}
