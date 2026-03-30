import { useRef } from "react";
import { formatPrecioDisplay } from "../controllers/productoAdapters";

export default function ProductoEditModal({
  productoEditModal,
  productoMeta,
  productoEditSaving,
  productoEditError,
  fallbackImage,
  onClose,
  onSubmit,
  onInputChange,
  onPrecioInputChange,
  onToggleCompatibilidad,
  onRemoveImage,
}) {
  if (!productoEditModal) return null;

  const isAccesorioMoto = productoEditModal.kind === "accesorio_moto";
  const subcategorias = Array.isArray(productoMeta?.subcategorias) ? productoMeta.subcategorias : [];
  const marcas = Array.isArray(productoMeta?.marcas) ? productoMeta.marcas : [];
  const motos = Array.isArray(productoMeta?.motos) ? productoMeta.motos : [];
  const fileInputRef = useRef(null);
  const hasNewImages = Array.isArray(productoEditModal.form.imagenes_galeria) && productoEditModal.form.imagenes_galeria.length > 0;

  return (
    <div className="admin-entity-modal-overlay" onClick={onClose}>
      <section className="admin-entity-modal admin-moto-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-entity-modal-header">
          <div>
            <p className="admin-entity-modal-kicker">Edicion de producto</p>
            <h3>{productoEditModal.title}</h3>
          </div>
          <button type="button" onClick={onClose} disabled={productoEditSaving}>
            Cerrar
          </button>
        </div>

        <form className="admin-moto-form admin-moto-edit-modal-form" onSubmit={onSubmit} noValidate>
          <label>
            Categoria *
            <select
              name="subcategoria"
              value={productoEditModal.form.subcategoria}
              onChange={onInputChange}
              required
            >
              <option value="">Selecciona una categoria</option>
              {subcategorias.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id}>
                  {subcategoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Marca *
            <select name="marca" value={productoEditModal.form.marca} onChange={onInputChange} required>
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
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
              value={productoEditModal.form.nombre}
              onChange={onInputChange}
              maxLength={150}
              required
            />
          </label>

          <label className="admin-form-span-2">
            Descripcion (opcional)
            <textarea
              name="descripcion"
              value={productoEditModal.form.descripcion}
              onChange={onInputChange}
              rows={4}
            />
          </label>

          <label>
            Precio *
            <input
              type="text"
              name="precio"
              value={formatPrecioDisplay(productoEditModal.form.precio)}
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
              value={productoEditModal.form.orden_carrusel}
              onChange={onInputChange}
              min="1"
              required
            />
          </label>

          <label className="admin-form-span-2">
            Imagenes
            <div className="admin-edit-file-picker">
              <input
                ref={fileInputRef}
                key={`${productoEditModal.kind}-edit-images-${productoEditModal.imageInputKey}`}
                className="admin-edit-file-hidden"
                type="file"
                name="imagenes_galeria"
                accept="image/*"
                multiple
                onChange={onInputChange}
              />
              <button
                type="button"
                className="admin-edit-file-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Examinar...
              </button>
              <span className="admin-edit-file-name">
                {hasNewImages
                  ? `${productoEditModal.form.imagenes_galeria.length} archivos seleccionados.`
                  : "No se han seleccionado archivos nuevos."}
              </span>
            </div>
          </label>

          {productoEditModal.imagePreviewUrl && (
            <div className="admin-form-span-2 admin-product-edit-preview-block">
              <p>Vista previa</p>
              <div className="admin-product-edit-preview-grid">
                <div className="admin-product-edit-preview-item">
                  <button
                    type="button"
                    className="admin-product-edit-preview-remove"
                    onClick={onRemoveImage}
                    aria-label="Eliminar imagen mostrada"
                    title="Eliminar imagen"
                  >
                    &times;
                  </button>
                  <img
                    src={productoEditModal.imagePreviewUrl}
                    alt={productoEditModal.title || "Producto"}
                    className="admin-image-preview"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {isAccesorioMoto && (
            <div className="admin-form-span-2 admin-form-footer-checks">
              <label className="admin-form-check admin-form-check-compact">
                <input
                  type="checkbox"
                  name="requiere_compatibilidad"
                  checked={Boolean(productoEditModal.form.requiere_compatibilidad)}
                  onChange={onInputChange}
                />
                Vincular a modelos especificos (opcional)
              </label>
            </div>
          )}

          {isAccesorioMoto && productoEditModal.form.requiere_compatibilidad && (
            <div className="admin-form-span-2 admin-checkbox-list">
              {motos.map((moto) => (
                <label key={moto.id} className="admin-form-check">
                  <input
                    type="checkbox"
                    checked={productoEditModal.form.compatibilidad_motos.includes(moto.id)}
                    onChange={() => onToggleCompatibilidad?.(moto.id)}
                  />
                  {moto.modelo || moto.nombre}
                </label>
              ))}
            </div>
          )}

          {productoEditError && <p className="admin-entity-modal-error">{productoEditError}</p>}

          <div className="admin-form-footer">
            <div className="admin-form-footer-checks">
              <label className="admin-form-check admin-form-check-compact">
                <input
                  type="checkbox"
                  name="es_destacado"
                  checked={productoEditModal.form.es_destacado}
                  onChange={onInputChange}
                />
                Destacado
              </label>
              <label className="admin-form-check admin-form-check-compact">
                <input type="checkbox" name="activo" checked={productoEditModal.form.activo} onChange={onInputChange} />
                Activo
              </label>
            </div>
            <div className="admin-moto-edit-modal-actions">
              <button type="button" className="btn-back" onClick={onClose} disabled={productoEditSaving}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={productoEditSaving}>
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
