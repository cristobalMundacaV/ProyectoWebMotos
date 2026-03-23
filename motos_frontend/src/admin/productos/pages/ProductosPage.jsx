import { useEffect, useState } from "react";
import AdminPagination, { paginateItems } from "../../shared/components/AdminPagination";

export default function ProductosPage({
  activeSection,
  loading,
  categoriasAccMotosMeta,
  categoriaAccMotosForm,
  categoriaAccMotosSaving,
  onCategoriaAccMotosInputChange,
  onCategoriaAccMotosSubmit,
  onCategoriaAccMotosEdit,
  onCategoriaAccMotosDelete,
  categoriasAccRiderMeta,
  categoriaAccRiderForm,
  categoriaAccRiderSaving,
  onCategoriaAccRiderInputChange,
  onCategoriaAccRiderSubmit,
  onCategoriaAccRiderEdit,
  onCategoriaAccRiderDelete,
  accesoriosMotosMeta,
  accesoriosMotosAdmin,
  accesorioMotoForm,
  accesorioMotoImageInputKey,
  accesorioMotoImageUrl,
  accesorioMotoSaving,
  editingAccesorioMotoId,
  onAccesorioMotoInputChange,
  onAccesorioMotoPrecioInputChange,
  onAccesorioMotoSubmit,
  onAccesorioMotoEdit,
  onAccesorioMotoDelete,
  onCancelAccesorioMotoEdit,
  onToggleCompatibilidad,
  accesoriosRiderMeta,
  accesoriosRiderAdmin,
  accesorioRiderForm,
  accesorioRiderImageInputKey,
  accesorioRiderImageUrl,
  accesorioRiderSaving,
  onAccesorioRiderInputChange,
  onAccesorioRiderPrecioInputChange,
  onAccesorioRiderSubmit,
  onAccesorioRiderEdit,
  onAccesorioRiderDelete,
}) {
  const PAGE_SIZE = 10;
  const ACCESORIOS_RIDER_PAGE_SIZE = 7;
  const [tablePages, setTablePages] = useState({
    categoriasAccRider: 1,
    categoriasAccMotos: 1,
    accesoriosMotos: 1,
    accesoriosRider: 1,
  });

  useEffect(() => {
    setTablePages({
      categoriasAccRider: 1,
      categoriasAccMotos: 1,
      accesoriosMotos: 1,
      accesoriosRider: 1,
    });
  }, [activeSection]);

  function formatPrecio(value) {
    if (value === null || value === undefined || value === "") return "";
    const digits = String(value).replace(/\D/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function formatCategoryLabel(value) {
    const clean = String(value || "")
      .trim()
      .replace(/\s+/g, " ");
    if (!clean) return "Sin subcategoria";
    return clean
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const [accesorioMotoLocalPreview, setAccesorioMotoLocalPreview] = useState("");
  const [accesorioRiderLocalPreview, setAccesorioRiderLocalPreview] = useState("");

  useEffect(() => {
    if (!(accesorioMotoForm.imagen_principal instanceof File)) {
      setAccesorioMotoLocalPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(accesorioMotoForm.imagen_principal);
    setAccesorioMotoLocalPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [accesorioMotoForm.imagen_principal]);

  useEffect(() => {
    if (!(accesorioRiderForm.imagen_principal instanceof File)) {
      setAccesorioRiderLocalPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(accesorioRiderForm.imagen_principal);
    setAccesorioRiderLocalPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [accesorioRiderForm.imagen_principal]);

  if (activeSection === "categorias_acc_rider") {
    const paginatedCategoriasAccRider = paginateItems(
      categoriasAccRiderMeta.subcategorias,
      tablePages.categoriasAccRider,
      PAGE_SIZE
    );

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Crear categorias indumentaria rider</h2>
            <span>Gestion de categorias de Indumentaria Rider</span>
          </div>

          <form className="admin-moto-form admin-inline-submit-form" onSubmit={onCategoriaAccRiderSubmit} noValidate>
            <label>
              Nombre *
              <input
                name="nombre"
                value={categoriaAccRiderForm.nombre}
                onChange={onCategoriaAccRiderInputChange}
                maxLength={100}
                required
              />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea
                name="descripcion"
                value={categoriaAccRiderForm.descripcion}
                onChange={onCategoriaAccRiderInputChange}
                rows={4}
              />
            </label>

            <label className="admin-form-check">
              <input
                type="checkbox"
                name="activa"
                checked={categoriaAccRiderForm.activa}
                onChange={onCategoriaAccRiderInputChange}
              />
              Activa (opcional)
            </label>

            <button type="submit" className="admin-primary-action" disabled={categoriaAccRiderSaving}>
              {categoriaAccRiderSaving ? "Guardando..." : "Guardar categoria"}
            </button>
          </form>
        </article>

        <article className="admin-panel-card admin-category-list-card">
          <div className="admin-card-header">
            <h2>Categorias Indumentaria Rider</h2>
            <span>{categoriasAccRiderMeta.subcategorias.length} registradas</span>
          </div>

          <div className="admin-table">
            {paginatedCategoriasAccRider.items.map((categoria) => (
              <div key={categoria.id} className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
                <div className="admin-entity-name-cell admin-category-name-cell admin-recent-simple-main">
                  <strong>{formatCategoryLabel(categoria.nombre)}</strong>
                </div>
                <div className="admin-row-actions admin-recent-simple-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onCategoriaAccRiderEdit?.(categoria)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onCategoriaAccRiderDelete?.(categoria)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && categoriasAccRiderMeta.subcategorias.length === 0 && (
              <p className="admin-empty">No hay categorias de accesorios rider cargadas.</p>
            )}
          </div>
          <AdminPagination
            pagination={paginatedCategoriasAccRider}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, categoriasAccRider: page }))}
          />
        </article>
      </section>
    );
  }

  if (activeSection === "categorias_acc_motos") {
    const paginatedCategoriasAccMotos = paginateItems(
      categoriasAccMotosMeta.subcategorias,
      tablePages.categoriasAccMotos,
      PAGE_SIZE
    );

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Crear categoria accesorios motos</h2>
            <span>Gestion de categorias de accesorios moto</span>
          </div>

          <form className="admin-moto-form admin-inline-submit-form" onSubmit={onCategoriaAccMotosSubmit} noValidate>
            <label>
              Nombre *
              <input
                name="nombre"
                value={categoriaAccMotosForm.nombre}
                onChange={onCategoriaAccMotosInputChange}
                maxLength={100}
                required
              />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea
                name="descripcion"
                value={categoriaAccMotosForm.descripcion}
                onChange={onCategoriaAccMotosInputChange}
                rows={4}
              />
            </label>

            <label className="admin-form-check">
              <input
                type="checkbox"
                name="activa"
                checked={categoriaAccMotosForm.activa}
                onChange={onCategoriaAccMotosInputChange}
              />
              Activa (opcional)
            </label>

            <button type="submit" className="admin-primary-action" disabled={categoriaAccMotosSaving}>
              {categoriaAccMotosSaving ? "Guardando..." : "Guardar categoria"}
            </button>
          </form>
        </article>

        <article className="admin-panel-card admin-category-list-card">
          <div className="admin-card-header">
            <h2>Categorias Accesorios Motos</h2>
            <span>{categoriasAccMotosMeta.subcategorias.length} registradas</span>
          </div>

          <div className="admin-table">
            {paginatedCategoriasAccMotos.items.map((categoria) => (
              <div key={categoria.id} className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
                <div className="admin-entity-name-cell admin-category-name-cell admin-recent-simple-main">
                  <strong>{formatCategoryLabel(categoria.nombre)}</strong>
                </div>
                <div className="admin-row-actions admin-recent-simple-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onCategoriaAccMotosEdit?.(categoria)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onCategoriaAccMotosDelete?.(categoria)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && categoriasAccMotosMeta.subcategorias.length === 0 && (
              <p className="admin-empty">No hay categorias de accesorios de moto cargadas.</p>
            )}
          </div>
          <AdminPagination
            pagination={paginatedCategoriasAccMotos}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, categoriasAccMotos: page }))}
          />
        </article>
      </section>
    );
  }

  if (activeSection === "accesorios_motos") {
    const paginatedAccesoriosMotos = paginateItems(accesoriosMotosAdmin, tablePages.accesoriosMotos, PAGE_SIZE);

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>{editingAccesorioMotoId ? "Editar accesorio moto" : "Agregar accesorio moto"}</h2>
            <span>Gestion de accesorios moto con o sin vinculo a modelos especificos.</span>
          </div>

          <form className="admin-moto-form" onSubmit={onAccesorioMotoSubmit} noValidate>
            <label>
              Categoria *
              <select
                name="subcategoria"
                value={accesorioMotoForm.subcategoria}
                onChange={onAccesorioMotoInputChange}
                required
              >
                <option value="">Selecciona una categoria</option>
                {categoriasAccMotosMeta.subcategorias.map((subcategoria) => (
                  <option key={subcategoria.id} value={subcategoria.id}>
                    {formatCategoryLabel(subcategoria.nombre)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Marca *
              <select name="marca" value={accesorioMotoForm.marca} onChange={onAccesorioMotoInputChange} required>
                <option value="">Selecciona una marca</option>
                {accesoriosMotosMeta.marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Nombre *
              <input
                name="nombre"
                value={accesorioMotoForm.nombre}
                onChange={onAccesorioMotoInputChange}
                maxLength={150}
                required
              />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea
                name="descripcion"
                value={accesorioMotoForm.descripcion}
                onChange={onAccesorioMotoInputChange}
                rows={4}
              />
            </label>

            <label>
              Precio *
              <input
                type="text"
                name="precio"
                value={formatPrecio(accesorioMotoForm.precio)}
                onChange={onAccesorioMotoPrecioInputChange}
                inputMode="numeric"
                placeholder="Ej: 150000"
                required
              />
            </label>

            <label>
              Stock *
              <input
                type="number"
                name="stock"
                value={accesorioMotoForm.stock}
                onChange={onAccesorioMotoInputChange}
                min="0"
                required
              />
            </label>

            <label className="admin-form-span-2">
              Imagen principal (opcional)
              <input
                key={`acc-moto-image-${accesorioMotoImageInputKey}`}
                type="file"
                name="imagen_principal"
                accept="image/*"
                onChange={onAccesorioMotoInputChange}
              />
              {(accesorioMotoLocalPreview || accesorioMotoImageUrl) && (
                <div className="admin-image-preview-box">
                  <img
                    src={accesorioMotoLocalPreview || accesorioMotoImageUrl}
                    alt="Vista previa accesorio moto"
                    className="admin-image-preview"
                  />
                </div>
              )}
            </label>

            <div className="admin-form-footer">
              <div className="admin-form-footer-checks">
                <label className="admin-form-check admin-form-check-compact">
                  <input type="checkbox" name="es_destacado" checked={accesorioMotoForm.es_destacado} onChange={onAccesorioMotoInputChange} />
                  Marcar como destacado (opcional)
                </label>

                <label className="admin-form-check admin-form-check-compact">
                  <input type="checkbox" name="activo" checked={accesorioMotoForm.activo} onChange={onAccesorioMotoInputChange} />
                  Publicar como activo (opcional)
                </label>

                <label className="admin-form-check admin-form-check-compact">
                  <input
                    type="checkbox"
                    name="requiere_compatibilidad"
                    checked={accesorioMotoForm.requiere_compatibilidad}
                    onChange={onAccesorioMotoInputChange}
                  />
                  Vincular a modelos especificos (opcional)
                </label>
              </div>

              <button type="submit" className="admin-primary-action admin-form-footer-submit" disabled={accesorioMotoSaving}>
                {accesorioMotoSaving ? "Guardando..." : editingAccesorioMotoId ? "Actualizar" : "Guardar"}
              </button>
              {editingAccesorioMotoId && (
                <button type="button" className="admin-page-btn ghost" onClick={onCancelAccesorioMotoEdit}>
                  Cancelar edicion
                </button>
              )}
            </div>

            {accesorioMotoForm.requiere_compatibilidad && (
              <div className="admin-form-span-2 admin-checkbox-list">
                {accesoriosMotosMeta.motos.map((moto) => (
                  <label key={moto.id} className="admin-form-check">
                    <input
                      type="checkbox"
                      checked={accesorioMotoForm.compatibilidad_motos.includes(moto.id)}
                      onChange={() => onToggleCompatibilidad(moto.id)}
                    />
                    {moto.modelo || moto.nombre}
                  </label>
                ))}
              </div>
            )}

          </form>
        </article>

        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Accesorios Motos</h2>
            <span>{accesoriosMotosAdmin.length} registrados</span>
          </div>

          <div className="admin-table">
            {paginatedAccesoriosMotos.items.map((producto) => (
              <div key={producto.id} className="admin-table-row admin-table-row-product-actions admin-recent-product-row">
                <div className="admin-recent-product-main">
                  <strong>{producto.nombre}</strong>
                  <span>{formatCategoryLabel(producto.subcategoria_nombre)}</span>
                </div>
                <div className="admin-product-price-cell admin-recent-product-meta">
                  <strong>
                    {producto.precio ? `$${Number(producto.precio).toLocaleString("es-CL")}` : "Sin precio"}
                  </strong>
                  <span>{producto.activo ? "Activo" : "Inactivo"}</span>
                </div>
                <div className="admin-row-actions admin-recent-product-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onAccesorioMotoEdit?.(producto)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onAccesorioMotoDelete?.(producto)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && accesoriosMotosAdmin.length === 0 && (
              <p className="admin-empty">No hay accesorios de moto cargados.</p>
            )}
          </div>
          <AdminPagination
            pagination={paginatedAccesoriosMotos}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, accesoriosMotos: page }))}
          />
        </article>
      </section>
    );
  }

  if (activeSection === "accesorios_rider") {
    const paginatedAccesoriosRider = paginateItems(
      accesoriosRiderAdmin,
      tablePages.accesoriosRider,
      ACCESORIOS_RIDER_PAGE_SIZE
    );

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Agregar accesorio rider</h2>
            <span>Gestion de productos para uso del piloto.</span>
          </div>

          <form className="admin-moto-form" onSubmit={onAccesorioRiderSubmit} noValidate>
            <label>
              Categoria *
              <select
                name="subcategoria"
                value={accesorioRiderForm.subcategoria}
                onChange={onAccesorioRiderInputChange}
                required
              >
                <option value="">Selecciona una categoria</option>
                {accesoriosRiderMeta.subcategorias.map((subcategoria) => (
                  <option key={subcategoria.id} value={subcategoria.id}>
                    {formatCategoryLabel(subcategoria.nombre)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Marca *
              <select name="marca" value={accesorioRiderForm.marca} onChange={onAccesorioRiderInputChange} required>
                <option value="">Selecciona una marca</option>
                {accesoriosRiderMeta.marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Nombre *
              <input
                name="nombre"
                value={accesorioRiderForm.nombre}
                onChange={onAccesorioRiderInputChange}
                maxLength={150}
                required
              />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea
                name="descripcion"
                value={accesorioRiderForm.descripcion}
                onChange={onAccesorioRiderInputChange}
                rows={4}
              />
            </label>

            <label>
              Precio *
              <input
                type="text"
                name="precio"
                value={formatPrecio(accesorioRiderForm.precio)}
                onChange={onAccesorioRiderPrecioInputChange}
                inputMode="numeric"
                placeholder="Ej: 150000"
                required
              />
            </label>

            <label>
              Stock *
              <input
                type="number"
                name="stock"
                value={accesorioRiderForm.stock}
                onChange={onAccesorioRiderInputChange}
                min="0"
                required
              />
            </label>

            <label className="admin-form-span-2">
              Imagen principal (opcional)
              <input
                key={`acc-rider-image-${accesorioRiderImageInputKey}`}
                type="file"
                name="imagen_principal"
                accept="image/*"
                onChange={onAccesorioRiderInputChange}
              />
              {(accesorioRiderLocalPreview || accesorioRiderImageUrl) && (
                <div className="admin-image-preview-box">
                  <img
                    src={accesorioRiderLocalPreview || accesorioRiderImageUrl}
                    alt="Vista previa accesorio rider"
                    className="admin-image-preview"
                  />
                </div>
              )}
            </label>

            <div className="admin-form-footer">
              <div className="admin-form-footer-checks">
                <label className="admin-form-check admin-form-check-compact">
                  <input type="checkbox" name="es_destacado" checked={accesorioRiderForm.es_destacado} onChange={onAccesorioRiderInputChange} />
                  Marcar como destacado (opcional)
                </label>

                <label className="admin-form-check admin-form-check-compact">
                  <input type="checkbox" name="activo" checked={accesorioRiderForm.activo} onChange={onAccesorioRiderInputChange} />
                  Publicar como activo (opcional)
                </label>
              </div>

              <button type="submit" className="admin-primary-action admin-form-footer-submit" disabled={accesorioRiderSaving}>
                {accesorioRiderSaving ? "Guardando..." : "Guardar accesorio rider"}
              </button>
            </div>
          </form>
        </article>

        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Accesorios Rider</h2>
            <span>{accesoriosRiderAdmin.length} registrados</span>
          </div>

          <div className="admin-table">
            {paginatedAccesoriosRider.items.map((producto) => (
              <div key={producto.id} className="admin-table-row admin-table-row-product-actions admin-recent-product-row">
                <div className="admin-recent-product-main">
                  <strong>{producto.nombre}</strong>
                  <span>{formatCategoryLabel(producto.subcategoria_nombre)}</span>
                </div>
                <div className="admin-product-price-cell admin-recent-product-meta">
                  <strong>
                    {producto.precio ? `$${Number(producto.precio).toLocaleString("es-CL")}` : "Sin precio"}
                  </strong>
                  <span>{producto.activo ? "Activo" : "Inactivo"}</span>
                </div>
                <div className="admin-row-actions admin-recent-product-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onAccesorioRiderEdit?.(producto)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onAccesorioRiderDelete?.(producto)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && accesoriosRiderAdmin.length === 0 && (
              <p className="admin-empty">No hay accesorios rider cargados.</p>
            )}
          </div>
          <AdminPagination
            pagination={paginatedAccesoriosRider}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, accesoriosRider: page }))}
          />
        </article>
      </section>
    );
  }

  return null;
}
