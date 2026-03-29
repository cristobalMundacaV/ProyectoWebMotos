import AdminYearDropdown from "../../shared/components/AdminYearDropdown";

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
  if (!motoEditModal) return null;

  return (
    <div className="admin-entity-modal-overlay" onClick={onClose}>
      <section className="admin-entity-modal admin-moto-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-entity-modal-header">
          <div>
            <p className="admin-entity-modal-kicker">Edicion de moto</p>
            <h3>{motoEditModal.modelName || "Editar moto"}</h3>
          </div>
          <button type="button" onClick={onClose} disabled={motoEditSaving}>
            Cerrar
          </button>
        </div>

        <form className="admin-moto-form admin-moto-edit-modal-form" onSubmit={onSubmit} noValidate>
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

          <label className="admin-form-span-2">
            Descripcion *
            <textarea
              name="descripcion"
              value={motoEditModal.form.descripcion}
              onChange={onInputChange}
              rows={4}
              required
            />
          </label>

          <label className="admin-form-span-2">
            Video de presentacion (opcional)
            <input
              type="url"
              name="video_presentacion"
              value={motoEditModal.form.video_presentacion || ""}
              onChange={onInputChange}
              placeholder="https://..."
            />
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

          <label className="admin-form-check admin-form-span-2">
            <input
              type="checkbox"
              name="permite_variante_maletas"
              checked={Boolean(motoEditModal.form.permite_variante_maletas)}
              onChange={onInputChange}
            />
            Habilitar variante con maletas
          </label>

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

          <label>
            {"A\u00f1o *"}
            <AdminYearDropdown
              name="anio"
              value={motoEditModal.form.anio}
              onChange={onInputChange}
              options={motoYearOptions}
              placeholder="Selecciona un a\u00f1o"
              required
            />
          </label>

          <label className="admin-form-span-2">
            Imagen principal
            <input
              key={`moto-edit-images-${motoEditModal.imageInputKey}`}
              type="file"
              name="imagen_principal"
              accept="image/*"
              onChange={onInputChange}
            />
            {motoEditModal.imageFileName && (
              <span className="admin-selected-file-name">{motoEditModal.imageFileName}</span>
            )}
          </label>

          {motoEditModal.form.es_destacada && (
            <label>
              Orden en carrusel *
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
            <label className="admin-form-span-2">
              Imagen con maletas *
              <input
                key={`moto-edit-image-maletas-${motoEditModal.imageInputKey}`}
                type="file"
                name="imagen_con_maletas"
                accept="image/*"
                onChange={onInputChange}
                required={Boolean(motoEditModal.form.permite_variante_maletas)}
                disabled={!motoEditModal.form.permite_variante_maletas}
              />
              {motoEditModal.imageMaletasFileName && (
                <span className="admin-selected-file-name">{motoEditModal.imageMaletasFileName}</span>
              )}
            </label>
          )}

          {(motoEditModal.imagePreviewUrl || motoEditModal.imageMaletasPreviewUrl) && (
            <div className="admin-form-span-2 admin-moto-edit-preview-grid">
              {motoEditModal.imagePreviewUrl && (
                <div className="admin-image-preview-box admin-moto-edit-preview">
                  <img
                    src={motoEditModal.imagePreviewUrl}
                    alt={`${motoEditModal.modelName || "Moto"} principal`}
                    className="admin-image-preview"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
              )}
              {motoEditModal.imageMaletasPreviewUrl && (
                <div className="admin-image-preview-box admin-moto-edit-preview">
                  <img
                    src={motoEditModal.imageMaletasPreviewUrl}
                    alt={`${motoEditModal.modelName || "Moto"} con maletas`}
                    className="admin-image-preview"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {motoEditError && <p className="admin-entity-modal-error">{motoEditError}</p>}

          <div className="admin-form-footer">
            <div className="admin-form-footer-checks">
              <label className="admin-form-check admin-form-check-compact">
                <input
                  type="checkbox"
                  name="es_destacada"
                  checked={motoEditModal.form.es_destacada}
                  onChange={onInputChange}
                />
                Destacada
              </label>
              <label className="admin-form-check admin-form-check-compact">
                <input
                  type="checkbox"
                  name="activa"
                  checked={motoEditModal.form.activa}
                  onChange={onInputChange}
                />
                Activa
              </label>
            </div>
            <div className="admin-moto-edit-modal-actions">
              <button type="button" className="btn-back" onClick={onClose} disabled={motoEditSaving}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={motoEditSaving}>
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
