import { useMemo, useState } from "react";
import AdminPagination, { paginateItems } from "../../shared/components/AdminPagination";

const EN_CURSO_STATES = ["en_revision", "en_proceso", "esperando_repuestos", "finalizada", "entregada"];

const ESTADO_OPTIONS = [
  { value: "en_revision", label: "En revision" },
  { value: "en_proceso", label: "En proceso" },
  { value: "esperando_repuestos", label: "Esperando repuestos" },
  { value: "finalizada", label: "Finalizada" },
  { value: "entregada", label: "Entregada" },
  { value: "cancelada", label: "Cancelada" },
];

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-CL");
}

function statusLabel(value) {
  const option = ESTADO_OPTIONS.find((item) => item.value === value);
  return option?.label || value || "-";
}

function formatReason(value) {
  if (!value) return "-";
  const clean = String(value).replace(/_/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getEstadoClass(value) {
  if (value === "en_revision") return "estado-en-revision";
  if (value === "en_proceso") return "estado-en-proceso";
  if (value === "esperando_repuestos") return "estado-esperando-repuestos";
  if (value === "finalizada") return "estado-finalizada";
  if (value === "entregada") return "estado-entregada";
  if (value === "cancelada") return "estado-cancelada";
  return "";
}

export default function MantencionesPage({
  activeSection,
  loading,
  mantenciones,
  savingById,
  onRefresh,
  onAcceptSolicitud,
  onUpdateMantencion,
}) {
  const PAGE_SIZE = 8;
  const [editsById, setEditsById] = useState({});
  const [selectedFichaId, setSelectedFichaId] = useState(null);
  const [solicitudesPage, setSolicitudesPage] = useState(1);
  const [enCursoPage, setEnCursoPage] = useState(1);
  const [fichasPage, setFichasPage] = useState(1);

  const solicitudes = useMemo(() => mantenciones.filter((item) => item.estado === "ingresada"), [mantenciones]);
  const enCurso = useMemo(() => mantenciones.filter((item) => EN_CURSO_STATES.includes(item.estado)), [mantenciones]);
  const fichas = useMemo(() => mantenciones, [mantenciones]);

  const paginatedSolicitudes = paginateItems(solicitudes, solicitudesPage, PAGE_SIZE);
  const paginatedEnCurso = paginateItems(enCurso, enCursoPage, PAGE_SIZE);
  const paginatedFichas = paginateItems(fichas, fichasPage, PAGE_SIZE);

  function getDraft(item) {
    return editsById[item.id] || { estado: item.estado, costo_total: item.costo_total || 0 };
  }

  function setDraft(id, field, value) {
    setEditsById((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }

  if (activeSection === "mantenciones_solicitudes") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Solicitudes de mantencion</h2>
            <button type="button" className="admin-primary-action" onClick={onRefresh}>
              Actualizar
            </button>
          </div>

          <div className="admin-table">
            {paginatedSolicitudes.items.map((item) => {
              const moto = item?.moto_cliente_detalle || {};
              const saving = Boolean(savingById[item.id]);
              return (
                <div key={item.id} className="admin-table-row admin-moto-table-row admin-mantencion-row admin-mantencion-solicitud-row">
                  <div className="admin-moto-table-cell">
                    <span className="admin-mantencion-cliente">{moto.cliente_nombre || "Cliente"}</span>
                    <strong>{`${moto.marca || "-"} ${moto.modelo || "-"}${moto.anio ? ` ${moto.anio}` : ""}`}</strong>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-ingreso">
                    <strong>Ingreso</strong>
                    <span>{formatDate(item.fecha_ingreso)}</span>
                  </div>
                  <div className="admin-moto-table-cell">
                    <strong>{formatReason(item.motivo || item.tipo_mantencion)}</strong>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-status-col">
                    <span className="admin-status-pill status-ingresada">Ingresada</span>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-actions">
                    <button
                      type="button"
                      className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                      disabled={saving}
                      onClick={() => onAcceptSolicitud(item.id)}
                    >
                      {saving ? "Aceptando..." : "Aceptar"}
                    </button>
                  </div>
                </div>
              );
            })}

            {!loading && solicitudes.length === 0 && <p className="admin-empty">No hay solicitudes de mantencion pendientes.</p>}
            {loading && <p className="admin-empty">Cargando solicitudes...</p>}
          </div>

          <AdminPagination pagination={paginatedSolicitudes} onPageChange={setSolicitudesPage} />
        </article>
      </section>
    );
  }

  if (activeSection === "mantenciones_en_curso") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Mantenciones en curso</h2>
            <button type="button" className="admin-primary-action" onClick={onRefresh}>
              Actualizar
            </button>
          </div>

          <div className="admin-table">
            {paginatedEnCurso.items.map((item) => {
              const moto = item?.moto_cliente_detalle || {};
              const draft = getDraft(item);
              const saving = Boolean(savingById[item.id]);
              const estadoActual = draft.estado || item.estado;

              return (
                <div key={item.id} className="admin-table-row admin-moto-table-row admin-mantencion-row">
                  <div className="admin-moto-table-cell">
                    <span className="admin-mantencion-year">{moto.anio || "-"}</span>
                    <strong>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</strong>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-persona">
                    <span className="admin-mantencion-top-muted">{moto.cliente_nombre || "Cliente"}</span>
                    <strong className="admin-mantencion-bottom-strong">{`Matricula: ${moto.matricula || "-"}`}</strong>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-controls admin-mantencion-control-cell">
                    <label>
                      Estado
                      <select
                        className={`admin-mantencion-estado-select ${getEstadoClass(estadoActual)}`}
                        value={estadoActual}
                        onChange={(event) => setDraft(item.id, "estado", event.target.value)}
                        disabled={saving}
                      >
                        {ESTADO_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-controls admin-mantencion-control-cell">
                    <label>
                      Valor
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={draft.costo_total ?? item.costo_total ?? 0}
                        onChange={(event) => setDraft(item.id, "costo_total", event.target.value)}
                        disabled={saving}
                      />
                    </label>
                  </div>
                  <div className="admin-moto-table-cell admin-mantencion-actions">
                    <button
                      type="button"
                      className="admin-primary-action admin-mantencion-action-btn admin-mantencion-save-btn"
                      disabled={saving}
                      onClick={() =>
                        onUpdateMantencion(item.id, {
                          estado: estadoActual,
                          costo_total: Number(draft.costo_total ?? item.costo_total ?? 0),
                        })
                      }
                    >
                      {saving ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
              );
            })}

            {!loading && enCurso.length === 0 && <p className="admin-empty">No hay mantenciones en curso.</p>}
            {loading && <p className="admin-empty">Cargando mantenciones...</p>}
          </div>

          <AdminPagination pagination={paginatedEnCurso} onPageChange={setEnCursoPage} />
        </article>
      </section>
    );
  }

  if (activeSection === "mantenciones_fichas") {
    const selectedFicha =
      paginatedFichas.items.find((item) => item.id === selectedFichaId) ||
      paginatedFichas.items[0] ||
      null;

    const fichaMoto = selectedFicha?.moto_cliente_detalle || {};

    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Fichas de mantencion</h2>
            <button type="button" className="admin-primary-action" onClick={onRefresh}>
              Actualizar
            </button>
          </div>

          <div className="admin-mantencion-fichas-layout">
            <aside className="admin-mantencion-fichas-list">
              {paginatedFichas.items.map((item) => {
                const moto = item?.moto_cliente_detalle || {};
                const isActive = selectedFicha?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? "admin-mantencion-ficha-item active" : "admin-mantencion-ficha-item"}
                    onClick={() => setSelectedFichaId(item.id)}
                  >
                    <strong>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</strong>
                    <span>{moto.cliente_nombre || "Cliente"}</span>
                    <small>{formatDate(item.fecha_ingreso)}</small>
                  </button>
                );
              })}

              {!loading && fichas.length === 0 && <p className="admin-empty">No hay fichas de mantencion disponibles.</p>}
              {loading && <p className="admin-empty">Cargando fichas...</p>}
            </aside>

            <div className="admin-mantencion-ficha-detail">
              {!selectedFicha && !loading && <p className="admin-empty">Selecciona una ficha para ver el detalle.</p>}

              {selectedFicha && (
                <>
                  <div className="admin-mantencion-ficha-head">
                    <h3>{`${fichaMoto.marca || "-"} ${fichaMoto.modelo || "-"}`}</h3>
                    <span className="admin-status-pill">{statusLabel(selectedFicha.estado)}</span>
                  </div>

                  <div className="admin-mantencion-ficha-grid">
                    <div>
                      <span>Cliente</span>
                      <strong>{fichaMoto.cliente_nombre || "-"}</strong>
                    </div>
                    <div>
                      <span>Matricula</span>
                      <strong>{fichaMoto.matricula || "-"}</strong>
                    </div>
                    <div>
                      <span>Año</span>
                      <strong>{fichaMoto.anio || "-"}</strong>
                    </div>
                    <div>
                      <span>Fecha ingreso</span>
                      <strong>{formatDate(selectedFicha.fecha_ingreso)}</strong>
                    </div>
                    <div>
                      <span>Tipo mantencion</span>
                      <strong>{formatReason(selectedFicha.tipo_mantencion)}</strong>
                    </div>
                    <div>
                      <span>Valor cobrado</span>
                      <strong>{`$${Number(selectedFicha.costo_total || 0).toLocaleString("es-CL")}`}</strong>
                    </div>
                  </div>

                  <div className="admin-mantencion-ficha-blocks">
                    <article>
                      <h4>Motivo de ingreso</h4>
                      <p>{selectedFicha.motivo || "-"}</p>
                    </article>
                    <article>
                      <h4>Diagnostico</h4>
                      <p>{selectedFicha.diagnostico || "-"}</p>
                    </article>
                    <article>
                      <h4>Trabajo realizado</h4>
                      <p>{selectedFicha.trabajo_realizado || "-"}</p>
                    </article>
                    <article>
                      <h4>Comentarios / Observaciones</h4>
                      <p>{selectedFicha.observaciones || "-"}</p>
                    </article>
                  </div>
                </>
              )}
            </div>
          </div>

          <AdminPagination
            pagination={paginatedFichas}
            onPageChange={(page) => {
              setFichasPage(page);
              setSelectedFichaId(null);
            }}
          />
        </article>
      </section>
    );
  }

  return null;
}
