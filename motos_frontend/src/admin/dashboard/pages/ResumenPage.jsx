import { Link } from "react-router-dom";

export default function ResumenPage({
  loading,
  dashboard,
  marcasMotosAdmin,
  marcasAccRiderAdmin,
  marcasAccMotosAdmin,
}) {
  const recentMotos = dashboard.motos.slice(0, 6);

  return (
    <div className="admin-dashboard-stack">
      <section className="admin-hero-card">
        <div>
          <h1>Bienvenido al Panel de Administración</h1>
        </div>
      </section>

      <section className="admin-summary-grid admin-kpi-layout">
        <article className="admin-summary-card kpi-main-1">
          <p>Motos en Sistema</p>
          <strong>{loading ? "..." : dashboard.motos.length}</strong>
          <span>Modelos activos en catalogo.</span>
        </article>
        <article className="admin-summary-card kpi-main-2">
          <p>Indumentaria Rider</p>
          <strong>{loading ? "..." : dashboard.productosIndumentaria.length}</strong>
          <span>Productos de indumentaria rider.</span>
        </article>
        <article className="admin-summary-card kpi-main-3">
          <p>Accesorios Motos</p>
          <strong>{loading ? "..." : dashboard.productosAccesorios.length}</strong>
          <span>Productos accesorios moto.</span>
        </article>
        <article className="admin-summary-card accent kpi-side-1">
          <p>Marcas Motos</p>
          <strong>{loading ? "..." : marcasMotosAdmin.length}</strong>
          <span>Marcas de moto registradas.</span>
        </article>
      </section>

      <section className="admin-dashboard-lower">
        <article className="admin-panel-card kpi-recent-card">
          <div className="admin-card-header">
            <h2>Motos recientes</h2>
            <Link to="/catalogo">Ir al catalogo</Link>
          </div>
          <div className="admin-table">
            {recentMotos.map((moto) => (
              <div key={moto.id} className="admin-table-row admin-moto-table-row">
                <div className="admin-moto-table-cell">
                  <strong>{moto.modelo}</strong>
                  <span>{moto.marca_nombre || "Sin marca"}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <strong>{moto.categoria_nombre || "-"}</strong>
                  <span>{moto.anio}</span>
                </div>
              </div>
            ))}
            {!loading && dashboard.motos.length === 0 && <p className="admin-empty">No hay motos registradas en el sistema.</p>}
          </div>
        </article>

        <div className="admin-kpi-side-stack">
          <article className="admin-summary-card kpi-side-2">
            <p>Marcas indumentaria</p>
            <strong>{loading ? "..." : marcasAccRiderAdmin.length}</strong>
            <span>Marcas de indumentaria registradas.</span>
          </article>
          <article className="admin-summary-card kpi-side-3">
            <p>Marcas accesorios motos</p>
            <strong>{loading ? "..." : marcasAccMotosAdmin.length}</strong>
            <span>Marcas de accesorios moto.</span>
          </article>
        </div>
      </section>
    </div>
  );
}
