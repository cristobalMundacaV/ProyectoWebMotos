import { useEffect, useMemo, useState } from "react";
import {
  createTipoAtributo,
  createValorAtributoMoto,
  deleteTipoAtributo,
  deleteValorAtributoMoto,
  getMotoFichaTecnica,
  getTiposAtributo,
  getValoresAtributoMoto,
  updateTipoAtributo,
  updateValorAtributoMoto,
} from "../services/motosAdminService";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildSlug(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function FichasTecnicasPage({ activeSection, motos = [] }) {
  const [selectedMotoId, setSelectedMotoId] = useState("");
  const [ficha, setFicha] = useState(null);
  const [tiposAtributo, setTiposAtributo] = useState([]);
  const [valoresMoto, setValoresMoto] = useState([]);
  const [loadingFicha, setLoadingFicha] = useState(false);
  const [errorFicha, setErrorFicha] = useState("");
  const [seccionForm, setSeccionForm] = useState({ nombre: "", orden: "1" });
  const [itemForm, setItemForm] = useState({ tipo_atributo: "", nombre: "", valor: "", orden: "1" });
  const [savingSeccion, setSavingSeccion] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  const motosDisponibles = useMemo(() => normalizeArray(motos), [motos]);

  const isFichaSection =
    activeSection === "fichas_resumen" ||
    activeSection === "fichas_secciones" ||
    activeSection === "fichas_items";

  async function loadSecciones() {
    const tipos = await getTiposAtributo();
    setTiposAtributo(normalizeArray(tipos));
  }

  async function loadItems(motoId) {
    if (!motoId) {
      setValoresMoto([]);
      return;
    }
    const valores = await getValoresAtributoMoto({ moto: motoId });
    setValoresMoto(normalizeArray(valores));
  }

  async function loadFicha(motoId) {
    if (!motoId) {
      setFicha(null);
      return;
    }
    setLoadingFicha(true);
    setErrorFicha("");
    try {
      const payload = await getMotoFichaTecnica(motoId);
      setFicha(payload || null);
    } catch {
      setFicha(null);
      setErrorFicha("No se pudo cargar la ficha tecnica de la moto seleccionada.");
    } finally {
      setLoadingFicha(false);
    }
  }

  useEffect(() => {
    if (!selectedMotoId && motosDisponibles.length > 0) {
      setSelectedMotoId(String(motosDisponibles[0].id));
    }
  }, [motosDisponibles, selectedMotoId]);

  useEffect(() => {
    if (!isFichaSection) return;
    let mounted = true;

    const loadAll = async () => {
      try {
        await loadSecciones();
        await loadItems(selectedMotoId);
        await loadFicha(selectedMotoId);
      } catch {
        if (mounted) setErrorFicha("No se pudieron cargar los datos de ficha tecnica.");
      }
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, [isFichaSection, selectedMotoId]);

  if (!isFichaSection) return null;

  const seccionesResumen = normalizeArray(ficha?.secciones_ficha);
  const totalItemsResumen = seccionesResumen.reduce((acc, section) => acc + normalizeArray(section.items).length, 0);

  const seccionesOrdenadas = [...tiposAtributo].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.nombre.localeCompare(b.nombre));
  const itemsOrdenados = [...valoresMoto].sort(
    (a, b) =>
      (a.tipo_atributo_orden ?? 0) - (b.tipo_atributo_orden ?? 0) ||
      (a.orden ?? 0) - (b.orden ?? 0) ||
      a.nombre.localeCompare(b.nombre)
  );

  async function handleCrearSeccion(event) {
    event.preventDefault();
    const nombre = seccionForm.nombre.trim();
    if (!nombre) return;
    setSavingSeccion(true);
    try {
      await createTipoAtributo({
        nombre,
        slug: buildSlug(nombre),
        orden: Number(seccionForm.orden) || 1,
        activo: true,
      });
      setSeccionForm({ nombre: "", orden: "1" });
      await loadSecciones();
    } finally {
      setSavingSeccion(false);
    }
  }

  async function handleEditarSeccion(seccion) {
    const nuevoNombre = window.prompt("Nuevo nombre de la seccion", seccion.nombre);
    if (!nuevoNombre) return;
    const nuevoOrden = window.prompt("Nuevo orden", String(seccion.orden ?? 1));
    await updateTipoAtributo(seccion.id, {
      nombre: nuevoNombre.trim(),
      slug: buildSlug(nuevoNombre),
      orden: Number(nuevoOrden) || 1,
    });
    await loadSecciones();
    await loadFicha(selectedMotoId);
  }

  async function handleEliminarSeccion(seccion) {
    const ok = window.confirm(`Eliminar seccion "${seccion.nombre}"?`);
    if (!ok) return;
    await deleteTipoAtributo(seccion.id);
    await loadSecciones();
    await loadItems(selectedMotoId);
    await loadFicha(selectedMotoId);
  }

  async function handleCrearItem(event) {
    event.preventDefault();
    if (!selectedMotoId || !itemForm.tipo_atributo || !itemForm.nombre.trim() || !itemForm.valor.trim()) return;
    setSavingItem(true);
    try {
      await createValorAtributoMoto({
        moto: Number(selectedMotoId),
        tipo_atributo: Number(itemForm.tipo_atributo),
        nombre: itemForm.nombre.trim(),
        valor: itemForm.valor.trim(),
        orden: Number(itemForm.orden) || 1,
      });
      setItemForm((prev) => ({ ...prev, nombre: "", valor: "", orden: "1" }));
      await loadItems(selectedMotoId);
      await loadFicha(selectedMotoId);
    } finally {
      setSavingItem(false);
    }
  }

  async function handleEditarItem(item) {
    const nuevoNombre = window.prompt("Nombre del item", item.nombre);
    if (!nuevoNombre) return;
    const nuevoValor = window.prompt("Valor del item", item.valor);
    if (nuevoValor === null) return;
    const nuevoOrden = window.prompt("Orden del item", String(item.orden ?? 1));
    await updateValorAtributoMoto(item.id, {
      nombre: nuevoNombre.trim(),
      valor: nuevoValor.trim(),
      orden: Number(nuevoOrden) || 1,
    });
    await loadItems(selectedMotoId);
    await loadFicha(selectedMotoId);
  }

  async function handleEliminarItem(item) {
    const ok = window.confirm(`Eliminar item "${item.nombre}"?`);
    if (!ok) return;
    await deleteValorAtributoMoto(item.id);
    await loadItems(selectedMotoId);
    await loadFicha(selectedMotoId);
  }

  async function handleMoverItem(item, direction) {
    const sameSection = itemsOrdenados.filter((row) => row.tipo_atributo === item.tipo_atributo);
    const index = sameSection.findIndex((row) => row.id === item.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= sameSection.length) return;
    const targetItem = sameSection[targetIndex];

    await Promise.all([
      updateValorAtributoMoto(item.id, { orden: targetItem.orden }),
      updateValorAtributoMoto(targetItem.id, { orden: item.orden }),
    ]);
    await loadItems(selectedMotoId);
    await loadFicha(selectedMotoId);
  }

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
            <span>{ficha?.modelo || "Moto"}</span>
          </div>
          <div className="admin-table">
            <div className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>Secciones</strong>
              </div>
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>{seccionesResumen.length}</strong>
              </div>
            </div>
            <div className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>Items tecnicos</strong>
              </div>
              <div className="admin-entity-name-cell admin-recent-simple-main">
                <strong>{totalItemsResumen}</strong>
              </div>
            </div>
          </div>
        </article>
      )}

      {!loadingFicha && !errorFicha && activeSection === "fichas_secciones" && (
        <>
          <article className="admin-panel-card">
            <div className="admin-card-header">
              <h2>Crear seccion</h2>
              <span>Motor, Caracteristicas, Equipamiento, etc.</span>
            </div>

            <form className="admin-moto-form admin-inline-submit-form" onSubmit={handleCrearSeccion}>
              <label>
                Nombre de la seccion *
                <input
                  name="nombre"
                  value={seccionForm.nombre}
                  onChange={(event) => setSeccionForm((prev) => ({ ...prev, nombre: event.target.value }))}
                  maxLength={120}
                  required
                />
              </label>

              <label>
                Orden *
                <input
                  type="number"
                  name="orden"
                  value={seccionForm.orden}
                  min="1"
                  onChange={(event) => setSeccionForm((prev) => ({ ...prev, orden: event.target.value }))}
                  required
                />
              </label>

              <button type="submit" className="admin-primary-action" disabled={savingSeccion}>
                {savingSeccion ? "Guardando..." : "Guardar seccion"}
              </button>
            </form>
          </article>

          <article className="admin-panel-card">
            <div className="admin-card-header">
              <h2>Secciones de la ficha</h2>
              <span>{seccionesOrdenadas.length} secciones</span>
            </div>
            <div className="admin-table">
              {seccionesOrdenadas.map((seccion) => {
                const itemCount = valoresMoto.filter((item) => item.tipo_atributo === seccion.id).length;
                return (
                  <div key={seccion.id} className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
                    <div className="admin-entity-name-cell admin-recent-simple-main">
                      <strong>{seccion.nombre}</strong>
                      <span>Orden: {seccion.orden}</span>
                      <span>{itemCount} items</span>
                    </div>
                    <div className="admin-row-actions admin-recent-simple-actions">
                      <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => handleEditarSeccion(seccion)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => handleEliminarSeccion(seccion)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              {seccionesOrdenadas.length === 0 && <p className="admin-empty">Aun no hay secciones de ficha tecnica.</p>}
            </div>
          </article>
        </>
      )}

      {!loadingFicha && !errorFicha && activeSection === "fichas_items" && (
        <>
          <article className="admin-panel-card">
            <div className="admin-card-header">
              <h2>Crear item</h2>
              <span>Ejemplo: Motor - Potencia maxima</span>
            </div>

            <form className="admin-moto-form admin-inline-submit-form" onSubmit={handleCrearItem}>
              <label>
                Seccion *
                <select
                  name="tipo_atributo"
                  value={itemForm.tipo_atributo}
                  onChange={(event) => setItemForm((prev) => ({ ...prev, tipo_atributo: event.target.value }))}
                  required
                >
                  <option value="">Selecciona seccion</option>
                  {seccionesOrdenadas.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Nombre del item *
                <input
                  name="nombre"
                  value={itemForm.nombre}
                  onChange={(event) => setItemForm((prev) => ({ ...prev, nombre: event.target.value }))}
                  maxLength={120}
                  required
                />
              </label>

              <label className="admin-form-span-2">
                Valor *
                <textarea
                  name="valor"
                  rows={3}
                  value={itemForm.valor}
                  onChange={(event) => setItemForm((prev) => ({ ...prev, valor: event.target.value }))}
                  required
                />
              </label>

              <label>
                Orden *
                <input
                  type="number"
                  name="orden"
                  value={itemForm.orden}
                  min="1"
                  onChange={(event) => setItemForm((prev) => ({ ...prev, orden: event.target.value }))}
                  required
                />
              </label>

              <button type="submit" className="admin-primary-action" disabled={savingItem}>
                {savingItem ? "Guardando..." : "Guardar item"}
              </button>
            </form>
          </article>

          <article className="admin-panel-card">
            <div className="admin-card-header">
              <h2>Items de ficha</h2>
              <span>{itemsOrdenados.length} items</span>
            </div>
            <div className="admin-table">
              {itemsOrdenados.map((item) => (
                <div key={item.id} className="admin-table-row admin-moto-table-row admin-moto-table-row-actions">
                  <div className="admin-moto-table-cell">
                    <span className="admin-row-label">Seccion</span>
                    <strong>{item.tipo_atributo_nombre}</strong>
                  </div>
                  <div className="admin-moto-table-cell">
                    <span className="admin-row-label">Item</span>
                    <strong>{item.nombre}</strong>
                    <span>Orden: {item.orden}</span>
                  </div>
                  <div className="admin-moto-table-cell">
                    <span className="admin-row-label">Valor</span>
                    <strong>{item.valor}</strong>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" className="admin-row-action-btn edit" title="Subir" onClick={() => handleMoverItem(item, "up")}>
                      ▲
                    </button>
                    <button type="button" className="admin-row-action-btn edit" title="Bajar" onClick={() => handleMoverItem(item, "down")}>
                      ▼
                    </button>
                    <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => handleEditarItem(item)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => handleEliminarItem(item)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
              {itemsOrdenados.length === 0 && <p className="admin-empty">Aun no hay items de ficha para esta moto.</p>}
            </div>
          </article>
        </>
      )}
    </section>
  );
}
