import { useMemo, useState } from "react";
import {
  createCategoriaMoto,
  createMarca,
  createModeloMoto,
  createMoto,
  deleteMoto,
  updateMoto,
} from "../services/motosAdminService";
import {
  initialCategoriaMotoForm,
  initialMarcaForm,
  initialModeloMotoForm,
  initialMotoForm,
} from "../../shared/constants/adminInitialState";
import { buildMediaUrl } from "../../../services/apiConfig";
import { MOTO_YEAR_RANGE } from "../constants/motoYearRange";

export default function useMotoAdmin({
  setDashboard,
  activeSection,
  activeMarcaConfig,
  pushToast,
  getErrorText,
  validateFormWithToast,
  clearInvalidFieldStyle,
  normalizeUppercaseLabel,
  normalizeTitleCaseForInput,
  normalizeTitleCaseLabel,
  normalizeCategoryLabel,
  normalizeCompareLabel,
  buildSlug,
  limitSlug,
  fallbackImage,
  onCreateMarcaForProductoDomain,
}) {
  const MAX_MOTO_GALLERY_IMAGES = 3;
  const [motoMeta, setMotoMeta] = useState({ marcas: [], categorias: [], modelos: [] });
  const [marcasMotosAdmin, setMarcasMotosAdmin] = useState([]);
  const [modelosMotosAdmin, setModelosMotosAdmin] = useState([]);
  const [categoriasMoto, setCategoriasMoto] = useState([]);
  const [motoForm, setMotoForm] = useState(initialMotoForm);
  const [motoImageInputKey, setMotoImageInputKey] = useState(0);
  const [motoSaving, setMotoSaving] = useState(false);
  const [motoEditModal, setMotoEditModal] = useState(null);
  const [motoEditSaving, setMotoEditSaving] = useState(false);
  const [motoEditError, setMotoEditError] = useState("");
  const [motoDeleteModal, setMotoDeleteModal] = useState(null);
  const [motoDeleteSaving, setMotoDeleteSaving] = useState(false);
  const [modeloMotoForm, setModeloMotoForm] = useState(initialModeloMotoForm);
  const [modeloMotoSaving, setModeloMotoSaving] = useState(false);
  const [categoriaMotoForm, setCategoriaMotoForm] = useState(initialCategoriaMotoForm);
  const [categoriaMotoSaving, setCategoriaMotoSaving] = useState(false);
  const [marcaForm, setMarcaForm] = useState(initialMarcaForm);
  const [marcaSaving, setMarcaSaving] = useState(false);

  function normalizePrecioInput(rawValue) {
    return String(rawValue || "").replace(/\D/g, "");
  }

  function normalizePrecioFromApi(value) {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "number") return String(Math.trunc(value));
    const text = String(value).trim();
    if (/^\d+[.,]\d{1,2}$/.test(text)) {
      const normalized = Number(text.replace(",", "."));
      if (Number.isFinite(normalized)) return String(Math.trunc(normalized));
    }
    return normalizePrecioInput(text);
  }

  function formatPrecioDisplay(value) {
    if (value === null || value === undefined || value === "") return "";
    const digits = String(value).replace(/\D/g, "");
    if (!digits) return "";
    return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  function getFileNameFromPath(pathValue) {
    const raw = String(pathValue || "").trim();
    if (!raw) return "";
    const noQuery = raw.split("?")[0];
    const lastSegment = noQuery.split("/").pop()?.split("\\").pop() || "";
    try {
      return decodeURIComponent(lastSegment);
    } catch {
      return lastSegment;
    }
  }

  function buildMotoPayload(form) {
    const payload = new FormData();
    const galleryFiles = Array.isArray(form.imagenes_galeria)
      ? form.imagenes_galeria.filter(Boolean).slice(0, MAX_MOTO_GALLERY_IMAGES)
      : [];
    const primaryImageFromGallery = galleryFiles[0] || null;
    const selectedModelo = motoMeta.modelos.find(
      (item) => String(item.id) === String(form.modelo) && String(item.marca) === String(form.marca)
    );
    const modeloNombre = selectedModelo?.nombre || "";
    const modeloSlug = selectedModelo?.slug || form.slug || limitSlug(buildSlug(modeloNombre), 50);

    payload.append("marca", form.marca);
    if (form.modelo) payload.append("modelo_id", String(form.modelo));
    payload.append("modelo", modeloNombre);
    payload.append("slug", modeloSlug);
    payload.append("descripcion", form.descripcion);
    payload.append("video_presentacion", form.video_presentacion || "");
    payload.append("precio", form.precio);
    payload.append("precio_lista", form.precio_lista);
    payload.append("permite_variante_maletas", String(Boolean(form.permite_variante_maletas)));
    if (form.permite_variante_maletas && form.precio_con_maletas) payload.append("precio_con_maletas", form.precio_con_maletas);
    if (form.permite_variante_maletas && form.precio_lista_con_maletas) payload.append("precio_lista_con_maletas", form.precio_lista_con_maletas);
    payload.append("anio", form.anio);
    payload.append("es_destacada", String(form.es_destacada));
    if (form.es_destacada) payload.append("orden_carrusel", form.orden_carrusel || "1");
    payload.append("activa", String(form.activa));
    if (form.imagen_principal || primaryImageFromGallery) {
      payload.append("imagen_principal", form.imagen_principal || primaryImageFromGallery);
    }
    galleryFiles.forEach((file) => payload.append("imagenes", file));
    if (form.imagen_con_maletas) payload.append("imagen_con_maletas", form.imagen_con_maletas);
    return payload;
  }

  const currentYear = new Date().getFullYear();
  const MIN_MOTO_YEAR = Math.max(2010, currentYear - MOTO_YEAR_RANGE);
  const motoYearOptions = useMemo(
    () => Array.from({ length: currentYear - MIN_MOTO_YEAR + 1 }, (_, index) => String(currentYear - index)),
    [currentYear, MIN_MOTO_YEAR]
  );

  const motoEditModelosFiltrados = useMemo(
    () => (motoEditModal ? motoMeta.modelos.filter((modelo) => String(modelo.marca) === String(motoEditModal.form.marca)) : []),
    [motoEditModal, motoMeta.modelos]
  );

  function handleMarcaInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    const normalizedValue = name === "nombre" ? normalizeUppercaseLabel(value) : value;
    setMarcaForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : normalizedValue,
      ...(name === "nombre" ? { slug: buildSlug(normalizeUppercaseLabel(normalizedValue)) } : {}),
    }));
  }

  function handleModeloMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    const normalizedValue = name === "nombre" ? normalizeUppercaseLabel(value) : value;
    setModeloMotoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : normalizedValue,
      ...(name === "nombre" ? { slug: limitSlug(buildSlug(normalizedValue), 50) } : {}),
    }));
  }

  function handleCategoriaMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    const normalizedValue = name === "nombre" ? normalizeTitleCaseForInput(value) : value;
    setCategoriaMotoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : normalizedValue,
      ...(name === "nombre" ? { slug: buildSlug(normalizeTitleCaseLabel(normalizedValue)) } : {}),
    }));
  }

  function handleMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    let galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
    if (name === "imagenes_galeria" && Array.isArray(galleryFiles) && galleryFiles.length > MAX_MOTO_GALLERY_IMAGES) {
      galleryFiles = galleryFiles.slice(0, MAX_MOTO_GALLERY_IMAGES);
      pushToast("Solo puedes subir hasta 3 imagenes por moto.", "neutral");
    }
    setMotoForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? name === "imagenes_galeria"
              ? galleryFiles
              : files?.[0] || null
            : value,
      ...(name === "permite_variante_maletas" && !checked ? { precio_con_maletas: "", precio_lista_con_maletas: "", imagen_con_maletas: null } : {}),
      ...(name === "es_destacada" && !checked ? { orden_carrusel: "1" } : {}),
      ...(name === "marca" ? { modelo: "", slug: "" } : {}),
      ...(name === "modelo"
        ? { slug: limitSlug(buildSlug(motoMeta.modelos.find((item) => String(item.id) === String(value))?.nombre || ""), 50) }
        : {}),
    }));
  }

  function handleMotoPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    setMotoForm((prev) => ({ ...prev, precio: normalizePrecioInput(event.target.value) }));
  }

  function handleMotoPrecioListaInputChange(event) {
    clearInvalidFieldStyle(event.target);
    setMotoForm((prev) => ({ ...prev, precio_lista: normalizePrecioInput(event.target.value) }));
  }

  function handleMotoPrecioConMaletasInputChange(event) {
    clearInvalidFieldStyle(event.target);
    setMotoForm((prev) => ({ ...prev, precio_con_maletas: normalizePrecioInput(event.target.value) }));
  }

  function handleMotoPrecioListaConMaletasInputChange(event) {
    clearInvalidFieldStyle(event.target);
    setMotoForm((prev) => ({ ...prev, precio_lista_con_maletas: normalizePrecioInput(event.target.value) }));
  }

  function handleMotoEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setMotoEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      let nextImageMaletasPreviewUrl = prev.imageMaletasPreviewUrl;
      let nextPreviewMaletasIsObjectUrl = prev.previewMaletasIsObjectUrl;
      let nextImageMaletasFileName = prev.imageMaletasFileName;
      let galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
      if (name === "imagenes_galeria" && Array.isArray(galleryFiles) && galleryFiles.length > MAX_MOTO_GALLERY_IMAGES) {
        galleryFiles = galleryFiles.slice(0, MAX_MOTO_GALLERY_IMAGES);
        pushToast("Solo puedes subir hasta 3 imagenes por moto.", "neutral");
      }
      const nextValue =
        type === "checkbox"
          ? checked
          : type === "file"
            ? name === "imagenes_galeria"
              ? galleryFiles
              : files?.[0] || null
            : value;

      if (type === "file" && (name === "imagen_principal" || name === "imagenes_galeria")) {
        if (prev.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
        const primaryImage = name === "imagenes_galeria" ? (Array.isArray(nextValue) ? nextValue[0] : null) : nextValue;
        if (primaryImage) {
          nextImagePreviewUrl = URL.createObjectURL(primaryImage);
          nextPreviewIsObjectUrl = true;
          nextImageFileName = primaryImage.name;
        } else {
          nextImagePreviewUrl = prev.originalImageUrl || "";
          nextPreviewIsObjectUrl = false;
          nextImageFileName = prev.originalImageName || "";
        }
      }

      if (type === "file" && name === "imagen_con_maletas") {
        if (prev.previewMaletasIsObjectUrl && prev.imageMaletasPreviewUrl) URL.revokeObjectURL(prev.imageMaletasPreviewUrl);
        if (nextValue) {
          nextImageMaletasPreviewUrl = URL.createObjectURL(nextValue);
          nextPreviewMaletasIsObjectUrl = true;
          nextImageMaletasFileName = nextValue.name;
        } else {
          nextImageMaletasPreviewUrl = prev.originalImageMaletasUrl || "";
          nextPreviewMaletasIsObjectUrl = false;
          nextImageMaletasFileName = prev.originalImageMaletasName || "";
        }
      }

      const nextForm = {
        ...prev.form,
        [name]: nextValue,
        ...(name === "permite_variante_maletas" && !nextValue ? { precio_con_maletas: "", precio_lista_con_maletas: "", imagen_con_maletas: null } : {}),
        ...(name === "es_destacada" && !nextValue ? { orden_carrusel: "1" } : {}),
        ...(name === "marca" ? { modelo: "", slug: "" } : {}),
        ...(name === "modelo"
          ? { slug: limitSlug(buildSlug(motoMeta.modelos.find((item) => String(item.id) === String(value))?.nombre || ""), 50) }
          : {}),
      };

      return {
        ...prev,
        form: nextForm,
        imagePreviewUrl: nextImagePreviewUrl,
        previewIsObjectUrl: nextPreviewIsObjectUrl,
        imageFileName: nextImageFileName,
        imageMaletasPreviewUrl: nextImageMaletasPreviewUrl,
        previewMaletasIsObjectUrl: nextPreviewMaletasIsObjectUrl,
        imageMaletasFileName: nextImageMaletasFileName,
      };
    });
  }

  function handleMotoEditPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio: precioNormalizado } } : prev));
  }

  function handleMotoEditPrecioListaInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio_lista: precioNormalizado } } : prev));
  }

  function handleMotoEditPrecioConMaletasInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio_con_maletas: precioNormalizado } } : prev));
  }

  function handleMotoEditPrecioListaConMaletasInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio_lista_con_maletas: precioNormalizado } } : prev));
  }

  async function handleMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    const selectedModelo = motoMeta.modelos.find(
      (item) => String(item.id) === String(motoForm.modelo) && String(item.marca) === String(motoForm.marca)
    );
    if (!selectedModelo) {
      pushToast("Selecciona un modelo valido para la marca elegida.", "error");
      return;
    }
    setMotoSaving(true);
    try {
      const nuevaMoto = await createMoto(buildMotoPayload(motoForm));
      setDashboard((prev) => ({ ...prev, motos: [nuevaMoto, ...prev.motos] }));
      pushToast("Moto agregada correctamente.", "success");
      setMotoForm(initialMotoForm);
      setMotoImageInputKey((prev) => prev + 1);
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la moto."), "error");
    } finally {
      setMotoSaving(false);
    }
  }

  function handleMotoEdit(moto) {
    const resolvedModeloId =
      moto.modelo_ref ??
      moto.modelo_id ??
      motoMeta.modelos.find(
        (item) =>
          String(item.marca) === String(moto.marca) &&
          String(item.nombre || "").trim().toUpperCase() === String(moto.modelo || "").trim().toUpperCase()
      )?.id ??
      "";
    setMotoEditError("");
    setMotoEditModal({
      id: moto.id,
      modelName: moto.modelo || "",
      originalImageUrl: buildMediaUrl(moto.imagen_principal) || fallbackImage,
      originalImageName: getFileNameFromPath(moto.imagen_principal),
      imagePreviewUrl: buildMediaUrl(moto.imagen_principal) || fallbackImage,
      imageFileName: getFileNameFromPath(moto.imagen_principal),
      previewIsObjectUrl: false,
      originalImageMaletasUrl: buildMediaUrl(moto.imagen_con_maletas) || "",
      originalImageMaletasName: getFileNameFromPath(moto.imagen_con_maletas),
      imageMaletasPreviewUrl: buildMediaUrl(moto.imagen_con_maletas) || "",
      imageMaletasFileName: getFileNameFromPath(moto.imagen_con_maletas),
      previewMaletasIsObjectUrl: false,
      imageInputKey: Date.now(),
      form: {
        marca: String(moto.marca ?? ""),
        modelo: String(resolvedModeloId ?? ""),
        slug: moto.slug || "",
        descripcion: moto.descripcion || "",
        precio: normalizePrecioFromApi(moto.precio),
        precio_lista: normalizePrecioFromApi(moto.precio_lista),
        permite_variante_maletas: Boolean(moto.permite_variante_maletas),
        precio_con_maletas: normalizePrecioFromApi(moto.precio_con_maletas),
        precio_lista_con_maletas: normalizePrecioFromApi(moto.precio_lista_con_maletas),
        anio: String(moto.anio ?? ""),
        color: moto.color || "",
        estado: moto.estado || "disponible",
        es_destacada: Boolean(moto.es_destacada),
        orden_carrusel: String(moto.orden_carrusel ?? "1"),
        activa: moto.activa !== false,
        imagen_principal: null,
        imagenes_galeria: [],
        imagen_con_maletas: null,
        video_presentacion: moto.video_presentacion || "",
      },
    });
  }

  function closeMotoEditModal(forceClose = false) {
    if (motoEditSaving && !forceClose) return;
    setMotoEditModal((prev) => {
      if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      if (prev?.previewMaletasIsObjectUrl && prev.imageMaletasPreviewUrl) URL.revokeObjectURL(prev.imageMaletasPreviewUrl);
      return null;
    });
    setMotoEditError("");
  }

  async function submitMotoEditModal(event) {
    event.preventDefault();
    if (!motoEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;
    const selectedModelo = motoMeta.modelos.find(
      (item) => String(item.id) === String(motoEditModal.form.modelo) && String(item.marca) === String(motoEditModal.form.marca)
    );
    if (!selectedModelo) {
      const message = "Selecciona un modelo valido para la marca elegida.";
      setMotoEditError(message);
      pushToast(message, "error");
      return;
    }
    setMotoEditSaving(true);
    setMotoEditError("");
    try {
      const updatedMoto = await updateMoto(motoEditModal.id, buildMotoPayload(motoEditModal.form));
      setDashboard((prev) => ({
        ...prev,
        motos: prev.motos.map((item) => (item.id === motoEditModal.id ? updatedMoto : item)),
      }));
      pushToast("Moto actualizada correctamente.", "success");
      closeMotoEditModal(true);
    } catch (error) {
      const message = getErrorText(error, "No se pudo actualizar la moto.");
      setMotoEditError(message);
      pushToast(message, "error");
    } finally {
      setMotoEditSaving(false);
    }
  }

  function handleMotoDelete(moto) {
    setMotoDeleteModal({
      id: moto.id,
      modelo: moto.modelo || "sin modelo",
    });
  }

  function closeMotoDeleteModal() {
    if (motoDeleteSaving) return;
    setMotoDeleteModal(null);
  }

  async function submitMotoDelete() {
    if (!motoDeleteModal) return;
    setMotoDeleteSaving(true);
    try {
      await deleteMoto(motoDeleteModal.id);
      setDashboard((prev) => ({
        ...prev,
        motos: prev.motos.filter((item) => item.id !== motoDeleteModal.id),
      }));
      if (motoEditModal?.id === motoDeleteModal.id) closeMotoEditModal();
      setMotoDeleteModal(null);
      pushToast("Moto eliminada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo eliminar la moto."), "error");
    } finally {
      setMotoDeleteSaving(false);
    }
  }

  async function handleModeloMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    if (!modeloMotoForm.marca || !modeloMotoForm.categoria) {
      pushToast("Selecciona marca y categoria para crear el modelo.", "error");
      return;
    }
    setModeloMotoSaving(true);
    try {
      const normalizedNombre = normalizeUppercaseLabel(modeloMotoForm.nombre);
      const payload = {
        marca: modeloMotoForm.marca,
        categoria: modeloMotoForm.categoria,
        nombre: normalizedNombre,
        nombre_modelo: normalizedNombre,
        descripcion: modeloMotoForm.descripcion,
        activo: Boolean(modeloMotoForm.activo),
      };
      const nuevoModelo = await createModeloMoto(payload);
      setModelosMotosAdmin((prev) => [nuevoModelo, ...prev]);
      setMotoMeta((prev) => ({ ...prev, modelos: [nuevoModelo, ...prev.modelos] }));
      setModeloMotoForm(initialModeloMotoForm);
      pushToast("Modelo creado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo crear el modelo."), "error");
    } finally {
      setModeloMotoSaving(false);
    }
  }

  async function handleCategoriaMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setCategoriaMotoSaving(true);
    try {
      const normalizedNombre = normalizeCategoryLabel(categoriaMotoForm.nombre);
      const payload = { ...categoriaMotoForm, nombre: normalizedNombre, slug: buildSlug(normalizedNombre) };
      const nuevaCategoria = await createCategoriaMoto(payload);
      setCategoriasMoto((prev) => [nuevaCategoria, ...prev]);
      setMotoMeta((prev) => ({ ...prev, categorias: [{ id: nuevaCategoria.id, nombre: nuevaCategoria.nombre }, ...prev.categorias] }));
      setCategoriaMotoForm(initialCategoriaMotoForm);
      pushToast("Categoria de moto creada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la categoria de moto."), "error");
    } finally {
      setCategoriaMotoSaving(false);
    }
  }

  async function handleMarcaSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setMarcaSaving(true);
    try {
      const normalizedNombre = normalizeUppercaseLabel(marcaForm.nombre);
      const payload = { ...marcaForm, nombre: normalizedNombre, slug: buildSlug(normalizedNombre) };
      const nuevaMarca = await createMarca(payload, { tipo: activeMarcaConfig.tipo });

      if (activeSection === "marcas_motos") {
        setMarcasMotosAdmin((prev) => [nuevaMarca, ...prev]);
        if (nuevaMarca.activa) {
          setMotoMeta((prev) => ({ ...prev, marcas: [{ id: nuevaMarca.id, nombre: nuevaMarca.nombre }, ...prev.marcas] }));
        }
      } else if (activeSection === "marcas_acc_motos") {
        onCreateMarcaForProductoDomain?.({ tipo: "accesorio_moto", marca: nuevaMarca });
      } else if (activeSection === "marcas_acc_rider") {
        onCreateMarcaForProductoDomain?.({ tipo: "accesorio_rider", marca: nuevaMarca });
      }

      setMarcaForm(initialMarcaForm);
      pushToast("Marca creada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la marca."), "error");
    } finally {
      setMarcaSaving(false);
    }
  }

  function resolveOptionIdByNombre(options, explicitId, explicitNombre) {
    if (explicitId !== undefined && explicitId !== null && explicitId !== "") return String(explicitId);
    const target = normalizeCompareLabel(explicitNombre);
    if (!target) return "";
    const match = options.find((item) => normalizeCompareLabel(item.nombre) === target);
    return match ? String(match.id) : "";
  }

  function bootstrapMotoData({ metaMotos, marcasMotosList, modelosMotoList, categoriasMotoList }) {
    setMotoMeta(metaMotos || { marcas: [], categorias: [], modelos: [] });
    setMarcasMotosAdmin(marcasMotosList || []);
    setModelosMotosAdmin(modelosMotoList || []);
    setCategoriasMoto(categoriasMotoList || []);
  }

  return {
    motoMeta,
    setMotoMeta,
    marcasMotosAdmin,
    setMarcasMotosAdmin,
    modelosMotosAdmin,
    setModelosMotosAdmin,
    categoriasMoto,
    setCategoriasMoto,
    motoForm,
    motoSaving,
    motoImageInputKey,
    motoEditModal,
    motoEditSaving,
    motoEditError,
    motoDeleteModal,
    motoDeleteSaving,
    modeloMotoForm,
    modeloMotoSaving,
    categoriaMotoForm,
    categoriaMotoSaving,
    marcaForm,
    marcaSaving,
    motoYearOptions,
    motoEditModelosFiltrados,
    formatPrecioDisplay,
    handleMarcaInputChange,
    handleModeloMotoInputChange,
    handleCategoriaMotoInputChange,
    handleMotoInputChange,
    handleMotoPrecioInputChange,
    handleMotoPrecioListaInputChange,
    handleMotoPrecioConMaletasInputChange,
    handleMotoPrecioListaConMaletasInputChange,
    handleMotoEditInputChange,
    handleMotoEditPrecioInputChange,
    handleMotoEditPrecioListaInputChange,
    handleMotoEditPrecioConMaletasInputChange,
    handleMotoEditPrecioListaConMaletasInputChange,
    handleMotoSubmit,
    handleMotoEdit,
    closeMotoEditModal,
    submitMotoEditModal,
    handleMotoDelete,
    closeMotoDeleteModal,
    submitMotoDelete,
    handleModeloMotoSubmit,
    handleCategoriaMotoSubmit,
    handleMarcaSubmit,
    resolveOptionIdByNombre,
    bootstrapMotoData,
  };
}
