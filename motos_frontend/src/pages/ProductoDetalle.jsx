import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductoBySlug, getContactoPublico } from "../services/productosService";
import Navbar from "../components/layout/Navbar";
import "../styles/detalle.css";

export default function ProductoDetalle() {
  const { slug } = useParams();
  const [producto, setProducto] = useState(null);
  const [contacto, setContacto] = useState({
    instagram: "@motosnuevamarca",
    telefono: "+56 9 1234 5678",
    ubicacion: "Tu ciudad, Chile",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [productoData, contactoData] = await Promise.all([
          getProductoBySlug(slug).catch(() => null),
          getContactoPublico().catch(() => null),
        ]);

        if (!isMounted) return;
        setProducto(productoData);

        if (contactoData) {
          setContacto({
            instagram: contactoData.instagram || "",
            telefono: contactoData.telefono || "",
            ubicacion: contactoData.ubicacion || "",
          });
        }
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

  if (!producto) {
    return (
      <div className="detalle-empty">
        <p>No encontramos este producto.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const nombre = producto.nombre || producto.slug || "Producto";
  const descripcionRaw = producto.descripcion?.trim();
  const descripcion =
    descripcionRaw && descripcionRaw !== nombre
      ? descripcionRaw
      : "Producto ideal para complementar tu equipamiento rider con calidad y estilo.";

  return (
    <div className="detalle-page detalle-producto-page">
      <Navbar />

      <main className="detalle-main">
        <div className="detalle-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>{nombre}</span>
        </div>

        <h1 className="detalle-title detalle-title-producto">{nombre}</h1>

        <section className="detalle-layout">
          <div className="detalle-image-wrap">
            <img
              src={
                producto.imagen_principal
                  ? `http://127.0.0.1:8000${producto.imagen_principal}`
                  : "https://via.placeholder.com/900x600?text=Sin+Imagen"
              }
              alt={nombre}
            />
          </div>

          <aside className="detalle-side">
            <p className="detalle-price">
              ${Number(producto.precio || 0).toLocaleString("es-CL")}
            </p>

            <div className="detalle-side-cards">
              <div className="detalle-data-card">
                <h3>Precio</h3>
                <div className="detalle-data-row">
                  <span>Categoria</span>
                  <span>{producto.subcategoria_nombre || "-"}</span>
                </div>
                <div className="detalle-data-row">
                  <span>Stock</span>
                  <span>{producto.stock ?? 0}</span>
                </div>
                <div className="detalle-data-row">
                  <span>Marca</span>
                  <span>{producto.marca_nombre || "-"}</span>
                </div>
              </div>

              <div className="detalle-contact-card">
                <h3>Contactanos</h3>
                <p>Instagram: {contacto.instagram || "No definido"}</p>
                <p>{contacto.telefono || "No definido"}</p>
                <p>{contacto.ubicacion || "No definido"}</p>
              </div>
            </div>

            <a
              className="detalle-cta"
              href={`https://wa.me/56912345678?text=Hola quiero cotizar el producto ${nombre}`}
              target="_blank"
              rel="noreferrer"
            >
              COTIZAR POR WHATSAPP
            </a>
          </aside>
        </section>

        <section className="detalle-description">
          <h2>Descripcion</h2>
          <p>{descripcion}</p>
        </section>
      </main>
    </div>
  );
}
