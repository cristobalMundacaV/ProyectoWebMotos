import { WEEK_DAYS } from "../constants/mantencionesUiConstants";
import { formatCuposLabel, formatLongDate, sanitizeIntegerInput } from "../utils/mantencionesViewUtils";

export default function CalendarioPanel({ model }) {
  const {
    loading: calendarLoading,
    error: calendarError,
    month,
    day,
    state,
    modals,
  } = model;

  const selectedCalendarDate = day.selectedDate;
  const selectedCalendarDay = day.selected;
  const selectedCalendarIsHoliday = day.isHoliday;
  const dayBlockConfirm = modals.dayBlockConfirm;
  const dayActivateModalOpen = modals.dayActivateModalOpen;
  const slotToggleConfirm = modals.slotToggleConfirm;
  const dayBlockSaving = state.dayBlockSaving;
  const dayBlockError = state.dayBlockError;
  const dayActivateSaving = state.dayActivateSaving;
  const dayActivateError = state.dayActivateError;
  const dayActivateForm = state.dayActivateForm;
  const slotToggleSaving = state.slotToggleSaving;
  const slotToggleError = state.slotToggleError;

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
                <strong>{month.label}</strong>
              </div>
              <div className="admin-horarios-calendar-nav">
                <button type="button" onClick={month.prev} disabled={!month.canPrev}>
                  {"<"}
                </button>
                <button type="button" onClick={month.next} disabled={!month.canNext}>
                  {">"}
                </button>
              </div>
            </div>

            <div className="admin-horarios-calendar-summary">
              <article>
                <span>Dias con agenda</span>
                <strong>{month.summary.daysWithSchedule}</strong>
              </article>
              <article>
                <span>Dias con cupos</span>
                <strong>{month.summary.daysAvailable}</strong>
              </article>
              <article>
                <span>Dias sin horas</span>
                <strong>{month.summary.daysFull}</strong>
              </article>
              <article>
                <span>Horas ocupadas</span>
                <strong>{month.summary.occupiedSlots}</strong>
              </article>
            </div>

            <div className="admin-horarios-calendar-grid admin-horarios-calendar-weekdays">
              {WEEK_DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="admin-horarios-calendar-grid admin-horarios-calendar-days">
              {month.cells.map((cell) => {
                if (cell.empty) return <span key={cell.key} className="admin-horarios-calendar-empty" />;

                const isSelected = selectedCalendarDate === cell.iso;
                const className = [
                  "admin-horarios-day-btn",
                  cell.hasSchedule ? (cell.hasAvailable ? "available" : "occupied") : "inactive",
                  !cell.hasSchedule && cell.isHoliday ? "holiday" : "",
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
                    onClick={() => day.setSelectedDate(cell.iso)}
                    title={
                      cell.hasSchedule
                        ? formatLongDate(cell.iso)
                        : cell.isHoliday
                          ? "Feriado chileno"
                          : "Sin horarios configurados"
                    }
                  >
                    <strong>{cell.day}</strong>
                    <small>
                      {cell.hasSchedule
                        ? cell.hasAvailable
                          ? `${cell.availableSlots}/${cell.totalSlots} libres`
                          : "Completo"
                        : cell.isHoliday
                          ? "Feriado"
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

            {!calendarLoading && calendarError && <p className="admin-empty">{calendarError}</p>}
          </section>

          <aside className="admin-horarios-slots-card">
            <div className="admin-horarios-slots-head">
              <div>
                <p className="admin-horarios-calendar-kicker">Detalle del dia</p>
                <strong>{selectedCalendarDate ? formatLongDate(selectedCalendarDate) : "Selecciona un dia"}</strong>
              </div>
              {selectedCalendarDate && (
                selectedCalendarDay ? (
                  <button
                    type="button"
                    className="admin-danger-action admin-mantencion-action-btn admin-horarios-day-disable-btn"
                    disabled={dayBlockSaving}
                    onClick={() => day.block(false)}
                  >
                    {dayBlockSaving ? "Desactivando..." : "Desactivar dia"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-primary-action admin-mantencion-action-btn admin-horarios-day-activate-btn"
                    disabled={dayActivateSaving}
                    onClick={day.openActivate}
                  >
                    {dayActivateSaving ? "Activando..." : "Activar dia"}
                  </button>
                )
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
                    <strong>{selectedCalendarDay.horas?.filter((slot) => !slot.disponible && !slot.desactivada).length || 0}</strong>
                  </article>
                </div>

                <div className="admin-horarios-slot-list">
                  {(selectedCalendarDay.horas || []).map((slot) => (
                    <div
                      key={slot.hora}
                      className={
                        slot.desactivada
                          ? "admin-horarios-slot-item disabled"
                          : slot.disponible
                            ? "admin-horarios-slot-item available"
                            : "admin-horarios-slot-item occupied"
                      }
                    >
                      <div>
                        <strong>{slot.hora}</strong>
                        <span>{slot.desactivada ? "Desactivada" : slot.disponible ? "Disponible" : "Ocupado"}</span>
                      </div>
                      <div className="admin-horarios-slot-actions">
                        <b>{formatCuposLabel(slot.cupos_disponibles)}</b>
                        {slot.desactivada ? (
                          <button
                            type="button"
                            className="admin-horarios-slot-toggle-btn enable"
                            disabled={slotToggleSaving}
                            onClick={() => day.toggleSlot(slot, "unblock")}
                            title="Activar hora"
                          >
                            +
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="admin-horarios-slot-toggle-btn disable"
                            disabled={slotToggleSaving}
                            onClick={() => day.toggleSlot(slot, "block")}
                            title="Desactivar hora"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : selectedCalendarDate ? (
              <p className="admin-empty">
                {selectedCalendarIsHoliday
                  ? "Dia feriado en Chile. Puedes activarlo manualmente si necesitas abrir agenda."
                  : "Dia sin agenda. Puedes activarlo para habilitar nuevas horas."}
              </p>
            ) : (
              <p className="admin-empty">Selecciona un dia del calendario para ver sus horas.</p>
            )}
            {dayBlockError ? <p className="admin-confirm-modal-error">{dayBlockError}</p> : null}
            {dayActivateError ? <p className="admin-confirm-modal-error">{dayActivateError}</p> : null}
            {slotToggleError ? <p className="admin-confirm-modal-error">{slotToggleError}</p> : null}
          </aside>
        </div>
        {dayBlockConfirm && (
          <div
            className="admin-confirm-modal-overlay"
            onClick={() => {
              if (!dayBlockSaving) modals.closeDayBlock();
            }}
          >
            <section className="admin-confirm-modal" onClick={(event) => event.stopPropagation()}>
              <img src="/images/informacion.png" alt="Informacion" className="admin-confirm-modal-image" />
              <h3>Confirmar cancelacion del dia</h3>
              <p className="admin-confirm-modal-text">
                Hay horas agendadas para este dia. Seguro que quieres cancelar la atencion del dia?
              </p>
              <p className="admin-confirm-modal-subtext">
                Las mantenciones agendadas en esta fecha pasaran al estado <strong>Reagendacion</strong>.
              </p>
              <p className="admin-confirm-modal-subtext">
                Fecha:{" "}
                <strong>{formatLongDate(dayBlockConfirm.fecha, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</strong>
                {" - "}
                Horas afectadas: <strong>{dayBlockConfirm.bookingsCount}</strong>
              </p>
              {dayBlockError ? <p className="admin-confirm-modal-error">{dayBlockError}</p> : null}
              <div className="admin-confirm-modal-actions">
                <button
                  type="button"
                  className="btn-back"
                  disabled={dayBlockSaving}
                  onClick={modals.closeDayBlock}
                >
                  Volver
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  disabled={dayBlockSaving}
                  onClick={() => day.block(true)}
                >
                  {dayBlockSaving ? "Procesando..." : "Aceptar"}
                </button>
              </div>
            </section>
          </div>
        )}
        {slotToggleConfirm && (
          <div
            className="admin-confirm-modal-overlay"
            onClick={() => {
              if (!slotToggleSaving) modals.closeSlotToggle();
            }}
          >
            <section className="admin-confirm-modal" onClick={(event) => event.stopPropagation()}>
              <img src="/images/informacion.png" alt="Informacion" className="admin-confirm-modal-image" />
              <h3>Confirmar desactivacion de hora</h3>
              <p className="admin-confirm-modal-text">
                Hay horas agendadas para esta hora. Seguro que quieres desactivarla?
              </p>
              <p className="admin-confirm-modal-subtext">
                Fecha: <strong>{formatLongDate(selectedCalendarDate, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</strong>
                {" - "}
                Hora: <strong>{slotToggleConfirm.hora}</strong>
              </p>
              <p className="admin-confirm-modal-subtext">
                Mantenciones afectadas: <strong>{slotToggleConfirm.bookingsCount}</strong>. Se marcaran como{" "}
                <strong>Reagendacion</strong>.
              </p>
              {slotToggleError ? <p className="admin-confirm-modal-error">{slotToggleError}</p> : null}
              <div className="admin-confirm-modal-actions">
                <button
                  type="button"
                  className="btn-back"
                  disabled={slotToggleSaving}
                  onClick={modals.closeSlotToggle}
                >
                  Volver
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  disabled={slotToggleSaving}
                  onClick={() => day.toggleSlot({ hora: slotToggleConfirm.hora }, "block", true)}
                >
                  {slotToggleSaving ? "Procesando..." : "Aceptar"}
                </button>
              </div>
            </section>
          </div>
        )}
        {dayActivateModalOpen && (
          <div
            className="admin-confirm-modal-overlay"
            onClick={() => {
              if (!dayActivateSaving) modals.closeDayActivate();
            }}
          >
            <section className="admin-confirm-modal" onClick={(event) => event.stopPropagation()}>
              <h3>Activar dia</h3>
              <p className="admin-confirm-modal-text">
                Configura el horario del dia seleccionado para habilitar agenda.
              </p>
              <label className="admin-confirm-modal-field">
                Hora inicio
                <input
                  type="time"
                  value={dayActivateForm.hora_inicio}
                  disabled={dayActivateSaving}
                  onChange={(event) => modals.setDayActivateField("hora_inicio", event.target.value)}
                  required
                />
              </label>
              <label className="admin-confirm-modal-field">
                Hora fin
                <input
                  type="time"
                  value={dayActivateForm.hora_fin}
                  disabled={dayActivateSaving}
                  onChange={(event) => modals.setDayActivateField("hora_fin", event.target.value)}
                  required
                />
              </label>
              <label className="admin-confirm-modal-field">
                Intervalo (minutos)
                <input
                  type="number"
                  min="15"
                  step="5"
                  value={dayActivateForm.intervalo_minutos}
                  disabled={dayActivateSaving}
                  onChange={(event) => modals.setDayActivateField("intervalo_minutos", sanitizeIntegerInput(event.target.value))}
                  required
                />
              </label>
              <label className="admin-confirm-modal-field">
                Horas por bloque
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={dayActivateForm.cupos_por_bloque}
                  disabled={dayActivateSaving}
                  onChange={(event) => modals.setDayActivateField("cupos_por_bloque", sanitizeIntegerInput(event.target.value))}
                  required
                />
              </label>
              {dayActivateError ? <p className="admin-confirm-modal-error">{dayActivateError}</p> : null}
              <div className="admin-confirm-modal-actions">
                <button
                  type="button"
                  className="btn-back admin-activate-modal-back-btn"
                  disabled={dayActivateSaving}
                  onClick={modals.closeDayActivate}
                >
                  Volver
                </button>
                <button
                  type="button"
                  className="btn-save admin-activate-modal-btn"
                  disabled={dayActivateSaving}
                  onClick={day.activate}
                >
                  {dayActivateSaving ? "Activando..." : "Activar"}
                </button>
              </div>
            </section>
          </div>
        )}
      </article>
    </section>
  );
}
