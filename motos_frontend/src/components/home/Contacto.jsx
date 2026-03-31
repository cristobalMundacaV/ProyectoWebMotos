import { useEffect, useState } from "react";
import { getContactoPublico } from "../../services/productosService";
import { buildWhatsAppUrl } from "../../services/contactoUtils";
import { INSTAGRAM_PROFILE_URL } from "../../services/socialLinks";
import "../../styles/home.css";

function buildGeoLabel(address) {
  if (!address) return "";
  const city = address.city || address.town || address.village || address.state || "";
  const country = address.country || "";
  return [city, country].filter(Boolean).join(", ");
}

export default function Contacto({ showMapCta = false, quoteMessage = "" }) {
  const [contacto, setContacto] = useState({
    instagram: "@motosnuevamarca",
    telefono: "+56 9 1234 5678",
    ubicacion: "Tu ciudad, Chile",
  });
  const [geoUbicacion, setGeoUbicacion] = useState("");
  const ubicacionFinal = contacto.ubicacion || geoUbicacion || "";
  const mapQuery = encodeURIComponent(ubicacionFinal || "Chile");
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`;
  const resolvedQuoteMessage =
    String(quoteMessage || "").trim() || "Hola, quiero cotizar una moto o producto de Delanoe Motos";
  const whatsappHref = buildWhatsAppUrl(contacto.telefono, resolvedQuoteMessage);

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

  useEffect(() => {
    let cancelled = false;

    if (!navigator?.geolocation) return undefined;
    if ((contacto.ubicacion || "").trim()) return undefined;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const fallbackCoords = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) {
            if (!cancelled) setGeoUbicacion(fallbackCoords);
            return;
          }
          const data = await response.json();
          const resolved = buildGeoLabel(data?.address) || fallbackCoords;
          if (!cancelled) setGeoUbicacion(resolved);
        } catch {
          if (!cancelled) setGeoUbicacion(fallbackCoords);
        }
      },
      () => {
        // If geolocation is denied/unavailable, keep configured location.
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      }
    );

    return () => {
      cancelled = true;
    };
  }, [contacto.ubicacion]);

  return (
    <section className="contacto" id="contacto">
      <h2>Contactanos</h2>
      <div className="contacto-box">
        <div>
          <h3>Instagram</h3>
          <p>
            {contacto.instagram ? (
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noreferrer">
                {contacto.instagram}
              </a>
            ) : (
              "No definido"
            )}
          </p>
        </div>
        <div>
          <h3>Teléfono</h3>
          <p>{contacto.telefono || "No definido"}</p>
        </div>
        <div>
          <h3>Ubicación</h3>
          <p>{ubicacionFinal || "No definido"}</p>
        </div>
      </div>
      <div className="contacto-map">
        <iframe
          title="Mapa de ubicacion"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {showMapCta && (
        <a className="contacto-whatsapp-cta" href={whatsappHref || "#"} target="_blank" rel="noreferrer">
          COTIZAR POR WHATSAPP
        </a>
      )}
    </section>
  );
}
