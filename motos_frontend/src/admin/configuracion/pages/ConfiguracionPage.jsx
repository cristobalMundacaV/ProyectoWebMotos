export default function ConfiguracionPage({
  activeSection,
  contactoForm,
  contactoSaving,
  contactoLoading,
  contactoLoadError,
  onContactoInputChange,
  onContactoSubmit,
  onContactoRetry,
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
          {contactoLoadError ? (
            <>
              <p className="admin-empty">{contactoLoadError}</p>
              <button
                type="button"
                className="admin-page-btn"
                onClick={onContactoRetry}
                disabled={contactoLoading || contactoSaving}
              >
                {contactoLoading ? "Reintentando..." : "Reintentar"}
              </button>
            </>
          ) : null}

          <label>
            Instagram *
            <input
              name="instagram"
              value={contactoForm.instagram}
              onChange={onContactoInputChange}
              maxLength={120}
              required
              disabled={Boolean(contactoLoadError) || contactoLoading}
            />
          </label>

          <label>
            Teléfono *
            <input
              name="telefono"
              value={contactoForm.telefono}
              onChange={onContactoInputChange}
              maxLength={60}
              required
              disabled={Boolean(contactoLoadError) || contactoLoading}
            />
          </label>

          <label className="admin-form-span-2">
            Ubicación *
            <input
              name="ubicacion"
              value={contactoForm.ubicacion}
              onChange={onContactoInputChange}
              maxLength={180}
              required
              disabled={Boolean(contactoLoadError) || contactoLoading}
            />
          </label>

          <button type="submit" className="admin-primary-action" disabled={contactoSaving || contactoLoading || Boolean(contactoLoadError)}>
            {"Guardar contacto"}
          </button>
        </form>
      </article>
    </section>
  );
}
