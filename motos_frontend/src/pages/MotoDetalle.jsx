import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { buildMediaUrl } from "../services/apiConfig";
import { getMotoBySlug, getMotoFichaTecnica } from "../services/motosService";
import { getContactoPublico } from "../services/productosService";
import { trackCatalogView } from "../services/analyticsService";
import { buildWhatsAppUrl } from "../services/contactoUtils";
import Navbar from "../components/layout/Navbar";
import "../styles/detalle.css";

export default function MotoDetalle() {
  const { slug } = useParams();
  const [moto, setMoto] = useState(null);
  const [seccionesFicha, setSeccionesFicha] = useState([]);
  const [openTechSection, setOpenTechSection] = useState("");
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
        let fichaData = null;

        if (motoData?.id) {
          try {
            fichaData = await getMotoFichaTecnica(motoData.id);
          } catch {
            fichaData = null;
          }
        }

        if (!isMounted) return;
        setMoto(motoData);
        setSeccionesFicha(Array.isArray(fichaData?.secciones_ficha) ? fichaData.secciones_ficha : []);
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

  useEffect(() => {
    if (!Array.isArray(seccionesFicha) || seccionesFicha.length === 0) {
      setOpenTechSection("");
      return;
    }
    setOpenTechSection(seccionesFicha[0]?.nombre || "");
  }, [moto?.id, seccionesFicha]);

  const seccionesFichaOrdenadas = useMemo(
    () =>
      (Array.isArray(seccionesFicha) ? seccionesFicha : [])
        .map((section) => ({
          ...section,
          orden: Number(section?.orden ?? 999),
          items: (Array.isArray(section?.items) ? section.items : [])
            .map((item) => ({ ...item, orden: Number(item?.orden ?? 999) }))
            .sort((a, b) => a.orden - b.orden || String(a?.nombre || "").localeCompare(String(b?.nombre || ""), "es")),
        }))
        .sort((a, b) => a.orden - b.orden || String(a?.nombre || "").localeCompare(String(b?.nombre || ""), "es")),
    [seccionesFicha]
  );

  const tieneFichaTecnica = seccionesFichaOrdenadas.length > 0;

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

        <section className="moto-tech-specs">
          <h2 className="moto-tech-title">ESPECIFICACIONES TECNICAS</h2>

          {!tieneFichaTecnica && (
            <p className="moto-tech-empty">No hay ficha tecnica disponible para este modelo.</p>
          )}

          {tieneFichaTecnica &&
            seccionesFichaOrdenadas.map((seccion) => {
              const isOpen = openTechSection === seccion.nombre;
              const icon = isOpen ? "-" : "+";
              return (
                <article key={seccion.nombre} className="moto-tech-section">
                  <button
                    type="button"
                    className={isOpen ? "moto-tech-section-head is-open" : "moto-tech-section-head"}
                    onClick={() => setOpenTechSection(isOpen ? "" : seccion.nombre)}
                    aria-expanded={isOpen}
                  >
                    <span>{String(seccion.nombre || "").toUpperCase()}</span>
                    <span>{icon}</span>
                  </button>

                  {isOpen && (
                    <div className="moto-tech-section-body">
                      {(Array.isArray(seccion.items) ? seccion.items : []).map((item, index) => (
                        <div
                          key={`${seccion.nombre}-${item.nombre}-${index}`}
                          className={index % 2 === 1 ? "moto-tech-row is-alt" : "moto-tech-row"}
                        >
                          <span className="moto-tech-label">{item.nombre}</span>
                          <span className="moto-tech-value">{item.valor || "-"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
        </section>
      </main>
    </div>
  );
}
