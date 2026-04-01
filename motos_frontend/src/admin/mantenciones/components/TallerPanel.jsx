import { TALLER_ESTADO_FILTERS } from "../constants/mantencionesUiConstants";
import FichaDetailPanel from "./FichaDetailPanel";
import FichaListPanel from "./FichaListPanel";
import FichaMobilePicker from "./FichaMobilePicker";

export default function TallerPanel({
  loading,
  fichasMantencion,
  tallerEstadoFilter,
  selectedFicha,
  fichasTallerEmptyText,
  onTallerEstadoFilterChange,
  onSelectFicha,
  mobilePickerOpen,
  onToggleMobilePicker,
  onCloseMobilePicker,
  onOpenClienteDatos,
  transitions,
  savingById,
}) {
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
                    onClick={() => onTallerEstadoFilterChange(filter.value)}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="admin-mantencion-client-btn"
              disabled={!selectedFicha}
              onClick={() => onOpenClienteDatos(selectedFicha)}
            >
              Datos Cliente
            </button>
          </div>
        </div>

        <div className="admin-mantencion-fichas-layout">
          <FichaMobilePicker
            loading={loading}
            items={fichasMantencion}
            selectedId={selectedFicha?.id}
            onSelect={onSelectFicha}
            emptyText={fichasTallerEmptyText}
            pickerKey="fichas"
            mobilePickerOpen={mobilePickerOpen}
            onToggle={onToggleMobilePicker}
            onClose={onCloseMobilePicker}
          />
          <FichaListPanel
            items={fichasMantencion}
            selectedId={selectedFicha?.id}
            onSelect={onSelectFicha}
            emptyText={fichasTallerEmptyText}
            loading={loading}
          />
          <div className="admin-mantencion-ficha-detail">
            <FichaDetailPanel item={selectedFicha} mode="fichas" transitions={transitions} savingById={savingById} />
          </div>
        </div>
      </article>
    </section>
  );
}

