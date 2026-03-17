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
    const timers = [];

    const scrollToSection = (behavior = "smooth") => {
      const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    };

    requestAnimationFrame(() => scrollToSection("smooth"));
    timers.push(window.setTimeout(() => scrollToSection("auto"), 220));
    timers.push(window.setTimeout(() => scrollToSection("auto"), 700));

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
