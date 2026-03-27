import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildFallbackImageDataUrl, buildMediaUrl } from "../services/apiConfig";
import { getProductoBySlug } from "../services/productosService";
import { trackCatalogView } from "../services/analyticsService";
import Navbar from "../components/layout/Navbar";
import Contacto from "../components/home/Contacto";
import "../styles/detalle.css";

export default function ProductoDetalle() {
  const { slug } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const fallbackImage = buildFallbackImageDataUrl({ width: 900, height: 600, text: "Sin Imagen" });

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setError("");
      try {
        const productoData = await getProductoBySlug(slug);

        if (!isMounted) return;
        setActiveImageIndex(0);
        setProducto(productoData);
        if (productoData) {
          const categoria = (productoData.categoria_nombre || "").toLowerCase();
          const tipoEntidad = categoria.includes("indumentaria") ? "indumentaria" : "accesorio";
          trackCatalogView({
            tipoEntidad,
            entidadId: productoData.id,
            entidadSlug: productoData.slug,
            entidadNombre: productoData.nombre || "",
            origen: `/productos/${slug}`,
            metadata: {
              categoria: productoData.subcategoria_nombre || "",
              marca: productoData.marca_nombre || "",
            },
          });
        }

      } catch (err) {
        console.error("Error loading product detail:", err);
        if (!isMounted) return;
        setError("No se pudo cargar la informacion de este producto.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) return null;

  if (!producto) {
    return (
      <div className="detalle-empty">
        <p>{error || "No encontramos este producto."}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const nombre = producto.nombre || producto.slug || "Producto";
  const categoriaSlug = String(producto.categoria_slug || "").toLowerCase();
  const esAccesorioMoto = categoriaSlug === "accesorios-para-la-moto" || categoriaSlug === "accesorios";
  const breadcrumbSectionLabel = esAccesorioMoto ? "Accesorios Motos" : "Indumentaria Rider";
  const breadcrumbSectionPath = esAccesorioMoto ? "/accesorios" : "/indumentaria";
  const descripcionRaw = producto.descripcion?.trim();
  const descripcion =
    descripcionRaw && descripcionRaw !== nombre
      ? descripcionRaw
      : "Producto ideal para complementar tu equipamiento rider con calidad y estilo.";
  const contactoProductoQuoteMessage = `Hola, quiero cotizar el producto ${nombre} de Delanoe Motos`;

  const galleryImages = (() => {
    const fromGallery = Array.isArray(producto?.imagenes) ? producto.imagenes : [];
    const candidates = [
      producto.imagen_principal ? buildMediaUrl(producto.imagen_principal) : "",
      ...fromGallery.map((item) => buildMediaUrl(item?.imagen || item)),
    ]
      .map((url) => String(url || "").trim())
      .filter(Boolean);
    const unique = [...new Set(candidates)];
    return unique.length > 0 ? unique : [fallbackImage];
  })();

  const activeImageSrc = galleryImages[activeImageIndex] || fallbackImage;

  return (
    <div className="detalle-page detalle-producto-page">
      <Navbar />

      <main className="detalle-main">
        <div className="detalle-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to={breadcrumbSectionPath}>{breadcrumbSectionLabel}</Link>
          <span>/</span>
          <span>{nombre}</span>
        </div>

        <section className="producto-hero-block">
          <h1 className="detalle-title detalle-title-producto">{nombre}</h1>

          <div className="producto-hero-image-wrap">
            <img
              src={activeImageSrc}
              alt={nombre}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="detalle-gallery-controls producto-gallery-controls">
              <button
                type="button"
                className="detalle-gallery-arrow"
                aria-label="Imagen anterior"
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              >
                {"<"}
              </button>
              <div className="detalle-gallery-thumbs">
                {galleryImages.map((imageSrc, index) => (
                  <button
                    key={`${imageSrc}-${index}`}
                    type="button"
                    className={index === activeImageIndex ? "detalle-gallery-thumb is-active" : "detalle-gallery-thumb"}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img src={imageSrc} alt={`${nombre} miniatura ${index + 1}`} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="detalle-gallery-arrow"
                aria-label="Imagen siguiente"
                onClick={() => setActiveImageIndex((prev) => (prev + 1 >= galleryImages.length ? 0 : prev + 1))}
              >
                {">"}
              </button>
            </div>
          )}

          <p className="detalle-price producto-price">${Number(producto.precio || 0).toLocaleString("es-CL")}</p>
        </section>

        <section className="producto-content-grid">
          <article className="detalle-description producto-description">
            <h2>Descripcion</h2>
            <p>{descripcion}</p>
          </article>

          <aside className="producto-impact-specs">
            <div className="moto-impact-grid">
              <article className="moto-impact-item">
                <h3>{String(producto.marca_nombre || "-").toUpperCase()}</h3>
                <p>Marca</p>
              </article>
              <article className="moto-impact-item">
                <h3>{String(producto.subcategoria_nombre || "-").toUpperCase()}</h3>
                <p>Categoria</p>
              </article>
            </div>
          </aside>
        </section>

        <Contacto showMapCta quoteMessage={contactoProductoQuoteMessage} />
      </main>
    </div>
  );
}
