import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { consultarMantencionesPorRut } from "../services/mantencionesService";
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

export default function ConsultarHora() {
  const [consultaRut, setConsultaRut] = useState("");
  const [consultaLoading, setConsultaLoading] = useState(false);
  const [consultaError, setConsultaError] = useState("");
  const [consultaResultados, setConsultaResultados] = useState([]);

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
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
