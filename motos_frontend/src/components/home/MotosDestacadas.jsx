import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMotos } from "../../hooks/useMotos";
import MotoCard from "../motos/MotoCard";
import { deleteMoto } from "../../services/motosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/home.css";

export default function MotosDestacadas() {
  const navigate = useNavigate();
  const { motos, setMotos, loading, error } = useMotos();
  const motosList = Array.isArray(motos) ? motos : [];
  const trackRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.querySelectorAll(".carousel-item"));
    if (items.length === 0) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenterX = trackRect.left + trackRect.width / 2;

    let activeIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenterX - trackCenterX);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    const targetIndex = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
    items[targetIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  async function handleDeleteMoto(moto) {
    if (!moto?.id || deletingId) return;

    const modelo = moto.modelo || moto.nombre || "esta moto";
    const confirmed = window.confirm(`Estas seguro que quieres eliminar ${modelo}?`);
    if (!confirmed) return;

    setDeletingId(moto.id);
    try {
      await deleteMoto(moto.id);
      setMotos((prev) => (Array.isArray(prev) ? prev.filter((item) => item.id !== moto.id) : []));
    } catch {
      window.alert("No se pudo eliminar la moto.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleEditMoto() {
    navigate("/catalogo");
  }

  return (
    <section className="destacadas" id="catalogo">
      <h2>Modelos Destacados</h2>

      {loading && <p className="home-carousel-empty">Cargando motos...</p>}
      {!loading && error && <p className="home-carousel-empty">{error}</p>}
      {!loading && !error && motosList.length === 0 && (
        <p className="home-carousel-empty">No hay motos disponibles por ahora.</p>
      )}

      {!loading && !error && motosList.length > 0 && (
        <div className="carousel-wrapper carousel-wrapper-motos">
          <button className="carousel-btn carousel-btn--prev" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5L8 12l6.5 6.5" />
            </svg>
          </button>

          <div className="carousel-track carousel-track-motos" ref={trackRef}>
            {motosList.map((moto) => (
              <div className="carousel-item carousel-item-motos" key={moto.id}>
                <MotoCard
                  moto={moto}
                  isAdmin={isAdmin}
                  onEdit={handleEditMoto}
                  onDelete={handleDeleteMoto}
                  showAdminOverlayActions
                  showBottomDeleteAction={false}
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
