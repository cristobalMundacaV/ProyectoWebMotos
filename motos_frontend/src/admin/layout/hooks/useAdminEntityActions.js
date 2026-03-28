import { useCallback } from "react";

export default function useAdminEntityActions({ activeSection, openEntityEditModal, openEntityDeleteModal }) {
  const handleMarcaEdit = useCallback(
    (marca) => {
      const sectionKind =
        activeSection === "marcas_motos"
          ? "marca_motos"
          : activeSection === "marcas_acc_motos"
            ? "marca_acc_motos"
            : "marca_acc_rider";
      openEntityEditModal({ kind: sectionKind, item: marca });
    },
    [activeSection, openEntityEditModal]
  );

  const handleMarcaDelete = useCallback(
    (marca) => {
      const sectionKind =
        activeSection === "marcas_motos"
          ? "marca_motos"
          : activeSection === "marcas_acc_motos"
            ? "marca_acc_motos"
            : "marca_acc_rider";
      openEntityDeleteModal({ kind: sectionKind, item: marca });
    },
    [activeSection, openEntityDeleteModal]
  );

  const handleCategoriaMotoEdit = useCallback(
    (categoria) => openEntityEditModal({ kind: "categoria_moto", item: categoria }),
    [openEntityEditModal]
  );
  const handleCategoriaMotoDelete = useCallback(
    (categoria) => openEntityDeleteModal({ kind: "categoria_moto", item: categoria }),
    [openEntityDeleteModal]
  );
  const handleModeloMotoEdit = useCallback(
    (modelo) => openEntityEditModal({ kind: "modelo_moto", item: modelo }),
    [openEntityEditModal]
  );
  const handleModeloMotoDelete = useCallback(
    (modelo) => openEntityDeleteModal({ kind: "modelo_moto", item: modelo }),
    [openEntityDeleteModal]
  );
  const handleCategoriaAccMotosEdit = useCallback(
    (categoria) => openEntityEditModal({ kind: "categoria_acc_motos", item: categoria }),
    [openEntityEditModal]
  );
  const handleCategoriaAccMotosDelete = useCallback(
    (categoria) => openEntityDeleteModal({ kind: "categoria_acc_motos", item: categoria }),
    [openEntityDeleteModal]
  );
  const handleCategoriaAccRiderEdit = useCallback(
    (categoria) => openEntityEditModal({ kind: "categoria_acc_rider", item: categoria }),
    [openEntityEditModal]
  );
  const handleCategoriaAccRiderDelete = useCallback(
    (categoria) => openEntityDeleteModal({ kind: "categoria_acc_rider", item: categoria }),
    [openEntityDeleteModal]
  );

  return {
    handleMarcaEdit,
    handleMarcaDelete,
    handleCategoriaMotoEdit,
    handleCategoriaMotoDelete,
    handleModeloMotoEdit,
    handleModeloMotoDelete,
    handleCategoriaAccMotosEdit,
    handleCategoriaAccMotosDelete,
    handleCategoriaAccRiderEdit,
    handleCategoriaAccRiderDelete,
  };
}
