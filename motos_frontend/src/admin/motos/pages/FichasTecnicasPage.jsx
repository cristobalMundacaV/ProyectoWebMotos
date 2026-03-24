import { useEffect, useMemo, useState } from "react";
import { getMotoFichaTecnica } from "../services/motosAdminService";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function FichasTecnicasPage({ activeSection, motos = [] }) {
  const [selectedMotoId, setSelectedMotoId] = useState("");
  const [ficha, setFicha] = useState(null);
  const [loadingFicha, setLoadingFicha] = useState(false);
  const [errorFicha, setErrorFicha] = useState("");

  const motosDisponibles = useMemo(() => normalizeArray(motos), [motos]);

  useEffect(() => {
    if (!selectedMotoId && motosDisponibles.length > 0) {
      setSelectedMotoId(String(motosDisponibles[0].id));
    }
  }, [motosDisponibles, selectedMotoId]);

  useEffect(() => {
    const isFichaSection =
      activeSection === "fichas_resumen" ||
      activeSection === "fichas_secciones" ||
      activeSection === "fichas_items";
    if (!isFichaSection || !selectedMotoId) return;

    let mounted = true;
    setLoadingFicha(true);
    setErrorFicha("");

    getMotoFichaTecnica(selectedMotoId)
      .then((payload) => {
        if (!mounted) return;
        setFicha(payload || null);
      })
      .catch(() => {
        if (!mounted) return;
        setFicha(null);
        setErrorFicha("No se pudo cargar la ficha tecnica de la moto seleccionada.");
      })
      .finally(() => {
        if (mounted) setLoadingFicha(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeSection, selectedMotoId]);

  if (
    activeSection !== "fichas_resumen" &&
    activeSection !== "fichas_secciones" &&
    activeSection !== "fichas_items"
  ) {
    return null;
  }

  const secciones = normalizeArray(ficha?.secciones_ficha);
  const itemsFlat = secciones.flatMap((seccion) =>
    normalizeArray(seccion?.items).map((item) => ({
      seccion: seccion?.nombre || "-",
      seccion_orden: seccion?.orden ?? 0,
      nombre: item?.nombre || "-",
      valor: item?.valor || "-",
      orden: item?.orden ?? 0,
    }))
  );

  const totalItems = itemsFlat.length;

  return (
    <section className="admin-content-grid lower">
      <article className="admin-panel-card">
        <div className="admin-card-header">
          <h2>Fichas tecnicas</h2>
          <span>Gestion visual por submodulos</span>
        </div>

        <form className="admin-moto-form admin-inline-submit-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Moto
            <select value={selectedMotoId} onChange={(event) => setSelectedMotoId(event.target.value)}>
              {motosDisponibles.map((moto) => (
                <option key={moto.id} value={moto.id}>
                  {moto.modelo} {moto.marca_nombre ? `(${moto.marca_nombre})` : ""}
                </option>
              ))}
            </select>
          </label>
        </form>
      </article>

      {loadingFicha && (
        <article className="admin-panel-card">
          <p className="admin-empty">Cargando ficha tecnica...</p>
        </article>
      )}

      {!loadingFicha && errorFicha && (
        <article className="admin-panel-card">
          <p className="admin-empty">{errorFicha}</p>
        </article>
      )}

      {!loadingFicha && !errorFicha && activeSection === "fichas_resumen" && (
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Resumen de ficha tecnica</h2>
            <span>{ficha?.modelo || "Moto"} </span>
          </div>
          <div className="admin-table">
            <div className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>Secciones</strong>
              </div>
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>{secciones.length}</strong>
              </div>
            </div>
            <div className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>Items tecnicos</strong>
              </div>
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>{totalItems}</strong>
              </div>
            </div>
          </div>
        </article>
      )}

      {!loadingFicha && !errorFicha && activeSection === "fichas_secciones" && (
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Secciones de la ficha</h2>
            <span>{secciones.length} secciones</span>
          </div>
          <div className="admin-table">
            {secciones.map((seccion) => (
              <div key={`${seccion.nombre}-${seccion.orden}`} className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
                <div className="admin-entity-name-cell admin-recent-simple-main">
                  <strong>{seccion.nombre}</strong>
                  <span>Orden: {seccion.orden}</span>
                </div>
                <div className="admin-entity-name-cell admin-recent-simple-main">
                  <span>{normalizeArray(seccion.items).length} items</span>
                </div>
              </div>
            ))}
            {secciones.length === 0 && <p className="admin-empty">Esta moto aun no tiene secciones de ficha tecnica.</p>}
          </div>
        </article>
      )}

      {!loadingFicha && !errorFicha && activeSection === "fichas_items" && (
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Items de ficha tecnica</h2>
            <span>{itemsFlat.length} items</span>
          </div>
          <div className="admin-table">
            {itemsFlat.map((item) => (
              <div key={`${item.seccion}-${item.nombre}-${item.orden}`} className="admin-table-row admin-moto-table-row">
                <div className="admin-moto-table-cell">
                  <span className="admin-row-label">Seccion</span>
                  <strong>{item.seccion}</strong>
                  <span>Orden seccion: {item.seccion_orden}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <span className="admin-row-label">Item</span>
                  <strong>{item.nombre}</strong>
                  <span>Orden item: {item.orden}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <span className="admin-row-label">Valor</span>
                  <strong>{item.valor}</strong>
                </div>
              </div>
            ))}
            {itemsFlat.length === 0 && <p className="admin-empty">No hay items cargados para esta moto.</p>}
          </div>
        </article>
      )}
    </section>
  );
}
