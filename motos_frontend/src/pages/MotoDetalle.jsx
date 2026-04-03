import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { buildMediaUrl } from "../services/apiConfig";
import { getMotoBySlug, getMotoFichaTecnica } from "../services/motosService";
import { trackCatalogView } from "../services/analyticsService";
import Navbar from "../components/layout/Navbar";
import Contacto from "../components/home/Contacto";
import "../styles/detalle.css";

function normalizeLabel(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function hasEnteredValue(value) {
  const normalized = String(value ?? "").trim();
  return Boolean(normalized) && normalized !== "-";
}

function formatFichaItemLabel(itemName) {
  const key = normalizeLabel(itemName);
  if (key === "cubre punos") return "Cubre Puños";
  return itemName;
}

function extractImageValue(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object") return image.imagen || image.url || "";
  return "";
}

function normalizeImageKey(image) {
  const rawValue = String(extractImageValue(image) || "").trim();
  if (!rawValue) return "";

  let pathname = rawValue;

  try {
    pathname = new URL(rawValue, "http://local.test").pathname || rawValue;
  } catch {
    pathname = rawValue;
  }

  const normalizedPath = pathname.replace(/\\/g, "/").split("?")[0].split("#")[0].toLowerCase();
  const fileName = normalizedPath.split("/").pop() || normalizedPath;
  const fileStem = fileName.replace(/\.[a-z0-9]+$/i, "");

  return fileStem || normalizedPath;
}

function buildDistinctGalleryImages(primaryImage, galleryImages = []) {
  const uniqueImages = new Map();
  const candidates = [primaryImage, ...(Array.isArray(galleryImages) ? galleryImages : [])];

  candidates.forEach((image) => {
    const key = normalizeImageKey(image);
    const source = extractImageValue(image);
    const url = buildMediaUrl(source);

    if (!key || !url || uniqueImages.has(key)) {
      return;
    }

    uniqueImages.set(key, url);
  });

  return Array.from(uniqueImages.values());
}

export default function MotoDetalle() {
  const { slug } = useParams();
  const [moto, setMoto] = useState(null);
  const [seccionesFicha, setSeccionesFicha] = useState([]);
  const [openTechSection, setOpenTechSection] = useState("");
  const [varianteConMaletas, setVarianteConMaletas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setError("");
      try {
        const motoData = await getMotoBySlug(slug);
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
    setActiveImageIndex(0);
  }, [moto?.id, varianteConMaletas]);

  useEffect(() => {
    if (!Array.isArray(seccionesFicha) || seccionesFicha.length === 0) {
      setOpenTechSection("");
      return;
    }
    setOpenTechSection("");
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

  const seccionesFichaConValores = useMemo(
    () =>
      seccionesFichaOrdenadas
        .map((section) => ({
          ...section,
          items: (Array.isArray(section.items) ? section.items : []).filter((item) => hasEnteredValue(item.valor)),
        }))
        .filter((section) => section.items.length > 0),
    [seccionesFichaOrdenadas]
  );

  useEffect(() => {
    if (seccionesFichaConValores.length === 0) {
      setOpenTechSection("");
      return;
    }
    // Permite que el usuario cierre todas las secciones sin auto-reapertura.
    if (openTechSection === "") {
      return;
    }
    if (!seccionesFichaConValores.some((section) => section.nombre === openTechSection)) {
      setOpenTechSection(seccionesFichaConValores[0].nombre);
    }
  }, [seccionesFichaConValores, openTechSection]);

  const tieneFichaTecnica = seccionesFichaConValores.length > 0;
  const fichaItemsMap = useMemo(() => {
    const map = new Map();
    seccionesFichaConValores.forEach((section) => {
      (section.items || []).forEach((item) => {
        map.set(normalizeLabel(item.nombre), String(item.valor || "").trim());
      });
    });
    return map;
  }, [seccionesFichaConValores]);

  function getFichaValue(...labels) {
    for (const label of labels) {
      const value = fichaItemsMap.get(normalizeLabel(label));
      if (hasEnteredValue(value)) return String(value).trim();
    }
    return "";
  }

  if (loading) return null;

  if (!moto) {
    return (
      <div className="detalle-empty">
        <p>{error || "No encontramos esta moto."}</p>
        <Link to="/" className="detalle-empty-link">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const modelo = moto.modelo || moto.nombre;
  const cilindradaLabel =
    moto.cilindrada && Number(moto.cilindrada) > 0
      ? `${Number(moto.cilindrada).toLocaleString("es-CL")} cc`
      : "";
  const descripcionRaw = moto.descripcion?.trim();
  const descripcion =
    descripcionRaw && descripcionRaw !== modelo
      ? descripcionRaw
      : "Motocicleta ideal para ciudad y aventura, con excelente equilibrio entre potencia, comodidad y estilo.";

  const tieneVarianteMaletas = Boolean(
    moto.permite_variante_maletas && moto.precio_con_maletas && moto.imagen_con_maletas
  );

  const imagenActual =
    tieneVarianteMaletas && varianteConMaletas ? moto.imagen_con_maletas : moto.imagen_principal;

  const galleryImages = buildDistinctGalleryImages(imagenActual, moto?.imagenes);
  const hasMultipleImages = galleryImages.length > 1;

  const activeImageSrc = galleryImages[activeImageIndex] || "";

  const precioDesdeActual =
    tieneVarianteMaletas && varianteConMaletas ? moto.precio_con_maletas : moto.precio;

  const precioListaActual =
    tieneVarianteMaletas && varianteConMaletas
      ? moto.precio_lista_con_maletas || moto.precio_lista || moto.precio_con_maletas
      : moto.precio_lista || moto.precio;

  const cuota24 = Math.round(Number(precioListaActual || 0) / 24);
  const etiquetaVariante = varianteConMaletas ? "con maletas" : "sin maletas";
  const marcaModeloMoto = [moto.marca_nombre, modelo].filter(Boolean).join(" ").trim();
  const contactoMotoQuoteMessage = `Hola, quiero cotizar la moto ${
    marcaModeloMoto || modelo
  } de Delanoe Motos`;

  const formatPrice = (value) => `$${Number(value || 0).toLocaleString("es-CL")}`;

  const metricasFicha = [
    { value: getFichaValue("Potencia Maxima"), label: "Potencia Maxima" },
    { value: getFichaValue("Par maximo"), label: "Par maximo" },
    { value: getFichaValue("Consumo homologado"), label: "Consumo homologado" },
    { value: getFichaValue("Frenos", "Sistema de frenos Brembo y Nissin"), label: "Frenos" },
  ].filter((item) => hasEnteredValue(item.value));
  const rawVideoUrl = String(moto.video_presentacion || "").trim();
  const videoPresentationUrl = rawVideoUrl ? buildMediaUrl(rawVideoUrl) : "";
  const isYouTubeUrl = /(?:youtube\.com|youtu\.be)/i.test(videoPresentationUrl);
  const isVimeoUrl = /vimeo\.com/i.test(videoPresentationUrl);
  const videoEmbedUrl = (() => {
    if (!videoPresentationUrl) return "";
    if (isYouTubeUrl) {
      const watchMatch = videoPresentationUrl.match(/[?&]v=([^&]+)/i);
      const shortMatch = videoPresentationUrl.match(/youtu\.be\/([^?&]+)/i);
      const embedMatch = videoPresentationUrl.match(/youtube\.com\/embed\/([^?&]+)/i);
      const videoId = watchMatch?.[1] || shortMatch?.[1] || embedMatch?.[1] || "";
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
    if (isVimeoUrl) {
      const idMatch = videoPresentationUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
      return idMatch?.[1] ? `https://player.vimeo.com/video/${idMatch[1]}` : "";
    }
    return "";
  })();

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
            {activeImageSrc ? <img src={activeImageSrc} alt={`${modelo} ${etiquetaVariante}`} /> : null}
            {hasMultipleImages && (
              <div className="detalle-gallery-controls moto-gallery-controls">
                <button
                  type="button"
                  className="detalle-gallery-arrow"
                  aria-label="Imagen anterior"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
                  }
                >
                  ‹
                </button>
                <div className="detalle-gallery-thumbs moto-gallery-thumbs">
                  {galleryImages.map((imageSrc, index) => (
                    <button
                      key={`${imageSrc}-${index}`}
                      type="button"
                      className={index === activeImageIndex ? "detalle-gallery-thumb is-active" : "detalle-gallery-thumb"}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <img src={imageSrc} alt={`${modelo} miniatura ${index + 1}`} />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="detalle-gallery-arrow"
                  aria-label="Imagen siguiente"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev + 1 >= galleryImages.length ? 0 : prev + 1))
                  }
                >
                  ›
                </button>
              </div>
            )}
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
          {cilindradaLabel ? <p className="moto-cuotas-label">CILINDRADA {cilindradaLabel}</p> : null}
        </section>

        <section className="moto-floating-content-grid">
          <article className="moto-description-card">
            <h2>Descripcion</h2>
            <p>{descripcion}</p>
          </article>

          <aside className="moto-impact-specs">
            {metricasFicha.length > 0 && (
              <div className="moto-impact-grid">
                {metricasFicha.map((item) => (
                  <article key={item.label} className="moto-impact-item">
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </section>

        {videoPresentationUrl && (
          <section className="moto-video-section">
            {videoEmbedUrl ? (
              <iframe
                className="moto-video-player"
                src={videoEmbedUrl}
                title={`Video de ${modelo}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                className="moto-video-player"
                controls
                preload="metadata"
                playsInline
                src={videoPresentationUrl}
              />
            )}
          </section>
        )}

        <section className="moto-tech-specs">
          <h2 className="moto-tech-title">ESPECIFICACIONES TECNICAS</h2>

          {!tieneFichaTecnica && (
            <p className="moto-tech-empty">No hay ficha tecnica disponible para este modelo.</p>
          )}

          {tieneFichaTecnica &&
            seccionesFichaConValores.map((seccion) => {
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
                          <span className="moto-tech-label">{formatFichaItemLabel(item.nombre)}</span>
                          <span className="moto-tech-value">{item.valor}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
        </section>

        <Contacto showMapCta quoteMessage={contactoMotoQuoteMessage} />
      </main>
    </div>
  );
}
