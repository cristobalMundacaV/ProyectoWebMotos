import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { cancelarMantencionPorRut, consultarMantencionesPorRut } from "../services/mantencionesService";
import "../styles/mantenimiento.css";

function normalizeRut(rawRut) {
  const cleaned = String(rawRut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase();
  if (cleaned.length < 2) return "";

  const body = cleaned.slice(0, -1).replace(/\D/g, "");
  const dv = cleaned.slice(-1);
  if (!body || !/^\d+$/.test(body) || !/^[0-9K]$/.test(dv)) return "";
  return `${body}-${dv}`;
}

function formatRutInput(rawRut) {
  const cleaned = String(rawRut || "")
    .replace(/[^0-9kK]/g, "")
    .toUpperCase();

  if (!cleaned) return "";
  if (cleaned.length === 1) return cleaned;

  const body = cleaned.slice(0, -1).replace(/\D/g, "");
  const dv = cleaned.slice(-1);
  const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${bodyWithDots}-${dv}`;
}

function isValidRut(rawRut) {
  const normalized = normalizeRut(rawRut);
  if (!normalized) return false;

  const [body, dv] = normalized.split("-");
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedDv = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  return dv === expectedDv;
}

function canCancelMantencion(estado) {
  return estado === "ingresada" || estado === "aceptada";
}

function getErrorText(error, fallback) {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;

  const firstArray = Object.values(data).find((value) => Array.isArray(value) && value.length > 0);
  if (firstArray) return String(firstArray[0]);
  return fallback;
}

export default function ConsultarHora() {
  const [consultaRut, setConsultaRut] = useState("");
  const [consultaLoading, setConsultaLoading] = useState(false);
  const [consultaError, setConsultaError] = useState("");
  const [consultaSuccess, setConsultaSuccess] = useState("");
  const [consultaResultados, setConsultaResultados] = useState([]);
  const [cancelandoById, setCancelandoById] = useState({});
  const [cancelModalItem, setCancelModalItem] = useState(null);

  const isCancelModalSaving = cancelModalItem ? Boolean(cancelandoById[cancelModalItem.id]) : false;

  useEffect(() => {
    if (!cancelModalItem) return undefined;

    const onEsc = (event) => {
      if (event.key !== "Escape") return;
      if (isCancelModalSaving) return;
      setCancelModalItem(null);
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [cancelModalItem, isCancelModalSaving]);

  async function handleConsultarEstado(event) {
    event.preventDefault();
    if (consultaLoading) return;

    const normalizedRut = normalizeRut(consultaRut);
    if (!normalizedRut || !isValidRut(normalizedRut)) {
      setConsultaError("Ingresa un RUT valido para consultar (ejemplo: 12345678-5).");
      setConsultaResultados([]);
      return;
    }

    setConsultaLoading(true);
    setConsultaError("");
    setConsultaSuccess("");

    try {
      const data = await consultarMantencionesPorRut(normalizedRut);
      const results = Array.isArray(data?.results) ? data.results : [];
      setConsultaResultados(results);
      if (results.length === 0) {
        setConsultaError("No encontramos horas de mantencion asociadas a ese RUT.");
      }
    } catch {
      setConsultaResultados([]);
      setConsultaError("No pudimos consultar el estado de tus horas. Intenta nuevamente.");
    } finally {
      setConsultaLoading(false);
    }
  }

  function openCancelModal(item) {
    if (!item || !canCancelMantencion(item.estado)) return;
    setCancelModalItem(item);
  }

  function closeCancelModal() {
    if (isCancelModalSaving) return;
    setCancelModalItem(null);
  }

  async function handleCancelarHora() {
    const item = cancelModalItem;
    if (!item || !canCancelMantencion(item.estado)) return;

    const normalizedRut = normalizeRut(consultaRut || item.rut_cliente);
    if (!normalizedRut || !isValidRut(normalizedRut)) {
      setConsultaError("No pudimos validar el RUT para cancelar la hora.");
      return;
    }

    setConsultaError("");
    setConsultaSuccess("");
    setCancelandoById((prev) => ({ ...prev, [item.id]: true }));

    try {
      const response = await cancelarMantencionPorRut(item.id, normalizedRut);
      setConsultaResultados((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? {
                ...row,
                estado: response?.estado || "cancelada",
                estado_label: response?.estado_label || "Cancelada",
              }
            : row
        )
      );
      setConsultaSuccess(response?.detail || "Tu hora fue cancelada correctamente.");
      setCancelModalItem(null);
    } catch (error) {
      setConsultaError(getErrorText(error, "No pudimos cancelar la hora. Intenta nuevamente."));
    } finally {
      setCancelandoById((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  return (
    <div>
      <Navbar />

      <main className="mantencion-page">
        <div className="mantencion-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Consultar hora</span>
        </div>

        <section className="mantencion-container mantencion-consulta-page">
          <div className="mantencion-head">
            <p className="mantencion-kicker">Servicio Tecnico Delanoe Motos</p>
            <h1>Consulta el estado de tu hora</h1>
            <p>Ingresa tu RUT para revisar tus solicitudes de mantencion.</p>
          </div>

          <section className="mantencion-consulta-section">
            <form className="mantencion-consulta-form" onSubmit={handleConsultarEstado} noValidate>
              <label>
                RUT
                <input
                  name="consulta_rut"
                  value={consultaRut}
                  onChange={(event) => setConsultaRut(formatRutInput(event.target.value))}
                  placeholder="12.345.678-5"
                  maxLength={12}
                  required
                />
              </label>
              <button type="submit" className="mantencion-consulta-btn" disabled={consultaLoading}>
                {consultaLoading ? "Consultando..." : "Consultar estado"}
              </button>
            </form>

            {consultaError && <p className="mantencion-consulta-error">{consultaError}</p>}
            {consultaSuccess && <p className="mantencion-consulta-success">{consultaSuccess}</p>}

            {consultaResultados.length > 0 && (
              <div className="mantencion-consulta-list">
                {consultaResultados.map((item) => (
                  <article key={item.id} className="mantencion-consulta-card">
                    <header>
                      <h3>{item.tipo_mantencion_label || item.tipo_mantencion}</h3>
                      <span className={`mantencion-estado-pill estado-${item.estado}`}>{item.estado_label}</span>
                    </header>

                    <div className="mantencion-consulta-details">
                      <div className="mantencion-consulta-column">
                        <p>
                          <strong>Nombres:</strong> {item.nombres || "-"}
                        </p>
                        <p>
                          <strong>Apellidos:</strong> {item.apellidos || "-"}
                        </p>
                        <p>
                          <strong>Telefono:</strong> {item.telefono || "-"}
                        </p>
                        <p>
                          <strong>Email:</strong> {item.email || "-"}
                        </p>
                      </div>

                      <div className="mantencion-consulta-column">
                        <p>
                          <strong>Moto:</strong> {[item.marca, item.modelo].filter(Boolean).join(" ") || "-"}
                        </p>
                        <p>
                          <strong>Patente:</strong> {item.matricula || "-"}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {item.fecha_ingreso
                            ? new Date(`${item.fecha_ingreso}T00:00:00`).toLocaleDateString("es-CL")
                            : "-"}
                        </p>
                        <p>
                          <strong>Hora:</strong> {item.hora_ingreso?.slice(0, 5) || "-"}
                        </p>
                      </div>
                    </div>

                    <p>
                      <strong>Motivo:</strong> {item.motivo}
                    </p>

                    {canCancelMantencion(item.estado) && (
                      <div className="mantencion-consulta-actions">
                        <button
                          type="button"
                          className="mantencion-consulta-cancel-btn"
                          onClick={() => openCancelModal(item)}
                          disabled={Boolean(cancelandoById[item.id])}
                        >
                          {cancelandoById[item.id] ? "Cancelando..." : "Cancelar hora"}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>

      {cancelModalItem && (
        <div className="mantencion-cancel-modal-overlay" onClick={closeCancelModal}>
          <section className="mantencion-cancel-modal" onClick={(event) => event.stopPropagation()}>
            <img src="/images/informacion.png" alt="Informacion" className="mantencion-cancel-modal-image" />
            <h3>Confirmar cancelacion</h3>
            <p className="mantencion-cancel-modal-text">
              Vas a cancelar la hora del{" "}
              <strong>
                {cancelModalItem.fecha_ingreso
                  ? new Date(`${cancelModalItem.fecha_ingreso}T00:00:00`).toLocaleDateString("es-CL")
                  : "-"}
              </strong>{" "}
              a las <strong>{cancelModalItem.hora_ingreso?.slice(0, 5) || "-"}</strong>.
            </p>
            <p className="mantencion-cancel-modal-subtext">
              Esta accion cambiara el estado a <strong>Cancelada</strong>.
            </p>

            <div className="mantencion-cancel-modal-actions">
              <button type="button" className="btn-back" onClick={closeCancelModal} disabled={isCancelModalSaving}>
                Volver
              </button>
              <button type="button" className="btn-delete" onClick={handleCancelarHora} disabled={isCancelModalSaving}>
                {isCancelModalSaving ? "Cancelando..." : "Cancelar hora"}
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
