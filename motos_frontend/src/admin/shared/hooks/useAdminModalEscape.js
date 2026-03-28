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
  accesorioRiderEditModal,
  accesorioRiderEditSaving,
  closeAccesorioRiderEditModal,
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
      !accesorioRiderEditModal &&
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
      if (accesorioRiderEditModal && !accesorioRiderEditSaving) closeAccesorioRiderEditModal();
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
    accesorioRiderEditModal,
    accesorioRiderEditSaving,
    closeAccesorioRiderEditModal,
    adminUserEditModal,
    adminUserDeleteModal,
    adminUserModalSaving,
    closeAdminUserEditModal,
    closeAdminUserDeleteModal,
  ]);
}
