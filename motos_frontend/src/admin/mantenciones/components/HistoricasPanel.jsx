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
  onOpenClienteDatos,
  historicoEstadoFilter,
  onHistoricoEstadoFilterChange,
  historicoFechaFilter,
  onHistoricoFechaFilterChange,
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
                  <option key={cliente.value} value={cliente.value}>
                    {cliente.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-mantencion-historico-filter">
              Filtrar por estado
              <select
                value={historicoEstadoFilter}
                onChange={(event) => onHistoricoEstadoFilterChange(event.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="en_proceso">En proceso</option>
                <option value="en_espera">En espera</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
                <option value="reagendacion">Reagendacion</option>
                <option value="entregada">Entregada</option>
              </select>
            </label>
            <label className="admin-mantencion-historico-filter">
              Filtrar por fecha
              <select
                value={historicoFechaFilter}
                onChange={(event) => onHistoricoFechaFilterChange(event.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Hace una semana</option>
                <option value="mes">Hace un mes</option>
                <option value="año">Hace un año</option>
              </select>
            </label>
            <button
              type="button"
              className="admin-mantencion-client-btn"
              disabled={!selectedHistorica}
              onClick={() => onOpenClienteDatos(selectedHistorica)}
            >
              Datos Cliente
            </button>
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
