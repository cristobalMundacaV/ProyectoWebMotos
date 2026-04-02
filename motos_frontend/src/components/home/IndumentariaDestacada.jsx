import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductoEditModal from "../../admin/productos/components/ProductoEditModal";
import { buildAccesorioRiderPayload } from "../../admin/productos/controllers/productoPayloadBuilder";
import {
  getFileNameFromPath,
  normalizePrecioFromApi,
  normalizePrecioInput,
} from "../../admin/productos/controllers/productoAdapters";
import { buildFallbackImageDataUrl, buildMediaUrl } from "../../services/apiConfig";
import {
  deleteProductoAdmin,
  getAccesoriosRiderMeta,
  getProductos,
  updateProductoAdmin,
} from "../../services/productosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/home.css";
import "../../styles/admin.css";

function normalizeCompareLabel(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function resolveOptionIdByNombre(options, explicitId, explicitNombre) {
  if (explicitId !== undefined && explicitId !== null && explicitId !== "") {
    return String(explicitId);
  }
  const target = normalizeCompareLabel(explicitNombre);
  if (!target) return "";
  const match = options.find((item) => normalizeCompareLabel(item.nombre) === target);
  return match ? String(match.id) : "";
}

function buildSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function IndumentariaDestacada() {
  const fallbackImage = buildFallbackImageDataUrl({ width: 600, height: 600, text: "Sin Imagen" });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const trackRef = useRef(null);
  const [accesoriosRiderMeta, setAccesoriosRiderMeta] = useState({ subcategorias: [], marcas: [] });
  const [accesorioRiderEditModal, setAccesorioRiderEditModal] = useState(null);
  const [accesorioRiderEditSaving, setAccesorioRiderEditSaving] = useState(false);
  const [accesorioRiderEditError, setAccesorioRiderEditError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  useEffect(() => {
    if (!feedback.message) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [feedback.message]);

  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;
    getAccesoriosRiderMeta()
      .then((meta) => {
        if (!isMounted) return;
        setAccesoriosRiderMeta({
          subcategorias: Array.isArray(meta?.subcategorias) ? meta.subcategorias : [],
          marcas: Array.isArray(meta?.marcas) ? meta.marcas : [],
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setAccesoriosRiderMeta({ subcategorias: [], marcas: [] });
      });
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    let isMounted = true;

    async function loadProductos() {
      setLoading(true);
      setError("");
      try {
        const lista = await getProductos({ tipo: "indumentaria", order: "release" });
        if (!isMounted) return;
        setProductos(Array.isArray(lista) ? lista : []);
      } catch {
        if (!isMounted) return;
        setError("No se pudieron cargar los productos destacados.");
        setProductos([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductos();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      setAccesorioRiderEditModal((prev) => {
        if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
        return prev;
      });
    };
  }, []);

  const destacados = useMemo(() => {
    const items = Array.isArray(productos) ? productos : [];
    const selected = items.filter((item) => item?.es_destacado);
    return (selected.length > 0 ? selected : items)
      .sort((a, b) => (a?.orden_carrusel ?? 1) - (b?.orden_carrusel ?? 1) || (a?.id ?? 0) - (b?.id ?? 0))
      .slice(0, 12);
  }, [productos]);

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.querySelectorAll(".carousel-item"));
    if (items.length === 0) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenterX = trackRect.left + trackRect.width / 2;

    let activeIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenterX - trackCenterX);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    const targetIndex = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
    items[targetIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  async function handleDeleteProducto(event, producto) {
    event.preventDefault();
    event.stopPropagation();
    if (!producto?.id || deletingId) return;

    const confirmed = window.confirm(`Estas seguro que quieres eliminar ${producto.nombre}?`);
    if (!confirmed) return;

    setDeletingId(producto.id);
    try {
      await deleteProductoAdmin(producto.id);
      setProductos((prev) => (Array.isArray(prev) ? prev.filter((item) => item.id !== producto.id) : []));
      setFeedback({ type: "success", message: "Producto eliminado correctamente." });
    } catch {
      setFeedback({ type: "error", message: "No se pudo eliminar el producto." });
    } finally {
      setDeletingId(null);
    }
  }

  function handleEditProducto(event, producto) {
    event.preventDefault();
    event.stopPropagation();

    const subcategoriaId = resolveOptionIdByNombre(
      accesoriosRiderMeta.subcategorias,
      producto.subcategoria,
      producto.subcategoria_nombre || producto.subcategoria_display || producto.subcategoria_label
    );
    const marcaId = resolveOptionIdByNombre(
      accesoriosRiderMeta.marcas,
      producto.marca,
      producto.marca_nombre || producto.marca_display || producto.marca_label
    );

    setAccesorioRiderEditError("");
    setAccesorioRiderEditModal({
      id: producto.id,
      title: producto.nombre || "Editar accesorio rider",
      kind: "accesorio_rider",
      originalImageUrl: buildMediaUrl(producto.imagen_principal) || "",
      originalImageName: getFileNameFromPath(producto.imagen_principal),
      imagePreviewUrl: buildMediaUrl(producto.imagen_principal) || "",
      imageFileName: getFileNameFromPath(producto.imagen_principal),
      previewIsObjectUrl: false,
      imageInputKey: Date.now(),
      currentImageIds: Array.isArray(producto.imagenes) ? producto.imagenes.map((item) => item.id).filter(Boolean) : [],
      form: {
        subcategoria: subcategoriaId,
        marca: marcaId,
        nombre: producto.nombre || "",
        slug: producto.slug || buildSlug(producto.nombre || ""),
        descripcion: producto.descripcion || "",
        precio: normalizePrecioFromApi(producto.precio),
        orden_carrusel: String(producto.orden_carrusel ?? "1"),
        es_destacado: Boolean(producto.es_destacado),
        activo: producto.activo !== false,
        imagen_principal: null,
        imagenes_galeria: [],
        imagenes_eliminar: [],
        remove_imagen_principal: false,
      },
    });
  }

  function closeAccesorioRiderEditModal(forceClose = false) {
    if (accesorioRiderEditSaving && !forceClose) return;
    setAccesorioRiderEditModal((prev) => {
      if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return null;
    });
    setAccesorioRiderEditError("");
  }

  function handleAccesorioRiderEditInputChange(event) {
    const { name, type, value, checked, files } = event.target;
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      const galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
      const nextValue =
        type === "checkbox"
          ? checked
          : type === "file"
            ? name === "imagenes_galeria"
              ? galleryFiles
              : files?.[0] || null
            : value;

      if (type === "file") {
        if (prev.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
        const primaryImage = name === "imagenes_galeria" ? (Array.isArray(nextValue) ? nextValue[0] : null) : nextValue;
        if (primaryImage) {
          nextImagePreviewUrl = URL.createObjectURL(primaryImage);
          nextPreviewIsObjectUrl = true;
          nextImageFileName = primaryImage.name;
        } else {
          nextImagePreviewUrl = prev.originalImageUrl || "";
          nextPreviewIsObjectUrl = false;
          nextImageFileName = prev.originalImageName || "";
        }
      }

      const nextForm = { ...prev.form, [name]: nextValue };
      if (type === "file" && name === "imagenes_galeria" && Array.isArray(nextValue) && nextValue.length > 0) {
        nextForm.imagenes_eliminar = [];
        nextForm.remove_imagen_principal = false;
      }
      if (name === "nombre") {
        nextForm.slug = buildSlug(nextForm.nombre);
      }

      return {
        ...prev,
        form: nextForm,
        imagePreviewUrl: nextImagePreviewUrl,
        previewIsObjectUrl: nextPreviewIsObjectUrl,
        imageFileName: nextImageFileName,
      };
    });
  }

  function handleAccesorioRiderEditPrecioInputChange(event) {
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        form: {
          ...prev.form,
          precio: precioNormalizado,
        },
      };
    });
  }

  function removeAccesorioRiderEditImage() {
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      if (prev.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return {
        ...prev,
        imagePreviewUrl: "",
        imageFileName: "",
        originalImageUrl: "",
        originalImageName: "",
        previewIsObjectUrl: false,
        imageInputKey: Date.now(),
        form: {
          ...prev.form,
          imagen_principal: null,
          imagenes_galeria: [],
          imagenes_eliminar: Array.isArray(prev.currentImageIds) ? prev.currentImageIds : [],
          remove_imagen_principal: true,
        },
      };
    });
  }

  async function submitAccesorioRiderEditModal(event) {
    event.preventDefault();
    if (!accesorioRiderEditModal) return;
    setAccesorioRiderEditSaving(true);
    setAccesorioRiderEditError("");
    const payload = buildAccesorioRiderPayload(accesorioRiderEditModal.form);
    try {
      const updatedAccesorio = await updateProductoAdmin(accesorioRiderEditModal.id, payload);
      setProductos((prev) => (Array.isArray(prev) ? prev.map((item) => (item.id === accesorioRiderEditModal.id ? updatedAccesorio : item)) : prev));
      setFeedback({ type: "success", message: "Producto actualizado correctamente." });
      closeAccesorioRiderEditModal(true);
    } catch {
      setAccesorioRiderEditError("No se pudo actualizar el producto.");
    } finally {
      setAccesorioRiderEditSaving(false);
    }
  }

  return (
    <section className="destacadas destacadas-rider">
      <h2>Indumentaria Rider Destacada</h2>
      {feedback.message ? <p className="home-carousel-empty">{feedback.message}</p> : null}

      {loading ? null : error ? (
        <p className="home-carousel-empty">{error}</p>
      ) : (
        <div className="carousel-wrapper carousel-wrapper-rider">
          <button className="carousel-btn carousel-btn--prev" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5L8 12l6.5 6.5" />
            </svg>
          </button>

          <div className="carousel-track carousel-track-rider" ref={trackRef}>
            {destacados.map((producto) => (
              <Link
                className="home-product-card home-product-card-clickable home-product-card-link carousel-item carousel-item-rider"
                key={producto.id}
                to={`/producto/${producto.slug}`}
                aria-label={`Ver detalles de ${producto.nombre}`}
              >
                <div className="home-product-image">
                  <img
                    src={producto.imagen_principal ? buildMediaUrl(producto.imagen_principal) : fallbackImage}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  {isAdmin && (
                    <div className="home-product-admin-actions" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="home-product-admin-btn edit" title="Editar" onClick={(event) => handleEditProducto(event, producto)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button
                        type="button"
                        className="home-product-admin-btn delete"
                        title="Eliminar"
                        onClick={(event) => handleDeleteProducto(event, producto)}
                        disabled={deletingId === producto.id}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="home-product-body">
                  <p className="home-product-brand">{producto.marca_nombre || producto.marca || "SIN MARCA"}</p>
                  <h3>{producto.nombre}</h3>
                  <div className="home-product-bottom-row">
                    <p>${Number(producto.precio || 0).toLocaleString("es-CL")}</p>
                    <span className="home-product-link">Detalles</span>
                  </div>
                </div>
              </Link>
            ))}

            {destacados.length === 0 && (
              <div className="home-carousel-empty">No hay productos destacados por ahora.</div>
            )}
          </div>

          <button className="carousel-btn carousel-btn--next" onClick={() => scroll(1)} aria-label="Siguiente">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 5.5L16 12l-6.5 6.5" />
            </svg>
          </button>
        </div>
      )}

      <ProductoEditModal
        productoEditModal={accesorioRiderEditModal}
        productoMeta={accesoriosRiderMeta}
        productoEditSaving={accesorioRiderEditSaving}
        productoEditError={accesorioRiderEditError}
        fallbackImage={fallbackImage}
        onClose={closeAccesorioRiderEditModal}
        onSubmit={submitAccesorioRiderEditModal}
        onInputChange={handleAccesorioRiderEditInputChange}
        onPrecioInputChange={handleAccesorioRiderEditPrecioInputChange}
        onToggleCompatibilidad={null}
        onRemoveImage={removeAccesorioRiderEditImage}
      />
    </section>
  );
}
