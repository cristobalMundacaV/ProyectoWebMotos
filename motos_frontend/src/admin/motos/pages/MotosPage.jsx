import { useEffect, useState } from "react";
import AdminPagination, { paginateItems } from "../../shared/components/AdminPagination";

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
  motoForm,
  motoSaving,
  motoMeta,
  motoImageInputKey,
  onMotoInputChange,
  onMotoPrecioInputChange,
  onMotoSubmit,
  categoriasMoto,
  categoriaMotoForm,
  categoriaMotoSaving,
  onCategoriaMotoInputChange,
  onCategoriaMotoSubmit,
  onCategoriaMotoEdit,
  onCategoriaMotoDelete,
}) {
  const PAGE_SIZE = 10;
  const [tablePages, setTablePages] = useState({
    marcas: 1,
    categoriasMoto: 1,
    motos: 1,
  });

  useEffect(() => {
    setTablePages({
      marcas: 1,
      categoriasMoto: 1,
      motos: 1,
    });
  }, [activeSection]);

  function formatPrecio(value) {
    if (value === null || value === undefined || value === "") return "";

    const texto = String(value);
    const [entero = "", decimal = ""] = texto.split(".");
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return decimal ? `${enteroConPuntos},${decimal}` : enteroConPuntos;
  }

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
            <span>{activeMarcaConfig.subtitulo}</span>
          </div>

          <form className="admin-moto-form admin-inline-submit-form" onSubmit={onMarcaSubmit} noValidate>
            <label>
              Nombre *
              <input name="nombre" value={marcaForm.nombre} onChange={onMarcaInputChange} maxLength={100} required />
            </label>

            <label>
              Slug (solo lectura)
              <input name="slug" value={marcaForm.slug} onChange={onMarcaInputChange} readOnly required />
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
              {marcaSaving ? "Guardando..." : "Guardar marca"}
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
              <div key={marca.id} className="admin-table-row admin-table-row-two-cols">
                <div className="admin-entity-name-cell">
                  <strong>{marca.nombre}</strong>
                </div>
                <div className="admin-row-actions">
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
            <span>Gestion de categorias de motos</span>
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

            <label>
              Slug (solo lectura)
              <input name="slug" value={categoriaMotoForm.slug} onChange={onCategoriaMotoInputChange} readOnly required />
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
              {categoriaMotoSaving ? "Guardando..." : "Guardar categoria"}
            </button>
          </form>
        </article>

        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Categorias creadas</h2>
            <span>{categoriasMoto.length} registradas</span>
          </div>

          <div className="admin-table">
            {paginatedCategoriasMoto.items.map((categoria) => (
              <div key={categoria.id} className="admin-table-row admin-table-row-two-cols">
                <div className="admin-entity-name-cell">
                  <strong>{categoria.nombre}</strong>
                </div>
                <div className="admin-row-actions">
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

  if (activeSection === "motos") {
    const paginatedMotos = paginateItems(dashboard.motos, tablePages.motos, PAGE_SIZE);

    return (
      <section className="admin-content-grid lower">
        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Agregar moto</h2>
            <span>Completa todos los atributos</span>
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
              Categoria *
              <select name="categoria" value={motoForm.categoria} onChange={onMotoInputChange} required>
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
              <input name="modelo" value={motoForm.modelo} onChange={onMotoInputChange} maxLength={150} required />
            </label>

            <label>
              Slug (solo lectura)
              <input name="slug" value={motoForm.slug} onChange={onMotoInputChange} readOnly required />
            </label>

            <label className="admin-form-span-2">
              Descripcion (opcional)
              <textarea name="descripcion" value={motoForm.descripcion} onChange={onMotoInputChange} rows={4} />
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
              Cilindrada *
              <input type="number" name="cilindrada" value={motoForm.cilindrada} onChange={onMotoInputChange} min="1" required />
            </label>

            <label>
              Año *
              <input type="number" name="anio" value={motoForm.anio} onChange={onMotoInputChange} min="1900" required />
            </label>

            <label>
              Stock *
              <input type="number" name="stock" value={motoForm.stock} onChange={onMotoInputChange} min="0" required />
            </label>

            <label className="admin-form-span-2">
              Imagen principal (opcional)
              <input
                key={`moto-image-${motoImageInputKey}`}
                type="file"
                name="imagen_principal"
                accept="image/*"
                onChange={onMotoInputChange}
              />
            </label>

            <div className="admin-form-footer">
              <div className="admin-form-footer-checks">
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
                {motoSaving ? "Guardando..." : "Guardar moto"}
              </button>
            </div>
          </form>
        </article>

        <article className="admin-panel-card">
          <div className="admin-card-header">
            <h2>Motos recientes</h2>
            <span>{dashboard.motos.length} registradas</span>
          </div>
          <div className="admin-table">
            {paginatedMotos.items.map((moto) => (
              <div key={moto.id} className="admin-table-row admin-moto-table-row">
                <div className="admin-moto-table-cell">
                  <strong>{moto.modelo}</strong>
                  <span>{moto.marca_nombre || "Sin marca"}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <strong>{moto.categoria_nombre || "-"}</strong>
                  <span>{moto.anio}</span>
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
    );
  }

  return null;
}
