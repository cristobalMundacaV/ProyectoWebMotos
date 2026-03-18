import "../../styles/home.css";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Nueva Generación de Motos en Tú Ciudad</h1>
          <p>Potencia, Estilo y Aventura para cada camino.</p>
          <a className="btn-primary" href="/catalogo">
            Ver catálogo
          </a>
        </div>
      </div>
    </section>
  );
}
