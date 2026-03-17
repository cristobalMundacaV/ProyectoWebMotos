import "../../styles/home.css";

export default function CtaWhatsApp() {
  return (
    <section className="cta-whatsapp">
      <h2>¿Buscas tu próxima moto?</h2>
      <a
        href="https://wa.me/56912345678?text=Hola,%20quiero%20cotizar%20una%20moto"
        target="_blank"
        rel="noreferrer"
      >
        Cotizar por WhatsApp
      </a>
    </section>
  );
}
