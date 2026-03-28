export default function AdminEntityModals({
  entityEditModal,
  entityDeleteModal,
  entityModalSaving,
  entityModalError,
  onCloseEntityEditModal,
  onCloseEntityDeleteModal,
  onEntityEditInputChange,
  onSubmitEntityEdit,
  onSubmitEntityDelete,
  getEntityKindLabel,
}) {
  return (
    <>
      {entityEditModal && (
        <div className="admin-entity-modal-overlay" onClick={onCloseEntityEditModal}>
          <section className="admin-entity-modal admin-entity-modal-compact" onClick={(event) => event.stopPropagation()}>
            <div className="admin-entity-modal-header">
              <div>
                <p className="admin-entity-modal-kicker">Edicion administrativa</p>
                <h3>Editar {getEntityKindLabel(entityEditModal.kind)}</h3>
              </div>
              <button
                type="button"
                onClick={onCloseEntityEditModal}
                disabled={entityModalSaving}
                aria-label="Cerrar modal"
              >
                X
              </button>
            </div>

            <form className="admin-entity-modal-form" onSubmit={onSubmitEntityEdit} noValidate>
              <label>
                Nombre *
                <input
                  name="nombre"
                  value={entityEditModal.nombre}
                  onChange={onEntityEditInputChange}
                  maxLength={100}
                  required
                />
              </label>

              {entityModalError && <p className="admin-entity-modal-error">{entityModalError}</p>}

              <div className="admin-entity-modal-actions">
                <button type="button" className="btn-back" onClick={onCloseEntityEditModal} disabled={entityModalSaving}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={entityModalSaving}>
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {entityDeleteModal && (
        <div className="admin-entity-modal-overlay" onClick={onCloseEntityDeleteModal}>
          <section className="admin-entity-delete-modal" onClick={(event) => event.stopPropagation()}>
            <img src="/images/informacion.png" alt="Informacion" className="admin-entity-delete-image" />
            <p className="admin-entity-delete-text">
              Estas seguro que quieres eliminar {entityDeleteModal.nombre}?
            </p>
            {entityModalError && <p className="admin-entity-modal-error">{entityModalError}</p>}
            <div className="admin-entity-delete-actions">
              <button type="button" className="btn-back" onClick={onCloseEntityDeleteModal} disabled={entityModalSaving}>
                Volver
              </button>
              <button type="button" className="btn-delete" onClick={onSubmitEntityDelete} disabled={entityModalSaving}>
                Eliminar
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

