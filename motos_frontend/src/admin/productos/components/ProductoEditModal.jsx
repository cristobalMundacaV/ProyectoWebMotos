import { formatPrecioDisplay } from "../controllers/productoAdapters";

export default function ProductoEditModal({
  accesorioRiderEditModal,
  accesoriosRiderMeta,
  accesorioRiderEditSaving,
  accesorioRiderEditError,
  fallbackImage,
  onClose,
  onSubmit,
  onInputChange,
  onPrecioInputChange,
}) {
  if (!accesorioRiderEditModal) return null;

  return (
    <div className="admin-entity-modal-overlay" onClick={onClose}>
      <section className="admin-entity-modal admin-moto-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-entity-modal-header">
          <div>
            <p className="admin-entity-modal-kicker">Edicion de producto</p>
            <h3>{accesorioRiderEditModal.title}</h3>
          </div>
          <button type="button" onClick={onClose} disabled={accesorioRiderEditSaving}>
            Cerrar
          </button>
        </div>

        <form className="admin-moto-form admin-moto-edit-modal-form" onSubmit={onSubmit} noValidate>
          <label>
            Categoria *
            <select
              name="subcategoria"
              value={accesorioRiderEditModal.form.subcategoria}
              onChange={onInputChange}
              required
            >
              <option value="">Selecciona una categoria</option>
              {accesoriosRiderMeta.subcategorias.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id}>
                  {subcategoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Marca *
            <select name="marca" value={accesorioRiderEditModal.form.marca} onChange={onInputChange} required>
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
              value={accesorioRiderEditModal.form.nombre}
              onChange={onInputChange}
              maxLength={150}
              required
            />
          </label>

          <label className="admin-form-span-2">
            Descripcion (opcional)
            <textarea
              name="descripcion"
              value={accesorioRiderEditModal.form.descripcion}
              onChange={onInputChange}
              rows={4}
            />
          </label>

          <label>
            Precio *
            <input
              type="text"
              name="precio"
              value={formatPrecioDisplay(accesorioRiderEditModal.form.precio)}
              onChange={onPrecioInputChange}
              inputMode="numeric"
              required
            />
          </label>

          <label>
            Orden carrusel *
            <input
              type="number"
              name="orden_carrusel"
              value={accesorioRiderEditModal.form.orden_carrusel}
              onChange={onInputChange}
              min="1"
              required
            />
          </label>

          <label className="admin-form-span-2">
            Imagenes
            <input
              key={`acc-rider-edit-images-${accesorioRiderEditModal.imageInputKey}`}
              type="file"
              name="imagenes_galeria"
              accept="image/*"
              multiple
              onChange={onInputChange}
            />
            {accesorioRiderEditModal.imageFileName && (
              <span className="admin-selected-file-name">{accesorioRiderEditModal.imageFileName}</span>
            )}
          </label>

          {accesorioRiderEditModal.imagePreviewUrl && (
            <div className="admin-form-span-2 admin-image-preview-box admin-moto-edit-preview">
              <img
                src={accesorioRiderEditModal.imagePreviewUrl}
                alt={accesorioRiderEditModal.title || "Accesorio rider"}
                className="admin-image-preview"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          )}

          {accesorioRiderEditError && <p className="admin-entity-modal-error">{accesorioRiderEditError}</p>}

          <div className="admin-form-footer">
            <div className="admin-form-footer-checks">
              <label className="admin-form-check admin-form-check-compact">
                <input
                  type="checkbox"
                  name="es_destacado"
                  checked={accesorioRiderEditModal.form.es_destacado}
                  onChange={onInputChange}
                />
                Destacado
              </label>
              <label className="admin-form-check admin-form-check-compact">
                <input type="checkbox" name="activo" checked={accesorioRiderEditModal.form.activo} onChange={onInputChange} />
                Activo
              </label>
            </div>
            <div className="admin-moto-edit-modal-actions">
              <button type="button" className="btn-back" onClick={onClose} disabled={accesorioRiderEditSaving}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={accesorioRiderEditSaving}>
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

