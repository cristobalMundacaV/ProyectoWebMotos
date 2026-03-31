import { useEffect, useMemo, useRef, useState } from "react";
import AdminPagination, { paginateItems } from "../../shared/components/AdminPagination";
import AdminYearDropdown from "../../shared/components/AdminYearDropdown";
import AdminDeleteConfirmModal from "../../shared/components/AdminDeleteConfirmModal";
import { MOTO_YEAR_RANGE } from "../constants/motoYearRange";

export default function MotosPage({
  activeSection,
  loading,
  dashboard,
  activeMarcaConfig,
  marcasMotosAdmin,
  marcasAccMotosAdmin,
  marcasAccRiderAdmin,
  marcaForm,
  marcaSaving,
  onMarcaInputChange,
  onMarcaSubmit,
  onMarcaEdit,
  onMarcaDelete,
  modelosMotosAdmin,
  modeloMotoForm,
  modeloMotoSaving,
  onModeloMotoInputChange,
  onModeloMotoSubmit,
  onModeloMotoEdit,
  onModeloMotoDelete,
  motoForm,
  motoSaving,
  motoMeta,
  motoImageInputKey,
  onMotoInputChange,
  onMotoPrecioInputChange,
  onMotoPrecioListaInputChange,
  onMotoPrecioConMaletasInputChange,
  onMotoPrecioListaConMaletasInputChange,
  onMotoSubmit,
  onMotoEdit,
  onMotoDelete,
  motoDeleteModal,
  motoDeleteSaving,
  onCloseMotoDeleteModal,
  onConfirmMotoDelete,
  categoriasMoto,
  categoriaMotoForm,
  categoriaMotoSaving,
  onCategoriaMotoInputChange,
  onCategoriaMotoSubmit,
  onCategoriaMotoEdit,
  onCategoriaMotoDelete,
}) {
  const PAGE_SIZE = 10;
  const MODELOS_PAGE_SIZE = 6;
  const RECENT_MOTOS_PAGE_SIZE = 7;
  const currentYear = new Date().getFullYear();
  const MIN_MOTO_YEAR = currentYear - MOTO_YEAR_RANGE;
  const yearLabel = `A${String.fromCharCode(241)}o *`;
  const yearPlaceholder = `Selecciona un A${String.fromCharCode(241)}o`;
  const motoYearOptions = Array.from(
    { length: currentYear - MIN_MOTO_YEAR + 1 },
    (_, index) => String(currentYear - index)
  );
  const [tablePages, setTablePages] = useState({
    marcas: 1,
    modelosMoto: 1,
    categoriasMoto: 1,
    motos: 1,
  });

  useEffect(() => {
    setTablePages({
      marcas: 1,
      modelosMoto: 1,
      categoriasMoto: 1,
      motos: 1,
    });
  }, [activeSection]);

  function formatPrecio(value) {
    if (value === null || value === undefined || value === "") return "";

    const texto = String(value);
    const [entero = "", decimal = ""] = texto.split(".");
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return decimal ? `$ ${enteroConPuntos},${decimal}` : `$ ${enteroConPuntos}`;
  }

  function formatCategoryLabel(value) {
    const clean = String(value || "")
      .trim()
      .replace(/\s+/g, " ");
    if (!clean) return "-";
    return clean
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const motoGaleriaPreviewUrls = useMemo(() => {
    const files = Array.isArray(motoForm.imagenes_galeria) ? motoForm.imagenes_galeria : [];
    return files.slice(0, 3).map((file) => URL.createObjectURL(file));
  }, [motoForm.imagenes_galeria]);

  useEffect(() => {
    return () => {
      motoGaleriaPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [motoGaleriaPreviewUrls]);
  const motoFileInputRef = useRef(null);
  const motoMaletasFileInputRef = useRef(null);
  const hasNewMotoImages = Array.isArray(motoForm.imagenes_galeria) && motoForm.imagenes_galeria.length > 0;
  const hasNewMotoMaletasImage = motoForm.imagen_con_maletas instanceof File;

  if (activeSection === "marcas_motos" || activeSection === "marcas_acc_motos" || activeSection === "marcas_acc_rider") {
    const marcas =
      activeSection === "marcas_motos"
        ? marcasMotosAdmin
        : activeSection === "marcas_acc_motos"
          ? marcasAccMotosAdmin
          : marcasAccRiderAdmin;

    const paginatedMarcas = paginateItems(marcas, tablePages.marcas, PAGE_SIZE);

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Crear marca</h2>
          </div>

          <form className="admin-moto-form admin-inline-submit-form" onSubmit={onMarcaSubmit} noValidate>
            <label>
              Nombre *
              <input name="nombre" value={marcaForm.nombre} onChange={onMarcaInputChange} maxLength={100} required />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea name="descripcion" value={marcaForm.descripcion} onChange={onMarcaInputChange} rows={4} />
            </label>

            <label className="admin-form-check">
              <input type="checkbox" name="activa" checked={marcaForm.activa} onChange={onMarcaInputChange} />
              Activa (opcional)
            </label>

            <button type="submit" className="admin-primary-action" disabled={marcaSaving}>
              {"Guardar marca"}
            </button>
          </form>
        </article>

        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>{activeMarcaConfig.titulo}</h2>
            <span>{marcas.length} registradas</span>
          </div>

          <div className="admin-table">
            {paginatedMarcas.items.map((marca) => (
              <div key={marca.id} className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
                <div className="admin-entity-name-cell admin-category-name-cell admin-recent-simple-main">
                  <strong>{marca.nombre}</strong>
                </div>
                <div className="admin-row-actions admin-recent-simple-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onMarcaEdit?.(marca)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onMarcaDelete?.(marca)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && marcas.length === 0 && <p className="admin-empty">No hay marcas registradas en el sistema.</p>}
          </div>
          <AdminPagination
            pagination={paginatedMarcas}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, marcas: page }))}
          />
        </article>
      </section>
    );
  }

  if (activeSection === "categoria_motos") {
    const paginatedCategoriasMoto = paginateItems(categoriasMoto, tablePages.categoriasMoto, PAGE_SIZE);

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Crear categoria de motos</h2>
          </div>

          <form className="admin-moto-form admin-inline-submit-form" onSubmit={onCategoriaMotoSubmit} noValidate>
            <label>
              Nombre *
              <input
                name="nombre"
                value={categoriaMotoForm.nombre}
                onChange={onCategoriaMotoInputChange}
                maxLength={100}
                required
              />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea
                name="descripcion"
                value={categoriaMotoForm.descripcion}
                onChange={onCategoriaMotoInputChange}
                rows={4}
              />
            </label>

            <label className="admin-form-check">
              <input
                type="checkbox"
                name="activa"
                checked={categoriaMotoForm.activa}
                onChange={onCategoriaMotoInputChange}
              />
              Activa (opcional)
            </label>

            <button type="submit" className="admin-primary-action" disabled={categoriaMotoSaving}>
              {"Guardar categoria"}
            </button>
          </form>
        </article>

        <article className="admin-panel-card admin-category-list-card">
          <div className="admin-card-header">
            <h2>Categorias creadas</h2>
            <span>{categoriasMoto.length} registradas</span>
          </div>

          <div className="admin-table">
            {paginatedCategoriasMoto.items.map((categoria) => (
              <div key={categoria.id} className="admin-table-row admin-table-row-two-cols admin-recent-simple-row">
                <div className="admin-entity-name-cell admin-category-name-cell admin-recent-simple-main">
                  <strong>{formatCategoryLabel(categoria.nombre)}</strong>
                </div>
                <div className="admin-row-actions admin-recent-simple-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onCategoriaMotoEdit?.(categoria)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onCategoriaMotoDelete?.(categoria)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && categoriasMoto.length === 0 && (
              <p className="admin-empty">No hay categorias de motos cargadas.</p>
            )}
          </div>
          <AdminPagination
            pagination={paginatedCategoriasMoto}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, categoriasMoto: page }))}
          />
        </article>
      </section>
    );
  }

  if (activeSection === "modelos_motos") {
    const paginatedModelosMoto = paginateItems(modelosMotosAdmin, tablePages.modelosMoto, MODELOS_PAGE_SIZE);

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Crear modelo de moto</h2>
          </div>

          <form className="admin-moto-form admin-inline-submit-form" onSubmit={onModeloMotoSubmit} noValidate>
            <label>
              Marca *
              <select name="marca" value={modeloMotoForm.marca} onChange={onModeloMotoInputChange} required>
                <option value="">Selecciona una marca</option>
                {motoMeta.marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Categoria *
              <select name="categoria" value={modeloMotoForm.categoria} onChange={onModeloMotoInputChange} required>
                <option value="">Selecciona una categoria</option>
                {motoMeta.categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {formatCategoryLabel(categoria.nombre)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Nombre del modelo *
              <input
                name="nombre"
                value={modeloMotoForm.nombre}
                onChange={onModeloMotoInputChange}
                maxLength={150}
                required
              />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea
                name="descripcion"
                value={modeloMotoForm.descripcion}
                onChange={onModeloMotoInputChange}
                rows={4}
              />
            </label>

            <label className="admin-form-check">
              <input type="checkbox" name="activo" checked={modeloMotoForm.activo} onChange={onModeloMotoInputChange} />
              Activo (opcional)
            </label>

            <button type="submit" className="admin-primary-action" disabled={modeloMotoSaving}>
              {"Guardar modelo"}
            </button>
          </form>
        </article>

        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Modelos creados</h2>
            <span>{modelosMotosAdmin.length} registrados</span>
          </div>

          <div className="admin-table">
            {paginatedModelosMoto.items.map((modelo) => (
              <div key={modelo.id} className="admin-table-row admin-table-row-two-cols admin-recent-model-row">
                <div className="admin-model-brand-cell admin-recent-model-main">
                  <span className="admin-row-label">Marca</span>
                  <strong>{modelo.marca_nombre || "-"}</strong>
                  <span>{formatCategoryLabel(modelo.categoria_nombre) || "-"}</span>
                </div>
                <div className="admin-model-name-center">
                  <span className="admin-row-label">Nombre modelo</span>
                  <strong>{modelo.nombre}</strong>
                </div>
                <div className="admin-row-actions admin-recent-model-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onModeloMotoEdit?.(modelo)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onModeloMotoDelete?.(modelo)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
            {!loading && modelosMotosAdmin.length === 0 && (
              <p className="admin-empty">No hay modelos de motos cargados.</p>
            )}
          </div>
          <AdminPagination
            pagination={paginatedModelosMoto}
            onPageChange={(page) => setTablePages((prev) => ({ ...prev, modelosMoto: page }))}
          />
        </article>
      </section>
    );
  }

  if (activeSection === "motos") {
    const paginatedMotos = paginateItems(dashboard.motos, tablePages.motos, RECENT_MOTOS_PAGE_SIZE);
    const modelosFiltrados = motoMeta.modelos.filter((modelo) => String(modelo.marca) === String(motoForm.marca));

    return (
      <>
        <section className="admin-content-grid lower">
          <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Agregar moto</h2>
          </div>

          <form className="admin-moto-form" onSubmit={onMotoSubmit} noValidate>
            <label>
              Marca *
              <select name="marca" value={motoForm.marca} onChange={onMotoInputChange} required>
                <option value="">Selecciona una marca</option>
                {motoMeta.marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Modelo *
              <select
                name="modelo"
                value={motoForm.modelo}
                onChange={onMotoInputChange}
                required
                disabled={!motoForm.marca}
              >
                <option value="">
                  {motoForm.marca ? "Selecciona un modelo" : "Selecciona una marca primero"}
                </option>
                {modelosFiltrados.map((modelo) => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea name="descripcion" value={motoForm.descripcion} onChange={onMotoInputChange} rows={4} />
            </label>

            <label>
              Video de presentacion (opcional)
              <input
                type="url"
                name="video_presentacion"
                value={motoForm.video_presentacion || ""}
                placeholder="https://..."
                onChange={onMotoInputChange}
              />
            </label>

            <label>
              {yearLabel}
              <AdminYearDropdown
                name="anio"
                value={motoForm.anio}
                onChange={onMotoInputChange}
                options={motoYearOptions}
                placeholder={yearPlaceholder}
                required
              />
            </label>

            <label>
              Precio *
              <input
                type="text"
                name="precio"
                value={formatPrecio(motoForm.precio)}
                onChange={onMotoPrecioInputChange}
                inputMode="decimal"
                placeholder="Ej: 5.000.000"
                required
              />
            </label>

            <label>
              Precio de lista *
              <input
                type="text"
                name="precio_lista"
                value={formatPrecio(motoForm.precio_lista)}
                onChange={onMotoPrecioListaInputChange}
                inputMode="decimal"
                placeholder="Ej: 10.690.000"
                required
              />
            </label>

            <label className="admin-form-span-2">
              Imagenes
              <div className="admin-edit-file-picker">
                <input
                  ref={motoFileInputRef}
                  key={`moto-images-${motoImageInputKey}`}
                  className="admin-edit-file-hidden"
                  type="file"
                  name="imagenes_galeria"
                  accept="image/*"
                  multiple
                  onChange={onMotoInputChange}
                />
                <button
                  type="button"
                  className="admin-edit-file-btn"
                  onClick={() => motoFileInputRef.current?.click()}
                >
                  Examinar...
                </button>
                <span className="admin-edit-file-name">
                  {hasNewMotoImages
                    ? `${motoForm.imagenes_galeria.length} archivos seleccionados.`
                    : "No se han seleccionado archivos nuevos."}
                </span>
              </div>
              {motoGaleriaPreviewUrls.length > 0 && (
                <div className="admin-gallery-preview-row">
                  {motoGaleriaPreviewUrls.map((previewUrl, index) => (
                    <img key={`${previewUrl}-${index}`} src={previewUrl} alt={`Vista previa moto ${index + 1}`} />
                  ))}
                </div>
              )}
            </label>

            {motoForm.es_destacada && (
              <label className="admin-form-span-2">
                Orden carrusel *
                <input
                  type="number"
                  name="orden_carrusel"
                  value={motoForm.orden_carrusel}
                  onChange={onMotoInputChange}
                  min="1"
                  required={Boolean(motoForm.es_destacada)}
                />
              </label>
            )}

            {motoForm.permite_variante_maletas && (
              <label>
                Precio con maletas *
                <input
                  type="text"
                  name="precio_con_maletas"
                  value={formatPrecio(motoForm.precio_con_maletas)}
                  onChange={onMotoPrecioConMaletasInputChange}
                  inputMode="decimal"
                  placeholder="Ej: 7.990.000"
                  required={Boolean(motoForm.permite_variante_maletas)}
                  disabled={!motoForm.permite_variante_maletas}
                />
              </label>
            )}

            {motoForm.permite_variante_maletas && (
              <label>
                Precio de lista con maletas *
                <input
                  type="text"
                  name="precio_lista_con_maletas"
                  value={formatPrecio(motoForm.precio_lista_con_maletas)}
                  onChange={onMotoPrecioListaConMaletasInputChange}
                  inputMode="decimal"
                  placeholder="Ej: 11.990.000"
                  required={Boolean(motoForm.permite_variante_maletas)}
                  disabled={!motoForm.permite_variante_maletas}
                />
              </label>
            )}

            {motoForm.permite_variante_maletas && (
              <label className="admin-form-span-2">
                Imagen con maletas *
                <div className="admin-edit-file-picker">
                  <input
                    ref={motoMaletasFileInputRef}
                    key={`moto-maletas-image-${motoImageInputKey}`}
                    className="admin-edit-file-hidden"
                    type="file"
                    name="imagen_con_maletas"
                    accept="image/*"
                    onChange={onMotoInputChange}
                    required={Boolean(motoForm.permite_variante_maletas)}
                    disabled={!motoForm.permite_variante_maletas}
                  />
                  <button
                    type="button"
                    className="admin-edit-file-btn"
                    onClick={() => motoMaletasFileInputRef.current?.click()}
                    disabled={!motoForm.permite_variante_maletas}
                  >
                    Examinar...
                  </button>
                  <span className="admin-edit-file-name">
                    {hasNewMotoMaletasImage ? motoForm.imagen_con_maletas.name : "No se ha seleccionado archivo nuevo."}
                  </span>
                </div>
              </label>
            )}

            <div className="admin-form-footer">
              <div className="admin-form-footer-checks admin-moto-footer-checks">
                <label className="admin-form-check admin-form-check-compact">
                  <input
                    type="checkbox"
                    name="permite_variante_maletas"
                    checked={Boolean(motoForm.permite_variante_maletas)}
                    onChange={onMotoInputChange}
                  />
                  Variante con maletas
                </label>

                <label className="admin-form-check admin-form-check-compact">
                  <input type="checkbox" name="es_destacada" checked={motoForm.es_destacada} onChange={onMotoInputChange} />
                  Marcar como destacada
                </label>

                <label className="admin-form-check admin-form-check-compact">
                  <input type="checkbox" name="activa" checked={motoForm.activa} onChange={onMotoInputChange} />
                  Publicar como activa
                </label>
              </div>

              <button type="submit" className="admin-primary-action admin-form-footer-submit" disabled={motoSaving}>
                {"Guardar moto"}
              </button>
            </div>
          </form>
          </article>

          <article className="admin-panel-card">
            <div className="admin-card-header">
              <h2>Motos registradas</h2>
              <span>{dashboard.motos.length} registradas</span>
            </div>
            <div className="admin-table">
              {paginatedMotos.items.map((moto) => (
                <div key={moto.id} className="admin-table-row admin-moto-table-row admin-moto-table-row-actions admin-recent-moto-row">
                  <div className="admin-moto-table-cell admin-recent-moto-main">
                    <span className="admin-row-label">Nombre Modelo</span>
                    <strong>{moto.modelo}</strong>
                    <span>{moto.marca_nombre || "Sin marca"}</span>
                  </div>
                  <div className="admin-moto-table-cell admin-recent-moto-meta">
                    <span className="admin-row-label">Tipo</span>
                    <strong>{formatCategoryLabel(moto.categoria_nombre)}</strong>
                    <span>{moto.es_destacada ? `${moto.anio} | Orden: ${moto.orden_carrusel ?? 1}` : moto.anio}</span>
                    <span>{moto.permite_variante_maletas ? "Variante: con/sin maletas" : "Variante: no aplica"}</span>
                  </div>
                  <div className="admin-row-actions admin-recent-moto-actions">
                    <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => onMotoEdit?.(moto)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => onMotoDelete?.(moto)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
              {!loading && dashboard.motos.length === 0 && <p className="admin-empty">No hay motos cargadas.</p>}
            </div>
            <AdminPagination
              pagination={paginatedMotos}
              onPageChange={(page) => setTablePages((prev) => ({ ...prev, motos: page }))}
            />
          </article>
        </section>

        <AdminDeleteConfirmModal
          isOpen={Boolean(motoDeleteModal)}
          isSaving={motoDeleteSaving}
          title="Confirmar eliminacion"
          message={`Estas seguro que quieres eliminar la moto ${motoDeleteModal?.modelo || ""}?`}
          confirmLabel="Eliminar"
          onClose={onCloseMotoDeleteModal}
          onConfirm={onConfirmMotoDelete}
        />
      </>
    );
  }

  return null;
}



