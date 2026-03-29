import { useMemo, useState } from "react";
import { toPositiveInteger } from "../utils/mantencionesViewUtils";

const DIAS_LABEL = {
  0: "Lunes",
  1: "Martes",
  2: "Miercoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sabado",
  6: "Domingo",
};

export default function HorariosPanel({
  horarios = [],
  horariosLoading = false,
  showHorarioForm,
  onToggleHorarioForm,
  horarioForm,
  horarioSaving = false,
  onHorarioInputChange,
  onHorarioSubmit,
  onHorarioUpdate,
  onHorarioDelete,
}) {
  const [horarioEditsById, setHorarioEditsById] = useState({});

  const horariosOrdenados = useMemo(() => {
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
  }, [horarios]);

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

  return (
    <section className="admin-content-grid admin-content-grid-mantenciones">
      <article className="admin-panel-card">
        <div className="admin-card-header">
          <h2>Horario de la Semana</h2>
          <button
            type="button"
            className="admin-primary-action"
            onClick={onToggleHorarioForm}
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
              {"Guardar horario"}
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
                      <input type="checkbox" checked readOnly />
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
        </div>
      </article>
    </section>
  );
}

