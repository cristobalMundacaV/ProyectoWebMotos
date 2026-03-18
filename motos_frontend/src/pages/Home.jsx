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
    if (!raw) return;

    let payload = null;
    try {
      payload = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem("homeScrollTarget");
      return;
    }

    const id = payload?.id;
    const ts = Number(payload?.ts || 0);
    const isFresh = Date.now() - ts < 7000;
    const isValidTarget = id === "inicio" || id === "contacto";
    if (!isFresh || !isValidTarget) {
      sessionStorage.removeItem("homeScrollTarget");
      return;
    }

    const timers = [];
    let attempts = 0;

    const getNavbarOffset = () => {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
      return navbarHeight + 10;
    };

    const scrollToSection = (behavior = "smooth") => {
      const target = document.getElementById(id);
      if (!target) return false;

      const navbarOffset = getNavbarOffset();
      const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: Math.max(0, top), behavior });
      return true;
    };

    const tick = () => {
      const didScroll = scrollToSection(attempts === 0 ? "smooth" : "auto");
      attempts += 1;
      if (!didScroll || attempts >= 14) return;
      timers.push(window.setTimeout(tick, 170));
    };

    requestAnimationFrame(tick);
    sessionStorage.removeItem("homeScrollTarget");

    return () => timers.forEach((timer) => window.clearTimeout(timer));
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
