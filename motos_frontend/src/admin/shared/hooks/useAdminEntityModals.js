import { useCallback, useState } from "react";
import {
  deleteCategoriaAccesoriosMotos,
  deleteCategoriaAccesoriosRider,
  updateCategoriaAccesoriosMotos,
  updateCategoriaAccesoriosRider,
} from "../../productos/services/productosAdminService";
import {
  deleteCategoriaMoto,
  deleteMarca,
  deleteModeloMoto,
  updateCategoriaMoto,
  updateMarca,
  updateModeloMoto,
} from "../../motos/services/motosAdminService";

export default function useAdminEntityModals({
  setDashboard,
  motoMeta,
  clearInvalidFieldStyle,
  normalizeUppercaseLabel,
  normalizeTitleCaseForInput,
  normalizeTitleCaseLabel,
  buildSlug,
  validateFormWithToast,
  getErrorText,
  pushToast,
  setMarcasMotosAdmin,
  setMotoMeta,
  setMarcasAccMotosAdmin,
  setAccesoriosMotosMeta,
  setMarcasAccRiderAdmin,
  setAccesoriosRiderMeta,
  setCategoriasMoto,
  setCategoriasAccMotosMeta,
  setCategoriasAccRiderMeta,
  setModelosMotosAdmin,
}) {
  const [entityEditModal, setEntityEditModal] = useState(null);
  const [entityDeleteModal, setEntityDeleteModal] = useState(null);
  const [entityModalSaving, setEntityModalSaving] = useState(false);
  const [entityModalError, setEntityModalError] = useState("");

  const openEntityEditModal = useCallback(
    ({ kind, item }) => {
      setEntityModalError("");
      const isBrandKind = kind === "marca_motos" || kind === "marca_acc_motos" || kind === "marca_acc_rider";
      const isCategoryKind =
        kind === "categoria_moto" || kind === "categoria_acc_motos" || kind === "categoria_acc_rider";
      const normalizedNombre = isBrandKind
        ? normalizeUppercaseLabel(item.nombre || "")
        : isCategoryKind
          ? normalizeTitleCaseLabel(item.nombre || "")
          : item.nombre || "";
      setEntityEditModal({
        kind,
        id: item.id,
        nombre: normalizedNombre,
        nombreOriginal: item.nombre || "",
        slug: item.slug || "",
        marca: item.marca ?? item.marca_id ?? "",
        categoria: item.categoria ?? item.categoria_id ?? "",
        cilindrada: item.cilindrada ?? "",
      });
    },
    [normalizeTitleCaseLabel, normalizeUppercaseLabel]
  );

  const closeEntityEditModal = useCallback(() => {
    if (entityModalSaving) return;
    setEntityEditModal(null);
    setEntityModalError("");
  }, [entityModalSaving]);

  const openEntityDeleteModal = useCallback(({ kind, item }) => {
    setEntityModalError("");
    setEntityDeleteModal({
      kind,
      id: item.id,
      nombre: item.nombre || "",
    });
  }, []);

  const closeEntityDeleteModal = useCallback(() => {
    if (entityModalSaving) return;
    setEntityDeleteModal(null);
    setEntityModalError("");
  }, [entityModalSaving]);

  const handleEntityEditInputChange = useCallback(
    (event) => {
      clearInvalidFieldStyle(event.target);
      const { name, value } = event.target;
      setEntityEditModal((prev) => {
        if (!prev) return prev;
        const isBrandKind =
          prev.kind === "marca_motos" || prev.kind === "marca_acc_motos" || prev.kind === "marca_acc_rider";
        const isModelKind = prev.kind === "modelo_moto";
        const isCategoryKind =
          prev.kind === "categoria_moto" || prev.kind === "categoria_acc_motos" || prev.kind === "categoria_acc_rider";
        const normalizedValue =
          name === "nombre"
            ? isModelKind
              ? normalizeUppercaseLabel(value)
              : isBrandKind
                ? normalizeUppercaseLabel(value)
                : isCategoryKind
                  ? normalizeTitleCaseForInput(value)
                  : value
            : value;
        const next = { ...prev, [name]: normalizedValue };
        if (name === "nombre") {
          const valueForSlug = isBrandKind
            ? normalizeUppercaseLabel(normalizedValue)
            : isCategoryKind
              ? normalizeTitleCaseLabel(normalizedValue)
              : normalizedValue;
          next.slug = buildSlug(valueForSlug);
        }
        return next;
      });
    },
    [
      buildSlug,
      clearInvalidFieldStyle,
      normalizeTitleCaseForInput,
      normalizeTitleCaseLabel,
      normalizeUppercaseLabel,
    ]
  );

  const getEntityKindLabel = useCallback((kind) => {
    if (kind === "marca_motos") return "marca de motos";
    if (kind === "marca_acc_motos") return "marca de accesorios moto";
    if (kind === "marca_acc_rider") return "marca de indumentaria";
    if (kind === "categoria_moto") return "categoria de motos";
    if (kind === "modelo_moto") return "modelo de motos";
    if (kind === "categoria_acc_motos") return "categoria de accesorios moto";
    if (kind === "categoria_acc_rider") return "categoria de indumentaria rider";
    return "elemento";
  }, []);

  const submitEntityEdit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!entityEditModal) return;
      if (!validateFormWithToast(event.currentTarget)) return;

      const isBrandKind =
        entityEditModal.kind === "marca_motos" ||
        entityEditModal.kind === "marca_acc_motos" ||
        entityEditModal.kind === "marca_acc_rider";
      const isModelKind = entityEditModal.kind === "modelo_moto";
      const isCategoryKind =
        entityEditModal.kind === "categoria_moto" ||
        entityEditModal.kind === "categoria_acc_motos" ||
        entityEditModal.kind === "categoria_acc_rider";
      const nombre = isModelKind
        ? normalizeUppercaseLabel(entityEditModal.nombre)
        : isBrandKind
          ? normalizeUppercaseLabel(entityEditModal.nombre)
          : isCategoryKind
            ? normalizeTitleCaseLabel(entityEditModal.nombre)
            : (entityEditModal.nombre || "").trim();
      const slug = (entityEditModal.slug || "").trim();
      if (!nombre) {
        setEntityModalError("El nombre es obligatorio.");
        return;
      }

      setEntityModalSaving(true);
      setEntityModalError("");
      try {
        if (entityEditModal.kind === "marca_motos" || entityEditModal.kind === "marca_acc_motos" || entityEditModal.kind === "marca_acc_rider") {
          const updated = await updateMarca(entityEditModal.id, { nombre, slug });
          if (entityEditModal.kind === "marca_motos") {
            setMarcasMotosAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
            setMotoMeta((prev) => ({
              ...prev,
              marcas: prev.marcas.map((item) => (item.id === entityEditModal.id ? { ...item, nombre: updated.nombre } : item)),
            }));
            setDashboard((prev) => ({
              ...prev,
              motos: prev.motos.map((item) =>
                Number(item.marca) === Number(entityEditModal.id) ||
                normalizeUppercaseLabel(item.marca_nombre) === normalizeUppercaseLabel(entityEditModal.nombreOriginal)
                  ? { ...item, marca_nombre: updated.nombre }
                  : item
              ),
            }));
          } else if (entityEditModal.kind === "marca_acc_motos") {
            setMarcasAccMotosAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
            setAccesoriosMotosMeta((prev) => ({
              ...prev,
              marcas: prev.marcas.map((item) => (item.id === entityEditModal.id ? { ...item, nombre: updated.nombre } : item)),
            }));
            setDashboard((prev) => ({
              ...prev,
              productosAccesorios: prev.productosAccesorios.map((item) =>
                Number(item.marca) === Number(entityEditModal.id) ||
                normalizeUppercaseLabel(item.marca_nombre) === normalizeUppercaseLabel(entityEditModal.nombreOriginal)
                  ? { ...item, marca_nombre: updated.nombre }
                  : item
              ),
            }));
          } else {
            setMarcasAccRiderAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
            setAccesoriosRiderMeta((prev) => ({
              ...prev,
              marcas: prev.marcas.map((item) => (item.id === entityEditModal.id ? { ...item, nombre: updated.nombre } : item)),
            }));
            setDashboard((prev) => ({
              ...prev,
              productosIndumentaria: prev.productosIndumentaria.map((item) =>
                Number(item.marca) === Number(entityEditModal.id) ||
                normalizeUppercaseLabel(item.marca_nombre) === normalizeUppercaseLabel(entityEditModal.nombreOriginal)
                  ? { ...item, marca_nombre: updated.nombre }
                  : item
              ),
            }));
          }
          pushToast("Marca actualizada correctamente.", "success");
        } else if (entityEditModal.kind === "categoria_moto") {
          const updated = await updateCategoriaMoto(entityEditModal.id, { nombre, slug });
          setCategoriasMoto((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
          setMotoMeta((prev) => ({
            ...prev,
            categorias: prev.categorias.map((item) => (item.id === entityEditModal.id ? { ...item, nombre: updated.nombre } : item)),
          }));
          setDashboard((prev) => ({
            ...prev,
            motos: prev.motos.map((item) =>
              Number(item.categoria) === Number(entityEditModal.id)
                ? { ...item, categoria_nombre: updated.nombre }
                : item
            ),
          }));
          pushToast("Categoria actualizada correctamente.", "success");
        } else if (entityEditModal.kind === "categoria_acc_motos") {
          const updated = await updateCategoriaAccesoriosMotos(entityEditModal.id, { nombre, slug });
          setCategoriasAccMotosMeta((prev) => ({
            ...prev,
            subcategorias: prev.subcategorias.map((item) => (item.id === entityEditModal.id ? updated : item)),
          }));
          setAccesoriosMotosMeta((prev) => ({
            ...prev,
            subcategorias: prev.subcategorias.map((item) => (item.id === entityEditModal.id ? updated : item)),
          }));
          setDashboard((prev) => ({
              ...prev,
              productosAccesorios: prev.productosAccesorios.map((item) =>
                Number(item.subcategoria) === Number(entityEditModal.id) ||
                normalizeTitleCaseLabel(item.subcategoria_nombre) === normalizeTitleCaseLabel(entityEditModal.nombreOriginal)
                  ? { ...item, subcategoria_nombre: updated.nombre }
                  : item
              ),
            }));
          pushToast("Categoria actualizada correctamente.", "success");
        } else if (entityEditModal.kind === "categoria_acc_rider") {
          const updated = await updateCategoriaAccesoriosRider(entityEditModal.id, { nombre, slug });
          setCategoriasAccRiderMeta((prev) => ({
            ...prev,
            subcategorias: prev.subcategorias.map((item) => (item.id === entityEditModal.id ? updated : item)),
          }));
          setAccesoriosRiderMeta((prev) => ({
            ...prev,
            subcategorias: prev.subcategorias.map((item) => (item.id === entityEditModal.id ? updated : item)),
          }));
          setDashboard((prev) => ({
              ...prev,
              productosIndumentaria: prev.productosIndumentaria.map((item) =>
                Number(item.subcategoria) === Number(entityEditModal.id) ||
                normalizeTitleCaseLabel(item.subcategoria_nombre) === normalizeTitleCaseLabel(entityEditModal.nombreOriginal)
                  ? { ...item, subcategoria_nombre: updated.nombre }
                  : item
              ),
            }));
          pushToast("Categoria actualizada correctamente.", "success");
        } else if (entityEditModal.kind === "modelo_moto") {
          const modelPayload = { nombre };
          if (entityEditModal.marca) modelPayload.marca = Number(entityEditModal.marca);
          if (entityEditModal.categoria !== null && entityEditModal.categoria !== undefined && entityEditModal.categoria !== "") {
            modelPayload.categoria = Number(entityEditModal.categoria);
          }
          if (entityEditModal.cilindrada !== null && entityEditModal.cilindrada !== undefined && entityEditModal.cilindrada !== "") {
            modelPayload.cilindrada = Number(entityEditModal.cilindrada);
          } else {
            modelPayload.cilindrada = null;
          }
          const updated = await updateModeloMoto(entityEditModal.id, modelPayload);
          setModelosMotosAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
          setMotoMeta((prev) => ({
            ...prev,
            modelos: prev.modelos.map((item) => (item.id === entityEditModal.id ? updated : item)),
          }));
          setDashboard((prev) => ({
            ...prev,
            motos: prev.motos.map((item) =>
              Number(item.modelo_ref) === Number(entityEditModal.id)
                ? {
                    ...item,
                    modelo: updated.nombre || updated.nombre_modelo || item.modelo,
                    marca_nombre: updated.marca_nombre || item.marca_nombre,
                    categoria_nombre: updated.categoria_nombre || item.categoria_nombre,
                    marca: updated.marca ?? item.marca,
                    categoria: updated.categoria ?? item.categoria,
                    cilindrada: updated.cilindrada ?? item.cilindrada,
                  }
                : item
            ),
          }));
          pushToast("Modelo actualizado correctamente.", "success");
        }
        setEntityEditModal(null);
      } catch (error) {
        setEntityModalError(getErrorText(error, "No se pudo guardar el cambio."));
      } finally {
        setEntityModalSaving(false);
      }
    },
    [
      entityEditModal,
      getErrorText,
      normalizeTitleCaseLabel,
      normalizeUppercaseLabel,
      pushToast,
      setDashboard,
      setAccesoriosMotosMeta,
      setAccesoriosRiderMeta,
      setCategoriasAccMotosMeta,
      setCategoriasAccRiderMeta,
      setCategoriasMoto,
      setMarcasAccMotosAdmin,
      setMarcasAccRiderAdmin,
      setMarcasMotosAdmin,
      setModelosMotosAdmin,
      setMotoMeta,
      validateFormWithToast,
    ]
  );

  const submitEntityDelete = useCallback(async () => {
    if (!entityDeleteModal) return;
    setEntityModalSaving(true);
    setEntityModalError("");
    try {
      if (entityDeleteModal.kind === "marca_motos" || entityDeleteModal.kind === "marca_acc_motos" || entityDeleteModal.kind === "marca_acc_rider") {
        await deleteMarca(entityDeleteModal.id);
        if (entityDeleteModal.kind === "marca_motos") {
          setMarcasMotosAdmin((prev) => prev.filter((item) => item.id !== entityDeleteModal.id));
          setMotoMeta((prev) => ({ ...prev, marcas: prev.marcas.filter((item) => item.id !== entityDeleteModal.id) }));
        } else if (entityDeleteModal.kind === "marca_acc_motos") {
          setMarcasAccMotosAdmin((prev) => prev.filter((item) => item.id !== entityDeleteModal.id));
          setAccesoriosMotosMeta((prev) => ({ ...prev, marcas: prev.marcas.filter((item) => item.id !== entityDeleteModal.id) }));
        } else {
          setMarcasAccRiderAdmin((prev) => prev.filter((item) => item.id !== entityDeleteModal.id));
          setAccesoriosRiderMeta((prev) => ({ ...prev, marcas: prev.marcas.filter((item) => item.id !== entityDeleteModal.id) }));
        }
        pushToast("Marca eliminada correctamente.", "success");
      } else if (entityDeleteModal.kind === "categoria_moto") {
        await deleteCategoriaMoto(entityDeleteModal.id);
        setCategoriasMoto((prev) => prev.filter((item) => item.id !== entityDeleteModal.id));
        setMotoMeta((prev) => ({ ...prev, categorias: prev.categorias.filter((item) => item.id !== entityDeleteModal.id) }));
        pushToast("Categoria eliminada correctamente.", "success");
      } else if (entityDeleteModal.kind === "categoria_acc_motos") {
        await deleteCategoriaAccesoriosMotos(entityDeleteModal.id);
        setCategoriasAccMotosMeta((prev) => ({
          ...prev,
          subcategorias: prev.subcategorias.filter((item) => item.id !== entityDeleteModal.id),
        }));
        setAccesoriosMotosMeta((prev) => ({
          ...prev,
          subcategorias: prev.subcategorias.filter((item) => item.id !== entityDeleteModal.id),
        }));
        pushToast("Categoria eliminada correctamente.", "success");
      } else if (entityDeleteModal.kind === "categoria_acc_rider") {
        await deleteCategoriaAccesoriosRider(entityDeleteModal.id);
        setCategoriasAccRiderMeta((prev) => ({
          ...prev,
          subcategorias: prev.subcategorias.filter((item) => item.id !== entityDeleteModal.id),
        }));
        setAccesoriosRiderMeta((prev) => ({
          ...prev,
          subcategorias: prev.subcategorias.filter((item) => item.id !== entityDeleteModal.id),
        }));
        pushToast("Categoria eliminada correctamente.", "success");
      } else if (entityDeleteModal.kind === "modelo_moto") {
        await deleteModeloMoto(entityDeleteModal.id);
        setModelosMotosAdmin((prev) => prev.filter((item) => item.id !== entityDeleteModal.id));
        setMotoMeta((prev) => ({
          ...prev,
          modelos: prev.modelos.filter((item) => item.id !== entityDeleteModal.id),
        }));
        pushToast("Modelo eliminado correctamente.", "success");
      }
      setEntityDeleteModal(null);
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo eliminar el elemento."), "error");
    } finally {
      setEntityModalSaving(false);
    }
  }, [
    entityDeleteModal,
    getErrorText,
    pushToast,
    setAccesoriosMotosMeta,
    setAccesoriosRiderMeta,
    setCategoriasAccMotosMeta,
    setCategoriasAccRiderMeta,
    setCategoriasMoto,
    setMarcasAccMotosAdmin,
    setMarcasAccRiderAdmin,
    setMarcasMotosAdmin,
    setModelosMotosAdmin,
    setMotoMeta,
  ]);

  return {
    entityEditModal,
    entityDeleteModal,
    entityModalSaving,
    entityModalError,
    motoMeta,
    openEntityEditModal,
    closeEntityEditModal,
    openEntityDeleteModal,
    closeEntityDeleteModal,
    handleEntityEditInputChange,
    getEntityKindLabel,
    submitEntityEdit,
    submitEntityDelete,
  };
}
