import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  deleteProductoAdmin,
  getCategoriasProducto,
  getMotosCompatibles,
  getProductos,
  updateProductoAdmin,
} from "../../services/productosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/equipamiento.css";

function getConfig(variant) {
  if (variant === "indumentaria") {
    return {
      title: "Indumentaria Rider",
      breadcrumb: "Indumentaria rider",
      tipoApi: "indumentaria",
      showModeloCompatible: false,
    };
  }

  return {
    title: "Accesorios para la Moto",
    breadcrumb: "Accesorios para la moto",
    tipoApi: "accesorios",
    showModeloCompatible: true,
  };
}

function getImageFileName(path) {
  if (!path) return "";
  const normalized = String(path).split("?")[0];
  const segments = normalized.split("/");
  return segments[segments.length - 1] || "";
}

export default function EquipamientoCatalog({ variant = "accesorios" }) {
  const ITEMS_PER_PAGE = 16;
  const { title, breadcrumb, tipoApi, showModeloCompatible } = getConfig(variant);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [motosCompatibles, setMotosCompatibles] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedMotos, setSelectedMotos] = useState([]);
  const [order, setOrder] = useState("release");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [editingProducto, setEditingProducto] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deletingProducto, setDeletingProducto] = useState(false);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadFiltros() {
      try {
        const [categoriasRes, motosRes] = await Promise.all([
          getCategoriasProducto({ tipo: tipoApi }),
          showModeloCompatible ? getMotosCompatibles({ tipo: tipoApi }) : Promise.resolve([]),
        ]);

        if (!isMounted) return;
        setCategorias(categoriasRes);
        setMotosCompatibles(motosRes);
      } catch {
        if (!isMounted) return;
        setError("No se pudieron cargar los filtros");
      }
    }

    loadFiltros();

    return () => {
      isMounted = false;
    };
  }, [showModeloCompatible, tipoApi]);

  useEffect(() => {
    let isMounted = true;

    async function loadProductos() {
      setLoading(true);
      setError("");

      try {
        const listaPorMoto =
          showModeloCompatible && selectedMotos.length > 0
            ? (
                await Promise.all(
                  selectedMotos.map((motoSlug) =>
                    getProductos({ tipo: tipoApi, motoSlug, order })
                  )
                )
              ).flat()
            : await getProductos({ tipo: tipoApi, order });

        if (!isMounted) return;

        const unique = Array.from(
          new Map(listaPorMoto.map((item) => [item.id, item])).values()
        );
        setProductos(unique);
      } catch {
        if (!isMounted) return;
        setError("No se pudieron cargar los productos");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductos();

    return () => {
      isMounted = false;
    };
  }, [order, selectedMotos, showModeloCompatible, tipoApi]);

  useEffect(() => {
    return () => {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    };
  }, [editImagePreview]);

  useEffect(() => {
    if (!editingProducto && !deleteCandidate) return undefined;

    const onEsc = (event) => {
      if (event.key !== "Escape") return;
      if (editingProducto && !savingEdit) closeEditModal();
      if (deleteCandidate && !deletingProducto) closeDeleteModal();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [editingProducto, deleteCandidate, savingEdit, deletingProducto]);

  const productosFiltrados = useMemo(() => {
    let items = productos.filter((item) => {
      const categoriaOk =
        selectedCategorias.length === 0 ||
        selectedCategorias.includes(item.subcategoria_nombre);
      return categoriaOk;
    });

    if (order === "precio-asc") {
      items = [...items].sort((a, b) => Number(a.precio) - Number(b.precio));
    }
    if (order === "precio-desc") {
      items = [...items].sort((a, b) => Number(b.precio) - Number(a.precio));
    }

    return items;
  }, [order, productos, selectedCategorias]);

  const totalPages = Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE));
  const pageSafe = Math.min(currentPage, totalPages);
  const productosPaginados = useMemo(() => {
    const start = (pageSafe - 1) * ITEMS_PER_PAGE;
    return productosFiltrados.slice(start, start + ITEMS_PER_PAGE);
  }, [productosFiltrados, pageSafe]);

  useEffect(() => {
    setCurrentPage(1);
  }, [order, selectedCategorias, selectedMotos, tipoApi]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function toggleValue(setter, current, value) {
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  }

  function parsePrecioEntero(value) {
    if (value === null || value === undefined || value === "") return 0;
    if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);

    const text = String(value).trim().replace(/\s/g, "");
    if (!text) return 0;

    if (text.includes(",")) {
      const integerPart = text.split(",")[0].replace(/\./g, "");
      const parsed = Number(integerPart.replace(/[^0-9]/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (/^\d+\.\d{1,2}$/.test(text)) {
      const parsed = Number(text);
      return Number.isFinite(parsed) ? Math.round(parsed) : 0;
    }

    const parsed = Number(text.replace(/[^0-9]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normalizePrecioInput(rawValue) {
    return String(parsePrecioEntero(rawValue) || "");
  }

  function formatPrecioInput(value) {
    if (value === null || value === undefined || value === "") return "";

    const entero = parsePrecioEntero(value);
    if (!entero) return "";
    return String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function getErrorText(err, fallback) {
    const data = err?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstArray = Object.values(data).find((value) => Array.isArray(value) && value.length > 0);
    if (firstArray) return firstArray[0];
    return fallback;
  }

  function openEditModal(producto) {
    setEditError("");
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImagePreview("");

    setEditingProducto(producto);
    setEditForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: String(parsePrecioEntero(producto.precio)),
      stock: String(producto.stock ?? 0),
      es_destacado: Boolean(producto.es_destacado),
      activo: producto.activo !== false,
      imagen_principal: null,
    });
  }

  function closeEditModal() {
    if (savingEdit) return;
    setEditingProducto(null);
    setEditForm(null);
    setEditError("");
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImagePreview("");
  }

  function handleEditInputChange(event) {
    const { name, type, checked, value, files } = event.target;

    setEditForm((prev) => {
      if (!prev) return prev;
      const nextValue = type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value;
      return {
        ...prev,
        [name]: type === "file" ? nextValue : name === "precio" ? normalizePrecioInput(value) : nextValue,
      };
    });

    if (type === "file") {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
      const file = files?.[0];
      setEditImagePreview(file ? URL.createObjectURL(file) : "");
    }
  }

  function openDeleteModal(producto) {
    setDeleteCandidate(producto);
  }

  function closeDeleteModal() {
    if (deletingProducto) return;
    setDeleteCandidate(null);
  }

  async function confirmDeleteProducto() {
    if (!deleteCandidate) return;
    setDeletingProducto(true);

    try {
      await deleteProductoAdmin(deleteCandidate.id);
      setProductos((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch (err) {
      window.alert(getErrorText(err, "No se pudo eliminar el producto."));
    } finally {
      setDeletingProducto(false);
    }
  }

  async function handleEditProductoSubmit(event) {
    event.preventDefault();
    if (!editingProducto || !editForm) return;

    setSavingEdit(true);
    setEditError("");

    const precioEntero = parsePrecioEntero(editForm.precio);
    const stockNumero = Number(editForm.stock);

    if (!editForm.nombre.trim()) {
      setEditError("El nombre es obligatorio.");
      setSavingEdit(false);
      return;
    }

    if (Number.isNaN(precioEntero) || Number.isNaN(stockNumero)) {
      setEditError("Los datos ingresados no son validos.");
      setSavingEdit(false);
      return;
    }

    const payload = new FormData();
    payload.append("nombre", editForm.nombre.trim());
    payload.append("descripcion", editForm.descripcion || "");
    payload.append("precio", String(precioEntero));
    payload.append("stock", String(stockNumero));
    payload.append("es_destacado", String(Boolean(editForm.es_destacado)));
    payload.append("activo", String(Boolean(editForm.activo)));
    if (editForm.imagen_principal) {
      payload.append("imagen_principal", editForm.imagen_principal);
    }

    try {
      const updated = await updateProductoAdmin(editingProducto.id, payload);
      setProductos((prev) => prev.map((item) => (item.id === editingProducto.id ? updated : item)));
      closeEditModal();
    } catch (err) {
      setEditError(getErrorText(err, "No se pudo editar el producto."));
    } finally {
      setSavingEdit(false);
    }
  }

  const previewSrc =
    editImagePreview ||
    (editingProducto?.imagen_principal ? `http://127.0.0.1:8000${editingProducto.imagen_principal}` : "");

  return (
    <main className="equip-page">
      <div className="equip-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{breadcrumb}</span>
      </div>

      <header className="equip-header">
        <h1>{title}</h1>
        <div className="equip-sort-row">
          <p>{productosFiltrados.length} articulos</p>
          <label htmlFor="equip-order">Ordenar por</label>
          <select
            id="equip-order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="release">Fecha de release</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
          </select>
        </div>
      </header>

      <section className="equip-layout">
        <aside className="equip-sidebar">
          <div className="equip-filter-block">
            <h3>Categoria</h3>
            <div className="equip-filter-list">
              {categorias.map((categoria) => (
                <label key={categoria}>
                  <input
                    type="checkbox"
                    checked={selectedCategorias.includes(categoria)}
                    onChange={() =>
                      toggleValue(setSelectedCategorias, selectedCategorias, categoria)
                    }
                  />
                  <span>{categoria}</span>
                </label>
              ))}
            </div>
          </div>

          {showModeloCompatible && (
            <div className="equip-filter-block">
              <h3>Modelo Compatible</h3>
              <div className="equip-filter-list">
                {motosCompatibles.map((moto) => (
                  <label key={moto.slug}>
                    <input
                      type="checkbox"
                      checked={selectedMotos.includes(moto.slug)}
                      onChange={() => toggleValue(setSelectedMotos, selectedMotos, moto.slug)}
                    />
                    <span>{moto.modelo || moto.nombre}</span>
                  </label>
                ))}
                {motosCompatibles.length === 0 && (
                  <p className="equip-filter-empty">No hay modelos compatibles cargados.</p>
                )}
              </div>
            </div>
          )}
        </aside>

        <div className="equip-grid">
          {loading && <div className="equip-empty">Cargando productos...</div>}
          {error && <div className="equip-empty">{error}</div>}

          {productosPaginados.map((producto) => (
            <article key={producto.id} className="equip-card">
              <div className="equip-card-image">
                <img
                  src={
                    producto.imagen_principal
                      ? `http://127.0.0.1:8000${producto.imagen_principal}`
                      : "https://via.placeholder.com/600x600?text=Sin+Imagen"
                  }
                  alt={producto.nombre}
                  loading="lazy"
                />
                {isAdmin && (
                  <div className="equip-admin-actions">
                    <button type="button" className="equip-admin-btn edit" title="Editar" onClick={() => openEditModal(producto)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button
                      type="button"
                      className="equip-admin-btn delete"
                      title="Eliminar"
                      onClick={() => openDeleteModal(producto)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                )}
              </div>
              <h3>{producto.nombre}</h3>
              <p>${Number(producto.precio).toLocaleString("es-CL")}</p>
              <div className="equip-card-actions">
                <Link className="equip-card-detail-btn" to={`/producto/${producto.slug}`}>
                  Ver detalles
                </Link>
              </div>
            </article>
          ))}

          {!loading && !error && productosFiltrados.length === 0 && (
            <div className="equip-empty">No hay productos</div>
          )}
        </div>

        {!loading && !error && productosFiltrados.length > ITEMS_PER_PAGE && (
          <div className="equip-pagination">
            <button
              type="button"
              className="equip-page-btn"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={pageSafe === 1}
            >
              Anterior
            </button>

            <span className="equip-page-indicator">
              Pagina {pageSafe} de {totalPages}
            </span>

            <button
              type="button"
              className="equip-page-btn"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={pageSafe === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      {editingProducto && editForm && (
        <div className="equip-edit-modal-overlay" onClick={closeEditModal}>
          <section className="equip-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="equip-edit-header">
              <div>
                <p className="equip-edit-kicker">Edicion de producto</p>
                <h3>{editingProducto.nombre}</h3>
              </div>
              <button
                type="button"
                className="equip-edit-close"
                onClick={closeEditModal}
                disabled={savingEdit}
              >
                Cerrar
              </button>
            </div>

            <form className="equip-edit-form" onSubmit={handleEditProductoSubmit}>
              <label className="equip-edit-span-2">
                Nombre *
                <input name="nombre" value={editForm.nombre} onChange={handleEditInputChange} maxLength={150} required />
              </label>

              <label className="equip-edit-span-2">
                Descripcion
                <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditInputChange} rows={4} />
              </label>

              <label>
                Precio *
                <input
                  name="precio"
                  value={formatPrecioInput(editForm.precio)}
                  onChange={handleEditInputChange}
                  inputMode="decimal"
                  placeholder="Ej: 150.000"
                  required
                />
              </label>

              <label>
                Stock *
                <input
                  type="number"
                  name="stock"
                  value={editForm.stock}
                  onChange={handleEditInputChange}
                  min="0"
                  required
                />
              </label>

              <label className="equip-edit-span-2">
                Imagen principal
                <div className="equip-edit-file-picker">
                  <input
                    ref={editFileInputRef}
                    className="equip-edit-file-hidden"
                    type="file"
                    name="imagen_principal"
                    accept="image/*"
                    onChange={handleEditInputChange}
                  />
                  <button
                    type="button"
                    className="equip-edit-file-btn"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    Examinar...
                  </button>
                  <span className="equip-edit-file-name">
                    {editForm.imagen_principal?.name ||
                      getImageFileName(editingProducto?.imagen_principal) ||
                      "No se ha seleccionado ningun archivo."}
                  </span>
                </div>
              </label>

              {previewSrc ? (
                <div className="equip-edit-preview equip-edit-span-2">
                  <p>Vista previa</p>
                  <img src={previewSrc} alt={editingProducto.nombre || "Producto"} />
                </div>
              ) : null}

              {editError && <p className="equip-edit-error">{editError}</p>}

              <div className="equip-edit-footer equip-edit-span-2">
                <div className="equip-edit-footer-checks">
                  <label className="equip-edit-check">
                    <input type="checkbox" name="es_destacado" checked={editForm.es_destacado} onChange={handleEditInputChange} />
                    Destacado
                  </label>

                  <label className="equip-edit-check">
                    <input type="checkbox" name="activo" checked={editForm.activo} onChange={handleEditInputChange} />
                    Activo
                  </label>
                </div>

                <div className="equip-edit-actions">
                  <button type="button" className="btn-secondary" onClick={closeEditModal} disabled={savingEdit}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={savingEdit}>
                    {savingEdit ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteCandidate && (
        <div className="equip-delete-modal-overlay" onClick={closeDeleteModal}>
          <section className="equip-delete-modal" onClick={(event) => event.stopPropagation()}>
            <img src="/images/informacion.png" alt="Informacion" className="equip-delete-modal-image" />
            <p className="equip-delete-modal-text">
              Estas seguro que quieres eliminar {deleteCandidate.nombre}?
            </p>
            <div className="equip-delete-modal-actions">
              <button type="button" className="btn-back" onClick={closeDeleteModal} disabled={deletingProducto}>
                Volver
              </button>
              <button type="button" className="btn-delete" onClick={confirmDeleteProducto} disabled={deletingProducto}>
                {deletingProducto ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
