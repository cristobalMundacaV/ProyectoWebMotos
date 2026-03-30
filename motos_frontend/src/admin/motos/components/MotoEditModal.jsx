import { useMemo, useRef } from "react";
import AdminYearDropdown from "../../shared/components/AdminYearDropdown";
import "../../../styles/catalogo-motos.css";

export default function MotoEditModal({
  motoEditModal,
  motoEditSaving,
  motoEditError,
  motoMeta,
  motoEditModelosFiltrados,
  motoYearOptions,
  formatPrecioDisplay,
  fallbackImage,
  onClose,
  onSubmit,
  onInputChange,
  onPrecioInputChange,
  onPrecioListaInputChange,
  onPrecioConMaletasInputChange,
  onPrecioListaConMaletasInputChange,
}) {
  const yearLabel = `A${String.fromCharCode(241)}o *`;
  const yearPlaceholder = `Selecciona un A${String.fromCharCode(241)}o`;
  const editFileInputRef = useRef(null);
  const editMaletasFileInputRef = useRef(null);

  const selectedModel = useMemo(
    () =>
      motoMeta.modelos.find(
        (modelo) =>
          String(modelo.id) === String(motoEditModal?.form?.modelo || "") &&
          String(modelo.marca) === String(motoEditModal?.form?.marca || "")
      ),
    [motoMeta.modelos, motoEditModal?.form?.marca, motoEditModal?.form?.modelo]
  );
  const categoriaSeleccionada = String(selectedModel?.categoria ?? selectedModel?.categoria_id ?? "");

  const hasGalleryImages =
    Array.isArray(motoEditModal?.form?.imagenes_galeria) && motoEditModal.form.imagenes_galeria.length > 0;
  const hasMainImage = Boolean(motoEditModal?.imagePreviewUrl);
  const hasMaletasImage = Boolean(motoEditModal?.imageMaletasPreviewUrl);
  const visibleDetailCount = Number(hasMainImage) + Number(hasMaletasImage);

  if (!motoEditModal) return null;

  return (
    <div className="moto-edit-modal-overlay" onClick={onClose}>
      <section className="moto-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="moto-edit-header">
          <div>
            <p className="moto-edit-kicker">Edicion de moto</p>
            <h3>{motoEditModal.modelName || "Editar moto"}</h3>
          </div>
          <button type="button" className="moto-edit-close" onClick={onClose} disabled={motoEditSaving}>
            Cerrar
          </button>
        </div>

        <form className="moto-edit-form" onSubmit={onSubmit} noValidate>
          <label>
            Marca *
            <select name="marca" value={motoEditModal.form.marca} onChange={onInputChange} required>
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
            <select name="categoria" value={categoriaSeleccionada} onChange={onInputChange} required disabled>
              <option value="">Selecciona una categoria</option>
              {motoMeta.categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Modelo *
            <select
              name="modelo"
              value={motoEditModal.form.modelo}
              onChange={onInputChange}
              required
              disabled={!motoEditModal.form.marca}
            >
              <option value="">
                {motoEditModal.form.marca ? "Selecciona un modelo" : "Selecciona una marca primero"}
              </option>
              {motoEditModelosFiltrados.map((modelo) => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            {yearLabel}
            <AdminYearDropdown
              name="anio"
              value={motoEditModal.form.anio}
              onChange={onInputChange}
              options={motoYearOptions}
              placeholder={yearPlaceholder}
              required
            />
          </label>

          <label className="moto-edit-span-2">
            Descripcion
            <textarea name="descripcion" value={motoEditModal.form.descripcion} onChange={onInputChange} rows={4} />
          </label>

          <label>
            Precio *
            <input
              name="precio"
              inputMode="numeric"
              value={formatPrecioDisplay(motoEditModal.form.precio)}
              onChange={onPrecioInputChange}
              required
            />
          </label>

          <label>
            Precio de lista *
            <input
              name="precio_lista"
              inputMode="numeric"
              value={formatPrecioDisplay(motoEditModal.form.precio_lista)}
              onChange={onPrecioListaInputChange}
              required
            />
          </label>

          <label className="moto-edit-span-2">
            Imagenes
            <div className="moto-edit-file-picker">
              <input
                ref={editFileInputRef}
                key={`moto-edit-images-${motoEditModal.imageInputKey}`}
                className="moto-edit-file-hidden"
                type="file"
                name="imagenes_galeria"
                accept="image/*"
                multiple
                onChange={onInputChange}
              />
              <button type="button" className="moto-edit-file-btn" onClick={() => editFileInputRef.current?.click()}>
                Examinar...
              </button>
              <span className="moto-edit-file-name">
                {hasGalleryImages
                  ? `${motoEditModal.form.imagenes_galeria.length} archivos seleccionados.`
                  : "No se ha seleccionado ningun archivo."}
              </span>
            </div>
            <p className="moto-edit-gallery-help">
              Las imagenes seleccionadas se agregaran a la galeria actual.
            </p>
          </label>

          {(hasMainImage || hasMaletasImage) && (
            <div className="moto-edit-span-2 moto-edit-gallery-manager">
              <div className="moto-edit-gallery-header">
                <p>Imagenes visibles en el detalle publico</p>
                <span>
                  {visibleDetailCount} visibles en detalle.
                  {hasMainImage ? " La unica imagen se tratara como principal." : ""}
                </span>
              </div>

              <div className="moto-edit-visible-grid">
                {hasMainImage && (
                  <article className="moto-edit-visible-card">
                    <span className="moto-edit-visible-badge">Imagen principal</span>
                    <img
                      src={motoEditModal.imagePreviewUrl || fallbackImage}
                      alt={`${motoEditModal.modelName || "Moto"} principal`}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                    <div className="moto-edit-gallery-status">Se mostrara en el detalle publico</div>
                  </article>
                )}
                {hasMaletasImage && (
                  <article className="moto-edit-visible-card">
                    <span className="moto-edit-visible-badge">Imagen con maletas</span>
                    <img
                      src={motoEditModal.imageMaletasPreviewUrl}
                      alt={`${motoEditModal.modelName || "Moto"} con maletas`}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                    <div className="moto-edit-gallery-status">Se mostrara en el detalle publico</div>
                  </article>
                )}
              </div>
            </div>
          )}

          <label className="moto-edit-span-2">
            Video de presentacion (opcional)
            <input
              type="url"
              name="video_presentacion"
              value={motoEditModal.form.video_presentacion || ""}
              onChange={onInputChange}
              placeholder="https://..."
            />
          </label>

          <div className="moto-edit-checks-row moto-edit-span-2">
            <label className="moto-edit-check">
              <input
                type="checkbox"
                name="permite_variante_maletas"
                checked={Boolean(motoEditModal.form.permite_variante_maletas)}
                onChange={onInputChange}
              />
              Variante con maletas
            </label>

            <label className="moto-edit-check">
              <input type="checkbox" name="es_destacada" checked={motoEditModal.form.es_destacada} onChange={onInputChange} />
              Destacada
            </label>

            <label className="moto-edit-check">
              <input type="checkbox" name="activa" checked={motoEditModal.form.activa} onChange={onInputChange} />
              Activa
            </label>
          </div>

          {motoEditModal.form.es_destacada && (
            <label className="moto-edit-span-2">
              Orden carrusel *
              <input
                type="number"
                name="orden_carrusel"
                value={motoEditModal.form.orden_carrusel}
                onChange={onInputChange}
                min={1}
                required={Boolean(motoEditModal.form.es_destacada)}
              />
            </label>
          )}

          {motoEditModal.form.permite_variante_maletas && (
            <label>
              Precio con maletas *
              <input
                name="precio_con_maletas"
                inputMode="numeric"
                value={formatPrecioDisplay(motoEditModal.form.precio_con_maletas)}
                onChange={onPrecioConMaletasInputChange}
                required={Boolean(motoEditModal.form.permite_variante_maletas)}
                disabled={!motoEditModal.form.permite_variante_maletas}
              />
            </label>
          )}

          {motoEditModal.form.permite_variante_maletas && (
            <label>
              Precio lista con maletas *
              <input
                name="precio_lista_con_maletas"
                inputMode="numeric"
                value={formatPrecioDisplay(motoEditModal.form.precio_lista_con_maletas)}
                onChange={onPrecioListaConMaletasInputChange}
                required={Boolean(motoEditModal.form.permite_variante_maletas)}
                disabled={!motoEditModal.form.permite_variante_maletas}
              />
            </label>
          )}

          {motoEditModal.form.permite_variante_maletas && (
            <label className="moto-edit-span-2">
              Imagen con maletas *
              <div className="moto-edit-file-picker">
                <input
                  ref={editMaletasFileInputRef}
                  key={`moto-edit-image-maletas-${motoEditModal.imageInputKey}`}
                  className="moto-edit-file-hidden"
                  type="file"
                  name="imagen_con_maletas"
                  accept="image/*"
                  onChange={onInputChange}
                  required={Boolean(motoEditModal.form.permite_variante_maletas)}
                  disabled={!motoEditModal.form.permite_variante_maletas}
                />
                <button
                  type="button"
                  className="moto-edit-file-btn"
                  onClick={() => editMaletasFileInputRef.current?.click()}
                  disabled={!motoEditModal.form.permite_variante_maletas}
                >
                  Examinar...
                </button>
                <span className="moto-edit-file-name">
                  {motoEditModal.imageMaletasFileName || "No se ha seleccionado ningun archivo."}
                </span>
              </div>
            </label>
          )}

          {motoEditError && <p className="moto-edit-error">{motoEditError}</p>}

          <div className="moto-edit-actions moto-edit-span-2">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={motoEditSaving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={motoEditSaving}>
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
