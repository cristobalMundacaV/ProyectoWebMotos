import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession, createAdminUser, listAdminUsers, logoutUser } from "../services/authService";
import { fetchAdminBootstrapData } from "../admin/dashboard/services/dashboardService";
import {
  createCategoriaMoto,
  createMarca,
  createMoto,
  deleteCategoriaMoto,
  deleteMarca,
  updateCategoriaMoto,
  updateMarca,
} from "../admin/motos/services/motosAdminService";
import {
  createAccesorioMoto,
  createAccesorioRider,
  createCategoriaAccesoriosMotos,
  createCategoriaAccesoriosRider,
  deleteCategoriaAccesoriosMotos,
  deleteCategoriaAccesoriosRider,
  updateCategoriaAccesoriosMotos,
  updateCategoriaAccesoriosRider,
} from "../admin/productos/services/productosAdminService";
import { updateContactoAdmin } from "../admin/configuracion/services/configuracionAdminService";
import AdminTopbar from "../admin/shared/components/AdminTopbar";
import AdminSidebar from "../admin/shared/components/AdminSidebar";
import AdminToastStack from "../admin/shared/components/AdminToastStack";
import AdminPagination, { paginateItems } from "../admin/shared/components/AdminPagination";
import ResumenPage from "../admin/dashboard/pages/ResumenPage";
import MotosPage from "../admin/motos/pages/MotosPage";
import ProductosPage from "../admin/productos/pages/ProductosPage";
import ConfiguracionPage from "../admin/configuracion/pages/ConfiguracionPage";
import "../styles/admin.css";

const initialMotoForm = {
  marca: "",
  categoria: "",
  modelo: "",
  slug: "",
  descripcion: "",
  precio: "",
  cilindrada: "",
  anio: "",
  stock: "0",
  es_destacada: false,
  activa: true,
  imagen_principal: null,
};

const initialCategoriaMotoForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

const initialMarcaForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

const initialCategoriaAccMotosForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

const initialAccesorioMotoForm = {
  subcategoria: "",
  marca: "",
  nombre: "",
  slug: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagen_principal: null,
  es_destacado: false,
  activo: true,
  requiere_compatibilidad: false,
  compatibilidad_motos: [],
};

const initialAccesorioRiderForm = {
  subcategoria: "",
  marca: "",
  nombre: "",
  slug: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagen_principal: null,
  es_destacado: false,
  activo: true,
};

const initialCategoriaAccRiderForm = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
};

const initialContactoForm = {
  instagram: "",
  telefono: "",
  ubicacion: "",
};

const initialCreateUserForm = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  telefono: "",
  rol: "",
  password: "",
  confirm_password: "",
};

function buildSlug(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function limitSlug(value, maxLength = 50) {
  if (!value) return "";
  const safe = String(value).slice(0, maxLength);
  return safe.replace(/(^-|-$)+/g, "");
}

function normalizeAdminUsersResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function translateBackendMessage(message) {
  if (!message) return "";
  const text = String(message).trim();
  const normalized = text.toLowerCase();
  const maxLengthMatch = normalized.match(/ensure this field has no more than (\d+) characters/);

  if (normalized.includes("this field is required")) return "Este campo es obligatorio.";
  if (maxLengthMatch) return `Este campo no puede superar ${maxLengthMatch[1]} caracteres.`;
  if (normalized.includes("already exists")) return "Ya existe un registro con ese valor.";
  if (normalized.includes("slug")) return "El slug ya existe. Cambia el nombre para generar uno diferente.";
  if (normalized.includes("not found")) return "No se encontro el recurso solicitado.";
  if (normalized.includes("invalid")) return "El dato ingresado no es valido.";
  if (normalized.includes("must be a number")) return "Debe ingresar un numero valido.";
  if (normalized.includes("permission denied")) return "No tienes permisos para realizar esta accion.";
  if (normalized.includes("authentication credentials were not provided")) return "Debes iniciar sesion para continuar.";

  return text;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("resumen");
  const [dashboard, setDashboard] = useState({
    motos: [],
    productosIndumentaria: [],
    productosAccesorios: [],
    categoriasIndumentaria: [],
    categoriasAccesorios: [],
  });
  const [loading, setLoading] = useState(true);
  const [motoMeta, setMotoMeta] = useState({ marcas: [], categorias: [] });
  const [marcasMotosAdmin, setMarcasMotosAdmin] = useState([]);
  const [marcasAccMotosAdmin, setMarcasAccMotosAdmin] = useState([]);
  const [marcasAccRiderAdmin, setMarcasAccRiderAdmin] = useState([]);
  const [marcaForm, setMarcaForm] = useState(initialMarcaForm);
  const [marcaSaving, setMarcaSaving] = useState(false);
  const [categoriasMoto, setCategoriasMoto] = useState([]);
  const [motoForm, setMotoForm] = useState(initialMotoForm);
  const [motoImageInputKey, setMotoImageInputKey] = useState(0);
  const [motoSaving, setMotoSaving] = useState(false);
  const [categoriaMotoForm, setCategoriaMotoForm] = useState(initialCategoriaMotoForm);
  const [categoriaMotoSaving, setCategoriaMotoSaving] = useState(false);
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
  const [accesorioMotoSaving, setAccesorioMotoSaving] = useState(false);
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
  const [accesorioRiderSaving, setAccesorioRiderSaving] = useState(false);
  const [contactoForm, setContactoForm] = useState(initialContactoForm);
  const [contactoSaving, setContactoSaving] = useState(false);
  const [createUserForm, setCreateUserForm] = useState(initialCreateUserForm);
  const [createUserSaving, setCreateUserSaving] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(true);
  const [adminUsersPage, setAdminUsersPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [entityEditModal, setEntityEditModal] = useState(null);
  const [entityDeleteModal, setEntityDeleteModal] = useState(null);
  const [entityModalSaving, setEntityModalSaving] = useState(false);
  const [entityModalError, setEntityModalError] = useState("");

  const marcaSectionConfig = {
    marcas_motos: {
      tipo: "moto",
      titulo: "Marcas de motos",
      subtitulo: "Usadas para el catalogo de motos",
    },
    marcas_acc_motos: {
      tipo: "accesorio_moto",
      titulo: "Marcas de accesorios motos",
      subtitulo: "Usadas en accesorios para la moto",
    },
    marcas_acc_rider: {
      tipo: "accesorio_rider",
      titulo: "Marcas de indumentaria",
      subtitulo: "Usadas en productos de indumentaria rider",
    },
  };

  const activeMarcaConfig = marcaSectionConfig[activeSection] || marcaSectionConfig.marcas_motos;

  async function fetchUsersList() {
    const payload = await listAdminUsers();
    const users = normalizeAdminUsersResponse(payload);
    setAdminUsers(users);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchAdminBootstrapData();

        if (!isMounted) return;

        setDashboard({
          motos: data.motos,
          productosIndumentaria: data.productosIndumentaria,
          productosAccesorios: data.productosAccesorios,
          categoriasIndumentaria: data.categoriasIndumentaria,
          categoriasAccesorios: data.categoriasAccesorios,
        });
        setMotoMeta(data.metaMotos);
        setMarcasMotosAdmin(data.marcasMotosList);
        setMarcasAccMotosAdmin(data.marcasAccMotosList);
        setMarcasAccRiderAdmin(data.marcasAccRiderList);
        setCategoriasMoto(data.categoriasMotoList);
        setCategoriasAccMotosMeta(data.categoriasAccMotosData);
        setCategoriasAccRiderMeta(data.categoriasAccRiderData);
        setAccesoriosMotosAdmin(data.accesoriosMotosList);
        setAccesoriosMotosMeta(data.accesoriosMotosMetaData);
        setAccesoriosRiderAdmin(data.accesoriosRiderList);
        setAccesoriosRiderMeta(data.accesoriosRiderMetaData);
        setContactoForm({
          instagram: data.contactoAdmin.instagram || "",
          telefono: data.contactoAdmin.telefono || "",
          ubicacion: data.contactoAdmin.ubicacion || "",
        });
        await fetchUsersList().catch(() => {
          setAdminUsers([]);
        });
      } finally {
        if (isMounted) setLoading(false);
        if (isMounted) setAdminUsersLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeSection === "lista_usuarios" || activeSection === "crear_usuario") {
      setAdminUsersPage(1);
    }
  }, [activeSection]);

  useEffect(() => {
    if (!entityEditModal && !entityDeleteModal) return undefined;

    const onEsc = (event) => {
      if (event.key !== "Escape") return;
      if (entityEditModal && !entityModalSaving) closeEntityEditModal();
      if (entityDeleteModal && !entityModalSaving) closeEntityDeleteModal();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [entityEditModal, entityDeleteModal, entityModalSaving]);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // If token is invalid/expired, still clear local session.
    } finally {
      clearAuthSession();
      navigate("/", { replace: true });
    }
  }

  function getErrorText(error, fallback = "No se pudo completar la solicitud.") {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return translateBackendMessage(data);
    if (data.detail) return translateBackendMessage(data.detail);

    const [firstError] = Object.values(data).find((value) => Array.isArray(value) && value.length) || [];
    return translateBackendMessage(firstError) || fallback;
  }

  function pushToast(message, variant = "success") {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function clearInvalidFieldStyle(target) {
    if (!target || typeof target.classList?.remove !== "function") return;
    target.classList.remove("admin-field-invalid");
  }

  function validateFormWithToast(formElement) {
    if (!formElement) return true;
    const fields = Array.from(formElement.querySelectorAll("input, select, textarea"));
    fields.forEach((field) => field.classList.remove("admin-field-invalid"));
    if (formElement.checkValidity()) return true;

    const invalidFields = fields.filter((field) => !field.checkValidity());
    invalidFields.forEach((field) => field.classList.add("admin-field-invalid"));
    const firstInvalid = invalidFields[0];
    const message = firstInvalid?.validationMessage || "Completa los campos obligatorios.";
    pushToast(message, "error");
    firstInvalid?.focus();
    return false;
  }

  function handleMarcaInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    setMarcaForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "nombre" ? { slug: buildSlug(value) } : {}),
    }));
  }

  function handleCategoriaMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    setCategoriaMotoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "nombre" ? { slug: buildSlug(value) } : {}),
    }));
  }

  function handleCategoriaAccMotosInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    setCategoriaAccMotosForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "nombre" ? { slug: buildSlug(value) } : {}),
    }));
  }

  function handleCategoriaAccRiderInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked } = event.target;
    setCategoriaAccRiderForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "nombre" ? { slug: buildSlug(value) } : {}),
    }));
  }

  function handleMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setMotoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
      ...(name === "modelo" ? { slug: limitSlug(buildSlug(value), 50) } : {}),
    }));
  }

  function handleMotoPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const raw = event.target.value || "";
    const normalized = raw
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^0-9.]/g, "");

    const [entero = "", ...decimales] = normalized.split(".");
    const precioNormalizado = decimales.length > 0 ? `${entero}.${decimales.join("")}` : entero;

    setMotoForm((prev) => ({
      ...prev,
      precio: precioNormalizado,
    }));
  }

  function normalizePrecioInput(rawValue) {
    const normalized = (rawValue || "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^0-9.]/g, "");

    const [entero = "", ...decimales] = normalized.split(".");
    return decimales.length > 0 ? `${entero}.${decimales.join("")}` : entero;
  }

  function handleAccesorioMotoPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioMotoForm((prev) => ({
      ...prev,
      precio: precioNormalizado,
    }));
  }

  function handleAccesorioMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setAccesorioMotoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
      ...(name === "nombre" ? { slug: limitSlug(buildSlug(value), 50) } : {}),
      ...(name === "requiere_compatibilidad" && !checked ? { compatibilidad_motos: [] } : {}),
    }));
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
    setAccesorioRiderForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
      ...(name === "nombre" ? { slug: limitSlug(buildSlug(value), 50) } : {}),
    }));
  }

  function handleAccesorioRiderPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setAccesorioRiderForm((prev) => ({
      ...prev,
      precio: precioNormalizado,
    }));
  }

  function handleContactoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, value } = event.target;
    setContactoForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCreateUserInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, value } = event.target;
    setCreateUserForm((prev) => ({ ...prev, [name]: value }));
  }

  function openEntityEditModal({ kind, item }) {
    setEntityModalError("");
    setEntityEditModal({
      kind,
      id: item.id,
      nombre: item.nombre || "",
      slug: item.slug || "",
    });
  }

  function closeEntityEditModal() {
    if (entityModalSaving) return;
    setEntityEditModal(null);
    setEntityModalError("");
  }

  function openEntityDeleteModal({ kind, item }) {
    setEntityModalError("");
    setEntityDeleteModal({
      kind,
      id: item.id,
      nombre: item.nombre || "",
    });
  }

  function closeEntityDeleteModal() {
    if (entityModalSaving) return;
    setEntityDeleteModal(null);
    setEntityModalError("");
  }

  function handleEntityEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, value } = event.target;
    setEntityEditModal((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [name]: value };
      if (name === "nombre") next.slug = buildSlug(value);
      return next;
    });
  }

  function getEntityKindLabel(kind) {
    if (kind === "marca_motos") return "marca de motos";
    if (kind === "marca_acc_motos") return "marca de accesorios moto";
    if (kind === "marca_acc_rider") return "marca de indumentaria";
    if (kind === "categoria_moto") return "categoria de motos";
    if (kind === "categoria_acc_motos") return "categoria de accesorios moto";
    if (kind === "categoria_acc_rider") return "categoria de indumentaria rider";
    return "elemento";
  }

  async function submitEntityEdit(event) {
    event.preventDefault();
    if (!entityEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;

    const nombre = (entityEditModal.nombre || "").trim();
    const slug = (entityEditModal.slug || "").trim();
    if (!nombre || !slug) {
      setEntityModalError("Nombre y slug son obligatorios.");
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
        } else if (entityEditModal.kind === "marca_acc_motos") {
          setMarcasAccMotosAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
          setAccesoriosMotosMeta((prev) => ({
            ...prev,
            marcas: prev.marcas.map((item) => (item.id === entityEditModal.id ? { ...item, nombre: updated.nombre } : item)),
          }));
        } else {
          setMarcasAccRiderAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
          setAccesoriosRiderMeta((prev) => ({
            ...prev,
            marcas: prev.marcas.map((item) => (item.id === entityEditModal.id ? { ...item, nombre: updated.nombre } : item)),
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
        pushToast("Categoria actualizada correctamente.", "success");
      }

      setEntityEditModal(null);
    } catch (error) {
      setEntityModalError(getErrorText(error, "No se pudo guardar el cambio."));
    } finally {
      setEntityModalSaving(false);
    }
  }

  async function submitEntityDelete() {
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
      }

      setEntityDeleteModal(null);
    } catch (error) {
      setEntityModalError(getErrorText(error, "No se pudo eliminar el elemento."));
    } finally {
      setEntityModalSaving(false);
    }
  }

  function handleMarcaEdit(marca) {
    const sectionKind =
      activeSection === "marcas_motos"
        ? "marca_motos"
        : activeSection === "marcas_acc_motos"
          ? "marca_acc_motos"
          : "marca_acc_rider";
    openEntityEditModal({ kind: sectionKind, item: marca });
  }

  function handleMarcaDelete(marca) {
    const sectionKind =
      activeSection === "marcas_motos"
        ? "marca_motos"
        : activeSection === "marcas_acc_motos"
          ? "marca_acc_motos"
          : "marca_acc_rider";
    openEntityDeleteModal({ kind: sectionKind, item: marca });
  }

  function handleCategoriaMotoEdit(categoria) {
    openEntityEditModal({ kind: "categoria_moto", item: categoria });
  }

  function handleCategoriaMotoDelete(categoria) {
    openEntityDeleteModal({ kind: "categoria_moto", item: categoria });
  }

  function handleCategoriaAccMotosEdit(categoria) {
    openEntityEditModal({ kind: "categoria_acc_motos", item: categoria });
  }

  function handleCategoriaAccMotosDelete(categoria) {
    openEntityDeleteModal({ kind: "categoria_acc_motos", item: categoria });
  }

  function handleCategoriaAccRiderEdit(categoria) {
    openEntityEditModal({ kind: "categoria_acc_rider", item: categoria });
  }

  function handleCategoriaAccRiderDelete(categoria) {
    openEntityDeleteModal({ kind: "categoria_acc_rider", item: categoria });
  }

  async function handleRefreshUsers() {
    setAdminUsersLoading(true);
    try {
      await fetchUsersList();
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo cargar la lista de usuarios."), "error");
    } finally {
      setAdminUsersLoading(false);
    }
  }

  async function handleMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setMotoSaving(true);

    const payload = new FormData();
    payload.append("marca", motoForm.marca);
    payload.append("categoria", motoForm.categoria);
    payload.append("modelo", motoForm.modelo);
    payload.append("slug", motoForm.slug);
    payload.append("descripcion", motoForm.descripcion);
    payload.append("precio", motoForm.precio);
    payload.append("cilindrada", motoForm.cilindrada);
    payload.append("anio", motoForm.anio);
    payload.append("stock", motoForm.stock);
    payload.append("es_destacada", String(motoForm.es_destacada));
    payload.append("activa", String(motoForm.activa));
    if (motoForm.imagen_principal) {
      payload.append("imagen_principal", motoForm.imagen_principal);
    }

    try {
      const nuevaMoto = await createMoto(payload);
      setDashboard((prev) => ({ ...prev, motos: [nuevaMoto, ...prev.motos] }));
      setMotoForm(initialMotoForm);
      setMotoImageInputKey((prev) => prev + 1);
      pushToast("Moto agregada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la moto."), "error");
    } finally {
      setMotoSaving(false);
    }
  }

  async function handleCategoriaMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setCategoriaMotoSaving(true);

    try {
      const nuevaCategoria = await createCategoriaMoto(categoriaMotoForm);
      setCategoriasMoto((prev) => [nuevaCategoria, ...prev]);
      setMotoMeta((prev) => ({
        ...prev,
        categorias: [{ id: nuevaCategoria.id, nombre: nuevaCategoria.nombre }, ...prev.categorias],
      }));
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
      const nuevaMarca = await createMarca(marcaForm, { tipo: activeMarcaConfig.tipo });

      if (activeSection === "marcas_motos") {
        setMarcasMotosAdmin((prev) => [nuevaMarca, ...prev]);
      } else if (activeSection === "marcas_acc_motos") {
        setMarcasAccMotosAdmin((prev) => [nuevaMarca, ...prev]);
        if (nuevaMarca.activa) {
          setAccesoriosMotosMeta((prev) => ({
            ...prev,
            marcas: [{ id: nuevaMarca.id, nombre: nuevaMarca.nombre }, ...prev.marcas],
          }));
        }
      } else if (activeSection === "marcas_acc_rider") {
        setMarcasAccRiderAdmin((prev) => [nuevaMarca, ...prev]);
        if (nuevaMarca.activa) {
          setAccesoriosRiderMeta((prev) => ({
            ...prev,
            marcas: [{ id: nuevaMarca.id, nombre: nuevaMarca.nombre }, ...prev.marcas],
          }));
        }
      }

      if (activeSection === "marcas_motos" && nuevaMarca.activa) {
        setMotoMeta((prev) => ({
          ...prev,
          marcas: [{ id: nuevaMarca.id, nombre: nuevaMarca.nombre }, ...prev.marcas],
        }));
      }

      setMarcaForm(initialMarcaForm);
      pushToast("Marca creada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar la marca."), "error");
    } finally {
      setMarcaSaving(false);
    }
  }

  async function handleCategoriaAccMotosSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setCategoriaAccMotosSaving(true);

    try {
      const nuevaSubcategoria = await createCategoriaAccesoriosMotos(categoriaAccMotosForm);
      setCategoriasAccMotosMeta((prev) => ({
        ...prev,
        subcategorias: [nuevaSubcategoria, ...prev.subcategorias],
      }));
      setAccesoriosMotosMeta((prev) => ({
        ...prev,
        subcategorias: [nuevaSubcategoria, ...prev.subcategorias],
      }));
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
      const nuevaSubcategoria = await createCategoriaAccesoriosRider(categoriaAccRiderForm);
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

    const payload = new FormData();
    payload.append("subcategoria", accesorioMotoForm.subcategoria);
    payload.append("marca", accesorioMotoForm.marca);
    payload.append("nombre", accesorioMotoForm.nombre);
    payload.append("slug", accesorioMotoForm.slug);
    payload.append("descripcion", accesorioMotoForm.descripcion);
    payload.append("precio", accesorioMotoForm.precio);
    payload.append("stock", accesorioMotoForm.stock);
    payload.append("es_destacado", String(accesorioMotoForm.es_destacado));
    payload.append("activo", String(accesorioMotoForm.activo));
    payload.append("requiere_compatibilidad", String(accesorioMotoForm.requiere_compatibilidad));
    if (accesorioMotoForm.imagen_principal) payload.append("imagen_principal", accesorioMotoForm.imagen_principal);
    if (accesorioMotoForm.requiere_compatibilidad) {
      accesorioMotoForm.compatibilidad_motos.forEach((motoId) => {
        payload.append("compatibilidad_motos", String(motoId));
      });
    }

    try {
      const nuevoAccesorio = await createAccesorioMoto(payload);
      setAccesoriosMotosAdmin((prev) => [nuevoAccesorio, ...prev]);
      setDashboard((prev) => ({ ...prev, productosAccesorios: [nuevoAccesorio, ...prev.productosAccesorios] }));
      setAccesorioMotoForm(initialAccesorioMotoForm);
      setAccesorioMotoImageInputKey((prev) => prev + 1);
      pushToast("Accesorio de moto creado correctamente.", "success");
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

    const payload = new FormData();
    payload.append("subcategoria", accesorioRiderForm.subcategoria);
    payload.append("marca", accesorioRiderForm.marca);
    payload.append("nombre", accesorioRiderForm.nombre);
    payload.append("slug", accesorioRiderForm.slug);
    payload.append("descripcion", accesorioRiderForm.descripcion);
    payload.append("precio", accesorioRiderForm.precio);
    payload.append("stock", accesorioRiderForm.stock);
    payload.append("es_destacado", String(accesorioRiderForm.es_destacado));
    payload.append("activo", String(accesorioRiderForm.activo));
    if (accesorioRiderForm.imagen_principal) payload.append("imagen_principal", accesorioRiderForm.imagen_principal);

    try {
      const nuevoAccesorio = await createAccesorioRider(payload);
      setAccesoriosRiderAdmin((prev) => [nuevoAccesorio, ...prev]);
      setDashboard((prev) => ({ ...prev, productosIndumentaria: [nuevoAccesorio, ...prev.productosIndumentaria] }));
      setAccesorioRiderForm(initialAccesorioRiderForm);
      setAccesorioRiderImageInputKey((prev) => prev + 1);
      pushToast("Accesorio rider creado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo guardar el accesorio rider."), "error");
    } finally {
      setAccesorioRiderSaving(false);
    }
  }

  async function handleContactoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setContactoSaving(true);

    try {
      const data = await updateContactoAdmin(contactoForm);
      setContactoForm({
        instagram: data.instagram || "",
        telefono: data.telefono || "",
        ubicacion: data.ubicacion || "",
      });
      pushToast("Datos de contacto actualizados correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo actualizar el contacto."), "error");
    } finally {
      setContactoSaving(false);
    }
  }

  async function handleCreateUserSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;

    if (createUserForm.password !== createUserForm.confirm_password) {
      pushToast("Las contraseñas no coinciden.", "error");
      return;
    }

    setCreateUserSaving(true);

    try {
      await createAdminUser({
        first_name: createUserForm.first_name,
        last_name: createUserForm.last_name,
        username: createUserForm.username,
        email: createUserForm.email,
        telefono: createUserForm.telefono,
        rol: createUserForm.rol,
        password: createUserForm.password,
        confirm_password: createUserForm.confirm_password,
      });
      await fetchUsersList().catch(() => {
        // If listing fails, keep creation success feedback.
      });
      setCreateUserForm(initialCreateUserForm);
      pushToast("Usuario creado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo crear el usuario."), "error");
    } finally {
      setCreateUserSaving(false);
    }
  }

  const paginatedAdminUsers = paginateItems(adminUsers, adminUsersPage, 10);

  function renderAdminUsersTable() {
    if (adminUsersLoading) {
      return <p className="admin-empty">Cargando usuarios...</p>;
    }

    if (adminUsers.length === 0) {
      return <p className="admin-empty">No hay usuarios registrados.</p>;
    }

    return (
      <>
        <div className="admin-table">
          {paginatedAdminUsers.items.map((user, index) => {
            const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
            return (
              <div
                key={user?.id || user?.username || `user-row-${index}`}
                className="admin-table-row admin-moto-table-row"
              >
                <div className="admin-moto-table-cell">
                  <strong>{fullName || user?.username || "Sin nombre"}</strong>
                  <span>@{user?.username || "-"}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <strong>{user?.rol || "-"}</strong>
                  <span>{user?.email || user?.telefono || "Sin contacto"}</span>
                </div>
              </div>
            );
          })}
        </div>
        <AdminPagination pagination={paginatedAdminUsers} onPageChange={setAdminUsersPage} />
      </>
    );
  }

  return (
    <div className="admin-shell">
      <AdminToastStack toasts={toasts} onDismiss={dismissToast} />
      <AdminTopbar onLogout={handleLogout} />

      <div className="admin-layout">
        <AdminSidebar activeSection={activeSection} onChangeSection={setActiveSection} />

        <main className="admin-main">
          {activeSection === "resumen" && (
            <ResumenPage
              loading={loading}
              dashboard={dashboard}
              marcasMotosAdmin={marcasMotosAdmin}
              marcasAccRiderAdmin={marcasAccRiderAdmin}
              marcasAccMotosAdmin={marcasAccMotosAdmin}
            />
          )}

          <MotosPage
            activeSection={activeSection}
            loading={loading}
            dashboard={dashboard}
            activeMarcaConfig={activeMarcaConfig}
            marcasMotosAdmin={marcasMotosAdmin}
            marcasAccMotosAdmin={marcasAccMotosAdmin}
            marcasAccRiderAdmin={marcasAccRiderAdmin}
            marcaForm={marcaForm}
            marcaSaving={marcaSaving}
            onMarcaInputChange={handleMarcaInputChange}
            onMarcaSubmit={handleMarcaSubmit}
            onMarcaEdit={handleMarcaEdit}
            onMarcaDelete={handleMarcaDelete}
            motoForm={motoForm}
            motoSaving={motoSaving}
            motoMeta={motoMeta}
            motoImageInputKey={motoImageInputKey}
            onMotoInputChange={handleMotoInputChange}
            onMotoPrecioInputChange={handleMotoPrecioInputChange}
            onMotoSubmit={handleMotoSubmit}
            categoriasMoto={categoriasMoto}
            categoriaMotoForm={categoriaMotoForm}
            categoriaMotoSaving={categoriaMotoSaving}
            onCategoriaMotoInputChange={handleCategoriaMotoInputChange}
            onCategoriaMotoSubmit={handleCategoriaMotoSubmit}
            onCategoriaMotoEdit={handleCategoriaMotoEdit}
            onCategoriaMotoDelete={handleCategoriaMotoDelete}
            accesoriosMotosMeta={accesoriosMotosMeta}
          />

          <ProductosPage
            activeSection={activeSection}
            loading={loading}
            categoriasAccMotosMeta={categoriasAccMotosMeta}
            categoriaAccMotosForm={categoriaAccMotosForm}
            categoriaAccMotosSaving={categoriaAccMotosSaving}
            onCategoriaAccMotosInputChange={handleCategoriaAccMotosInputChange}
            onCategoriaAccMotosSubmit={handleCategoriaAccMotosSubmit}
            onCategoriaAccMotosEdit={handleCategoriaAccMotosEdit}
            onCategoriaAccMotosDelete={handleCategoriaAccMotosDelete}
            categoriasAccRiderMeta={categoriasAccRiderMeta}
            categoriaAccRiderForm={categoriaAccRiderForm}
            categoriaAccRiderSaving={categoriaAccRiderSaving}
            onCategoriaAccRiderInputChange={handleCategoriaAccRiderInputChange}
            onCategoriaAccRiderSubmit={handleCategoriaAccRiderSubmit}
            onCategoriaAccRiderEdit={handleCategoriaAccRiderEdit}
            onCategoriaAccRiderDelete={handleCategoriaAccRiderDelete}
            accesoriosMotosMeta={accesoriosMotosMeta}
            accesoriosMotosAdmin={accesoriosMotosAdmin}
            accesorioMotoForm={accesorioMotoForm}
            accesorioMotoImageInputKey={accesorioMotoImageInputKey}
            accesorioMotoSaving={accesorioMotoSaving}
            onAccesorioMotoInputChange={handleAccesorioMotoInputChange}
            onAccesorioMotoPrecioInputChange={handleAccesorioMotoPrecioInputChange}
            onAccesorioMotoSubmit={handleAccesorioMotoSubmit}
            onToggleCompatibilidad={toggleAccesorioCompatibilidadMoto}
            motoMeta={motoMeta}
            accesoriosRiderMeta={accesoriosRiderMeta}
            accesoriosRiderAdmin={accesoriosRiderAdmin}
            accesorioRiderForm={accesorioRiderForm}
            accesorioRiderImageInputKey={accesorioRiderImageInputKey}
            accesorioRiderSaving={accesorioRiderSaving}
            onAccesorioRiderInputChange={handleAccesorioRiderInputChange}
            onAccesorioRiderPrecioInputChange={handleAccesorioRiderPrecioInputChange}
            onAccesorioRiderSubmit={handleAccesorioRiderSubmit}
          />

          <ConfiguracionPage
            activeSection={activeSection}
            contactoForm={contactoForm}
            contactoSaving={contactoSaving}
            onContactoInputChange={handleContactoInputChange}
            onContactoSubmit={handleContactoSubmit}
          />

          {activeSection === "lista_usuarios" && (
            <section className="admin-content-grid">
              <article className="admin-panel-card">
                <div className="admin-card-header">
                  <h2>Lista de usuarios</h2>
                  <button type="button" className="admin-primary-action" onClick={handleRefreshUsers}>
                    Actualizar
                  </button>
                </div>
                {renderAdminUsersTable()}
              </article>
            </section>
          )}

          {activeSection === "crear_usuario" && (
            <section className="admin-content-grid lower">
              <article className="admin-panel-card">
                <div className="admin-card-header">
                  <h2>Crear usuario</h2>
                  <span>Gestion de usuarios internos del sistema.</span>
                </div>

                <form className="admin-moto-form" onSubmit={handleCreateUserSubmit} noValidate>
                  <label>
                    Nombres *
                    <input
                      name="first_name"
                      value={createUserForm.first_name}
                      onChange={handleCreateUserInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label>
                    Apellidos *
                    <input
                      name="last_name"
                      value={createUserForm.last_name}
                      onChange={handleCreateUserInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label>
                    Username *
                    <input
                      name="username"
                      value={createUserForm.username}
                      onChange={handleCreateUserInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label>
                    Correo (opcional)
                    <input
                      type="email"
                      name="email"
                      value={createUserForm.email}
                      onChange={handleCreateUserInputChange}
                      maxLength={254}
                    />
                  </label>

                  <label>
                    Telefono *
                    <input
                      name="telefono"
                      value={createUserForm.telefono}
                      onChange={handleCreateUserInputChange}
                      maxLength={30}
                      required
                    />
                  </label>

                  <label>
                    Rol *
                    <select
                      name="rol"
                      value={createUserForm.rol}
                      onChange={handleCreateUserInputChange}
                      required
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="admin">Administrador</option>
                      <option value="encargado">Encargado</option>
                    </select>
                  </label>

                  <label>
                    Contraseña *
                    <input
                      type="password"
                      name="password"
                      value={createUserForm.password}
                      onChange={handleCreateUserInputChange}
                      minLength={4}
                      required
                    />
                  </label>

                  <label>
                    Repetir contraseña *
                    <input
                      type="password"
                      name="confirm_password"
                      value={createUserForm.confirm_password}
                      onChange={handleCreateUserInputChange}
                      minLength={4}
                      required
                    />
                  </label>

                  <button type="submit" className="admin-primary-action" disabled={createUserSaving}>
                    {createUserSaving ? "Creando..." : "Crear usuario"}
                  </button>
                </form>
              </article>

              <article className="admin-panel-card">
                <div className="admin-card-header">
                  <h2>Lista de usuarios</h2>
                  <button type="button" className="admin-primary-action" onClick={handleRefreshUsers}>
                    Actualizar
                  </button>
                </div>
                {renderAdminUsersTable()}
              </article>
            </section>
          )}

          {entityEditModal && (
            <div className="admin-entity-modal-overlay" onClick={closeEntityEditModal}>
              <section className="admin-entity-modal" onClick={(event) => event.stopPropagation()}>
                <div className="admin-entity-modal-header">
                  <div>
                    <p className="admin-entity-modal-kicker">Edicion administrativa</p>
                    <h3>Editar {getEntityKindLabel(entityEditModal.kind)}</h3>
                  </div>
                  <button
                    type="button"
                    className="admin-entity-modal-close"
                    onClick={closeEntityEditModal}
                    disabled={entityModalSaving}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>

                <form className="admin-entity-modal-form" onSubmit={submitEntityEdit} noValidate>
                  <label>
                    Nombre *
                    <input
                      name="nombre"
                      value={entityEditModal.nombre}
                      onChange={handleEntityEditInputChange}
                      maxLength={100}
                      required
                    />
                  </label>

                  <label>
                    Slug (solo lectura) *
                    <input
                      name="slug"
                      value={entityEditModal.slug}
                      readOnly
                      maxLength={140}
                      required
                    />
                  </label>

                  {entityModalError && <p className="admin-entity-modal-error">{entityModalError}</p>}

                  <div className="admin-entity-modal-actions">
                    <button type="button" className="btn-back" onClick={closeEntityEditModal} disabled={entityModalSaving}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={entityModalSaving}>
                      {entityModalSaving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {entityDeleteModal && (
            <div className="admin-entity-modal-overlay" onClick={closeEntityDeleteModal}>
              <section className="admin-entity-delete-modal" onClick={(event) => event.stopPropagation()}>
                <img src="/images/informacion.png" alt="Informacion" className="admin-entity-delete-image" />
                <p className="admin-entity-delete-text">
                  Estas seguro que quieres eliminar {entityDeleteModal.nombre}?
                </p>
                {entityModalError && <p className="admin-entity-modal-error">{entityModalError}</p>}
                <div className="admin-entity-delete-actions">
                  <button type="button" className="btn-back" onClick={closeEntityDeleteModal} disabled={entityModalSaving}>
                    Volver
                  </button>
                  <button type="button" className="btn-delete" onClick={submitEntityDelete} disabled={entityModalSaving}>
                    {entityModalSaving ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}



