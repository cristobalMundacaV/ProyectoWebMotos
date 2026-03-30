import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useMotos } from "../hooks/useMotos";
import MotoCard from "../components/motos/MotoCard";
import AdminYearDropdown from "../admin/shared/components/AdminYearDropdown";
import AdminDeleteConfirmModal from "../admin/shared/components/AdminDeleteConfirmModal";
import { MOTO_YEAR_RANGE } from "../admin/motos/constants/motoYearRange";
import { buildMediaUrl } from "../services/apiConfig";
import { deleteMoto, getMotoAdminMeta, updateMoto } from "../services/motosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../services/authService";
import "../styles/catalogo-motos.css";

/** Catalogo completo de motos con filtros y edicion para admins */
export default function CatalogoMotos() {
  const ITEMS_PER_PAGE = 16;
  const yearLabel = `A${String.fromCharCode(241)}o *`;
  const yearPlaceholder = `Selecciona un A${String.fromCharCode(241)}o`;
  const currentYear = new Date().getFullYear();
  const minMotoYear = currentYear - MOTO_YEAR_RANGE;
  const motoYearOptions = useMemo(
    () => Array.from({ length: currentYear - minMotoYear + 1 }, (_, index) => String(currentYear - index)),
    [currentYear, minMotoYear]
  );
  const { motos, setMotos, loading, error } = useMotos();
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [cilindradaMin, setCilindradaMin] = useState("");
  const [cilindradaMax, setCilindradaMax] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [meta, setMeta] = useState({ marcas: [], categorias: [], modelos: [] });
  const [editingMoto, setEditingMoto] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editImageMaletasPreview, setEditImageMaletasPreview] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deletingMoto, setDeletingMoto] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const editFileInputRef = useRef(null);
  const editMaletasFileInputRef = useRef(null);
  const formatTitleCase = (value) =>
    String(value || "-")
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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
          modelos: Array.isArray(response?.modelos) ? response.modelos : [],
        });
      })
      .catch((metaError) => {
        console.error("Error loading moto admin metadata:", metaError);
        if (!isMounted) return;
        setMeta({ marcas: [], categorias: [], modelos: [] });
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    return () => {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
      if (editImageMaletasPreview) URL.revokeObjectURL(editImageMaletasPreview);
    };
  }, [editImagePreview, editImageMaletasPreview]);

  useEffect(() => {
    if (!feedback.message) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [feedback.message]);

  useEffect(() => {
    if (!editingMoto && !deleteCandidate) return undefined;

    const onEsc = (event) => {
      if (event.key !== "Escape") return;

      if (editingMoto && !savingEdit) {
        setEditingMoto(null);
        setEditForm(null);
        setEditError("");
        if (editImagePreview) URL.revokeObjectURL(editImagePreview);
        if (editImageMaletasPreview) URL.revokeObjectURL(editImageMaletasPreview);
        setEditImagePreview("");
        setEditImageMaletasPreview("");
      }

      if (deleteCandidate && !deletingMoto) {
        setDeleteCandidate(null);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [editingMoto, savingEdit, editImagePreview, editImageMaletasPreview, deleteCandidate, deletingMoto]);

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
    return `$ ${String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
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
    if (typeof data === "string") {
      return data;
    }
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
    setEditImageMaletasPreview("");

    const resolvedModeloId =
      String(moto.modelo_ref ?? moto.modelo_id ?? "") ||
      resolveSelectId(
        null,
        moto.modelo || moto.nombre || "",
        meta.modelos.filter((item) => String(item.marca) === String(moto.marca))
      );
    const modeloSeleccionado = meta.modelos.find((item) => String(item.id) === String(resolvedModeloId));
    const categoriaDesdeModelo = resolveSelectId(
      modeloSeleccionado?.categoria ?? modeloSeleccionado?.categoria_id,
      modeloSeleccionado?.categoria_nombre,
      meta.categorias
    );

    setEditingMoto(moto);
    setEditForm({
      marca: resolveSelectId(moto.marca, moto.marca_nombre, meta.marcas),
      categoria: categoriaDesdeModelo || resolveSelectId(moto.categoria, moto.categoria_nombre, meta.categorias),
      modelo: resolvedModeloId,
      slug: moto.slug || "",
      descripcion: moto.descripcion || "",
      precio: String(parsePrecioEntero(moto.precio)),
      precio_lista: String(parsePrecioEntero(moto.precio_lista || moto.precio)),
      permite_variante_maletas: Boolean(moto.permite_variante_maletas),
      precio_con_maletas: String(parsePrecioEntero(moto.precio_con_maletas)),
      precio_lista_con_maletas: String(
        parsePrecioEntero(moto.precio_lista_con_maletas || moto.precio_lista || moto.precio_con_maletas)
      ),
      anio: String(moto.anio ?? ""),
      orden_carrusel: String(moto.orden_carrusel ?? 1),
      es_destacada: Boolean(moto.es_destacada),
      activa: moto.activa !== false,
      imagenes_galeria: [],
      imagen_con_maletas: null,
      video_presentacion: moto.video_presentacion || "",
    });
  }

  function closeEditModal() {
    if (savingEdit) return;

    setEditingMoto(null);
    setEditForm(null);
    setEditError("");
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    if (editImageMaletasPreview) URL.revokeObjectURL(editImageMaletasPreview);
    setEditImagePreview("");
    setEditImageMaletasPreview("");
  }

  function handleEditInputChange(event) {
    const { name, type, checked, value, files } = event.target;
    const file = type === "file"
      ? name === "imagenes_galeria"
        ? Array.from(files || [])
        : files?.[0] || null
      : null;

    setEditForm((prev) => {
      if (!prev) return prev;

      const nextValue = type === "checkbox" ? checked : type === "file" ? file : value;
      const nextForm = {
        ...prev,
        [name]: nextValue,
      };

      if (name === "marca") {
        nextForm.modelo = "";
        nextForm.categoria = "";
      }

      if (name === "modelo") {
        const selectedModelo = meta.modelos.find(
          (item) =>
            String(item.id) === String(nextValue) &&
            String(item.marca) === String(nextForm.marca)
        );
        nextForm.slug = buildSlug(selectedModelo?.slug || selectedModelo?.nombre || "");
        nextForm.categoria = resolveSelectId(
          selectedModelo?.categoria ?? selectedModelo?.categoria_id,
          selectedModelo?.categoria_nombre,
          meta.categorias
        );
      }

      if (name === "precio") {
        nextForm.precio = normalizePrecioInput(value);
      }
      if (name === "precio_lista") {
        nextForm.precio_lista = normalizePrecioInput(value);
      }
      if (name === "precio_con_maletas") {
        nextForm.precio_con_maletas = normalizePrecioInput(value);
      }
      if (name === "precio_lista_con_maletas") {
        nextForm.precio_lista_con_maletas = normalizePrecioInput(value);
      }
      if (name === "permite_variante_maletas" && !checked) {
        nextForm.precio_con_maletas = "";
        nextForm.precio_lista_con_maletas = "";
        nextForm.imagen_con_maletas = null;
        if (editImageMaletasPreview) {
          URL.revokeObjectURL(editImageMaletasPreview);
          setEditImageMaletasPreview("");
        }
      }

      return nextForm;
    });

    if (type === "file" && (name === "imagen_principal" || name === "imagenes_galeria")) {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
      const firstFile = name === "imagenes_galeria" ? files?.[0] : files?.[0];
      setEditImagePreview(firstFile ? URL.createObjectURL(firstFile) : "");
    }

    if (type === "file" && name === "imagen_con_maletas") {
      if (editImageMaletasPreview) URL.revokeObjectURL(editImageMaletasPreview);
      const file = files?.[0];
      setEditImageMaletasPreview(file ? URL.createObjectURL(file) : "");
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
      setFeedback({ type: "success", message: "Moto eliminada correctamente." });
    } catch {
      setFeedback({ type: "error", message: "No se pudo eliminar la moto." });
    } finally {
      setDeletingMoto(false);
    }
  }

  async function handleEditMotoSubmit(event) {
    event.preventDefault();
    if (!editingMoto || !editForm) return;

    setSavingEdit(true);
    setEditError("");

    const selectedModelo = meta.modelos.find(
      (item) =>
        String(item.id) === String(editForm.modelo) &&
        String(item.marca) === String(editForm.marca)
    );
    if (!selectedModelo) {
      setEditError("Debes seleccionar un modelo valido para actualizar la moto.");
      setSavingEdit(false);
      return;
    }
    const categoriaDesdeModelo = resolveSelectId(
      selectedModelo.categoria ?? selectedModelo.categoria_id,
      selectedModelo.categoria_nombre,
      meta.categorias
    );
    if (!categoriaDesdeModelo) {
      setEditError("El modelo seleccionado no tiene categoria valida asociada.");
      setSavingEdit(false);
      return;
    }

    const payload = new FormData();
    payload.append("marca", editForm.marca);
    payload.append("categoria", categoriaDesdeModelo);
    payload.append("modelo_id", String(selectedModelo.id));
    payload.append("modelo", selectedModelo.nombre || "");
    payload.append("slug", selectedModelo.slug || editForm.slug);
    payload.append("descripcion", editForm.descripcion || "");
    payload.append("precio", editForm.precio);
    payload.append("precio_lista", editForm.precio_lista);
    payload.append("permite_variante_maletas", String(Boolean(editForm.permite_variante_maletas)));
    if (editForm.permite_variante_maletas && editForm.precio_con_maletas) {
      payload.append("precio_con_maletas", editForm.precio_con_maletas);
    }
    if (editForm.permite_variante_maletas && editForm.precio_lista_con_maletas) {
      payload.append("precio_lista_con_maletas", editForm.precio_lista_con_maletas);
    }
    payload.append("anio", editForm.anio);
    payload.append("orden_carrusel", editForm.orden_carrusel || "1");
    payload.append("es_destacada", String(editForm.es_destacada));
    payload.append("activa", String(editForm.activa));

    const galleryFiles = Array.isArray(editForm.imagenes_galeria)
      ? editForm.imagenes_galeria.filter(Boolean)
      : [];
    const primaryImageFromGallery = galleryFiles[0] || null;
    if (primaryImageFromGallery) {
      payload.append("imagen_principal", primaryImageFromGallery);
    }
    galleryFiles.forEach((file) => payload.append("imagenes", file));
    if (editForm.imagen_con_maletas) {
      payload.append("imagen_con_maletas", editForm.imagen_con_maletas);
    }
    payload.append("video_presentacion", editForm.video_presentacion || "");

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
    const normalizedSearch = String(searchQuery || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    let items = motos.filter((moto) => {
      const marcaMatch = selectedMarcas.length === 0 || selectedMarcas.includes(moto.marca_nombre || "");
      const categoriaMatch =
        selectedCategorias.length === 0 || selectedCategorias.includes(moto.categoria_nombre || "");
      const cilindrada = parseNumber(moto.cilindrada);
      const minMatch = cilindradaMin === "" || cilindrada >= parseNumber(cilindradaMin);
      const maxMatch = cilindradaMax === "" || cilindrada <= parseNumber(cilindradaMax);
      const searchable = [moto.modelo, moto.nombre, moto.marca_nombre, moto.categoria_nombre]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const searchMatch = normalizedSearch === "" || searchable.includes(normalizedSearch);

      return marcaMatch && categoriaMatch && minMatch && maxMatch && searchMatch;
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
  }, [motos, selectedMarcas, selectedCategorias, cilindradaMin, cilindradaMax, searchQuery, order]);

  const totalPages = Math.max(1, Math.ceil(filteredMotos.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedMotos = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredMotos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMotos, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMarcas, selectedCategorias, cilindradaMin, cilindradaMax, searchQuery, order]);

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
  const previewMaletasSrc =
    editImageMaletasPreview ||
    (editingMoto?.imagen_con_maletas ? buildMediaUrl(editingMoto.imagen_con_maletas) : "");
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
          <div className="moto-catalog-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Catalogo de Motos</span>
          </div>
          {loading ? (
            null
          ) : error ? (
            <p style={{ textAlign: "center" }}>{error}</p>
          ) : (
            <>
              <header className="moto-header">
                <div className="moto-title-block">
                  <h2>Catalogo de Motos</h2>
                  <p className="moto-results-meta">{filteredMotos.length} motos</p>
                  {feedback.message ? (
                    <p role="status" aria-live="polite" className="moto-results-meta">
                      {feedback.message}
                    </p>
                  ) : null}
                </div>

                <div className="moto-catalog-toolbar-actions">
                  <label className="moto-search" htmlFor="moto-search-input">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      id="moto-search-input"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Buscar por modelo, marca o categoria..."
                    />
                  </label>

                  <div className="moto-order-block">
                    <label htmlFor="moto-order">Ordenar por</label>
                    <select id="moto-order" value={order} onChange={(event) => setOrder(event.target.value)}>
                      <option value="default">Destacados primero</option>
                      <option value="precio-asc">Precio: menor a mayor</option>
                      <option value="precio-desc">Precio: mayor a menor</option>
                      <option value="cilindrada-asc">Cilindrada: menor a mayor</option>
                      <option value="cilindrada-desc">Cilindrada: mayor a menor</option>
                    <option value="anio-desc">Mas reciente</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="moto-filter-toggle-btn"
                    onClick={() => setIsFiltersOpen((prev) => !prev)}
                  >
                    Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
                  </button>
                </div>
              </header>

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
                          <span>{formatTitleCase(marca)}</span>
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
                          <span>{formatTitleCase(categoria)}</span>
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

                <div className="moto-catalog-content">
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
                <select name="categoria" value={editForm.categoria} onChange={handleEditInputChange} required disabled>
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
                <select
                  name="modelo"
                  value={editForm.modelo}
                  onChange={handleEditInputChange}
                  required
                  disabled={!editForm.marca}
                >
                  <option value="">
                    {editForm.marca ? "Selecciona un modelo" : "Selecciona una marca primero"}
                  </option>
                  {meta.modelos
                    .filter((modelo) => String(modelo.marca) === String(editForm.marca))
                    .map((modelo) => (
                      <option key={modelo.id} value={modelo.id}>
                        {modelo.nombre} {modelo.marca_nombre ? `(${modelo.marca_nombre})` : ""}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                {yearLabel}
                <AdminYearDropdown
                  name="anio"
                  value={editForm.anio}
                  onChange={handleEditInputChange}
                  options={motoYearOptions}
                  placeholder={yearPlaceholder}
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
                Precio de lista *
                <input
                  name="precio_lista"
                  value={formatPrecioInput(editForm.precio_lista)}
                  onChange={handleEditInputChange}
                  inputMode="decimal"
                  placeholder="Ej: 9.990.000"
                  required
                />
              </label>

              <label className="moto-edit-span-2">
                Imagenes
                <div className="moto-edit-file-picker">
                  <input
                    ref={editFileInputRef}
                    className="moto-edit-file-hidden"
                    type="file"
                    name="imagenes_galeria"
                    accept="image/*"
                    multiple
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
                    {Array.isArray(editForm.imagenes_galeria) && editForm.imagenes_galeria.length > 0
                      ? `${editForm.imagenes_galeria.length} archivos seleccionados.`
                      : "No se ha seleccionado ningun archivo."}
                  </span>
                </div>
              </label>

              <label className="moto-edit-span-2">
                Video de presentacion (opcional)
                <input
                  type="url"
                  name="video_presentacion"
                  value={editForm.video_presentacion || ""}
                  onChange={handleEditInputChange}
                  placeholder="https://..."
                />
              </label>

              {(previewSrc || previewMaletasSrc) ? (
                <div className="moto-edit-preview-grid moto-edit-span-2">
                  {previewSrc ? (
                    <div className="moto-edit-preview">
                      <p>Vista previa principal</p>
                      <img src={previewSrc} alt={`${editingMoto.modelo || "Moto"} principal`} />
                    </div>
                  ) : null}
                  {previewMaletasSrc ? (
                    <div className="moto-edit-preview">
                      <p>Vista previa con maletas</p>
                      <img src={previewMaletasSrc} alt={`${editingMoto.modelo || "Moto"} con maletas`} />
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="moto-edit-checks-row moto-edit-span-2">
                <label className="moto-edit-check">
                  <input
                    type="checkbox"
                    name="permite_variante_maletas"
                    checked={Boolean(editForm.permite_variante_maletas)}
                    onChange={handleEditInputChange}
                  />
                  Habilitar variante con maletas
                </label>

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
              </div>

              {editForm.es_destacada && (
                <label className="moto-edit-span-2">
                  Orden carrusel *
                  <input
                    type="number"
                    name="orden_carrusel"
                    value={editForm.orden_carrusel}
                    onChange={handleEditInputChange}
                    min="1"
                    required={Boolean(editForm.es_destacada)}
                  />
                </label>
              )}

              {editForm.permite_variante_maletas && (
                <label>
                  Precio con maletas *
                  <input
                    name="precio_con_maletas"
                    value={formatPrecioInput(editForm.precio_con_maletas)}
                    onChange={handleEditInputChange}
                    inputMode="decimal"
                    placeholder="Ej: 9.990.000"
                    required
                  />
                </label>
              )}

              {editForm.permite_variante_maletas && (
                <label>
                  Precio de lista con maletas *
                  <input
                    name="precio_lista_con_maletas"
                    value={formatPrecioInput(editForm.precio_lista_con_maletas)}
                    onChange={handleEditInputChange}
                    inputMode="decimal"
                    placeholder="Ej: 11.490.000"
                    required
                  />
                </label>
              )}

              {editForm.permite_variante_maletas && (
                <label className="moto-edit-span-2">
                  Imagen con maletas *
                  <div className="moto-edit-file-picker">
                    <input
                      ref={editMaletasFileInputRef}
                      className="moto-edit-file-hidden"
                      type="file"
                      name="imagen_con_maletas"
                      accept="image/*"
                      onChange={handleEditInputChange}
                    />
                    <button
                      type="button"
                      className="moto-edit-file-btn"
                      onClick={() => editMaletasFileInputRef.current?.click()}
                    >
                      Examinar...
                    </button>
                    <span className="moto-edit-file-name">
                      {editForm.imagen_con_maletas?.name || "No se ha seleccionado ningun archivo."}
                    </span>
                  </div>
                </label>
              )}

              {editError && <p className="moto-edit-error">{editError}</p>}

              <div className="moto-edit-actions moto-edit-span-2">
                <button type="button" className="btn-secondary" onClick={closeEditModal} disabled={savingEdit}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={savingEdit}>
                  {"Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <AdminDeleteConfirmModal
        isOpen={Boolean(deleteCandidate)}
        isSaving={deletingMoto}
        title="Confirmar eliminacion"
        message={`Estas seguro que quieres eliminar la moto ${deleteCandidate?.modelo || deleteCandidate?.nombre || ""}?`}
        confirmLabel="Eliminar"
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteMoto}
      />

      <Footer />
    </div>
  );
}













