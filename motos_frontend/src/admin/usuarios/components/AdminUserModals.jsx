export default function AdminUserModals({
  editModal,
  deleteModal,
  modalSaving,
  modalError,
  onCloseEdit,
  onCloseDelete,
  onEditInputChange,
  onSubmitEdit,
  onSubmitDelete,
}) {
  return (
    <>
      {editModal && (
        <div className="admin-entity-modal-overlay admin-user-edit-overlay" onClick={onCloseEdit}>
          <section className="admin-entity-modal admin-entity-modal-compact admin-user-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-entity-modal-header">
              <div>
                <p className="admin-entity-modal-kicker">Edicion de usuario</p>
                <h3>Editar usuario</h3>
              </div>
            </div>

            <form className="admin-entity-modal-form" onSubmit={onSubmitEdit} noValidate>
              <label>
                Nombres *
                <input name="first_name" value={editModal.first_name} onChange={onEditInputChange} maxLength={150} required />
              </label>

              <label>
                Apellidos *
                <input name="last_name" value={editModal.last_name} onChange={onEditInputChange} maxLength={150} required />
              </label>

              <label>
                Username *
                <input name="username" value={editModal.username} onChange={onEditInputChange} maxLength={150} required />
              </label>

              <label>
                Correo (opcional)
                <input type="email" name="email" value={editModal.email} onChange={onEditInputChange} maxLength={254} />
              </label>

              <label>
                Telefono *
                <input name="telefono" value={editModal.telefono} onChange={onEditInputChange} maxLength={30} required />
              </label>

              <label>
                Rol *
                <select name="rol" value={editModal.rol} onChange={onEditInputChange} required>
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="encargado">Encargado</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </label>

              {modalError && <p className="admin-entity-modal-error">{modalError}</p>}

              <div className="admin-entity-modal-actions">
                <button type="button" className="btn-back" onClick={onCloseEdit} disabled={modalSaving}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={modalSaving}>
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteModal && (
        <div className="admin-entity-modal-overlay" onClick={onCloseDelete}>
          <section className="admin-entity-delete-modal" onClick={(event) => event.stopPropagation()}>
            <img src="/images/informacion.png" alt="Informacion" className="admin-entity-delete-image" />
            <p className="admin-entity-delete-text">Estas seguro que quieres eliminar a {deleteModal.name}?</p>
            {modalError && <p className="admin-entity-modal-error">{modalError}</p>}
            <div className="admin-entity-delete-actions">
              <button type="button" className="btn-back" onClick={onCloseDelete} disabled={modalSaving}>
                Volver
              </button>
              <button type="button" className="btn-delete" onClick={onSubmitDelete} disabled={modalSaving}>
                Eliminar
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
