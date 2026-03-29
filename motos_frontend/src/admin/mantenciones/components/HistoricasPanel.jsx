import FichaDetailPanel from "./FichaDetailPanel";
import FichaListPanel from "./FichaListPanel";
import FichaMobilePicker from "./FichaMobilePicker";

export default function HistoricasPanel({
  loading,
  historicoClientes,
  selectedHistoricoClienteEffective,
  onHistoricoClienteChange,
  fichasHistoricasByCliente,
  selectedHistorica,
  onSelectHistorica,
  mobilePickerOpen,
  onToggleMobilePicker,
  onCloseMobilePicker,
  transitions,
  savingById,
}) {
  const emptyText = selectedHistoricoClienteEffective
    ? "No hay fichas historicas para este cliente."
    : "Seleccione un cliente para ver sus fichas historicas.";

  return (
    <section className="admin-content-grid admin-content-grid-mantenciones admin-content-grid-mantenciones-fichas">
      <article className="admin-panel-card">
        <div className="admin-card-header">
          <div className="admin-mantencion-solicitudes-head">
            <h2>Fichas historicas</h2>
            <label className="admin-mantencion-historico-filter">
              Cliente
              <select
                value={selectedHistoricoClienteEffective}
                onChange={(event) => onHistoricoClienteChange(event.target.value)}
                disabled={!historicoClientes.length}
              >
                <option value="">Seleccione un cliente</option>
                {historicoClientes.map((cliente) => (
                  <option key={cliente} value={cliente}>
                    {cliente}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="admin-mantencion-fichas-layout">
          <FichaMobilePicker
            loading={loading}
            items={fichasHistoricasByCliente}
            selectedId={selectedHistorica?.id}
            onSelect={onSelectHistorica}
            emptyText={emptyText}
            pickerKey="historicas"
            mobilePickerOpen={mobilePickerOpen}
            onToggle={onToggleMobilePicker}
            onClose={onCloseMobilePicker}
          />
          <FichaListPanel
            items={fichasHistoricasByCliente}
            selectedId={selectedHistorica?.id}
            onSelect={onSelectHistorica}
            emptyText={emptyText}
            loading={loading}
          />
          <div className="admin-mantencion-ficha-detail">
            {selectedHistoricoClienteEffective
              ? <FichaDetailPanel item={selectedHistorica} mode="historicas" transitions={transitions} savingById={savingById} />
              : <p className="admin-empty">Seleccione un cliente para ver el detalle.</p>}
          </div>
        </div>
      </article>
    </section>
  );
}

