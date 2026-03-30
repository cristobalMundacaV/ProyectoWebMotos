import { useEffect } from "react";

export default function useAdminModalEscape({
  entityEditModal,
  entityDeleteModal,
  entityModalSaving,
  closeEntityEditModal,
  closeEntityDeleteModal,
  motoEditModal,
  motoEditSaving,
  closeMotoEditModal,
  motoDeleteModal,
  motoDeleteSaving,
  closeMotoDeleteModal,
  accesorioMotoEditModal,
  accesorioMotoEditSaving,
  closeAccesorioMotoEditModal,
  accesorioRiderEditModal,
  accesorioRiderEditSaving,
  closeAccesorioRiderEditModal,
  productoDeleteModal,
  productoDeleteSaving,
  closeProductoDeleteModal,
  adminUserEditModal,
  adminUserDeleteModal,
  adminUserModalSaving,
  closeAdminUserEditModal,
  closeAdminUserDeleteModal,
}) {
  useEffect(() => {
    if (
      !entityEditModal &&
      !entityDeleteModal &&
      !motoEditModal &&
      !motoDeleteModal &&
      !accesorioMotoEditModal &&
      !accesorioRiderEditModal &&
      !productoDeleteModal &&
      !adminUserEditModal &&
      !adminUserDeleteModal
    ) {
      return undefined;
    }

    const onEsc = (event) => {
      if (event.key !== "Escape") return;
      if (entityEditModal && !entityModalSaving) closeEntityEditModal();
      if (entityDeleteModal && !entityModalSaving) closeEntityDeleteModal();
      if (motoEditModal && !motoEditSaving) closeMotoEditModal();
      if (motoDeleteModal && !motoDeleteSaving) closeMotoDeleteModal();
      if (accesorioMotoEditModal && !accesorioMotoEditSaving) closeAccesorioMotoEditModal();
      if (accesorioRiderEditModal && !accesorioRiderEditSaving) closeAccesorioRiderEditModal();
      if (productoDeleteModal && !productoDeleteSaving) closeProductoDeleteModal();
      if (adminUserEditModal && !adminUserModalSaving) closeAdminUserEditModal();
      if (adminUserDeleteModal && !adminUserModalSaving) closeAdminUserDeleteModal();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [
    entityEditModal,
    entityDeleteModal,
    entityModalSaving,
    closeEntityEditModal,
    closeEntityDeleteModal,
    motoEditModal,
    motoEditSaving,
    closeMotoEditModal,
    motoDeleteModal,
    motoDeleteSaving,
    closeMotoDeleteModal,
    accesorioMotoEditModal,
    accesorioMotoEditSaving,
    closeAccesorioMotoEditModal,
    accesorioRiderEditModal,
    accesorioRiderEditSaving,
    closeAccesorioRiderEditModal,
    productoDeleteModal,
    productoDeleteSaving,
    closeProductoDeleteModal,
    adminUserEditModal,
    adminUserDeleteModal,
    adminUserModalSaving,
    closeAdminUserEditModal,
    closeAdminUserDeleteModal,
  ]);
}
