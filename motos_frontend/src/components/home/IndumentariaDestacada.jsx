import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildMediaUrl } from "../../services/apiConfig";
import { deleteProductoAdmin, getProductos } from "../../services/productosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/home.css";

export default function IndumentariaDestacada() {
  const fallbackImage = "https://via.placeholder.com/600x600?text=Sin+Imagen";
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProductos() {
      setLoading(true);
      setError("");
      try {
        const lista = await getProductos({ tipo: "indumentaria", order: "release" });
        if (!isMounted) return;
        setProductos(Array.isArray(lista) ? lista : []);
      } catch (err) {
        console.error("Error loading featured apparel:", err);
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
    } catch {
      window.alert("No se pudo eliminar el producto.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleEditProducto(event) {
    event.preventDefault();
    event.stopPropagation();
    navigate("/indumentaria");
  }

  return (
    <section className="destacadas destacadas-rider">
      <h2>Indumentaria Rider Destacada</h2>

      {loading ? (
        <p className="home-carousel-empty">Cargando productos...</p>
      ) : error ? (
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
                    src={
                      producto.imagen_principal
                        ? buildMediaUrl(producto.imagen_principal)
                        : fallbackImage
                    }
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  {isAdmin && (
                    <div className="home-product-admin-actions" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="home-product-admin-btn edit" title="Editar" onClick={handleEditProducto}>
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
                  <p className="home-product-brand">
                    {producto.marca_nombre || producto.marca || "SIN MARCA"}
                  </p>
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
    </section>
  );
}
