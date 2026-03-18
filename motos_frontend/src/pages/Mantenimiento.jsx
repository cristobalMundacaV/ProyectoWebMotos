import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getStoredUser } from "../services/authService";
import { agendarMantencion, getDisponibilidadMantenciones } from "../services/mantencionesService";
import "../styles/mantenimiento.css";

const TIPO_MANTENCION_OPTIONS = [
  { value: "preventiva", label: "Preventiva" },
  { value: "correctiva", label: "Correctiva" },
  { value: "garantia", label: "Garantia" },
  { value: "revision_general", label: "Revision general" },
  { value: "cambio_aceite", label: "Cambio de aceite" },
  { value: "frenos", label: "Frenos" },
  { value: "transmision", label: "Transmision" },
  { value: "electrica", label: "Electrica" },
  { value: "otra", label: "Otra" },
];

const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, index) => String(CURRENT_YEAR - index));

function getInitialForm() {
  const user = getStoredUser();
  const nombreCompleto = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  return {
    nombre_completo: nombreCompleto || user?.username || "",
    telefono: user?.telefono || "",
    email: user?.email || "",
    matricula: "",
    marca: "",
    modelo: "",
    anio: "",
    kilometraje_actual: "",
    fecha_agendada: "",
    hora_agendada: "",
    tipo_mantencion: "preventiva",
    motivo: "",
  };
}

function formatDateLabel(dateText, options = {}) {
  if (!dateText) return "";
  const [year, month, day] = String(dateText).split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  if (Number.isNaN(date.getTime())) return dateText;
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

export default function Mantenimiento() {
  const [form, setForm] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsByDate, setSlotsByDate] = useState([]);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const slotsMap = useMemo(() => {
    const map = {};
    slotsByDate.forEach((day) => {
      map[day.fecha] = day;
    });
    return map;
  }, [slotsByDate]);

  const selectedDaySlots = useMemo(() => slotsMap[form.fecha_agendada]?.horas || [], [slotsMap, form.fecha_agendada]);

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ key: `empty-${i}`, empty: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const iso = toIsoDate(date);
      const slotInfo = slotsMap[iso];
      const hasSlots = Boolean(slotInfo);
      const hasAvailable = Boolean(slotInfo?.has_disponibles);

      cells.push({
        key: iso,
        iso,
        day,
        hasSlots,
        hasAvailable,
        disabled: !hasSlots,
      });
    }

    return cells;
  }, [calendarMonth, slotsMap]);

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => setToast({ type: "", message: "" }), 3500);
    return () => window.clearTimeout(timer);
  }, [toast.message]);

  useEffect(() => {
    let mounted = true;

    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const data = await getDisponibilidadMantenciones(30);
        if (!mounted) return;
        const slots = Array.isArray(data?.slots) ? data.slots : [];
        setSlotsByDate(slots);

        if (slots.length > 0) {
          const firstDate = slots[0].fecha;
          const [year, month] = firstDate.split("-").map(Number);
          setCalendarMonth(new Date(year, (month || 1) - 1, 1));
        }
      } catch (_error) {
        if (!mounted) return;
        setToast({ type: "error", message: "No pudimos cargar los horarios disponibles en este momento." });
      } finally {
        if (mounted) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectDate(isoDate) {
    const daySlots = slotsMap[isoDate]?.horas || [];
    const currentHourAvailable = daySlots.some((slot) => slot.hora === form.hora_agendada && slot.disponible);
    setForm((prev) => ({
      ...prev,
      fecha_agendada: isoDate,
      hora_agendada: currentHourAvailable ? prev.hora_agendada : "",
    }));
  }

  function handleSelectHour(hourValue, available) {
    if (!available) return;
    setForm((prev) => ({ ...prev, hora_agendada: hourValue }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const requiredFields = [
      ["nombre_completo", "Nombre completo"],
      ["telefono", "Telefono"],
      ["email", "Email"],
      ["matricula", "Matricula"],
      ["marca", "Marca"],
      ["modelo", "Modelo"],
      ["anio", "Años"],
      ["kilometraje_actual", "Kilometraje actual"],
      ["fecha_agendada", "Dia de mantencion"],
      ["hora_agendada", "Hora de mantencion"],
      ["motivo", "Motivo"],
    ];

    const missingField = requiredFields.find(([key]) => String(form[key] ?? "").trim() === "");
    if (missingField) {
      setToast({ type: "error", message: `Completa el campo obligatorio: ${missingField[1]}.` });
      return;
    }
    const normalizedEmail = form.email.trim().toLowerCase();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!emailValid) {
      setToast({ type: "error", message: "Ingresa un email valido (ejemplo: nombre@dominio.com)." });
      return;
    }
    const normalizedMatricula = form.matricula.trim().toUpperCase();
    if (!/^[A-Z]{3}\d{2}$/.test(normalizedMatricula)) {
      setToast({ type: "error", message: "La matricula debe tener formato AAA99 (ejemplo: TKG30)." });
      return;
    }

    setLoading(true);
    setToast({ type: "", message: "" });

    try {
      await agendarMantencion({
        ...form,
        matricula: normalizedMatricula,
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        nombre_completo: form.nombre_completo.trim(),
        telefono: form.telefono.trim(),
        email: normalizedEmail,
        motivo: form.motivo.trim(),
        anio: Number(form.anio),
        kilometraje_actual: Number(form.kilometraje_actual),
        fecha_agendada: form.fecha_agendada,
        hora_agendada: form.hora_agendada,
      });

      setToast({ type: "success", message: "Solicitud enviada con exito. Te contactaremos para confirmar tu hora." });
      setForm((prev) => ({
        ...getInitialForm(),
        nombre_completo: prev.nombre_completo,
        telefono: prev.telefono,
        email: prev.email,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const apiErrors = error?.response?.data;
      if (typeof apiErrors === "string") {
        setToast({ type: "error", message: apiErrors });
      } else if (apiErrors && typeof apiErrors === "object") {
        const firstMessage = Object.values(apiErrors).flat().find(Boolean);
        setToast({ type: "error", message: firstMessage || "No pudimos registrar la solicitud. Intenta nuevamente." });
      } else {
        setToast({ type: "error", message: "No pudimos registrar la solicitud. Intenta nuevamente." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <main className="mantencion-page">
        <section className="mantencion-container">
          <div className="mantencion-head">
            <p className="mantencion-kicker">Servicio Tecnico Delanoe Motos</p>
            <h1>Agenda tu mantenimiento</h1>
            <p>Selecciona en el calendario un dia y hora.</p>
          </div>

          {toast.message && (
            <div className={`mantencion-toast mantencion-toast-${toast.type}`} role="status" aria-live="polite">
              {toast.message}
            </div>
          )}

          <form className="mantencion-form" onSubmit={handleSubmit} noValidate>
            <h2>Datos del cliente</h2>

            <div className="mantencion-grid">
              <label>
                Nombre completo
                <input name="nombre_completo" value={form.nombre_completo} onChange={handleChange} required />
              </label>

              <label>
                Telefono
                <input name="telefono" value={form.telefono} onChange={handleChange} required />
              </label>

              <label className="mantencion-field-full">
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
            </div>

            <h2>Datos de la moto</h2>

            <div className="mantencion-grid">
              <label>
                Matricula
                <input
                  name="matricula"
                  value={form.matricula}
                  onChange={handleChange}
                  placeholder="TKG30"
                  maxLength={5}
                  required
                />
              </label>

              <label>
                Marca
                <input name="marca" value={form.marca} onChange={handleChange} required />
              </label>

              <label>
                Modelo
                <input name="modelo" value={form.modelo} onChange={handleChange} required />
              </label>

              <label>
                Años
                <select name="anio" value={form.anio} onChange={handleChange} required>
                  <option value="">Selecciona años</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Kilometraje actual
                <input
                  name="kilometraje_actual"
                  type="number"
                  min="0"
                  value={form.kilometraje_actual}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <h2>Solicitud de mantencion</h2>

            <div className="mantencion-grid">
              <label>
                Tipo de mantencion
                <select name="tipo_mantencion" value={form.tipo_mantencion} onChange={handleChange}>
                  {TIPO_MANTENCION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mantencion-field-full mantencion-calendar-wrap">
                <div className="mantencion-calendar-head">
                  <strong>{calendarMonth.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}</strong>
                  <div className="mantencion-calendar-nav">
                    <button type="button" onClick={() => setCalendarMonth((prev) => addMonths(prev, -1))}>
                      {"<"}
                    </button>
                    <button type="button" onClick={() => setCalendarMonth((prev) => addMonths(prev, 1))}>
                      {">"}
                    </button>
                  </div>
                </div>

                <div className="mantencion-calendar-grid mantencion-calendar-weekdays">
                  {WEEK_DAYS.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>

                <div className="mantencion-calendar-grid mantencion-calendar-days">
                  {calendarCells.map((cell) => {
                    if (cell.empty) return <span key={cell.key} className="mantencion-calendar-empty" />;

                    const isSelected = form.fecha_agendada === cell.iso;
                    const className = [
                      "mantencion-day-btn",
                      cell.hasAvailable ? "available" : "occupied",
                      isSelected ? "selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <button
                        key={cell.key}
                        type="button"
                        className={className}
                        onClick={() => handleSelectDate(cell.iso)}
                        disabled={cell.disabled}
                        title={formatDateLabel(cell.iso)}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>

                <div className="mantencion-calendar-legend">
                  <span><i className="dot dot-available" />Disponible</span>
                  <span><i className="dot dot-occupied" />Ocupado</span>
                </div>

                <div className="mantencion-slots">
                  <p className="mantencion-slots-title">
                    {form.fecha_agendada ? `Horas: ${formatDateLabel(form.fecha_agendada, { weekday: "long" })}` : "Selecciona un dia"}
                  </p>

                  <div className="mantencion-slot-list">
                    {form.fecha_agendada && selectedDaySlots.length === 0 && <span className="mantencion-slot-empty">Sin horas para este dia.</span>}
                    {!form.fecha_agendada && <span className="mantencion-slot-empty">Selecciona un dia del calendario.</span>}

                    {selectedDaySlots.map((slot) => {
                      const isSelected = form.hora_agendada === slot.hora;
                      const className = [
                        "mantencion-slot-btn",
                        slot.disponible ? "available" : "occupied",
                        isSelected ? "selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <button
                          key={slot.hora}
                          type="button"
                          className={className}
                          onClick={() => handleSelectHour(slot.hora, slot.disponible)}
                          disabled={!slot.disponible}
                        >
                          {slot.hora}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <input type="hidden" name="fecha_agendada" value={form.fecha_agendada} />
                <input type="hidden" name="hora_agendada" value={form.hora_agendada} />
              </div>

              <label className="mantencion-field-full">
                Motivo
                <textarea name="motivo" value={form.motivo} onChange={handleChange} rows="4" required />
              </label>
            </div>

            <button className="mantencion-submit-btn" type="submit" disabled={loading || loadingSlots}>
              {loading ? "Enviando..." : "Agendar mantenimiento"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

