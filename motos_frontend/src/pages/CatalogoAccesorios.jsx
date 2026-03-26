import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import EquipamientoCatalog from "../components/equipamiento/EquipamientoCatalog";

export default function CatalogoAccesorios() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <EquipamientoCatalog variant="accesorios" />
      <Footer />
    </div>
  );
}
