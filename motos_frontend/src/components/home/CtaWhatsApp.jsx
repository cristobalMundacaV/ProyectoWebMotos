import { useEffect, useState } from "react";
import { getContactoPublico } from "../../services/productosService";
import { buildWhatsAppUrl } from "../../services/contactoUtils";
import "../../styles/home.css";

export default function CtaWhatsApp() {
  const [telefono, setTelefono] = useState("+56 9 1234 5678");
  const whatsappHref = buildWhatsAppUrl(telefono, "Hola, quiero cotizar una moto");

  useEffect(() => {
    let isMounted = true;

    async function loadContacto() {
      try {
        const data = await getContactoPublico();
        if (!isMounted || !data?.telefono) return;
        setTelefono(data.telefono);
      } catch {
        // Keep fallback phone if request fails.
      }
    }

    loadContacto();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="cta-whatsapp">
      <h2>{"¿Buscas tu próxima moto?"}</h2>
      <a href={whatsappHref || "#"} target="_blank" rel="noreferrer">
        Cotizar por WhatsApp
      </a>
    </section>
  );
}
