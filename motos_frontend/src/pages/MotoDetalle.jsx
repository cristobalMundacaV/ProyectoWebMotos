import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildMediaUrl } from "../services/apiConfig";
import { getMotoBySlug } from "../services/motosService";
import { getContactoPublico } from "../services/productosService";
import { trackCatalogView } from "../services/analyticsService";
import { buildWhatsAppUrl } from "../services/contactoUtils";
import Navbar from "../components/layout/Navbar";
import "../styles/detalle.css";

export default function MotoDetalle() {
  const { slug } = useParams();
  const [moto, setMoto] = useState(null);
  const [varianteConMaletas, setVarianteConMaletas] = useState(false);
  const [telefonoContacto, setTelefonoContacto] = useState("+56 9 1234 5678");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setError("");
      try {
        const [motoData, contactoData] = await Promise.all([getMotoBySlug(slug), getContactoPublico()]);

        if (!isMounted) return;
        setMoto(motoData);
        if (contactoData?.telefono) {
          setTelefonoContacto(contactoData.telefono);
        }
        if (motoData) {
          trackCatalogView({
            tipoEntidad: "moto",
            entidadId: motoData.id,
            entidadSlug: motoData.slug,
            entidadNombre: motoData.modelo || motoData.nombre || "",
            origen: `/motos/${slug}`,
            metadata: {
              marca: motoData.marca_nombre || "",
              categoria: motoData.categoria_nombre || "",
            },
          });
        }
      } catch (err) {
        console.error("Error loading moto detail:", err);
        if (!isMounted) return;
        setError("No se pudo cargar la informacion de esta moto.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    setVarianteConMaletas(false);
  }, [moto?.id]);

  if (loading) {
    return <p className="detalle-loading">Cargando detalle...</p>;
  }

  if (!moto) {
    return (
      <div className="detalle-empty">
        <p>{error || "No encontramos esta moto."}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const modelo = moto.modelo || moto.nombre;
  const descripcionRaw = moto.descripcion?.trim();
  const descripcion =
    descripcionRaw && descripcionRaw !== modelo
      ? descripcionRaw
      : "Motocicleta ideal para ciudad y aventura, con excelente equilibrio entre potencia, comodidad y estilo.";

  const categoria = moto.categoria_nombre || "-";
  const marca = moto.marca_nombre || "-";
  const cilindrada = moto.cilindrada ? `${moto.cilindrada}cc` : "-";

  const tieneVarianteMaletas = Boolean(
    moto.permite_variante_maletas && moto.precio_con_maletas && moto.imagen_con_maletas
  );

  const imagenActual =
    tieneVarianteMaletas && varianteConMaletas ? moto.imagen_con_maletas : moto.imagen_principal;

  const precioDesdeActual =
    tieneVarianteMaletas && varianteConMaletas ? moto.precio_con_maletas : moto.precio;

  const precioListaActual =
    tieneVarianteMaletas && varianteConMaletas
      ? moto.precio_lista_con_maletas || moto.precio_lista || moto.precio_con_maletas
      : moto.precio_lista || moto.precio;

  const cuota24 = Math.round(Number(precioListaActual || 0) / 24);
  const etiquetaVariante = varianteConMaletas ? "con maletas" : "sin maletas";

  const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-CL")}`;

  const whatsappHref = buildWhatsAppUrl(
    telefonoContacto,
    `Hola quiero cotizar la moto ${modelo}${tieneVarianteMaletas ? ` (${etiquetaVariante})` : ""}`
  );

  return (
    <div className="detalle-page detalle-moto-page">
      <Navbar />

      <main className="detalle-main">
        <div className="detalle-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Motos</Link>
          <span>/</span>
          <span>{modelo}</span>
        </div>

        <section className="moto-hero-block">
          <h1 className="moto-floating-title">{modelo}</h1>

          <div className="moto-hero-image-wrap">
            <img src={buildMediaUrl(imagenActual)} alt={`${modelo} ${etiquetaVariante}`} />
          </div>

          {tieneVarianteMaletas && (
            <button
              type="button"
              className={`moto-variant-toggle ${varianteConMaletas ? "is-on" : "is-off"}`}
              onClick={() => setVarianteConMaletas((prev) => !prev)}
              aria-pressed={varianteConMaletas}
              aria-label={varianteConMaletas ? "Cambiar a sin maletas" : "Cambiar a con maletas"}
            >
              <span className="moto-variant-pill" aria-hidden="true">
                <span className="moto-variant-dot" />
              </span>
              <span className="moto-variant-label">{varianteConMaletas ? "CON MALETAS" : "SIN MALETAS"}</span>
            </button>
          )}
        </section>

        <section className="moto-pricing-block">
          <p className="moto-cuotas-label">24 CUOTAS SIN INTERES DE</p>
          <p className="moto-cuotas-value">{formatPrice(cuota24)}</p>
          <p className="moto-precio-desde">PRECIO DESDE {formatPrice(precioDesdeActual)}</p>
        </section>

        <section className="moto-floating-content-grid">
          <article className="moto-description-card">
            <h2>Descripcion</h2>
            <p>{descripcion}</p>
          </article>

          <aside className="moto-specs-card">
            <h3>Especificaciones</h3>
            <div className="detalle-data-row">
              <span>Categoria</span>
              <span>{categoria}</span>
            </div>
            <div className="detalle-data-row">
              <span>Marca</span>
              <span>{marca}</span>
            </div>
            <div className="detalle-data-row">
              <span>Modelo</span>
              <span>{modelo}</span>
            </div>
            <div className="detalle-data-row">
              <span>Cilindrada</span>
              <span>{cilindrada}</span>
            </div>

            <a className="detalle-cta" href={whatsappHref || "#"} target="_blank" rel="noreferrer">
              COTIZAR POR WHATSAPP
            </a>
          </aside>
        </section>
      </main>
    </div>
  );
}
