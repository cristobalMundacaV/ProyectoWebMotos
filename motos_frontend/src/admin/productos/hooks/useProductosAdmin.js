import { useState } from "react";
import {
  createAccesorioMoto,
  createAccesorioRider,
  createCategoriaAccesoriosMotos,
  createCategoriaAccesoriosRider,
  deleteProductoAdmin,
  updateProductoAdmin,
} from "../services/productosAdminService";
import {
  forceBrandTokenInName,
  limitSlug,
  buildSlug,
  normalizeCategoryLabel,
  normalizeTitleCaseLabel,
  normalizeTitleCaseForInput,
  normalizeCompareLabel,
} from "../../shared/utils/adminText";
import {
  initialAccesorioMotoForm,
  initialAccesorioRiderForm,
  initialCategoriaAccMotosForm,
  initialCategoriaAccRiderForm,
} from "../constants/productosInitialState";
import {
  getFileNameFromPath,
  normalizePrecioFromApi,
  normalizePrecioInput,
  resolveOptionIdByNombre,
} from "../controllers/productoAdapters";
import { buildAccesorioMotoPayload, buildAccesorioRiderPayload } from "../controllers/productoPayloadBuilder";
import { buildMediaUrl } from "../../../services/apiConfig";

export default function useProductosAdmin({
  setDashboard,
  fallbackImage,
  clearInvalidFieldStyle,
  validateFormWithToast,
  pushToast,
  getErrorText,
}) {
  const [marcasAccMotosAdmin, setMarcasAccMotosAdmin] = useState([]);
  const [marcasAccRiderAdmin, setMarcasAccRiderAdmin] = useState([]);
  const [categoriasAccMotosMeta, setCategoriasAccMotosMeta] = useState({
    categorias_padre: [],
    subcategorias: [],
  });
  const [categoriaAccMotosForm, setCategoriaAccMotosForm] = useState(initialCategoriaAccMotosForm);
  const [categoriaAccMotosSaving, setCategoriaAccMotosSaving] = useState(false);
  const [accesoriosMotosAdmin, setAccesoriosMotosAdmin] = useState([]);
  const [accesoriosMotosMeta, setAccesoriosMotosMeta] = useState({ subcategorias: [], marcas: [], motos: [] });
  const [accesorioMotoForm, setAccesorioMotoForm] = useState(initialAccesorioMotoForm);
  const [accesorioMotoImageInputKey, setAccesorioMotoImageInputKey] = useState(0);
  const [accesorioMotoImageUrl, setAccesorioMotoImageUrl] = useState("");
  const [accesorioMotoSaving, setAccesorioMotoSaving] = useState(false);
  const [accesorioMotoEditModal, setAccesorioMotoEditModal] = useState(null);
  const [accesorioMotoEditSaving, setAccesorioMotoEditSaving] = useState(false);
  const [accesorioMotoEditError, setAccesorioMotoEditError] = useState("");
  const [categoriasAccRiderMeta, setCategoriasAccRiderMeta] = useState({
    categorias_padre: [],
    subcategorias: [],
  });
  const [categoriaAccRiderForm, setCategoriaAccRiderForm] = useState(initialCategoriaAccRiderForm);
  const [categoriaAccRiderSaving, setCategoriaAccRiderSaving] = useState(false);
  const [accesoriosRiderAdmin, setAccesoriosRiderAdmin] = useState([]);
  const [accesoriosRiderMeta, setAccesoriosRiderMeta] = useState({ subcategorias: [], marcas: [] });
  const [accesorioRiderForm, setAccesorioRiderForm] = useState(initialAccesorioRiderForm);
  const [accesorioRiderImageInputKey, setAccesorioRiderImageInputKey] = useState(0);
  const [accesorioRiderImageUrl, setAccesorioRiderImageUrl] = useState("");
  const [accesorioRiderSaving, setAccesorioRiderSaving] = useState(false);
  const [accesorioRiderEditModal, setAccesorioRiderEditModal] = useState(null);
  const [accesorioRiderEditSaving, setAccesorioRiderEditSaving] = useState(false);
  const [accesorioRiderEditError, setAccesorioRiderEditError] = useState("");
  const [productoDeleteModal, setProductoDeleteModal] = useState(null);
  const [productoDeleteSaving, setProductoDeleteSaving] = useState(false);

  function bootstrapProductosData({
    marcasAccMotosList = [],
    marcasAccRiderList = [],
    categoriasAccMotosData,
    categoriasAccRiderData,
    accesoriosMotosList,
    accesoriosMotosMetaData,
    accesoriosRiderList,
    accesoriosRiderMetaData,
  }) {
    setMarcasAccMotosAdmin(marcasAccMotosList);
    setMarcasAccRiderAdmin(marcasAccRiderList);
    setCategoriasAccMotosMeta(categoriasAccMotosData);
    setCategoriasAccRiderMeta(categoriasAccRiderData);
    setAccesoriosMotosAdmin(accesoriosMotosList);
    setAccesoriosMotosMeta(accesoriosMotosMetaData);
    setAccesoriosRiderAdmin(accesoriosRiderList);
    setAccesoriosRiderMeta(accesoriosRiderMetaData);
  }

  function handleCategoriaAccMotosInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    const normalizedValue = name === "nombre" ? normalizeTitleCaseForInput(value) : value;
    setCategoriaAccMotosForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : normalizedValue,
      ...(name === "nombre" ? { slug: buildSlug(normalizeTitleCaseLabel(normalizedValue)) } : {}),
    }));
  }

  function handleCategoriaAccRiderInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    const normalizedValue = name === "nombre" ? normalizeTitleCaseForInput(value) : value;
    setCategoriaAccRiderForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : normalizedValue,
      ...(name === "nombre" ? { slug: buildSlug(normalizeTitleCaseLabel(normalizedValue)) } : {}),
    }));
  }

  function handleAccesorioMotoPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioMotoForm((prev) => ({ ...prev, precio: precioNormalizado }));
  }

  function handleAccesorioMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    const galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
    setAccesorioMotoForm((prev) => {
      const nextBrandId = name === "marca" ? value : prev.marca;
      const selectedBrand = accesoriosMotosMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextForm = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? name === "imagenes_galeria"
                ? galleryFiles
                : files?.[0] || null
              : normalizedValue,
        ...(name === "requiere_compatibilidad" && !checked ? { compatibilidad_motos: [] } : {}),
        ...(name === "es_destacado" && !checked ? { orden_carrusel: "1" } : {}),
      };

      if (name === "marca" && nextForm.nombre) {
        nextForm.nombre = forceBrandTokenInName(nextForm.nombre, brandName);
      }
      if (name === "nombre" || name === "marca") {
        nextForm.slug = limitSlug(buildSlug(normalizeTitleCaseLabel(nextForm.nombre)), 50);
      }
      return nextForm;
    });
  }

  function toggleAccesorioCompatibilidadMoto(motoId) {
    setAccesorioMotoForm((prev) => {
      const exists = prev.compatibilidad_motos.includes(motoId);
      return {
        ...prev,
        compatibilidad_motos: exists
          ? prev.compatibilidad_motos.filter((id) => id !== motoId)
          : [...prev.compatibilidad_motos, motoId],
      };
    });
  }

  function handleAccesorioRiderInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    const galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
    setAccesorioRiderForm((prev) => {
      const nextBrandId = name === "marca" ? value : prev.marca;
      const selectedBrand = accesoriosRiderMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextForm = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? name === "imagenes_galeria"
                ? galleryFiles
                : files?.[0] || null
              : normalizedValue,
      };
      if (name === "marca" && nextForm.nombre) {
        nextForm.nombre = forceBrandTokenInName(nextForm.nombre, brandName);
      }
      if (name === "nombre" || name === "marca") {
        nextForm.slug = limitSlug(buildSlug(normalizeTitleCaseLabel(nextForm.nombre)), 50);
      }
      return nextForm;
    });
  }

  function handleAccesorioRiderPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioRiderForm((prev) => ({ ...prev, precio: precioNormalizado }));
  }

  function handleAccesorioRiderEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      const galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
      const nextBrandId = name === "marca" ? value : prev.form.marca;
      const selectedBrand = accesoriosRiderMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextValue =
        type === "checkbox"
          ? checked
          : type === "file"
            ? name === "imagenes_galeria"
              ? galleryFiles
              : files?.[0] || null
            : normalizedValue;

      if (type === "file") {
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

      const nextForm = { ...prev.form, [name]: nextValue };
      if (type === "file" && name === "imagenes_galeria" && Array.isArray(nextValue) && nextValue.length > 0) {
        nextForm.imagenes_eliminar = [];
        nextForm.remove_imagen_principal = false;
      }
      if (name === "marca" && nextForm.nombre) {
        nextForm.nombre = forceBrandTokenInName(nextForm.nombre, brandName);
      }
      if (name === "nombre" || name === "marca") {
        nextForm.slug = limitSlug(buildSlug(normalizeTitleCaseLabel(nextForm.nombre)), 50);
      }

      return {
        ...prev,
        form: nextForm,
        imagePreviewUrl: nextImagePreviewUrl,
        previewIsObjectUrl: nextPreviewIsObjectUrl,
        imageFileName: nextImageFileName,
      };
    });
  }

  function handleAccesorioRiderEditPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        form: {
          ...prev.form,
          precio: precioNormalizado,
        },
      };
    });
  }

  function handleAccesorioMotoEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setAccesorioMotoEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      const galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []) : null;
      const nextBrandId = name === "marca" ? value : prev.form.marca;
      const selectedBrand = accesoriosMotosMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextValue =
        type === "checkbox"
          ? checked
          : type === "file"
            ? name === "imagenes_galeria"
              ? galleryFiles
              : files?.[0] || null
            : normalizedValue;

      if (type === "file") {
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

      const nextForm = {
        ...prev.form,
        [name]: nextValue,
        ...(name === "requiere_compatibilidad" && !checked ? { compatibilidad_motos: [] } : {}),
      };
      if (type === "file" && name === "imagenes_galeria" && Array.isArray(nextValue) && nextValue.length > 0) {
        nextForm.imagenes_eliminar = [];
        nextForm.remove_imagen_principal = false;
      }

      if (name === "marca" && nextForm.nombre) {
        nextForm.nombre = forceBrandTokenInName(nextForm.nombre, brandName);
      }
      if (name === "nombre" || name === "marca") {
        nextForm.slug = limitSlug(buildSlug(normalizeTitleCaseLabel(nextForm.nombre)), 50);
      }

      return {
        ...prev,
        form: nextForm,
        imagePreviewUrl: nextImagePreviewUrl,
        previewIsObjectUrl: nextPreviewIsObjectUrl,
        imageFileName: nextImageFileName,
      };
    });
  }

  function handleAccesorioMotoEditPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioMotoEditModal((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        form: {
          ...prev.form,
          precio: precioNormalizado,
        },
      };
    });
  }

  function toggleAccesorioMotoEditCompatibilidad(motoId) {
    setAccesorioMotoEditModal((prev) => {
      if (!prev) return prev;
      const exists = prev.form.compatibilidad_motos.includes(motoId);
      return {
        ...prev,
        form: {
          ...prev.form,
          compatibilidad_motos: exists
            ? prev.form.compatibilidad_motos.filter((id) => id !== motoId)
            : [...prev.form.compatibilidad_motos, motoId],
        },
      };
    });
  }

  function removeAccesorioMotoEditImage() {
    setAccesorioMotoEditModal((prev) => {
      if (!prev) return prev;
      if (prev.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return {
        ...prev,
        imagePreviewUrl: "",
        imageFileName: "",
        originalImageUrl: "",
        originalImageName: "",
        previewIsObjectUrl: false,
        imageInputKey: Date.now(),
        form: {
          ...prev.form,
          imagen_principal: null,
          imagenes_galeria: [],
          imagenes_eliminar: Array.isArray(prev.currentImageIds) ? prev.currentImageIds : [],
          remove_imagen_principal: true,
        },
      };
    });
  }

  function removeAccesorioRiderEditImage() {
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      if (prev.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return {
        ...prev,
        imagePreviewUrl: "",
        imageFileName: "",
        originalImageUrl: "",
        originalImageName: "",
        previewIsObjectUrl: false,
        imageInputKey: Date.now(),
        form: {
          ...prev.form,
          imagen_principal: null,
          imagenes_galeria: [],
          imagenes_eliminar: Array.isArray(prev.currentImageIds) ? prev.currentImageIds : [],
          remove_imagen_principal: true,
        },
      };
    });
  }

  async function handleCategoriaAccMotosSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setCategoriaAccMotosSaving(true);
    try {
      const normalizedNombre = normalizeCategoryLabel(categoriaAccMotosForm.nombre);
      const payload = { ...categoriaAccMotosForm, nombre: normalizedNombre, slug: buildSlug(normalizedNombre) };
      const nuevaSubcategoria = await createCategoriaAccesoriosMotos(payload);
      setCategoriasAccMotosMeta((prev) => ({ ...prev, subcategorias: [nuevaSubcategoria, ...prev.subcategorias] }));
      setAccesoriosMotosMeta((prev) => ({ ...prev, subcategorias: [nuevaSubcategoria, ...prev.subcategorias] }));
      setCategoriaAccMotosForm(initialCategoriaAccMotosForm);
      pushToast("Categoria de accesorios de moto creada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la categoria de accesorios de moto."), "error");
    } finally {
      setCategoriaAccMotosSaving(false);
    }
  }

  async function handleCategoriaAccRiderSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setCategoriaAccRiderSaving(true);
    try {
      const normalizedNombre = normalizeCategoryLabel(categoriaAccRiderForm.nombre);
      const payload = { ...categoriaAccRiderForm, nombre: normalizedNombre, slug: buildSlug(normalizedNombre) };
      const nuevaSubcategoria = await createCategoriaAccesoriosRider(payload);
      setCategoriasAccRiderMeta((prev) => ({ ...prev, subcategorias: [nuevaSubcategoria, ...prev.subcategorias] }));
      setAccesoriosRiderMeta((prev) => ({ ...prev, subcategorias: [nuevaSubcategoria, ...prev.subcategorias] }));
      setCategoriaAccRiderForm(initialCategoriaAccRiderForm);
      pushToast("Categoria de accesorios rider creada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la categoria de accesorios rider."), "error");
    } finally {
      setCategoriaAccRiderSaving(false);
    }
  }

  async function handleAccesorioMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setAccesorioMotoSaving(true);
    const payload = buildAccesorioMotoPayload(accesorioMotoForm);
    try {
      const nuevoAccesorio = await createAccesorioMoto(payload);
      setAccesoriosMotosAdmin((prev) => [nuevoAccesorio, ...prev]);
      setDashboard((prev) => ({ ...prev, productosAccesorios: [nuevoAccesorio, ...prev.productosAccesorios] }));
      pushToast("Accesorio de moto creado correctamente.", "success");
      setAccesorioMotoForm(initialAccesorioMotoForm);
      setAccesorioMotoImageInputKey((prev) => prev + 1);
      setAccesorioMotoImageUrl("");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar el accesorio de moto."), "error");
    } finally {
      setAccesorioMotoSaving(false);
    }
  }

  async function handleAccesorioRiderSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setAccesorioRiderSaving(true);
    const payload = buildAccesorioRiderPayload(accesorioRiderForm);
    try {
      const nuevoAccesorio = await createAccesorioRider(payload);
      setAccesoriosRiderAdmin((prev) => [nuevoAccesorio, ...prev]);
      setDashboard((prev) => ({ ...prev, productosIndumentaria: [nuevoAccesorio, ...prev.productosIndumentaria] }));
      setAccesorioRiderForm(initialAccesorioRiderForm);
      setAccesorioRiderImageInputKey((prev) => prev + 1);
      setAccesorioRiderImageUrl("");
      pushToast("Accesorio rider creado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar el accesorio rider."), "error");
    } finally {
      setAccesorioRiderSaving(false);
    }
  }

  function handleAccesorioMotoEdit(producto) {
    const subcategoriaId = resolveOptionIdByNombre(
      categoriasAccMotosMeta.subcategorias,
      producto.subcategoria,
      producto.subcategoria_nombre || producto.subcategoria_display || producto.subcategoria_label,
      normalizeCompareLabel
    );
    const marcaId = resolveOptionIdByNombre(
      accesoriosMotosMeta.marcas,
      producto.marca,
      producto.marca_nombre || producto.marca_display || producto.marca_label,
      normalizeCompareLabel
    );
    const compatibilidad = Array.isArray(producto.compatibilidad_motos)
      ? producto.compatibilidad_motos.map((item) => (typeof item === "object" ? item.id : item)).filter(Boolean)
      : [];

    setAccesorioMotoEditError("");
    setAccesorioMotoEditModal({
      id: producto.id,
      title: producto.nombre || "Editar accesorio moto",
      kind: "accesorio_moto",
      originalImageUrl: buildMediaUrl(producto.imagen_principal) || "",
      originalImageName: getFileNameFromPath(producto.imagen_principal),
      imagePreviewUrl: buildMediaUrl(producto.imagen_principal) || "",
      imageFileName: getFileNameFromPath(producto.imagen_principal),
      previewIsObjectUrl: false,
      imageInputKey: Date.now(),
      currentImageIds: Array.isArray(producto.imagenes) ? producto.imagenes.map((item) => item.id).filter(Boolean) : [],
      form: {
        subcategoria: subcategoriaId,
        marca: marcaId,
        nombre: producto.nombre || "",
        slug: producto.slug || "",
        descripcion: producto.descripcion || "",
        precio: normalizePrecioFromApi(producto.precio),
        orden_carrusel: String(producto.orden_carrusel ?? "1"),
        imagen_principal: null,
        imagenes_galeria: [],
        imagenes_eliminar: [],
        remove_imagen_principal: false,
        es_destacado: Boolean(producto.es_destacado),
        activo: producto.activo !== false,
        requiere_compatibilidad: Boolean(producto.requiere_compatibilidad),
        compatibilidad_motos: compatibilidad,
      },
    });
  }

  function handleAccesorioRiderEdit(producto) {
    const subcategoriaId = resolveOptionIdByNombre(
      accesoriosRiderMeta.subcategorias,
      producto.subcategoria,
      producto.subcategoria_nombre || producto.subcategoria_display || producto.subcategoria_label,
      normalizeCompareLabel
    );
    const marcaId = resolveOptionIdByNombre(
      accesoriosRiderMeta.marcas,
      producto.marca,
      producto.marca_nombre || producto.marca_display || producto.marca_label,
      normalizeCompareLabel
    );
    setAccesorioRiderEditError("");
    setAccesorioRiderEditModal({
      id: producto.id,
      title: producto.nombre || "Editar accesorio rider",
      kind: "accesorio_rider",
      originalImageUrl: buildMediaUrl(producto.imagen_principal) || "",
      originalImageName: getFileNameFromPath(producto.imagen_principal),
      imagePreviewUrl: buildMediaUrl(producto.imagen_principal) || "",
      imageFileName: getFileNameFromPath(producto.imagen_principal),
      previewIsObjectUrl: false,
      imageInputKey: Date.now(),
      currentImageIds: Array.isArray(producto.imagenes) ? producto.imagenes.map((item) => item.id).filter(Boolean) : [],
      form: {
        subcategoria: subcategoriaId,
        marca: marcaId,
        nombre: producto.nombre || "",
        slug: producto.slug || "",
        descripcion: producto.descripcion || "",
        precio: normalizePrecioFromApi(producto.precio),
        orden_carrusel: String(producto.orden_carrusel ?? "1"),
        es_destacado: Boolean(producto.es_destacado),
        activo: producto.activo !== false,
        imagen_principal: null,
        imagenes_galeria: [],
        imagenes_eliminar: [],
        remove_imagen_principal: false,
      },
    });
  }

  function closeAccesorioRiderEditModal(forceClose = false) {
    if (accesorioRiderEditSaving && !forceClose) return;
    setAccesorioRiderEditModal((prev) => {
      if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return null;
    });
    setAccesorioRiderEditError("");
  }

  function closeAccesorioMotoEditModal(forceClose = false) {
    if (accesorioMotoEditSaving && !forceClose) return;
    setAccesorioMotoEditModal((prev) => {
      if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return null;
    });
    setAccesorioMotoEditError("");
  }

  async function submitAccesorioMotoEditModal(event) {
    event.preventDefault();
    if (!accesorioMotoEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;
    setAccesorioMotoEditSaving(true);
    setAccesorioMotoEditError("");
    const payload = buildAccesorioMotoPayload(accesorioMotoEditModal.form);
    try {
      const updatedAccesorio = await updateProductoAdmin(accesorioMotoEditModal.id, payload);
      setAccesoriosMotosAdmin((prev) => prev.map((item) => (item.id === accesorioMotoEditModal.id ? updatedAccesorio : item)));
      setDashboard((prev) => ({
        ...prev,
        productosAccesorios: prev.productosAccesorios.map((item) =>
          item.id === accesorioMotoEditModal.id ? updatedAccesorio : item
        ),
      }));
      pushToast("Accesorio de moto actualizado correctamente.", "success");
      closeAccesorioMotoEditModal(true);
    } catch (error) {
      const message = getErrorText(error, "No se pudo actualizar el accesorio de moto.");
      setAccesorioMotoEditError(message);
      pushToast(message, "error");
    } finally {
      setAccesorioMotoEditSaving(false);
    }
  }

  async function submitAccesorioRiderEditModal(event) {
    event.preventDefault();
    if (!accesorioRiderEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;
    setAccesorioRiderEditSaving(true);
    setAccesorioRiderEditError("");
    const payload = buildAccesorioRiderPayload(accesorioRiderEditModal.form);
    try {
      const updatedAccesorio = await updateProductoAdmin(accesorioRiderEditModal.id, payload);
      setAccesoriosRiderAdmin((prev) => prev.map((item) => (item.id === accesorioRiderEditModal.id ? updatedAccesorio : item)));
      setDashboard((prev) => ({
        ...prev,
        productosIndumentaria: prev.productosIndumentaria.map((item) =>
          item.id === accesorioRiderEditModal.id ? updatedAccesorio : item
        ),
      }));
      pushToast("Accesorio rider actualizado correctamente.", "success");
      closeAccesorioRiderEditModal(true);
    } catch (error) {
      const message = getErrorText(error, "No se pudo actualizar el accesorio rider.");
      setAccesorioRiderEditError(message);
      pushToast(message, "error");
    } finally {
      setAccesorioRiderEditSaving(false);
    }
  }

  function handleAccesorioMotoDelete(producto) {
    setProductoDeleteModal({
      id: producto.id,
      nombre: producto.nombre || "sin nombre",
      tipo: "accesorio_moto",
    });
  }

  function handleAccesorioRiderDelete(producto) {
    setProductoDeleteModal({
      id: producto.id,
      nombre: producto.nombre || "sin nombre",
      tipo: "indumentaria",
    });
  }

  function closeProductoDeleteModal() {
    if (productoDeleteSaving) return;
    setProductoDeleteModal(null);
  }

  async function submitProductoDelete() {
    if (!productoDeleteModal) return;
    setProductoDeleteSaving(true);
    try {
      await deleteProductoAdmin(productoDeleteModal.id);
      if (productoDeleteModal.tipo === "accesorio_moto") {
        setAccesoriosMotosAdmin((prev) => prev.filter((item) => item.id !== productoDeleteModal.id));
        setDashboard((prev) => ({
          ...prev,
          productosAccesorios: prev.productosAccesorios.filter((item) => item.id !== productoDeleteModal.id),
        }));
        if (accesorioMotoEditModal?.id === productoDeleteModal.id) closeAccesorioMotoEditModal();
        pushToast("Accesorio de moto eliminado correctamente.", "success");
      } else {
        setAccesoriosRiderAdmin((prev) => prev.filter((item) => item.id !== productoDeleteModal.id));
        setDashboard((prev) => ({
          ...prev,
          productosIndumentaria: prev.productosIndumentaria.filter((item) => item.id !== productoDeleteModal.id),
        }));
        if (accesorioRiderEditModal?.id === productoDeleteModal.id) closeAccesorioRiderEditModal();
        pushToast("Indumentaria rider eliminada correctamente.", "success");
      }
      setProductoDeleteModal(null);
    } catch (error) {
      const fallbackMessage =
        productoDeleteModal.tipo === "accesorio_moto"
          ? "No se pudo eliminar el accesorio de moto."
          : "No se pudo eliminar la indumentaria rider.";
      pushToast(getErrorText(error, fallbackMessage), "error");
    } finally {
      setProductoDeleteSaving(false);
    }
  }

  function handleCancelAccesorioMotoEdit() {
    closeAccesorioMotoEditModal();
  }

  return {
    marcasAccMotosAdmin,
    setMarcasAccMotosAdmin,
    marcasAccRiderAdmin,
    setMarcasAccRiderAdmin,
    categoriasAccMotosMeta,
    setCategoriasAccMotosMeta,
    categoriaAccMotosForm,
    categoriaAccMotosSaving,
    accesoriosMotosAdmin,
    setAccesoriosMotosAdmin,
    accesoriosMotosMeta,
    setAccesoriosMotosMeta,
    accesorioMotoForm,
    accesorioMotoImageInputKey,
    accesorioMotoImageUrl,
    accesorioMotoSaving,
    accesorioMotoEditModal,
    accesorioMotoEditSaving,
    accesorioMotoEditError,
    categoriasAccRiderMeta,
    setCategoriasAccRiderMeta,
    categoriaAccRiderForm,
    categoriaAccRiderSaving,
    accesoriosRiderAdmin,
    setAccesoriosRiderAdmin,
    accesoriosRiderMeta,
    setAccesoriosRiderMeta,
    accesorioRiderForm,
    accesorioRiderImageInputKey,
    accesorioRiderImageUrl,
    accesorioRiderSaving,
    accesorioRiderEditModal,
    accesorioRiderEditSaving,
    accesorioRiderEditError,
    productoDeleteModal,
    productoDeleteSaving,
    bootstrapProductosData,
    handleCategoriaAccMotosInputChange,
    handleCategoriaAccRiderInputChange,
    handleAccesorioMotoPrecioInputChange,
    handleAccesorioMotoInputChange,
    toggleAccesorioCompatibilidadMoto,
    handleAccesorioRiderInputChange,
    handleAccesorioRiderPrecioInputChange,
    handleAccesorioMotoEditInputChange,
    handleAccesorioMotoEditPrecioInputChange,
    toggleAccesorioMotoEditCompatibilidad,
    handleAccesorioRiderEditInputChange,
    handleAccesorioRiderEditPrecioInputChange,
    handleCategoriaAccMotosSubmit,
    handleCategoriaAccRiderSubmit,
    handleAccesorioMotoSubmit,
    handleAccesorioRiderSubmit,
    handleAccesorioMotoEdit,
    removeAccesorioMotoEditImage,
    closeAccesorioMotoEditModal,
    submitAccesorioMotoEditModal,
    handleAccesorioRiderEdit,
    removeAccesorioRiderEditImage,
    closeAccesorioRiderEditModal,
    submitAccesorioRiderEditModal,
    handleAccesorioMotoDelete,
    handleAccesorioRiderDelete,
    closeProductoDeleteModal,
    submitProductoDelete,
    handleCancelAccesorioMotoEdit,
  };
}
