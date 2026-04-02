import { useEffect, useMemo, useRef, useState } from "react";
import { useMotos } from "../../hooks/useMotos";
import MotoCard from "../motos/MotoCard";
import MotoEditModal from "../../admin/motos/components/MotoEditModal";
import usePublicToasts from "../equipamiento/usePublicToasts";
import PublicToastStack from "../equipamiento/PublicToastStack";
import { MOTO_YEAR_RANGE } from "../../admin/motos/constants/motoYearRange";
import { buildFallbackImageDataUrl, buildMediaUrl } from "../../services/apiConfig";
import { deleteMoto, getMotoAdminMeta, updateMoto } from "../../services/motosService";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../../services/authService";
import "../../styles/home.css";
import "../../styles/admin.css";

export default function MotosDestacadas() {
  const fallbackImage = buildFallbackImageDataUrl({ width: 900, height: 600, text: "Sin Imagen" });
  const { motos, setMotos, loading, error } = useMotos();
  const orderedMotos = useMemo(
    () =>
      [...(Array.isArray(motos) ? motos : [])].sort((a, b) => {
        const destacadaA = a?.es_destacada ? 1 : 0;
        const destacadaB = b?.es_destacada ? 1 : 0;
        if (destacadaA !== destacadaB) return destacadaB - destacadaA;
        return (a?.orden_carrusel ?? 1) - (b?.orden_carrusel ?? 1) || (a?.id ?? 0) - (b?.id ?? 0);
      }),
    [motos]
  );
  const trackRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [motoMeta, setMotoMeta] = useState({ marcas: [], categorias: [], modelos: [] });
  const [motoEditModal, setMotoEditModal] = useState(null);
  const [motoEditSaving, setMotoEditSaving] = useState(false);
  const [motoEditError, setMotoEditError] = useState("");
  const { toasts, pushToast, dismissToast } = usePublicToasts();

  const currentYear = new Date().getFullYear();
  const minMotoYear = currentYear - MOTO_YEAR_RANGE;
  const motoYearOptions = useMemo(
    () => Array.from({ length: currentYear - minMotoYear + 1 }, (_, index) => String(currentYear - index)),
    [currentYear, minMotoYear]
  );
  const motoEditModelosFiltrados = useMemo(
    () =>
      motoEditModal
        ? motoMeta.modelos.filter((modelo) => String(modelo.marca) === String(motoEditModal.form.marca))
        : [],
    [motoEditModal, motoMeta.modelos]
  );

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setIsAdmin(Boolean(token && hasAdminAccess(user)));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;
    getMotoAdminMeta()
      .then((response) => {
        if (!isMounted) return;
        setMotoMeta({
          marcas: Array.isArray(response?.marcas) ? response.marcas : [],
          categorias: Array.isArray(response?.categorias) ? response.categorias : [],
          modelos: Array.isArray(response?.modelos) ? response.modelos : [],
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setMotoMeta({ marcas: [], categorias: [], modelos: [] });
      });
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    return () => {
      setMotoEditModal((prev) => {
        if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
        if (prev?.previewMaletasIsObjectUrl && prev.imageMaletasPreviewUrl) URL.revokeObjectURL(prev.imageMaletasPreviewUrl);
        return prev;
      });
    };
  }, []);

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

  function buildSlug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function buildMotoPayload(form) {
    const payload = new FormData();
    const galleryFiles = Array.isArray(form.imagenes_galeria) ? form.imagenes_galeria.filter(Boolean).slice(0, 3) : [];
    const primaryImageFromGallery = galleryFiles[0] || null;
    const selectedModelo = motoMeta.modelos.find(
      (item) => String(item.id) === String(form.modelo) && String(item.marca) === String(form.marca)
    );
    const modeloNombre = selectedModelo?.nombre || "";
    const modeloSlug = selectedModelo?.slug || form.slug || buildSlug(modeloNombre);

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

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.querySelectorAll(".carousel-item"));
    if (items.length === 0) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenterX = trackRect.left + trackRect.width / 2;

    let activeIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenterX - trackCenterX);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    const targetIndex = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
    items[targetIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  async function handleDeleteMoto(moto) {
    if (!moto?.id || deletingId) return;

    const modelo = moto.modelo || moto.nombre || "esta moto";
    const confirmed = window.confirm(`Estas seguro que quieres eliminar ${modelo}?`);
    if (!confirmed) return;

    setDeletingId(moto.id);
    try {
      await deleteMoto(moto.id);
      setMotos((prev) => (Array.isArray(prev) ? prev.filter((item) => item.id !== moto.id) : []));
      pushToast("Moto eliminada correctamente.", "success");
    } catch {
      pushToast("No se pudo eliminar la moto.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  function handleEditMoto(moto) {
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

  function handleMotoEditInputChange(event) {
    const { name, type, value, checked, files } = event.target;
    setMotoEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      let nextImageMaletasPreviewUrl = prev.imageMaletasPreviewUrl;
      let nextPreviewMaletasIsObjectUrl = prev.previewMaletasIsObjectUrl;
      let nextImageMaletasFileName = prev.imageMaletasFileName;
      const galleryFiles = type === "file" && name === "imagenes_galeria" ? Array.from(files || []).slice(0, 3) : null;
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
        ...(name === "permite_variante_maletas" && !nextValue
          ? { precio_con_maletas: "", precio_lista_con_maletas: "", imagen_con_maletas: null }
          : {}),
        ...(name === "es_destacada" && !nextValue ? { orden_carrusel: "1" } : {}),
        ...(name === "marca" ? { modelo: "", slug: "" } : {}),
      };
      if (name === "modelo") {
        nextForm.slug = buildSlug(motoMeta.modelos.find((item) => String(item.id) === String(value))?.nombre || "");
      }

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
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio: precioNormalizado } } : prev));
  }

  function handleMotoEditPrecioListaInputChange(event) {
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio_lista: precioNormalizado } } : prev));
  }

  function handleMotoEditPrecioConMaletasInputChange(event) {
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio_con_maletas: precioNormalizado } } : prev));
  }

  function handleMotoEditPrecioListaConMaletasInputChange(event) {
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => (prev ? { ...prev, form: { ...prev.form, precio_lista_con_maletas: precioNormalizado } } : prev));
  }

  async function submitMotoEditModal(event) {
    event.preventDefault();
    if (!motoEditModal) return;
    const selectedModelo = motoMeta.modelos.find(
      (item) => String(item.id) === String(motoEditModal.form.modelo) && String(item.marca) === String(motoEditModal.form.marca)
    );
    if (!selectedModelo) {
      setMotoEditError("Selecciona un modelo valido para la marca elegida.");
      return;
    }
    setMotoEditSaving(true);
    setMotoEditError("");
    try {
      const updatedMoto = await updateMoto(motoEditModal.id, buildMotoPayload(motoEditModal.form));
      setMotos((prev) => (Array.isArray(prev) ? prev.map((item) => (item.id === motoEditModal.id ? updatedMoto : item)) : prev));
      pushToast("Moto actualizada correctamente.", "success");
      closeMotoEditModal(true);
    } catch {
      setMotoEditError("No se pudo actualizar la moto.");
      pushToast("No se pudo actualizar la moto.", "error");
    } finally {
      setMotoEditSaving(false);
    }
  }

  return (
    <section className="destacadas" id="catalogo">
      <h2>Modelos Destacados</h2>
      <PublicToastStack toasts={toasts} onDismiss={dismissToast} />

      {loading && null}
      {!loading && error && <p className="home-carousel-empty">{error}</p>}
      {!loading && !error && orderedMotos.length === 0 && (
        <p className="home-carousel-empty">No hay motos disponibles por ahora.</p>
      )}

      {!loading && !error && orderedMotos.length > 0 && (
        <div className="carousel-wrapper carousel-wrapper-motos">
          <button className="carousel-btn carousel-btn--prev" onClick={() => scroll(-1)} aria-label="Anterior">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5L8 12l6.5 6.5" />
            </svg>
          </button>

          <div className="carousel-track carousel-track-motos" ref={trackRef}>
            {orderedMotos.map((moto) => (
              <div className="carousel-item carousel-item-motos" key={moto.id}>
                <MotoCard
                  moto={moto}
                  isAdmin={isAdmin}
                  onEdit={handleEditMoto}
                  onDelete={handleDeleteMoto}
                  showAdminOverlayActions
                  showBottomDeleteAction={false}
                />
              </div>
            ))}
          </div>

          <button className="carousel-btn carousel-btn--next" onClick={() => scroll(1)} aria-label="Siguiente">
            <svg className="carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 5.5L16 12l-6.5 6.5" />
            </svg>
          </button>
        </div>
      )}
      <MotoEditModal
        motoEditModal={motoEditModal}
        motoEditSaving={motoEditSaving}
        motoEditError={motoEditError}
        motoMeta={motoMeta}
        motoEditModelosFiltrados={motoEditModelosFiltrados}
        motoYearOptions={motoYearOptions}
        formatPrecioDisplay={formatPrecioDisplay}
        fallbackImage={fallbackImage}
        onClose={closeMotoEditModal}
        onSubmit={submitMotoEditModal}
        onInputChange={handleMotoEditInputChange}
        onPrecioInputChange={handleMotoEditPrecioInputChange}
        onPrecioListaInputChange={handleMotoEditPrecioListaInputChange}
        onPrecioConMaletasInputChange={handleMotoEditPrecioConMaletasInputChange}
        onPrecioListaConMaletasInputChange={handleMotoEditPrecioListaConMaletasInputChange}
      />
    </section>
  );
}
