import { useMemo, useState } from "react";

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
  if (value === "ingresada") return "Ingresada";
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

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
}

export default function MantencionesPage({
  activeSection,
  loading,
  mantenciones,
  savingById,
  onRefresh,
  onAcceptSolicitud,
  onUpdateMantencion,
  horarios = [],
  horariosLoading = false,
  horarioForm,
  horarioSaving = false,
  onRefreshHorarios,
  onHorarioInputChange,
  onHorarioSubmit,
  onHorarioDelete,
}) {
  const [editsById, setEditsById] = useState({});
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [selectedFichaId, setSelectedFichaId] = useState(null);

  const DIAS_LABEL = {
    0: "Lunes",
    1: "Martes",
    2: "Miercoles",
    3: "Jueves",
    4: "Viernes",
    5: "Sabado",
    6: "Domingo",
  };

  const solicitudes = useMemo(() => mantenciones.filter((item) => item.estado === "ingresada"), [mantenciones]);
  const fichasMantencion = useMemo(() => mantenciones.filter((item) => item.estado !== "ingresada"), [mantenciones]);

  const selectedSolicitud = useMemo(() => {
    const byId = solicitudes.find((item) => item.id === selectedSolicitudId);
    return byId || solicitudes[0] || null;
  }, [solicitudes, selectedSolicitudId]);

  const selectedFicha = useMemo(() => {
    const byId = fichasMantencion.find((item) => item.id === selectedFichaId);
    return byId || fichasMantencion[0] || null;
  }, [fichasMantencion, selectedFichaId]);

  function getDraft(item) {
    return (
      editsById[item.id] || {
        estado: item.estado,
        costo_total: item.costo_total || 0,
        kilometraje_ingreso: item.kilometraje_ingreso ?? "",
      }
    );
  }

  function setDraft(id, field, value) {
    setEditsById((prev) => ({
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
              <strong>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</strong>
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

  function renderFichaDetail(item, mode) {
    if (!item) {
      return <p className="admin-empty">Selecciona una ficha para ver el detalle.</p>;
    }

    const moto = item?.moto_cliente_detalle || {};
    const draft = getDraft(item);
    const saving = Boolean(savingById[item.id]);
    const estadoActual = draft.estado || item.estado;

    return (
      <>
        <div className="admin-mantencion-ficha-head">
          <h3>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</h3>
          <span className="admin-status-pill">{statusLabel(item.estado)}</span>
        </div>

        <div className="admin-mantencion-ficha-grid">
          <div>
            <span>Cliente</span>
            <strong>{moto.cliente_nombre || "-"}</strong>
          </div>
          <div>
            <span>Matricula</span>
            <strong>{moto.matricula || "-"}</strong>
          </div>
          <div>
            <span>A\u00f1o</span>
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
        </div>

        {mode === "solicitudes" ? (
          <div className="admin-mantencion-ficha-actions admin-mantencion-ficha-actions-solicitud">
            <button
              type="button"
              className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
              disabled={saving}
              onClick={() => onAcceptSolicitud(item.id)}
            >
              {saving ? "Aceptando..." : "Aceptar ingreso a taller"}
            </button>
          </div>
        ) : (
          <div className="admin-mantencion-ficha-controls">
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

            <label>
              Km ingreso
              <input
                type="number"
                min="0"
                step="1"
                value={draft.kilometraje_ingreso ?? ""}
                onChange={(event) => setDraft(item.id, "kilometraje_ingreso", event.target.value)}
                disabled={saving}
              />
            </label>

            <label>
              Valor cobrado
              <input
                type="number"
                min="0"
                step="1"
                value={draft.costo_total ?? item.costo_total ?? 0}
                onChange={(event) => setDraft(item.id, "costo_total", event.target.value)}
                disabled={saving}
              />
            </label>

            <div className="admin-mantencion-ficha-actions">
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
                  })
                }
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}

        <div className="admin-mantencion-ficha-grid" style={{ marginBottom: 12 }}>
          <div>
            <span>Valor cobrado</span>
            <strong>{formatMoney(mode === "fichas" ? draft.costo_total ?? item.costo_total : item.costo_total)}</strong>
          </div>
        </div>

        <div className="admin-mantencion-ficha-blocks">
          <article>
            <h4>Motivo de ingreso</h4>
            <p>{item.motivo || "-"}</p>
          </article>
          <article>
            <h4>Diagnostico</h4>
            <p>{item.diagnostico || "-"}</p>
          </article>
          <article>
            <h4>Trabajo realizado</h4>
            <p>{item.trabajo_realizado || "-"}</p>
          </article>
          <article>
            <h4>Comentarios / Observaciones</h4>
            <p>{item.observaciones || "-"}</p>
          </article>
        </div>
      </>
    );
  }

  if (activeSection === "mantenciones_solicitudes") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Solicitudes de mantencion</h2>
            <button type="button" className="admin-primary-action" onClick={onRefresh}>
              Actualizar
            </button>
          </div>

          <div className="admin-mantencion-fichas-layout">
            {renderFichaList(solicitudes, selectedSolicitud?.id, setSelectedSolicitudId, "No hay solicitudes pendientes.")}
            <div className="admin-mantencion-ficha-detail">{renderFichaDetail(selectedSolicitud, "solicitudes")}</div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "mantenciones_fichas") {
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
            {renderFichaList(fichasMantencion, selectedFicha?.id, setSelectedFichaId, "No hay fichas de mantencion disponibles.")}
            <div className="admin-mantencion-ficha-detail">{renderFichaDetail(selectedFicha, "fichas")}</div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "mantenciones_horarios") {
    return (
      <section className="admin-content-grid admin-content-grid-mantenciones">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Horarios operativos</h2>
            <button type="button" className="admin-primary-action" onClick={onRefreshHorarios}>
              Actualizar
            </button>
          </div>

          <form className="admin-moto-form" onSubmit={onHorarioSubmit} noValidate>
            <label>
              Dia
              <select name="dia_semana" value={horarioForm?.dia_semana ?? "0"} onChange={onHorarioInputChange} required>
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
              Cupos por bloque
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
              {horarioSaving ? "Guardando..." : "Agregar horario"}
            </button>
          </form>

          <div className="admin-table">
            {horarios.map((item) => (
              <div key={item.id} className="admin-table-row admin-moto-table-row admin-mantencion-row">
                <div className="admin-moto-table-cell">
                  <strong>{DIAS_LABEL[item.dia_semana] || item.dia_semana}</strong>
                  <span>{`${item.hora_inicio?.slice(0, 5) || "--:--"} - ${item.hora_fin?.slice(0, 5) || "--:--"}`}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <strong>Intervalo</strong>
                  <span>{`${item.intervalo_minutos} min`}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <strong>Cupos</strong>
                  <span>{item.cupos_por_bloque}</span>
                </div>
                <div className="admin-moto-table-cell admin-mantencion-actions">
                  <button
                    type="button"
                    className="admin-danger-action admin-mantencion-action-btn"
                    onClick={() => onHorarioDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {!horariosLoading && horarios.length === 0 && <p className="admin-empty">No hay horarios operativos configurados.</p>}
            {horariosLoading && <p className="admin-empty">Cargando horarios...</p>}
          </div>
        </article>
      </section>
    );
  }

  return null;
}
