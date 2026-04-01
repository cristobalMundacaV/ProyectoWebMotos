import {
  formatDate,
  formatDateTime,
  formatIntegerCL,
  formatReason,
  getStatusPillClass,
  sanitizeIntegerInput,
  statusLabel,
} from "../utils/mantencionesViewUtils";

export default function FichaDetailPanel({ item, mode, transitions, savingById }) {
  if (!item) {
    return <p className="admin-empty">Selecciona una ficha para ver el detalle.</p>;
  }

  const moto = item?.moto_cliente_detalle || {};
  const draft = transitions.getDraft(item);
  const savingAction = savingById[item.id] || "";
  const saving = Boolean(savingAction);
  const isSolicitud = mode === "solicitudes";
  const isTallerDia = mode === "taller_dia";
  const isEditable = mode === "fichas" || mode === "taller_dia";
  const canEditKmIngreso = isTallerDia;
  const isFinalizadaRecord = mode === "fichas" && item.estado === "finalizado";
  const isEnProcesoRecord = mode === "fichas" && item.estado === "en_proceso";
  const isEnEsperaRecord = mode === "fichas" && item.estado === "en_espera";
  const controlledEditRecord = isFinalizadaRecord || isEnProcesoRecord || isEnEsperaRecord;
  const hasPendingChanges = controlledEditRecord && transitions.hasPendingChanges(item);
  const readOnly = !isEditable;
  const highlightEditing = controlledEditRecord && hasPendingChanges;
  const estadoActual = item.estado;
  const solicitudAceptada = item.estado === "aprobado";
  const isSolicitudReagendacion = item.estado === "solicitud";
  const cancelActionLabel = isSolicitudReagendacion ? "Reagendacion" : solicitudAceptada ? "Anular mantenimiento" : "Anular hora";
  const canCancelSolicitud = isSolicitud && (item.estado === "solicitud" || item.estado === "aprobado");

  return (
    <div className={highlightEditing ? "admin-mantencion-ficha-editing" : ""}>
      <div className="admin-mantencion-ficha-head">
        <h3>{`${moto.marca || "-"} ${moto.modelo || "-"}`}</h3>
        <div className="admin-mantencion-ficha-head-status">
          <span className={`admin-status-pill ${getStatusPillClass(item.estado)}`}>{statusLabel(item.estado)}</span>
          {item.estado === "entregada" && item.costo_total ? (
            <div className="admin-mantencion-monto-entregada">
              <span className="admin-monto-label">Valor cobrado</span>
              <span className="admin-monto-value">${formatIntegerCL(item.costo_total)}</span>
            </div>
          ) : null}
        </div>
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
            <span>{"Año"}</span>
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
            <span>{"Año"}</span>
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

      {!isSolicitud ? (
        <div className="admin-mantencion-ficha-controls">
          {canEditKmIngreso && (
            <label>
              Km ingreso
              <input
                type="text"
                inputMode="numeric"
                value={formatIntegerCL(draft.kilometraje_ingreso ?? "")}
                onChange={(event) => transitions.setDraftField(item.id, "kilometraje_ingreso", sanitizeIntegerInput(event.target.value))}
                disabled={saving}
              />
            </label>
          )}
        </div>
      ) : null}

      {isSolicitud ? (
        <div className="admin-mantencion-ficha-blocks admin-mantencion-ficha-blocks-solicitud">
          <article>
            <h4>Motivo de la solicitud</h4>
            <p>{item.motivo || "-"}</p>
          </article>
          <div className="admin-mantencion-ficha-actions admin-mantencion-ficha-actions-solicitud">
            {canCancelSolicitud && (
              <button
                type="button"
                className="admin-danger-action admin-mantencion-action-btn admin-mantencion-cancel-btn"
                disabled={saving}
                onClick={() => transitions.openCancelConfirm(item, cancelActionLabel, isSolicitudReagendacion)}
              >
                {cancelActionLabel}
              </button>
            )}
            {!solicitudAceptada ? (
              <button
                type="button"
                className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                disabled={saving}
                onClick={() => transitions.approveSolicitud(item.id)}
              >
                {"Aprobar hora"}
              </button>
            ) : (
              <button
                type="button"
                className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                disabled={saving}
                onClick={() => transitions.openIngresoConfirm(item)}
              >
                {"Marcar ingreso"}
              </button>
            )}
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
              onChange={(event) => transitions.setDraftField(item.id, "diagnostico", event.target.value)}
              disabled={saving || readOnly}
              rows={4}
            />
          </article>
          {!isTallerDia && (
            <>
              <article>
                <h4>Trabajo realizado</h4>
                <textarea
                  className="admin-mantencion-ficha-textarea"
                  value={isEditable ? draft.trabajo_realizado ?? "" : item.trabajo_realizado ?? ""}
                  onChange={(event) => transitions.setDraftField(item.id, "trabajo_realizado", event.target.value)}
                  disabled={saving || readOnly}
                  rows={4}
                />
              </article>
              <article>
                <h4>Comentarios / Observaciones</h4>
                <textarea
                  className="admin-mantencion-ficha-textarea"
                  value={isEditable ? draft.observaciones ?? "" : item.observaciones ?? ""}
                  onChange={(event) => transitions.setDraftField(item.id, "observaciones", event.target.value)}
                  disabled={saving || readOnly}
                  rows={4}
                />
              </article>
            </>
          )}

          {mode === "historicas" && item.estado === "cancelado" && (
            <article className="admin-mantencion-ficha-block-full">
              <h4>Motivo de cancelacion</h4>
              <p>{(item.motivo_cancelacion || "").trim() || "Sin motivo registrado."}</p>
            </article>
          )}
        </div>
      )}

      {isEditable && (
        <div className="admin-mantencion-ficha-actions admin-mantencion-ficha-actions-bottom">
          {isFinalizadaRecord ? (
            <>
              {hasPendingChanges && (
                <button
                  type="button"
                  className="admin-ficha-outline-action admin-mantencion-action-btn"
                  disabled={saving}
                  onClick={() => transitions.updateItemEstado({ item, estado: estadoActual, action: "save" })}
                >
                  {"Guardar cambios"}
                </button>
              )}
              <button
                type="button"
                className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                disabled={saving}
                onClick={() => transitions.openEntregaConfirm(item)}
              >
                {"Marcar como entregado"}
              </button>
            </>
          ) : isEnProcesoRecord ? (
            <>
              {hasPendingChanges && (
                <button
                  type="button"
                  className="admin-ficha-outline-action admin-mantencion-action-btn"
                  disabled={saving}
                  onClick={() => transitions.updateItemEstado({ item, estado: "en_proceso", action: "save" })}
                >
                  {"Guardar cambios"}
                </button>
              )}
              <button
                type="button"
                className="admin-danger-action admin-mantencion-action-btn admin-mantencion-cancel-btn"
                disabled={saving}
                onClick={() => transitions.openCancelConfirm(item, "Cancelar mantenimiento", false)}
              >
                {"Cancelar mantenimiento"}
              </button>
              <button
                type="button"
                className="admin-ficha-outline-action admin-mantencion-action-btn admin-mantencion-wait-btn"
                disabled={saving}
                onClick={() => transitions.updateItemEstado({ item, estado: "en_espera", action: "wait" })}
              >
                {"Marcar en espera"}
              </button>
              <button
                type="button"
                className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                disabled={saving}
                onClick={() => transitions.updateItemEstado({ item, estado: "finalizado", action: "finalize" })}
              >
                {"Marcar como finalizado"}
              </button>
            </>
          ) : isEnEsperaRecord ? (
            <>
              {hasPendingChanges && (
                <button
                  type="button"
                  className="admin-ficha-outline-action admin-mantencion-action-btn"
                  disabled={saving}
                  onClick={() => transitions.updateItemEstado({ item, estado: "en_espera", action: "save" })}
                >
                  {"Guardar cambios"}
                </button>
              )}
              <button
                type="button"
                className="admin-danger-action admin-mantencion-action-btn admin-mantencion-cancel-btn"
                disabled={saving}
                onClick={() => transitions.openCancelConfirm(item, "Cancelar mantenimiento", false)}
              >
                {"Cancelar mantenimiento"}
              </button>
              <button
                type="button"
                className="admin-primary-action admin-mantencion-action-btn admin-mantencion-accept-btn"
                disabled={saving}
                onClick={() => transitions.updateItemEstado({ item, estado: "en_proceso", action: "resume" })}
              >
                {"Reanudar"}
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

