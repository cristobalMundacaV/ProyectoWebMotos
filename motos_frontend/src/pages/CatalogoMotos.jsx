import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useMotos } from "../hooks/useMotos";
import MotoCard from "../components/motos/MotoCard";
import { buildMediaUrl } from "../services/apiConfig";
import { deleteMoto, getMotoAdminMeta, updateMoto } from "../services/motosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../services/authService";
import "../styles/catalogo-motos.css";

/** Catalogo completo de motos con filtros y edicion para admins */
export default function CatalogoMotos() {
  const ITEMS_PER_PAGE = 16;
  const { motos, setMotos, loading, error } = useMotos();
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [cilindradaMin, setCilindradaMin] = useState("");
  const [cilindradaMax, setCilindradaMax] = useState("");
  const [order, setOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [meta, setMeta] = useState({ marcas: [], categorias: [] });
  const [editingMoto, setEditingMoto] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deletingMoto, setDeletingMoto] = useState(false);
  const editFileInputRef = useRef(null);
  const formatUppercase = (value) => String(value || "-").toUpperCase();

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;
    getMotoAdminMeta()
      .then((response) => {
        if (!isMounted) return;
        setMeta({
          marcas: Array.isArray(response?.marcas) ? response.marcas : [],
          categorias: Array.isArray(response?.categorias) ? response.categorias : [],
        });
      })
      .catch((metaError) => {
        console.error("Error loading moto admin metadata:", metaError);
        if (!isMounted) return;
        setMeta({ marcas: [], categorias: [] });
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    return () => {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    };
  }, [editImagePreview]);

  useEffect(() => {
    if (!editingMoto && !deleteCandidate) return undefined;

    const onEsc = (event) => {
      if (event.key !== "Escape") return;

      if (editingMoto && !savingEdit) {
        setEditingMoto(null);
        setEditForm(null);
        setEditError("");
        if (editImagePreview) URL.revokeObjectURL(editImagePreview);
        setEditImagePreview("");
      }

      if (deleteCandidate && !deletingMoto) {
        setDeleteCandidate(null);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [editingMoto, savingEdit, editImagePreview, deleteCandidate, deletingMoto]);

  function buildSlug(value) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
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

  function getErrorText(error, fallback = "No se pudo guardar la moto.") {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstArray = Object.values(data).find((value) => Array.isArray(value) && value.length > 0);
    if (firstArray) return firstArray[0];

    return fallback;
  }

  function resolveSelectId(entityId, entityName, list) {
    if (entityId) return String(entityId);
    if (!entityName) return "";

    const match = list.find((item) => item.nombre === entityName);
    return match ? String(match.id) : "";
  }

  function parseNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function openEditModal(moto) {
    setEditError("");
    setEditImagePreview("");

    setEditingMoto(moto);
    setEditForm({
      marca: resolveSelectId(moto.marca, moto.marca_nombre, meta.marcas),
      categoria: resolveSelectId(moto.categoria, moto.categoria_nombre, meta.categorias),
      modelo: moto.modelo || moto.nombre || "",
      slug: moto.slug || "",
      descripcion: moto.descripcion || "",
      precio: String(parsePrecioEntero(moto.precio)),
      cilindrada: String(moto.cilindrada ?? ""),
      anio: String(moto.anio ?? ""),
      stock: String(moto.stock ?? 0),
      es_destacada: Boolean(moto.es_destacada),
      activa: moto.activa !== false,
      imagen_principal: null,
    });
  }

  function closeEditModal() {
    if (savingEdit) return;

    setEditingMoto(null);
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
      const nextForm = {
        ...prev,
        [name]: nextValue,
      };

      if (name === "modelo") {
        nextForm.slug = buildSlug(value);
      }

      if (name === "precio") {
        nextForm.precio = normalizePrecioInput(value);
      }

      return nextForm;
    });

    if (type === "file") {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
      const file = files?.[0];
      setEditImagePreview(file ? URL.createObjectURL(file) : "");
    }
  }

  function openDeleteModal(moto) {
    setDeleteCandidate(moto);
  }

  function closeDeleteModal() {
    if (deletingMoto) return;
    setDeleteCandidate(null);
  }

  async function confirmDeleteMoto() {
    if (!deleteCandidate) return;
    setDeletingMoto(true);

    try {
      await deleteMoto(deleteCandidate.id);
      setMotos((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch {
      window.alert("No se pudo eliminar la moto.");
    } finally {
      setDeletingMoto(false);
    }
  }

  async function handleEditMotoSubmit(event) {
    event.preventDefault();
    if (!editingMoto || !editForm) return;

    setSavingEdit(true);
    setEditError("");

    const payload = new FormData();
    payload.append("marca", editForm.marca);
    payload.append("categoria", editForm.categoria);
    payload.append("modelo", editForm.modelo);
    payload.append("slug", editForm.slug);
    payload.append("descripcion", editForm.descripcion);
    payload.append("precio", editForm.precio);
    payload.append("cilindrada", editForm.cilindrada);
    payload.append("anio", editForm.anio);
    payload.append("stock", editForm.stock);
    payload.append("es_destacada", String(editForm.es_destacada));
    payload.append("activa", String(editForm.activa));

    if (editForm.imagen_principal) {
      payload.append("imagen_principal", editForm.imagen_principal);
    }

    try {
      const updated = await updateMoto(editingMoto.id, payload);
      setMotos((prev) => prev.map((item) => (item.id === editingMoto.id ? updated : item)));
      closeEditModal();
    } catch (error) {
      setEditError(getErrorText(error, "No se pudo editar la moto."));
    } finally {
      setSavingEdit(false);
    }
  }

  const marcas = useMemo(() => {
    return [...new Set(motos.map((moto) => moto.marca_nombre).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "es")
    );
  }, [motos]);

  const categorias = useMemo(() => {
    return [...new Set(motos.map((moto) => moto.categoria_nombre).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "es")
    );
  }, [motos]);

  const filteredMotos = useMemo(() => {
    let items = motos.filter((moto) => {
      const marcaMatch = selectedMarcas.length === 0 || selectedMarcas.includes(moto.marca_nombre || "");
      const categoriaMatch =
        selectedCategorias.length === 0 || selectedCategorias.includes(moto.categoria_nombre || "");
      const cilindrada = parseNumber(moto.cilindrada);
      const minMatch = cilindradaMin === "" || cilindrada >= parseNumber(cilindradaMin);
      const maxMatch = cilindradaMax === "" || cilindrada <= parseNumber(cilindradaMax);

      return marcaMatch && categoriaMatch && minMatch && maxMatch;
    });

    if (order === "precio-asc") {
      items = [...items].sort((a, b) => parsePrecioEntero(a.precio) - parsePrecioEntero(b.precio));
    }
    if (order === "precio-desc") {
      items = [...items].sort((a, b) => parsePrecioEntero(b.precio) - parsePrecioEntero(a.precio));
    }
    if (order === "cilindrada-asc") {
      items = [...items].sort((a, b) => parseNumber(a.cilindrada) - parseNumber(b.cilindrada));
    }
    if (order === "cilindrada-desc") {
      items = [...items].sort((a, b) => parseNumber(b.cilindrada) - parseNumber(a.cilindrada));
    }
    if (order === "anio-desc") {
      items = [...items].sort((a, b) => parseNumber(b.anio) - parseNumber(a.anio));
    }

    return items;
  }, [motos, selectedMarcas, selectedCategorias, cilindradaMin, cilindradaMax, order]);

  const totalPages = Math.max(1, Math.ceil(filteredMotos.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedMotos = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredMotos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMotos, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMarcas, selectedCategorias, cilindradaMin, cilindradaMax, order]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const toggleMarca = (marca) => {
    setSelectedMarcas((prev) =>
      prev.includes(marca) ? prev.filter((item) => item !== marca) : [...prev, marca]
    );
  };

  const toggleCategoria = (categoria) => {
    setSelectedCategorias((prev) =>
      prev.includes(categoria) ? prev.filter((item) => item !== categoria) : [...prev, categoria]
    );
  };

  const previewSrc =
    editImagePreview ||
    (editingMoto?.imagen_principal ? buildMediaUrl(editingMoto.imagen_principal) : "");
  const activeFiltersCount =
    selectedMarcas.length +
    selectedCategorias.length +
    (cilindradaMin !== "" ? 1 : 0) +
    (cilindradaMax !== "" ? 1 : 0);

  const clearFilters = () => {
    setSelectedMarcas([]);
    setSelectedCategorias([]);
    setCilindradaMin("");
    setCilindradaMax("");
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="moto-catalog-page">
        <section className="moto-catalog-section">
          <h2>Catalogo de Motos</h2>
          {loading ? (
            <p style={{ textAlign: "center" }}>Cargando...</p>
          ) : error ? (
            <p style={{ textAlign: "center" }}>{error}</p>
          ) : (
            <>
              <div className="moto-catalog-toolbar">
                <p className="moto-results-meta">{filteredMotos.length} motos</p>

                <div className="moto-catalog-toolbar-actions">
                  <label className="moto-sort-label">
                    <span>Ordenar por</span>
                    <select value={order} onChange={(event) => setOrder(event.target.value)}>
                      <option value="default">Destacados primero</option>
                      <option value="precio-asc">Precio: menor a mayor</option>
                      <option value="precio-desc">Precio: mayor a menor</option>
                      <option value="cilindrada-asc">Cilindrada: menor a mayor</option>
                      <option value="cilindrada-desc">Cilindrada: mayor a menor</option>
                      <option value="anio-desc">Mas reciente</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="moto-filter-toggle-btn"
                    onClick={() => setIsFiltersOpen((prev) => !prev)}
                  >
                    Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={isFiltersOpen ? "moto-filters-backdrop open" : "moto-filters-backdrop"}
                onClick={() => setIsFiltersOpen(false)}
                aria-label="Cerrar filtros"
              />

              <div className="moto-catalog-layout">
              <aside className={isFiltersOpen ? "moto-catalog-sidebar open" : "moto-catalog-sidebar"}>
                <div className="moto-sidebar-head">
                  <h3>Filtros</h3>
                  <button type="button" onClick={() => setIsFiltersOpen(false)}>
                    Cerrar
                  </button>
                </div>

                <div className="moto-filter-block">
                  <h3>Marcas</h3>
                  <div className="moto-filter-list">
                    {marcas.map((marca) => (
                      <label key={marca}>
                        <input
                          type="checkbox"
                          checked={selectedMarcas.includes(marca)}
                          onChange={() => toggleMarca(marca)}
                        />
                        <span>{formatUppercase(marca)}</span>
                      </label>
                    ))}
                    {marcas.length === 0 && <p className="moto-filter-empty">Sin marcas</p>}
                  </div>
                </div>

                <div className="moto-filter-block">
                  <h3>Categoria de motos</h3>
                  <div className="moto-filter-list">
                    {categorias.map((categoria) => (
                      <label key={categoria}>
                        <input
                          type="checkbox"
                          checked={selectedCategorias.includes(categoria)}
                          onChange={() => toggleCategoria(categoria)}
                        />
                        <span>{formatUppercase(categoria)}</span>
                      </label>
                    ))}
                    {categorias.length === 0 && <p className="moto-filter-empty">Sin categorias</p>}
                  </div>
                </div>

                <div className="moto-filter-block">
                  <h3>Cilindrada</h3>
                  <div className="moto-range-fields">
                    <label>
                      <span>Min cc</span>
                      <input
                        type="number"
                        min="0"
                        value={cilindradaMin}
                        onChange={(event) => setCilindradaMin(event.target.value)}
                        placeholder="Ej: 250"
                      />
                    </label>
                    <label>
                      <span>Max cc</span>
                      <input
                        type="number"
                        min="0"
                        value={cilindradaMax}
                        onChange={(event) => setCilindradaMax(event.target.value)}
                        placeholder="Ej: 650"
                      />
                    </label>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button type="button" className="moto-clear-filters-btn" onClick={clearFilters}>
                    Limpiar filtros
                  </button>
                )}
              </aside>

              <div className="motos-grid">
                {paginatedMotos.map((moto) => (
                  <MotoCard
                    key={moto.id}
                    moto={moto}
                    isAdmin={isAdmin}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
                {filteredMotos.length === 0 && (
                  <p className="moto-grid-empty">No hay motos que coincidan con los filtros.</p>
                )}
              </div>

              {filteredMotos.length > ITEMS_PER_PAGE && (
                <div className="moto-pagination">
                  <button
                    type="button"
                    className="moto-page-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safePage === 1}
                  >
                    Anterior
                  </button>

                  <span className="moto-page-indicator">
                    Pagina {safePage} de {totalPages}
                  </span>

                  <button
                    type="button"
                    className="moto-page-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safePage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
              </div>
            </>
          )}
        </section>
      </main>

      {editingMoto && editForm && (
        <div className="moto-edit-modal-overlay" onClick={closeEditModal}>
          <section className="moto-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="moto-edit-header">
              <div>
                <p className="moto-edit-kicker">Edicion de moto</p>
                <h3>{editingMoto.modelo || editingMoto.nombre}</h3>
              </div>
              <button
                type="button"
                className="moto-edit-close"
                onClick={closeEditModal}
                disabled={savingEdit}
              >
                Cerrar
              </button>
            </div>

            <form className="moto-edit-form" onSubmit={handleEditMotoSubmit}>
              <label>
                Marca *
                <select name="marca" value={editForm.marca} onChange={handleEditInputChange} required>
                  <option value="">Selecciona una marca</option>
                  {meta.marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Categoria *
                <select name="categoria" value={editForm.categoria} onChange={handleEditInputChange} required>
                  <option value="">Selecciona una categoria</option>
                  {meta.categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Modelo *
                <input
                  name="modelo"
                  value={editForm.modelo}
                  onChange={handleEditInputChange}
                  maxLength={150}
                  required
                />
              </label>

              <label className="moto-edit-span-2">
                Descripcion
                <textarea
                  name="descripcion"
                  value={editForm.descripcion}
                  onChange={handleEditInputChange}
                  rows={4}
                />
              </label>

              <label>
                Precio *
                <input
                  name="precio"
                  value={formatPrecioInput(editForm.precio)}
                  onChange={handleEditInputChange}
                  inputMode="decimal"
                  placeholder="Ej: 5.000.000"
                  required
                />
              </label>

              <label>
                Cilindrada *
                <input
                  type="number"
                  name="cilindrada"
                  value={editForm.cilindrada}
                  onChange={handleEditInputChange}
                  min="1"
                  required
                />
              </label>

              <label>
                Año *
                <input
                  type="number"
                  name="anio"
                  value={editForm.anio}
                  onChange={handleEditInputChange}
                  min="1900"
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

              <label className="moto-edit-span-2">
                Imagen principal
                <div className="moto-edit-file-picker">
                  <input
                    ref={editFileInputRef}
                    className="moto-edit-file-hidden"
                    type="file"
                    name="imagen_principal"
                    accept="image/*"
                    onChange={handleEditInputChange}
                  />
                  <button
                    type="button"
                    className="moto-edit-file-btn"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    Examinar...
                  </button>
                  <span className="moto-edit-file-name">
                    {editForm.imagen_principal?.name || "No se ha seleccionado ningún archivo."}
                  </span>
                </div>
              </label>

              {previewSrc ? (
                <div className="moto-edit-preview moto-edit-span-2">
                  <p>Vista previa</p>
                  <img src={previewSrc} alt={editingMoto.modelo || "Moto"} />
                </div>
              ) : null}

              <label className="moto-edit-check">
                <input
                  type="checkbox"
                  name="es_destacada"
                  checked={editForm.es_destacada}
                  onChange={handleEditInputChange}
                />
                Destacada
              </label>

              <label className="moto-edit-check">
                <input
                  type="checkbox"
                  name="activa"
                  checked={editForm.activa}
                  onChange={handleEditInputChange}
                />
                Activa
              </label>

              {editError && <p className="moto-edit-error">{editError}</p>}

              <div className="moto-edit-actions moto-edit-span-2">
                <button type="button" className="btn-secondary" onClick={closeEditModal} disabled={savingEdit}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={savingEdit}>
                  {savingEdit ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteCandidate && (
        <div className="moto-delete-modal-overlay" onClick={closeDeleteModal}>
          <section className="moto-delete-modal" onClick={(event) => event.stopPropagation()}>
            <img src="/images/informacion.png" alt="Informacion" className="moto-delete-modal-image" />
            <p className="moto-delete-modal-text">
              ¿Estas seguro que quieres eliminar {deleteCandidate.modelo || deleteCandidate.nombre}?
            </p>
            <div className="moto-delete-modal-actions">
              <button type="button" className="btn-back" onClick={closeDeleteModal} disabled={deletingMoto}>
                Volver
              </button>
              <button type="button" className="btn-delete" onClick={confirmDeleteMoto} disabled={deletingMoto}>
                {deletingMoto ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}

