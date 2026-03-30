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
        productoEditModal: productos.accesorioMotoEditModal || productos.accesorioRiderEditModal,
        productoMeta:
          productos.accesorioMotoEditModal
            ? { subcategorias: productos.accesoriosMotosMeta.subcategorias, marcas: productos.accesoriosMotosMeta.marcas, motos: productos.accesoriosMotosMeta.motos }
            : { subcategorias: productos.accesoriosRiderMeta.subcategorias, marcas: productos.accesoriosRiderMeta.marcas, motos: [] },
        productoEditSaving: productos.accesorioMotoEditModal ? productos.accesorioMotoEditSaving : productos.accesorioRiderEditSaving,
        productoEditError: productos.accesorioMotoEditModal ? productos.accesorioMotoEditError : productos.accesorioRiderEditError,
        fallbackImage,
        onClose: productos.accesorioMotoEditModal ? productos.closeAccesorioMotoEditModal : productos.closeAccesorioRiderEditModal,
        onSubmit: productos.accesorioMotoEditModal ? productos.submitAccesorioMotoEditModal : productos.submitAccesorioRiderEditModal,
        onInputChange: productos.accesorioMotoEditModal ? productos.handleAccesorioMotoEditInputChange : productos.handleAccesorioRiderEditInputChange,
        onPrecioInputChange: productos.accesorioMotoEditModal ? productos.handleAccesorioMotoEditPrecioInputChange : productos.handleAccesorioRiderEditPrecioInputChange,
        onToggleCompatibilidad: productos.toggleAccesorioMotoEditCompatibilidad,
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
        motoMeta: entityModals.motoMeta,
      },
    };
  }, [domains, fallbackImage]);
}
