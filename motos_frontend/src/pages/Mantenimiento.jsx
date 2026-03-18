import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getStoredUser } from "../services/authService";
import { agendarMantencion } from "../services/mantencionesService";
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
    fecha_ingreso: "",
    kilometraje_ingreso: "",
    tipo_mantencion: "preventiva",
    motivo: "",
    observaciones: "",
  };
}

export default function Mantenimiento() {
  const [form, setForm] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => setToast({ type: "", message: "" }), 3500);
    return () => window.clearTimeout(timer);
  }, [toast.message]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const requiredFields = [
      ["nombre_completo", "Nombre completo"],
      ["telefono", "Telefono"],
      ["matricula", "Matricula"],
      ["marca", "Marca"],
      ["modelo", "Modelo"],
      ["anio", "A\u00f1o"],
      ["kilometraje_actual", "Kilometraje actual"],
      ["kilometraje_ingreso", "Kilometraje de ingreso"],
      ["motivo", "Motivo"],
    ];

    const missingField = requiredFields.find(([key]) => String(form[key] ?? "").trim() === "");
    if (missingField) {
      setToast({ type: "error", message: `Completa el campo obligatorio: ${missingField[1]}.` });
      return;
    }

    setLoading(true);
    setToast({ type: "", message: "" });

    try {
      await agendarMantencion({
        ...form,
        matricula: form.matricula.trim().toUpperCase(),
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        nombre_completo: form.nombre_completo.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        motivo: form.motivo.trim(),
        observaciones: form.observaciones.trim(),
        anio: Number(form.anio),
        kilometraje_actual: Number(form.kilometraje_actual),
        kilometraje_ingreso: Number(form.kilometraje_ingreso),
        fecha_ingreso: form.fecha_ingreso || undefined,
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
            <p>
              Completa este formulario y nuestro equipo te contactara para coordinar fecha, diagnostico y tiempos de
              trabajo.
            </p>
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
                Email (opcional)
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </label>
            </div>

            <h2>Datos de la moto</h2>

            <div className="mantencion-grid">
              <label>
                Matricula
                <input name="matricula" value={form.matricula} onChange={handleChange} placeholder="ABCD12" required />
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
                Año
                <input name="anio" type="number" min="1900" max="2100" value={form.anio} onChange={handleChange} required />
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

              <label>
                Fecha preferida (opcional)
                <input name="fecha_ingreso" type="date" value={form.fecha_ingreso} onChange={handleChange} />
              </label>

              <label>
                Kilometraje de ingreso
                <input
                  name="kilometraje_ingreso"
                  type="number"
                  min="0"
                  value={form.kilometraje_ingreso}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="mantencion-field-full">
                Motivo
                <textarea name="motivo" value={form.motivo} onChange={handleChange} rows="4" required />
              </label>

              <label className="mantencion-field-full">
                Observaciones (opcional)
                <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" />
              </label>
            </div>

            <button className="mantencion-submit-btn" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Agendar mantenimiento"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
