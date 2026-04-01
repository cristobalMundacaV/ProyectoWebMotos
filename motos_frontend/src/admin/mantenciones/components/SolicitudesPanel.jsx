import { SOLICITUDES_TABS } from "../constants/mantencionesUiConstants";
import FichaDetailPanel from "./FichaDetailPanel";
import FichaListPanel from "./FichaListPanel";
import FichaMobilePicker from "./FichaMobilePicker";
import { memo } from "react";

function SolicitudesPanel({
  loading,
  solicitudes,
  solicitudesTab,
  selectedSolicitud,
  solicitudesEmptyText,
  onTabChange,
  onSelectSolicitud,
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
            <div className="admin-mantencion-head-left">
              <h2>Solicitudes de mantencion</h2>
              <div className="admin-mantencion-tabs" role="tablist" aria-label="Filtros de solicitudes">
                {SOLICITUDES_TABS.map((tab) => {
                  const isActive = solicitudesTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={isActive ? "admin-mantencion-tab active" : "admin-mantencion-tab"}
                      onClick={() => onTabChange(tab.value)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              className="admin-mantencion-client-btn"
              disabled={!selectedSolicitud}
              onClick={() => onOpenClienteDatos(selectedSolicitud)}
            >
              Datos Cliente
            </button>
          </div>
        </div>

        <div className="admin-mantencion-fichas-layout">
          <FichaMobilePicker
            loading={loading}
            items={solicitudes}
            selectedId={selectedSolicitud?.id}
            onSelect={onSelectSolicitud}
            emptyText={solicitudesEmptyText}
            pickerKey="solicitudes"
            mobilePickerOpen={mobilePickerOpen}
            onToggle={onToggleMobilePicker}
            onClose={onCloseMobilePicker}
          />
          <FichaListPanel
            items={solicitudes}
            selectedId={selectedSolicitud?.id}
            onSelect={onSelectSolicitud}
            emptyText={solicitudesEmptyText}
            loading={loading}
          />
          <div className="admin-mantencion-ficha-detail">
            <FichaDetailPanel item={selectedSolicitud} mode="solicitudes" transitions={transitions} savingById={savingById} />
          </div>
        </div>
      </article>
    </section>
  );
}

export default memo(SolicitudesPanel);