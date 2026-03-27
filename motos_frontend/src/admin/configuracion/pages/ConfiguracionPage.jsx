export default function ConfiguracionPage({
  activeSection,
  contactoForm,
  contactoSaving,
  onContactoInputChange,
  onContactoSubmit,
}) {
  if (activeSection !== "contacto") {
    return null;
  }

  return (
    <section className="admin-content-grid">
      <article className="admin-panel-card">
        <div className="admin-card-header">
          <h2>Editar vias de contacto para publico</h2>
          <span>Se refleja en la seccion Contacto del sistema. </span>
        </div>

        <form className="admin-moto-form" onSubmit={onContactoSubmit} noValidate>
          <label>
            Instagram *
            <input
              name="instagram"
              value={contactoForm.instagram}
              onChange={onContactoInputChange}
              maxLength={120}
              required
            />
          </label>

          <label>
            Telefono *
            <input
              name="telefono"
              value={contactoForm.telefono}
              onChange={onContactoInputChange}
              maxLength={60}
              required
            />
          </label>

          <label className="admin-form-span-2">
            Ubicacion *
            <input
              name="ubicacion"
              value={contactoForm.ubicacion}
              onChange={onContactoInputChange}
              maxLength={180}
              required
            />
          </label>

          <button type="submit" className="admin-primary-action" disabled={contactoSaving}>
            {"Guardar contacto"}
          </button>
        </form>
      </article>
    </section>
  );
}
