import { useMemo } from "react";

export default function useAdminModalProps({ fallbackImage, domains }) {
  return useMemo(() => {
    const { motos, productos, users, entityModals } = domains;

    return {
      moto: {
        motoEditModal: motos.motoEditModal,
        motoEditSaving: motos.motoEditSaving,
        motoEditError: motos.motoEditError,
        motoMeta: motos.motoMeta,
        motoEditModelosFiltrados: motos.motoEditModelosFiltrados,
        motoYearOptions: motos.motoYearOptions,
        formatPrecioDisplay: motos.formatPrecioDisplay,
        fallbackImage,
        onClose: motos.closeMotoEditModal,
        onSubmit: motos.submitMotoEditModal,
        onInputChange: motos.handleMotoEditInputChange,
        onPrecioInputChange: motos.handleMotoEditPrecioInputChange,
        onPrecioListaInputChange: motos.handleMotoEditPrecioListaInputChange,
        onPrecioConMaletasInputChange: motos.handleMotoEditPrecioConMaletasInputChange,
        onPrecioListaConMaletasInputChange: motos.handleMotoEditPrecioListaConMaletasInputChange,
      },
      producto: {
        accesorioRiderEditModal: productos.accesorioRiderEditModal,
        accesoriosRiderMeta: productos.accesoriosRiderMeta,
        accesorioRiderEditSaving: productos.accesorioRiderEditSaving,
        accesorioRiderEditError: productos.accesorioRiderEditError,
        fallbackImage,
        onClose: productos.closeAccesorioRiderEditModal,
        onSubmit: productos.submitAccesorioRiderEditModal,
        onInputChange: productos.handleAccesorioRiderEditInputChange,
        onPrecioInputChange: productos.handleAccesorioRiderEditPrecioInputChange,
      },
      user: {
        editModal: users.adminUserEditModal,
        deleteModal: users.adminUserDeleteModal,
        modalSaving: users.adminUserModalSaving,
        modalError: users.adminUserModalError,
        onCloseEdit: users.closeAdminUserEditModal,
        onCloseDelete: users.closeAdminUserDeleteModal,
        onEditInputChange: users.handleAdminUserEditInputChange,
        onSubmitEdit: users.submitAdminUserEdit,
        onSubmitDelete: users.submitAdminUserDelete,
      },
      entity: {
        entityEditModal: entityModals.entityEditModal,
        entityDeleteModal: entityModals.entityDeleteModal,
        entityModalSaving: entityModals.entityModalSaving,
        entityModalError: entityModals.entityModalError,
        onCloseEntityEditModal: entityModals.closeEntityEditModal,
        onCloseEntityDeleteModal: entityModals.closeEntityDeleteModal,
        onEntityEditInputChange: entityModals.handleEntityEditInputChange,
        onSubmitEntityEdit: entityModals.submitEntityEdit,
        onSubmitEntityDelete: entityModals.submitEntityDelete,
        getEntityKindLabel: entityModals.getEntityKindLabel,
      },
    };
  }, [domains, fallbackImage]);
}

