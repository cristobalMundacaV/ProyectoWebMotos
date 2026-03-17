import { useEffect, useState } from "react";
import { getContactoPublico } from "../../services/productosService";
import "../../styles/home.css";

export default function Contacto() {
  const [contacto, setContacto] = useState({
    instagram: "@motosnuevamarca",
    telefono: "+56 9 1234 5678",
    ubicacion: "Tu ciudad, Chile",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadContacto() {
      try {
        const data = await getContactoPublico();
        if (!isMounted || !data) return;
        setContacto({
          instagram: data.instagram || "",
          telefono: data.telefono || "",
          ubicacion: data.ubicacion || "",
        });
      } catch {
        // Keep fallback values if request fails.
      }
    }

    loadContacto();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="contacto" id="contacto">
      <h2>Contáctanos</h2>
      <div className="contacto-box">
        <div>
          <h3>Instagram</h3>
          <p>{contacto.instagram || "No definido"}</p>
        </div>
        <div>
          <h3>Teléfono</h3>
          <p>{contacto.telefono || "No definido"}</p>
        </div>
        <div>
          <h3>Ubicación</h3>
          <p>{contacto.ubicacion || "No definido"}</p>
        </div>
      </div>
    </section>
  );
}
