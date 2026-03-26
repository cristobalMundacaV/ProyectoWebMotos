import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import EquipamientoCatalog from "../components/equipamiento/EquipamientoCatalog";

export default function CatalogoIndumentaria() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <EquipamientoCatalog variant="indumentaria" />
      <Footer />
    </div>
  );
}
