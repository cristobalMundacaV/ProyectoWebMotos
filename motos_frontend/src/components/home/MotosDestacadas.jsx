import { useEffect, useState, useRef } from "react";
import { useMotos } from "../../hooks/useMotos";
import MotoCard from "../motos/MotoCard";
import { deleteMoto } from "../../services/motosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/home.css";

export default function MotosDestacadas() {
  const { motos, setMotos, loading, error } = useMotos();
  const trackRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const SCROLL_AMOUNT = 460;

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  function scroll(direction) {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
    }
  }

  async function handleDeleteMoto(moto) {
    if (!moto?.id || deletingId) return;

    const modelo = moto.modelo || moto.nombre || "esta moto";
    const confirmed = window.confirm(`Estas seguro que quieres eliminar ${modelo}?`);
    if (!confirmed) return;

    setDeletingId(moto.id);
    try {
      await deleteMoto(moto.id);
      setMotos((prev) => prev.filter((item) => item.id !== moto.id));
    } catch {
      window.alert("No se pudo eliminar la moto.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="destacadas" id="catalogo">
      <h2>Modelos Destacados</h2>

      {loading && <p className="home-carousel-empty">Cargando motos...</p>}
      {!loading && error && <p className="home-carousel-empty">{error}</p>}
      {!loading && !error && motos.length === 0 && (
        <p className="home-carousel-empty">No hay motos disponibles por ahora.</p>
      )}

      {!loading && !error && motos.length > 0 && (
        <div className="carousel-wrapper carousel-wrapper-motos">
          <button className="carousel-btn carousel-btn--prev" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5L8 12l6.5 6.5" />
            </svg>
          </button>

          <div className="carousel-track carousel-track-motos" ref={trackRef}>
            {motos.map((moto) => (
              <div className="carousel-item carousel-item-motos" key={moto.id}>
                <MotoCard
                  moto={moto}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteMoto}
                  showAdminOverlayActions={false}
                  showBottomDeleteAction
                />
              </div>
            ))}
          </div>

          <button className="carousel-btn carousel-btn--next" onClick={() => scroll(1)} aria-label="Siguiente">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 5.5L16 12l-6.5 6.5" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
