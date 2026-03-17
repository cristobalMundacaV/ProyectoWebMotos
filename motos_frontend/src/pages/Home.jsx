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
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    const navbarOffset = 110;

    const scrollToSection = () => {
      const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    requestAnimationFrame(scrollToSection);
    const timer = window.setTimeout(scrollToSection, 140);

    return () => window.clearTimeout(timer);
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
