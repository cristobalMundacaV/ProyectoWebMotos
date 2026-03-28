import { createElement } from "react";
import ResumenPage from "../dashboard/pages/ResumenPage";
import MotosPage from "../motos/pages/MotosPage";
import FichasTecnicasPage from "../motos/pages/FichasTecnicasPage";
import ProductosPage from "../productos/pages/ProductosPage";
import ConfiguracionPage from "../configuracion/pages/ConfiguracionPage";
import MantencionesPage from "../mantenciones/pages/MantencionesPage";
import UsuariosPage from "../usuarios/pages/UsuariosPage";

const SECTION_COMPONENT_REGISTRY = [
  { key: "resumen", Component: ResumenPage, activeOnly: true },
  { key: "motos", Component: MotosPage, activeOnly: false },
  { key: "fichas", Component: FichasTecnicasPage, activeOnly: false },
  { key: "productos", Component: ProductosPage, activeOnly: false },
  { key: "configuracion", Component: ConfiguracionPage, activeOnly: false },
  { key: "mantenciones", Component: MantencionesPage, activeOnly: false },
  { key: "usuarios", Component: UsuariosPage, activeOnly: false },
];

function shouldRenderSection({ activeOnly, key, activeSection }) {
  if (!activeOnly) return true;
  return key === activeSection;
}

export default function AdminSectionRouter({ activeSection, sectionPropsMap }) {
  return (
    <>
      {SECTION_COMPONENT_REGISTRY.map(({ key, Component: SectionComponent, activeOnly }) => {
        if (!shouldRenderSection({ activeOnly, key, activeSection })) return null;
        return createElement(SectionComponent, { key, ...(sectionPropsMap[key] || {}) });
      })}
    </>
  );
}
