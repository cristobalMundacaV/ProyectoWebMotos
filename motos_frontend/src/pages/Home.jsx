import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import MotosDestacadas from "../components/home/MotosDestacadas";
import IndumentariaDestacada from "../components/home/IndumentariaDestacada";
import CtaWhatsApp from "../components/home/CtaWhatsApp";
import Contacto from "../components/home/Contacto";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const raw = sessionStorage.getItem("homeScrollTarget");
    let id = "";

    if (raw) {
      try {
        const payload = JSON.parse(raw);
        const candidate = payload?.id;
        const ts = Number(payload?.ts || 0);
        const isFresh = Date.now() - ts < 7000;
        const isValidTarget = candidate === "inicio" || candidate === "contacto";
        if (isFresh && isValidTarget) id = candidate;
      } catch {
        // Ignoramos payload invalido y usamos hash como fallback.
      }
    }

    if (!id) {
      if (location.hash === "#contacto") id = "contacto";
      if (location.hash === "#inicio") id = "inicio";
    }

    if (!id) {
      sessionStorage.removeItem("homeScrollTarget");
      return;
    }

    const getNavbarOffset = () => {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
      return navbarHeight + 10;
    };

    const getTargetTop = () => {
      const target = document.getElementById(id);
      if (!target) return null;

      const navbarOffset = getNavbarOffset();
      return Math.max(0, target.getBoundingClientRect().top + window.scrollY - navbarOffset);
    };

    const scrollToSection = (behavior = "smooth", onlyDown = false) => {
      const top = getTargetTop();
      if (top === null) return false;
      if (onlyDown && top <= window.scrollY + 4) return false;
      window.scrollTo({ top, behavior });
      return true;
    };

    requestAnimationFrame(() => {
      scrollToSection("smooth");
    });

    // Corrige desplazamientos por carga tardia de contenido (carruseles),
    // pero solo hacia abajo para evitar el efecto de "sube y baja".
    const keepStrictAnchor = id === "contacto";
    const correctionTimer = window.setInterval(() => {
      scrollToSection("auto", !keepStrictAnchor);
    }, 180);
    const stopCorrectionsTimer = window.setTimeout(() => {
      window.clearInterval(correctionTimer);
      sessionStorage.removeItem("homeScrollTarget");
    }, id === "contacto" ? 6000 : 2200);

    const stopOnUserScrollIntent = () => {
      window.clearInterval(correctionTimer);
      window.clearTimeout(stopCorrectionsTimer);
    };

    window.addEventListener("wheel", stopOnUserScrollIntent, { passive: true });
    window.addEventListener("touchstart", stopOnUserScrollIntent, { passive: true });
    window.addEventListener("keydown", stopOnUserScrollIntent);

    if (location.hash) {
      window.history.replaceState(null, "", location.pathname + location.search);
    }

    return () => {
      window.clearInterval(correctionTimer);
      window.clearTimeout(stopCorrectionsTimer);
      window.removeEventListener("wheel", stopOnUserScrollIntent);
      window.removeEventListener("touchstart", stopOnUserScrollIntent);
      window.removeEventListener("keydown", stopOnUserScrollIntent);
    };
  }, [location.pathname, location.hash]);

  return (
    <div>
      <Navbar />
      <Hero />
      <MotosDestacadas />
      <IndumentariaDestacada />
      <CtaWhatsApp />
      <Contacto />
      <Footer />
    </div>
  );
}
