import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProductos } from "../../services/productosService";
import "../../styles/home.css";

export default function IndumentariaDestacada() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  const SCROLL_AMOUNT = 460;

  useEffect(() => {
    let isMounted = true;

    async function loadProductos() {
      setLoading(true);
      try {
        const lista = await getProductos({ tipo: "indumentaria", order: "release" });
        if (!isMounted) return;
        setProductos(Array.isArray(lista) ? lista : []);
      } catch {
        if (!isMounted) return;
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
    return (selected.length > 0 ? selected : items).slice(0, 12);
  }, [productos]);

  function scroll(direction) {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
    }
  }

  return (
    <section className="destacadas destacadas-rider">
      <h2>Indumentaria Rider Destacada</h2>

      {loading ? (
        <p className="home-carousel-empty">Cargando productos...</p>
      ) : (
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-btn--prev" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5L8 12l6.5 6.5" />
            </svg>
          </button>

          <div className="carousel-track" ref={trackRef}>
            {destacados.map((producto) => (
              <article className="home-product-card carousel-item" key={producto.id}>
                <div className="home-product-image">
                  <img
                    src={
                      producto.imagen_principal
                        ? `http://127.0.0.1:8000${producto.imagen_principal}`
                        : "https://via.placeholder.com/600x600?text=Sin+Imagen"
                    }
                    alt={producto.nombre}
                    loading="lazy"
                  />
                </div>
                <div className="home-product-body">
                  <p className="home-product-brand">
                    {producto.marca_nombre || producto.marca || "SIN MARCA"}
                  </p>
                  <h3>{producto.nombre}</h3>
                  <div className="home-product-bottom-row">
                    <p>${Number(producto.precio || 0).toLocaleString("es-CL")}</p>
                    <Link className="home-product-link" to={`/producto/${producto.slug}`}>
                      Detalles
                    </Link>
                  </div>
                </div>
              </article>
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
