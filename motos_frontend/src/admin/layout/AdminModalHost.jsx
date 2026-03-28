import { createElement } from "react";
import MotoEditModal from "../motos/components/MotoEditModal";
import ProductoEditModal from "../productos/components/ProductoEditModal";
import AdminUserModals from "../usuarios/components/AdminUserModals";
import AdminEntityModals from "../shared/components/AdminEntityModals";

const MODAL_COMPONENT_REGISTRY = [
  { key: "moto", Component: MotoEditModal },
  { key: "producto", Component: ProductoEditModal },
  { key: "user", Component: AdminUserModals },
  { key: "entity", Component: AdminEntityModals },
];

export default function AdminModalHost({ modalPropsMap }) {
  return (
    <>
      {MODAL_COMPONENT_REGISTRY.map(({ key, Component: ModalComponent }) =>
        createElement(ModalComponent, { key, ...(modalPropsMap[key] || {}) })
      )}
    </>
  );
}
