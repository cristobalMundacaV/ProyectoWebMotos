import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildMediaUrl } from "../services/apiConfig";
import { getMotoBySlug } from "../services/motosService";
import { getContactoPublico } from "../services/productosService";
import { trackCatalogView } from "../services/analyticsService";
import Navbar from "../components/layout/Navbar";
import "../styles/detalle.css";

export default function MotoDetalle() {
  const { slug } = useParams();
  const [moto, setMoto] = useState(null);
  const [contacto, setContacto] = useState({
    instagram: "@motosnuevamarca",
    telefono: "+56 9 1234 5678",
    ubicacion: "Tu ciudad, Chile",
  });
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

        if (contactoData) {
          setContacto({
            instagram: contactoData.instagram || "",
            telefono: contactoData.telefono || "",
            ubicacion: contactoData.ubicacion || "",
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

  return (
    <div className="detalle-page">
      <Navbar />

      <main className="detalle-main">
        <div className="detalle-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Motos</Link>
          <span>/</span>
          <span>{modelo}</span>
        </div>

        <h1 className="detalle-title">{modelo}</h1>

        <section className="detalle-layout">
          <div className="detalle-image-wrap">
            <img
              src={buildMediaUrl(moto.imagen_principal)}
              alt={modelo}
            />
          </div>

          <aside className="detalle-side">
            <p className="detalle-price">
              ${Number(moto.precio).toLocaleString("es-CL")}
            </p>

            <div className="detalle-side-cards">
              <div className="detalle-data-card">
                <h3>Precio</h3>
                <div className="detalle-data-row">
                  <span>Categoría</span>
                  <span>{moto.categoria_nombre || "-"}</span>
                </div>
                <div className="detalle-data-row">
                  <span>Cilindrada</span>
                  <span>{moto.cilindrada}cc</span>
                </div>
                <div className="detalle-data-row">
                  <span>Marca</span>
                  <span>{moto.marca_nombre || "-"}</span>
                </div>
              </div>

              <div className="detalle-contact-card">
                <h3>Contáctanos</h3>
                <p>Instagram: {contacto.instagram || "No definido"}</p>
                <p>{contacto.telefono || "No definido"}</p>
                <p>{contacto.ubicacion || "No definido"}</p>
              </div>
            </div>

            <a
              className="detalle-cta"
              href={`https://wa.me/56912345678?text=Hola quiero cotizar la moto ${modelo}`}
              target="_blank"
              rel="noreferrer"
            >
              COTIZAR POR WHATSAPP
            </a>
          </aside>
        </section>

        <section className="detalle-description">
          <h2>Descripción</h2>
          <p>{descripcion}</p>
        </section>
      </main>
    </div>
  );
}
