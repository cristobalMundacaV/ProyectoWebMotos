import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Contacto from "../components/home/Contacto";
import EquipamientoCatalog from "../components/equipamiento/EquipamientoCatalog";

export default function CatalogoAccesorios() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <EquipamientoCatalog variant="accesorios" />
      <Contacto showMapCta />
      <Footer />
    </div>
  );
}
