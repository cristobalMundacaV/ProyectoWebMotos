import AdminUsersTable from "../components/AdminUsersTable";

export default function UsuariosPage({
  activeSection,
  createUserForm,
  createUserSaving,
  onCreateUserInputChange,
  onCreateUserSubmit,
  adminUsers,
  adminUsersLoading,
  adminUsersLoadError,
  paginatedAdminUsers,
  onEditUser,
  onDeleteUser,
  onPageChange,
}) {
  if (activeSection !== "crear_usuario" && activeSection !== "lista_usuarios") return null;

  return (
    <section className="admin-content-grid lower">
        <article className="admin-panel-card">
        <div className="admin-card-header">
          <h2>Crear usuario</h2>
        </div>

        <form className="admin-moto-form" onSubmit={onCreateUserSubmit} noValidate>
          <label>
            Nombres *
            <input name="first_name" value={createUserForm.first_name} onChange={onCreateUserInputChange} maxLength={150} required />
          </label>

          <label>
            Apellidos *
            <input name="last_name" value={createUserForm.last_name} onChange={onCreateUserInputChange} maxLength={150} required />
          </label>

          <label>
            Username *
            <input name="username" value={createUserForm.username} onChange={onCreateUserInputChange} maxLength={150} required />
          </label>

          <label>
            Correo (opcional)
            <input type="email" name="email" value={createUserForm.email} onChange={onCreateUserInputChange} maxLength={254} />
          </label>

          <label>
            Telefono *
            <input name="telefono" value={createUserForm.telefono} onChange={onCreateUserInputChange} maxLength={30} required />
          </label>

          <label>
            Rol *
            <select name="rol" value={createUserForm.rol} onChange={onCreateUserInputChange} required>
              <option value="">Selecciona un rol</option>
              <option value="admin">Administrador</option>
              <option value="encargado">Encargado</option>
            </select>
          </label>

          <label>
            Contraseña *
            <input type="password" name="password" value={createUserForm.password} onChange={onCreateUserInputChange} minLength={4} required />
          </label>

          <label>
            Repetir Contraseña *
            <input type="password" name="confirm_password" value={createUserForm.confirm_password} onChange={onCreateUserInputChange} minLength={4} required />
          </label>

          <button type="submit" className="admin-primary-action" disabled={createUserSaving}>
            {createUserSaving ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      </article>

      <article className="admin-panel-card">
        <div className="admin-card-header">
          <h2>Lista de usuarios</h2>
        </div>
        {adminUsersLoadError ? <p className="admin-empty">{adminUsersLoadError}</p> : null}
        <AdminUsersTable
          adminUsers={adminUsers}
          adminUsersLoading={adminUsersLoading}
          paginatedAdminUsers={paginatedAdminUsers}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onPageChange={onPageChange}
        />
      </article>
    </section>
  );
}
