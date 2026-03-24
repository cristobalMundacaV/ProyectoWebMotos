import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  createAdminUser,
  deleteAdminUser,
  getStoredUser,
  listAdminUsers,
  logoutUser,
  updateStoredUser,
  updateAdminUser,
} from "../services/authService";
import { fetchAdminBootstrapData } from "../admin/dashboard/services/dashboardService";
import {
  createCategoriaMoto,
  createModeloMoto,
  createMarca,
  createMoto,
  deleteMoto,
  deleteCategoriaMoto,
  deleteMarca,
  deleteModeloMoto,
  updateCategoriaMoto,
  updateModeloMoto,
  updateMoto,
  updateMarca,
} from "../admin/motos/services/motosAdminService";
import {
  createAccesorioMoto,
  createAccesorioRider,
  createCategoriaAccesoriosMotos,
  createCategoriaAccesoriosRider,
  deleteProductoAdmin,
  deleteCategoriaAccesoriosMotos,
  deleteCategoriaAccesoriosRider,
  updateProductoAdmin,
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
import FichasTecnicasPage from "../admin/motos/pages/FichasTecnicasPage";
import ProductosPage from "../admin/productos/pages/ProductosPage";
import ConfiguracionPage from "../admin/configuracion/pages/ConfiguracionPage";
import MantencionesPage from "../admin/mantenciones/pages/MantencionesPage";
import {
  createHorarioMantencionAdmin,
  deleteHorarioMantencionAdmin,
  getHorariosMantencionAdmin,
  getMantencionesAdmin,
  updateMantencionAdmin,
  updateHorarioMantencionAdmin,
} from "../admin/mantenciones/services/mantencionesAdminService";
import { buildMediaUrl } from "../services/apiConfig";
import "../styles/admin.css";

const initialMotoForm = {
  marca: "",
  modelo: "",
  slug: "",
  descripcion: "",
  precio: "",
  anio: "",
  color: "",
  stock: "0",
  estado: "disponible",
  es_destacada: false,
  orden_carrusel: "1",
  activa: true,
  imagen_principal: null,
};

const initialModeloMotoForm = {
  marca: "",
  categoria: "",
  cilindrada: "",
  nombre: "",
  slug: "",
  descripcion: "",
  activo: true,
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
  orden_carrusel: "1",
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

const initialHorarioMantencionForm = {
  dia_inicio: "0",
  dia_fin: "4",
  hora_inicio: "09:00",
  hora_fin: "18:00",
  intervalo_minutos: "60",
  cupos_por_bloque: "1",
};

const MOTO_COLOR_PALETTE = [
  "Negro",
  "Blanco",
  "Rojo",
  "Azul",
  "Verde",
  "Amarillo",
  "Naranjo",
  "Gris",
  "Plateado",
  "Dorado",
];

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

function normalizeUppercaseLabel(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function normalizeTitleCaseForInput(value) {
  const raw = String(value || "").replace(/\t/g, " ");
  return raw
    .split(/(\s+)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part)) return part;
      if (/^[A-Z0-9-]+$/.test(part) && /[A-Z]/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

function normalizeTitleCaseLabel(value) {
  return normalizeTitleCaseForInput(value)
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeCategoryLabel(value) {
  return normalizeTitleCaseLabel(value);
}

function normalizeCompareLabel(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function forceBrandTokenInName(value, brandName) {
  const normalized = normalizeTitleCaseForInput(value);
  const normalizedBrand = normalizeUppercaseLabel(brandName);
  if (!normalizedBrand) return normalized;

  return normalized
    .split(/(\s+)/)
    .map((part) => (normalizeCompareLabel(part) === normalizeCompareLabel(normalizedBrand) ? normalizedBrand : part))
    .join("");
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
  if (normalized.includes("not found")) return "No se encontró el recurso solicitado.";
  if (normalized.includes("invalid")) return "El dato ingresado no es valido.";
  if (normalized.includes("must be a number")) return "Debe ingresar un numero valido.";
  if (normalized.includes("permission denied")) return "No tienes permisos para realizar esta accion.";
  if (normalized.includes("authentication credentials were not provided")) return "Debes iniciar sesión para continuar.";

  return text;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [activeSection, setActiveSection] = useState("resumen");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState({
    motos: [],
    productosIndumentaria: [],
    productosAccesorios: [],
    categoriasIndumentaria: [],
    categoriasAccesorios: [],
  });
  const [loading, setLoading] = useState(true);
  const [motoMeta, setMotoMeta] = useState({ marcas: [], categorias: [], modelos: [] });
  const [marcasMotosAdmin, setMarcasMotosAdmin] = useState([]);
  const [marcasAccMotosAdmin, setMarcasAccMotosAdmin] = useState([]);
  const [marcasAccRiderAdmin, setMarcasAccRiderAdmin] = useState([]);
  const [marcaForm, setMarcaForm] = useState(initialMarcaForm);
  const [marcaSaving, setMarcaSaving] = useState(false);
  const [modelosMotosAdmin, setModelosMotosAdmin] = useState([]);
  const [modeloMotoForm, setModeloMotoForm] = useState(initialModeloMotoForm);
  const [modeloMotoSaving, setModeloMotoSaving] = useState(false);
  const [categoriasMoto, setCategoriasMoto] = useState([]);
  const [motoForm, setMotoForm] = useState(initialMotoForm);
  const [motoImageInputKey, setMotoImageInputKey] = useState(0);
  const [motoSaving, setMotoSaving] = useState(false);
  const [motoEditModal, setMotoEditModal] = useState(null);
  const [motoEditSaving, setMotoEditSaving] = useState(false);
  const [motoEditError, setMotoEditError] = useState("");
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
  const [accesorioMotoImageUrl, setAccesorioMotoImageUrl] = useState("");
  const [accesorioMotoSaving, setAccesorioMotoSaving] = useState(false);
  const [editingAccesorioMotoId, setEditingAccesorioMotoId] = useState(null);
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
  const [contactoForm, setContactoForm] = useState(initialContactoForm);
  const [contactoSaving, setContactoSaving] = useState(false);
  const [mantenciones, setMantenciones] = useState([]);
  const [mantencionesLoading, setMantencionesLoading] = useState(true);
  const [mantencionSavingById, setMantencionSavingById] = useState({});
  const [horariosMantencion, setHorariosMantencion] = useState([]);
  const [horariosMantencionLoading, setHorariosMantencionLoading] = useState(false);
  const [horarioMantencionSaving, setHorarioMantencionSaving] = useState(false);
  const [horarioMantencionForm, setHorarioMantencionForm] = useState(initialHorarioMantencionForm);
  const [createUserForm, setCreateUserForm] = useState(initialCreateUserForm);
  const [createUserSaving, setCreateUserSaving] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(true);
  const [adminUsersPage, setAdminUsersPage] = useState(1);
  const [adminUserEditModal, setAdminUserEditModal] = useState(null);
  const [adminUserDeleteModal, setAdminUserDeleteModal] = useState(null);
  const [adminUserModalSaving, setAdminUserModalSaving] = useState(false);
  const [adminUserModalError, setAdminUserModalError] = useState("");
  const [toasts, setToasts] = useState([]);
  const toastTimersRef = useRef(new Map());
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

  async function fetchMantencionesList() {
    const rows = await getMantencionesAdmin();
    setMantenciones(rows);
  }

  async function fetchHorariosMantencionList() {
    const rows = await getHorariosMantencionAdmin();
    setHorariosMantencion(rows);
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
        setModelosMotosAdmin(data.modelosMotoList);
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
        await fetchMantencionesList().catch(() => {
          setMantenciones([]);
        });
      } finally {
        if (isMounted) setLoading(false);
        if (isMounted) setAdminUsersLoading(false);
        if (isMounted) setMantencionesLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      toastTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (activeSection === "lista_usuarios" || activeSection === "crear_usuario") {
      setAdminUsersPage(1);
    }
  }, [activeSection]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeSection]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 860) {
        setIsMobileSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      activeSection !== "mantenciones_solicitudes" &&
      activeSection !== "mantenciones_fichas" &&
      activeSection !== "mantenciones_historicas" &&
      activeSection !== "taller_mantenciones_dia" &&
      activeSection !== "taller_en_taller" &&
      activeSection !== "taller_por_entregar"
    ) return;
    let isMounted = true;
    setMantencionesLoading(true);

    getMantencionesAdmin()
      .then((rows) => {
        if (!isMounted) return;
        setMantenciones(rows);
      })
      .catch((error) => {
        if (!isMounted) return;
        setMantenciones([]);
        pushToast(getErrorText(error, "No se pudo cargar la lista de mantenciones."), "error");
      })
      .finally(() => {
        if (isMounted) setMantencionesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSection]);

  useEffect(() => {
    const isUsersSection = activeSection === "lista_usuarios" || activeSection === "crear_usuario";
    const isMantencionesSection =
      activeSection === "mantenciones_solicitudes" ||
      activeSection === "mantenciones_fichas" ||
      activeSection === "mantenciones_historicas" ||
      activeSection === "taller_mantenciones_dia" ||
      activeSection === "taller_en_taller" ||
      activeSection === "taller_por_entregar";
    const isHorariosSection = activeSection === "horarios_operativos" || activeSection === "mantenciones_horarios";

    if (!isUsersSection && !isMantencionesSection && !isHorariosSection) return undefined;

    let mounted = true;

    const syncData = async () => {
      if (document.hidden || !mounted) return;
      try {
        if (isUsersSection) {
          const payload = await listAdminUsers();
          if (!mounted) return;
          setAdminUsers(normalizeAdminUsersResponse(payload));
        }

        if (isMantencionesSection) {
          const mantencionesRows = await getMantencionesAdmin();
          if (!mounted) return;
          setMantenciones(mantencionesRows);
        }

        if (isHorariosSection) {
          const horariosRows = await getHorariosMantencionAdmin();
          if (!mounted) return;
          setHorariosMantencion(horariosRows);
        }
      } catch {
        // Actualizacion silenciosa para no saturar con toasts en tiempo real.
      }
    };

    const intervalId = window.setInterval(syncData, 12000);
    const onVisibilityChange = () => {
      if (!document.hidden) syncData();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "horarios_operativos" && activeSection !== "mantenciones_horarios") return;
    let isMounted = true;
    setHorariosMantencionLoading(true);

    getHorariosMantencionAdmin()
      .then((rows) => {
        if (!isMounted) return;
        setHorariosMantencion(rows);
      })
      .catch((error) => {
        if (!isMounted) return;
        setHorariosMantencion([]);
        pushToast(getErrorText(error, "No se pudo cargar la configuracion de horarios."), "error");
      })
      .finally(() => {
        if (isMounted) setHorariosMantencionLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSection]);

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
    motoEditModal,
    motoEditSaving,
    accesorioRiderEditModal,
    accesorioRiderEditSaving,
    adminUserEditModal,
    adminUserDeleteModal,
    adminUserModalSaving,
  ]);

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

  async function handleTopbarProfileSave(payload) {
    if (!currentUser?.id) {
      pushToast("No se encontró la sesión del usuario.", "error");
      return false;
    }
    if (!currentUser?.rol) {
      pushToast("No se pudo identificar el rol del usuario actual.", "error");
      return false;
    }
    try {
      const response = await updateAdminUser(currentUser.id, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        username: payload.username,
        email: payload.email,
        telefono: payload.telefono,
        rol: currentUser.rol,
      });
      const updatedUser = response?.user || response;
      setCurrentUser(updatedUser);
      updateStoredUser(updatedUser);
      pushToast("Perfil actualizado correctamente.");
      return true;
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo actualizar el perfil."), "error");
      return false;
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
    const normalizedMessage = String(message || "").trim();
    if (!normalizedMessage) return;

    setToasts((prev) => {
      const duplicate = prev.find((toast) => toast.message === normalizedMessage && toast.variant === variant);
      const id = duplicate?.id || `${Date.now()}-${Math.random()}`;
      const next = duplicate
        ? prev.map((toast) => (toast.id === id ? { ...toast, message: normalizedMessage, variant } : toast))
        : [...prev, { id, message: normalizedMessage, variant }];

      // Limita visibles para que no se apilen muchos toasts.
      const limited = next.slice(-4);

      const existingTimer = toastTimersRef.current.get(id);
      if (existingTimer) window.clearTimeout(existingTimer);

      const timerId = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        toastTimersRef.current.delete(id);
      }, 3500);
      toastTimersRef.current.set(id, timerId);

      return limited;
    });
  }

  function dismissToast(id) {
    const timerId = toastTimersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      toastTimersRef.current.delete(id);
    }
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

  function handleMotoInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setMotoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
      ...(name === "marca" ? { modelo: "", slug: "" } : {}),
      ...(name === "modelo"
        ? {
            slug: limitSlug(
              buildSlug(
                motoMeta.modelos.find((item) => String(item.id) === String(value))?.nombre || ""
              ),
              50
            ),
          }
        : {}),
    }));
  }

  function handleMotoPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);

    setMotoForm((prev) => ({
      ...prev,
      precio: precioNormalizado,
    }));
  }

  function handleMotoEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;

    setMotoEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      const nextValue = type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value;

      if (type === "file") {
        if (prev.previewIsObjectUrl && prev.imagePreviewUrl) {
          URL.revokeObjectURL(prev.imagePreviewUrl);
        }
        if (nextValue) {
          nextImagePreviewUrl = URL.createObjectURL(nextValue);
          nextPreviewIsObjectUrl = true;
          nextImageFileName = nextValue.name;
        } else {
          nextImagePreviewUrl = prev.originalImageUrl || "";
          nextPreviewIsObjectUrl = false;
          nextImageFileName = prev.originalImageName || "";
        }
      }

      const nextForm = {
        ...prev.form,
        [name]: nextValue,
        ...(name === "marca" ? { modelo: "", slug: "" } : {}),
        ...(name === "modelo"
          ? {
              slug: limitSlug(
                buildSlug(motoMeta.modelos.find((item) => String(item.id) === String(value))?.nombre || ""),
                50
              ),
            }
          : {}),
      };

      return {
        ...prev,
        form: nextForm,
        imagePreviewUrl: nextImagePreviewUrl,
        previewIsObjectUrl: nextPreviewIsObjectUrl,
        imageFileName: nextImageFileName,
      };
    });
  }

  function handleMotoEditPrecioInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const precioNormalizado = normalizePrecioInput(event.target.value);
    setMotoEditModal((prev) => {
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
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
    const selectedModelo = motoMeta.modelos.find((item) => String(item.id) === String(form.modelo));
    payload.append("marca", form.marca);
    payload.append("modelo_id", form.modelo);
    payload.append("modelo", selectedModelo?.nombre || "");
    payload.append("slug", selectedModelo?.slug || form.slug);
    payload.append("descripcion", form.descripcion);
    payload.append("precio", form.precio);
    payload.append("anio", form.anio);
    payload.append("color", form.color || "");
    payload.append("stock", form.stock);
    payload.append("estado", form.estado || "disponible");
    payload.append("es_destacada", String(form.es_destacada));
    payload.append("orden_carrusel", form.orden_carrusel || "1");
    payload.append("activa", String(form.activa));
    if (form.imagen_principal) {
      payload.append("imagen_principal", form.imagen_principal);
    }
    return payload;
  }

  function resolveOptionIdByNombre(options, explicitId, explicitNombre) {
    if (explicitId !== undefined && explicitId !== null && explicitId !== "") {
      return String(explicitId);
    }
    const target = normalizeCompareLabel(explicitNombre);
    if (!target) return "";
    const match = options.find((item) => normalizeCompareLabel(item.nombre) === target);
    return match ? String(match.id) : "";
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
    setAccesorioMotoForm((prev) => {
      const nextBrandId = name === "marca" ? value : prev.marca;
      const selectedBrand = accesoriosMotosMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : normalizedValue,
        ...(name === "requiere_compatibilidad" && !checked ? { compatibilidad_motos: [] } : {}),
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
    setAccesorioRiderForm((prev) => {
      const nextBrandId = name === "marca" ? value : prev.marca;
      const selectedBrand = accesoriosRiderMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : normalizedValue,
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
    setAccesorioRiderForm((prev) => ({
      ...prev,
      precio: precioNormalizado,
    }));
  }

  function handleAccesorioRiderEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, type, value, checked, files } = event.target;
    setAccesorioRiderEditModal((prev) => {
      if (!prev) return prev;
      let nextImagePreviewUrl = prev.imagePreviewUrl;
      let nextPreviewIsObjectUrl = prev.previewIsObjectUrl;
      let nextImageFileName = prev.imageFileName;
      const nextBrandId = name === "marca" ? value : prev.form.marca;
      const selectedBrand = accesoriosRiderMeta.marcas.find((marca) => String(marca.id) === String(nextBrandId));
      const brandName = selectedBrand?.nombre || "";
      const normalizedValue = name === "nombre" ? forceBrandTokenInName(value, brandName) : value;
      const nextValue = type === "checkbox" ? checked : type === "file" ? files?.[0] || null : normalizedValue;

      if (type === "file") {
        if (prev.previewIsObjectUrl && prev.imagePreviewUrl) {
          URL.revokeObjectURL(prev.imagePreviewUrl);
        }
        if (nextValue) {
          nextImagePreviewUrl = URL.createObjectURL(nextValue);
          nextPreviewIsObjectUrl = true;
          nextImageFileName = nextValue.name;
        } else {
          nextImagePreviewUrl = prev.originalImageUrl || "";
          nextPreviewIsObjectUrl = false;
          nextImageFileName = prev.originalImageName || "";
        }
      }

      const nextForm = {
        ...prev.form,
        [name]: nextValue,
      };
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
    const isBrandKind =
      kind === "marca_motos" ||
      kind === "marca_acc_motos" ||
      kind === "marca_acc_rider";
    const isCategoryKind =
      kind === "categoria_moto" ||
      kind === "categoria_acc_motos" ||
      kind === "categoria_acc_rider";
    const normalizedNombre = isBrandKind
      ? normalizeUppercaseLabel(item.nombre || "")
      : isCategoryKind
        ? normalizeTitleCaseLabel(item.nombre || "")
        : item.nombre || "";
    setEntityEditModal({
      kind,
      id: item.id,
      nombre: normalizedNombre,
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
      const isBrandKind =
        prev.kind === "marca_motos" ||
        prev.kind === "marca_acc_motos" ||
        prev.kind === "marca_acc_rider";
      const isModelKind = prev.kind === "modelo_moto";
      const isCategoryKind =
        prev.kind === "categoria_moto" ||
        prev.kind === "categoria_acc_motos" ||
        prev.kind === "categoria_acc_rider";
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
  }

  function getEntityKindLabel(kind) {
    if (kind === "marca_motos") return "marca de motos";
    if (kind === "marca_acc_motos") return "marca de accesorios moto";
    if (kind === "marca_acc_rider") return "marca de indumentaria";
    if (kind === "categoria_moto") return "categoria de motos";
    if (kind === "modelo_moto") return "modelo de motos";
    if (kind === "categoria_acc_motos") return "categoria de accesorios moto";
    if (kind === "categoria_acc_rider") return "categoria de indumentaria rider";
    return "elemento";
  }

  async function submitEntityEdit(event) {
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
      } else if (entityEditModal.kind === "modelo_moto") {
        const updated = await updateModeloMoto(entityEditModal.id, { nombre, slug });
        setModelosMotosAdmin((prev) => prev.map((item) => (item.id === entityEditModal.id ? updated : item)));
        setMotoMeta((prev) => ({
          ...prev,
          modelos: prev.modelos.map((item) => (item.id === entityEditModal.id ? updated : item)),
        }));
        pushToast("Modelo actualizado correctamente.", "success");
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

  function handleModeloMotoEdit(modelo) {
    openEntityEditModal({ kind: "modelo_moto", item: modelo });
  }

  function handleModeloMotoDelete(modelo) {
    openEntityDeleteModal({ kind: "modelo_moto", item: modelo });
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

  function handleHorarioMantencionInputChange(event) {
    const { name, value, type, checked } = event.target;
    setHorarioMantencionForm((prev) => {
      const nextValue = type === "checkbox" ? checked : value;
      const next = { ...prev, [name]: nextValue };

      if (name === "cupos_por_bloque") {
        const clean = String(nextValue ?? "").replace(/[^\d]/g, "");
        next.cupos_por_bloque = clean;
        return next;
      }

      if (String(prev.cupos_por_bloque ?? "").trim() === "") {
        next.cupos_por_bloque = "1";
      }

      return next;
    });
  }

  async function handleHorarioMantencionSubmit(event) {
    event.preventDefault();
    if (horarioMantencionSaving) return;
    setHorarioMantencionSaving(true);
    try {
      const diaInicio = Number.parseInt(horarioMantencionForm.dia_inicio, 10);
      const diaFin = Number.parseInt(horarioMantencionForm.dia_fin, 10);
      if (!Number.isFinite(diaInicio) || !Number.isFinite(diaFin) || diaInicio < 0 || diaFin > 6) {
        throw new Error("Selecciona un rango de dias valido.");
      }
      if (diaFin < diaInicio) {
        throw new Error("El dia fin no puede ser menor al dia inicio.");
      }

      const payloadBase = {
        hora_inicio: horarioMantencionForm.hora_inicio,
        hora_fin: horarioMantencionForm.hora_fin,
        intervalo_minutos: Number(horarioMantencionForm.intervalo_minutos),
        cupos_por_bloque: Math.max(1, Number.parseInt(horarioMantencionForm.cupos_por_bloque, 10) || 1),
        activo: true,
      };

      for (let diaSemana = diaInicio; diaSemana <= diaFin; diaSemana += 1) {
        const existentes = horariosMantencion
          .filter((item) => Number(item.dia_semana) === diaSemana)
          .sort((a, b) => Number(a.id) - Number(b.id));

        if (existentes.length > 0) {
          const [principal, ...duplicados] = existentes;
          await updateHorarioMantencionAdmin(principal.id, {
            ...payloadBase,
            dia_semana: diaSemana,
          });

          if (duplicados.length > 0) {
            await Promise.all(duplicados.map((item) => deleteHorarioMantencionAdmin(item.id)));
          }
          continue;
        }

        await createHorarioMantencionAdmin({
          ...payloadBase,
          dia_semana: diaSemana,
        });
      }

      // El rango guardado debe ser exacto: elimina horarios fuera de [dia_inicio, dia_fin].
      const fueraDeRango = horariosMantencion.filter((item) => {
        const dia = Number(item.dia_semana);
        return Number.isFinite(dia) && (dia < diaInicio || dia > diaFin);
      });
      if (fueraDeRango.length > 0) {
        await Promise.all(fueraDeRango.map((item) => deleteHorarioMantencionAdmin(item.id)));
      }

      await fetchHorariosMantencionList();
      pushToast("Horario operativo guardado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo crear el horario operativo."), "error");
    } finally {
      setHorarioMantencionSaving(false);
    }
  }

  async function handleDeleteHorarioMantencion(horarioId) {
    try {
      await deleteHorarioMantencionAdmin(horarioId);
      setHorariosMantencion((prev) => prev.filter((item) => item.id !== horarioId));
      pushToast("Horario eliminado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo eliminar el horario."), "error");
    }
  }

  async function handleUpdateHorarioMantencion(horarioId, payload) {
    try {
      const updated = await updateHorarioMantencionAdmin(horarioId, payload);

      const targetDia = Number(updated?.dia_semana ?? payload?.dia_semana ?? 0);
      const duplicados = horariosMantencion.filter(
        (item) => Number(item.dia_semana) === targetDia && Number(item.id) !== Number(updated.id)
      );
      if (duplicados.length > 0) {
        await Promise.all(duplicados.map((item) => deleteHorarioMantencionAdmin(item.id)));
      }

      await fetchHorariosMantencionList();
      pushToast("Horario actualizado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo actualizar el horario."), "error");
    }
  }

  async function handleAcceptMantencionSolicitud(mantencionId) {
    setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: true }));
    try {
      const updated = await updateMantencionAdmin(mantencionId, { estado: "aceptada" });
      setMantenciones((prev) => prev.map((item) => (item.id === mantencionId ? updated : item)));
      pushToast("Hora aceptada. La solicitud quedo en estado aceptada.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo aceptar la solicitud de mantencion."), "error");
    } finally {
      setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: false }));
    }
  }

  async function handleUpdateMantencion(mantencionId, payload) {
    setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: true }));
    try {
      const updated = await updateMantencionAdmin(mantencionId, payload);
      setMantenciones((prev) => prev.map((item) => (item.id === mantencionId ? updated : item)));
      pushToast("Mantencion actualizada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo actualizar la mantencion."), "error");
    } finally {
      setMantencionSavingById((prev) => ({ ...prev, [mantencionId]: false }));
    }
  }

  async function handleMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setMotoSaving(true);
    const payload = buildMotoPayload(motoForm);

    try {
      const nuevaMoto = await createMoto(payload);
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
      originalImageUrl: buildMediaUrl(moto.imagen_principal),
      originalImageName: getFileNameFromPath(moto.imagen_principal),
      imagePreviewUrl: buildMediaUrl(moto.imagen_principal),
      imageFileName: getFileNameFromPath(moto.imagen_principal),
      previewIsObjectUrl: false,
      imageInputKey: Date.now(),
      form: {
        marca: String(moto.marca ?? ""),
        modelo: String(resolvedModeloId ?? ""),
        slug: moto.slug || "",
        descripcion: moto.descripcion || "",
        precio: normalizePrecioFromApi(moto.precio),
        anio: String(moto.anio ?? ""),
        color: moto.color || "",
        stock: String(moto.stock ?? "0"),
        estado: moto.estado || "disponible",
        es_destacada: Boolean(moto.es_destacada),
        orden_carrusel: String(moto.orden_carrusel ?? "1"),
        activa: moto.activa !== false,
        imagen_principal: null,
      },
    });
  }

  function closeMotoEditModal(forceClose = false) {
    if (motoEditSaving && !forceClose) return;
    setMotoEditModal((prev) => {
      if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) {
        URL.revokeObjectURL(prev.imagePreviewUrl);
      }
      return null;
    });
    setMotoEditError("");
  }

  async function submitMotoEditModal(event) {
    event.preventDefault();
    if (!motoEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;
    setMotoEditSaving(true);
    setMotoEditError("");

    const payload = buildMotoPayload(motoEditModal.form);

    try {
      const updatedMoto = await updateMoto(motoEditModal.id, payload);
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

  async function handleMotoDelete(moto) {
    try {
      await deleteMoto(moto.id);
      setDashboard((prev) => ({
        ...prev,
        motos: prev.motos.filter((item) => item.id !== moto.id),
      }));
      if (motoEditModal?.id === moto.id) closeMotoEditModal();
      pushToast("Moto eliminada correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo eliminar la moto."), "error");
    }
  }

  async function handleModeloMotoSubmit(event) {
    event.preventDefault();
    if (!validateFormWithToast(event.currentTarget)) return;
    setModeloMotoSaving(true);

    try {
      const normalizedNombre = normalizeUppercaseLabel(modeloMotoForm.nombre);
      const payload = {
        ...modeloMotoForm,
        categoria: modeloMotoForm.categoria || null,
        cilindrada: modeloMotoForm.cilindrada ? Number(modeloMotoForm.cilindrada) : null,
        nombre: normalizedNombre,
        slug: limitSlug(buildSlug(normalizedNombre), 50),
      };
      const nuevoModelo = await createModeloMoto(payload);
      setModelosMotosAdmin((prev) => [nuevoModelo, ...prev]);
      setMotoMeta((prev) => ({
        ...prev,
        modelos: [nuevoModelo, ...prev.modelos],
      }));
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
      const payload = {
        ...categoriaMotoForm,
        nombre: normalizedNombre,
        slug: buildSlug(normalizedNombre),
      };
      const nuevaCategoria = await createCategoriaMoto(payload);
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
      const normalizedNombre = normalizeUppercaseLabel(marcaForm.nombre);
      const payload = {
        ...marcaForm,
        nombre: normalizedNombre,
        slug: buildSlug(normalizedNombre),
      };
      const nuevaMarca = await createMarca(payload, { tipo: activeMarcaConfig.tipo });

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
      const normalizedNombre = normalizeCategoryLabel(categoriaAccMotosForm.nombre);
      const payload = {
        ...categoriaAccMotosForm,
        nombre: normalizedNombre,
        slug: buildSlug(normalizedNombre),
      };
      const nuevaSubcategoria = await createCategoriaAccesoriosMotos(payload);
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
      const normalizedNombre = normalizeCategoryLabel(categoriaAccRiderForm.nombre);
      const payload = {
        ...categoriaAccRiderForm,
        nombre: normalizedNombre,
        slug: buildSlug(normalizedNombre),
      };
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
      if (editingAccesorioMotoId) {
        const updatedAccesorio = await updateProductoAdmin(editingAccesorioMotoId, payload);
        setAccesoriosMotosAdmin((prev) =>
          prev.map((item) => (item.id === editingAccesorioMotoId ? updatedAccesorio : item))
        );
        setDashboard((prev) => ({
          ...prev,
          productosAccesorios: prev.productosAccesorios.map((item) =>
            item.id === editingAccesorioMotoId ? updatedAccesorio : item
          ),
        }));
        pushToast("Accesorio de moto actualizado correctamente.", "success");
      } else {
        const nuevoAccesorio = await createAccesorioMoto(payload);
        setAccesoriosMotosAdmin((prev) => [nuevoAccesorio, ...prev]);
        setDashboard((prev) => ({ ...prev, productosAccesorios: [nuevoAccesorio, ...prev.productosAccesorios] }));
        pushToast("Accesorio de moto creado correctamente.", "success");
      }
      setAccesorioMotoForm(initialAccesorioMotoForm);
      setAccesorioMotoImageInputKey((prev) => prev + 1);
      setAccesorioMotoImageUrl("");
      setEditingAccesorioMotoId(null);
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
    payload.append("orden_carrusel", accesorioRiderForm.orden_carrusel || "1");
    payload.append("es_destacado", String(accesorioRiderForm.es_destacado));
    payload.append("activo", String(accesorioRiderForm.activo));
    if (accesorioRiderForm.imagen_principal) payload.append("imagen_principal", accesorioRiderForm.imagen_principal);

    try {
      const nuevoAccesorio = await createAccesorioRider(payload);
      setAccesoriosRiderAdmin((prev) => [nuevoAccesorio, ...prev]);
      setDashboard((prev) => ({ ...prev, productosIndumentaria: [nuevoAccesorio, ...prev.productosIndumentaria] }));
      pushToast("Accesorio rider creado correctamente.", "success");
      setAccesorioRiderForm(initialAccesorioRiderForm);
      setAccesorioRiderImageInputKey((prev) => prev + 1);
      setAccesorioRiderImageUrl("");
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
      producto.subcategoria_nombre
    );
    const marcaId = resolveOptionIdByNombre(
      accesoriosMotosMeta.marcas,
      producto.marca,
      producto.marca_nombre
    );
    setEditingAccesorioMotoId(producto.id);
    setAccesorioMotoForm((prev) => ({
      ...prev,
      subcategoria: subcategoriaId,
      marca: marcaId,
      nombre: producto.nombre || "",
      slug: producto.slug || "",
      descripcion: producto.descripcion || "",
      precio: normalizePrecioFromApi(producto.precio),
      stock: String(producto.stock ?? "0"),
      es_destacado: Boolean(producto.es_destacado),
      activo: producto.activo !== false,
      requiere_compatibilidad: Boolean(producto.requiere_compatibilidad),
      compatibilidad_motos: Array.isArray(producto.compatibilidad_motos) ? producto.compatibilidad_motos : [],
      imagen_principal: null,
    }));
    setAccesorioMotoImageUrl(buildMediaUrl(producto.imagen_principal));
  }

  function handleAccesorioRiderEdit(producto) {
    const subcategoriaId = resolveOptionIdByNombre(
      accesoriosRiderMeta.subcategorias,
      producto.subcategoria,
      producto.subcategoria_nombre
    );
    const marcaId = resolveOptionIdByNombre(
      accesoriosRiderMeta.marcas,
      producto.marca,
      producto.marca_nombre
    );
    setAccesorioRiderEditError("");
    setAccesorioRiderEditModal({
      id: producto.id,
      title: producto.nombre || "Editar accesorio rider",
      originalImageUrl: buildMediaUrl(producto.imagen_principal),
      originalImageName: getFileNameFromPath(producto.imagen_principal),
      imagePreviewUrl: buildMediaUrl(producto.imagen_principal),
      imageFileName: getFileNameFromPath(producto.imagen_principal),
      previewIsObjectUrl: false,
      imageInputKey: Date.now(),
      form: {
        subcategoria: subcategoriaId,
        marca: marcaId,
        nombre: producto.nombre || "",
        slug: producto.slug || "",
        descripcion: producto.descripcion || "",
        precio: normalizePrecioFromApi(producto.precio),
        stock: String(producto.stock ?? "0"),
        orden_carrusel: String(producto.orden_carrusel ?? "1"),
        es_destacado: Boolean(producto.es_destacado),
        activo: producto.activo !== false,
        imagen_principal: null,
      },
    });
  }

  function closeAccesorioRiderEditModal(forceClose = false) {
    if (accesorioRiderEditSaving && !forceClose) return;
    setAccesorioRiderEditModal((prev) => {
      if (prev?.previewIsObjectUrl && prev.imagePreviewUrl) {
        URL.revokeObjectURL(prev.imagePreviewUrl);
      }
      return null;
    });
    setAccesorioRiderEditError("");
  }

  async function submitAccesorioRiderEditModal(event) {
    event.preventDefault();
    if (!accesorioRiderEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;
    setAccesorioRiderEditSaving(true);
    setAccesorioRiderEditError("");

    const payload = new FormData();
    payload.append("subcategoria", accesorioRiderEditModal.form.subcategoria);
    payload.append("marca", accesorioRiderEditModal.form.marca);
    payload.append("nombre", accesorioRiderEditModal.form.nombre);
    payload.append("slug", accesorioRiderEditModal.form.slug);
    payload.append("descripcion", accesorioRiderEditModal.form.descripcion);
    payload.append("precio", accesorioRiderEditModal.form.precio);
    payload.append("stock", accesorioRiderEditModal.form.stock);
    payload.append("orden_carrusel", accesorioRiderEditModal.form.orden_carrusel || "1");
    payload.append("es_destacado", String(accesorioRiderEditModal.form.es_destacado));
    payload.append("activo", String(accesorioRiderEditModal.form.activo));
    if (accesorioRiderEditModal.form.imagen_principal) {
      payload.append("imagen_principal", accesorioRiderEditModal.form.imagen_principal);
    }

    try {
      const updatedAccesorio = await updateProductoAdmin(accesorioRiderEditModal.id, payload);
      setAccesoriosRiderAdmin((prev) =>
        prev.map((item) => (item.id === accesorioRiderEditModal.id ? updatedAccesorio : item))
      );
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

  async function handleAccesorioMotoDelete(producto) {
    try {
      await deleteProductoAdmin(producto.id);
      setAccesoriosMotosAdmin((prev) => prev.filter((item) => item.id !== producto.id));
      setDashboard((prev) => ({
        ...prev,
        productosAccesorios: prev.productosAccesorios.filter((item) => item.id !== producto.id),
      }));
      if (editingAccesorioMotoId === producto.id) {
        setEditingAccesorioMotoId(null);
        setAccesorioMotoForm(initialAccesorioMotoForm);
        setAccesorioMotoImageInputKey((prev) => prev + 1);
        setAccesorioMotoImageUrl("");
      }
      pushToast("Accesorio de moto eliminado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo eliminar el accesorio de moto."), "error");
    }
  }

  async function handleAccesorioRiderDelete(producto) {
    try {
      await deleteProductoAdmin(producto.id);
      setAccesoriosRiderAdmin((prev) => prev.filter((item) => item.id !== producto.id));
      setDashboard((prev) => ({
        ...prev,
        productosIndumentaria: prev.productosIndumentaria.filter((item) => item.id !== producto.id),
      }));
      if (accesorioRiderEditModal?.id === producto.id) {
        closeAccesorioRiderEditModal();
      }
      pushToast("Accesorio rider eliminado correctamente.", "success");
    } catch (error) {
      pushToast(getErrorText(error, "No se pudo eliminar el accesorio rider."), "error");
    }
  }

  function handleCancelAccesorioMotoEdit() {
    setEditingAccesorioMotoId(null);
    setAccesorioMotoForm(initialAccesorioMotoForm);
    setAccesorioMotoImageInputKey((prev) => prev + 1);
    setAccesorioMotoImageUrl("");
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

  function openAdminUserEditModal(user) {
    setAdminUserModalError("");
    setAdminUserEditModal({
      id: user?.id,
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      rol: user?.rol || "",
    });
  }

  function closeAdminUserEditModal(forceClose = false) {
    if (adminUserModalSaving && !forceClose) return;
    setAdminUserEditModal(null);
    setAdminUserModalError("");
  }

  function openAdminUserDeleteModal(user) {
    setAdminUserModalError("");
    const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    setAdminUserDeleteModal({
      id: user?.id,
      name: fullName || user?.username || "este usuario",
    });
  }

  function closeAdminUserDeleteModal(forceClose = false) {
    if (adminUserModalSaving && !forceClose) return;
    setAdminUserDeleteModal(null);
    setAdminUserModalError("");
  }

  function handleAdminUserEditInputChange(event) {
    clearInvalidFieldStyle(event.target);
    const { name, value } = event.target;
    setAdminUserEditModal((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function submitAdminUserEdit(event) {
    event.preventDefault();
    if (!adminUserEditModal) return;
    if (!validateFormWithToast(event.currentTarget)) return;
    setAdminUserModalSaving(true);
    setAdminUserModalError("");

    try {
      const updated = await updateAdminUser(adminUserEditModal.id, {
        first_name: adminUserEditModal.first_name,
        last_name: adminUserEditModal.last_name,
        username: adminUserEditModal.username,
        email: adminUserEditModal.email,
        telefono: adminUserEditModal.telefono,
        rol: adminUserEditModal.rol,
      });
      setAdminUsers((prev) => prev.map((item) => (item.id === adminUserEditModal.id ? { ...item, ...updated } : item)));
      pushToast("Usuario actualizado correctamente.", "success");
      closeAdminUserEditModal(true);
    } catch (error) {
      const message = getErrorText(error, "No se pudo actualizar el usuario.");
      setAdminUserModalError(message);
      pushToast(message, "error");
    } finally {
      setAdminUserModalSaving(false);
    }
  }

  async function submitAdminUserDelete() {
    if (!adminUserDeleteModal) return;
    setAdminUserModalSaving(true);
    setAdminUserModalError("");

    try {
      await deleteAdminUser(adminUserDeleteModal.id);
      setAdminUsers((prev) => prev.filter((item) => item.id !== adminUserDeleteModal.id));
      pushToast("Usuario eliminado correctamente.", "success");
      closeAdminUserDeleteModal(true);
    } catch (error) {
      const message = getErrorText(error, "No se pudo eliminar el usuario.");
      setAdminUserModalError(message);
      pushToast(message, "error");
    } finally {
      setAdminUserModalSaving(false);
    }
  }

  const paginatedAdminUsers = paginateItems(adminUsers, adminUsersPage, 10);
  const MIN_MOTO_YEAR = 2000;
  const currentYear = new Date().getFullYear();
  const motoYearOptions = Array.from({ length: currentYear - MIN_MOTO_YEAR + 1 }, (_, index) => String(currentYear - index));
  const motoEditModelosFiltrados = motoEditModal
    ? motoMeta.modelos.filter((modelo) => !motoEditModal.form.marca || String(modelo.marca) === String(motoEditModal.form.marca))
    : [];

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
                className="admin-table-row admin-moto-table-row admin-moto-table-row-actions"
              >
                <div className="admin-moto-table-cell">
                  <strong>{fullName || user?.username || "Sin nombre"}</strong>
                  <span>@{user?.username || "-"}</span>
                </div>
                <div className="admin-moto-table-cell">
                  <strong>{user?.rol || "-"}</strong>
                  <span>{user?.email || user?.telefono || "Sin contacto"}</span>
                </div>
                <div className="admin-row-actions">
                  <button type="button" className="admin-row-action-btn edit" title="Editar" onClick={() => openAdminUserEditModal(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button type="button" className="admin-row-action-btn delete" title="Eliminar" onClick={() => openAdminUserDeleteModal(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
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
      <AdminTopbar
        onLogout={handleLogout}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isSidebarOpen={isMobileSidebarOpen}
        user={currentUser}
        onSaveProfile={handleTopbarProfileSave}
      />

      <div className="admin-layout">
        <div className={isMobileSidebarOpen ? "admin-sidebar-drawer open" : "admin-sidebar-drawer"}>
          <AdminSidebar
            activeSection={activeSection}
            onChangeSection={setActiveSection}
            onNavigate={() => setIsMobileSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </div>

        {isMobileSidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-backdrop"
            aria-label="Cerrar menu"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

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
            modelosMotosAdmin={modelosMotosAdmin}
            modeloMotoForm={modeloMotoForm}
            modeloMotoSaving={modeloMotoSaving}
            onModeloMotoInputChange={handleModeloMotoInputChange}
            onModeloMotoSubmit={handleModeloMotoSubmit}
            onModeloMotoEdit={handleModeloMotoEdit}
            onModeloMotoDelete={handleModeloMotoDelete}
            motoForm={motoForm}
            motoSaving={motoSaving}
            motoMeta={motoMeta}
            motoImageInputKey={motoImageInputKey}
            onMotoInputChange={handleMotoInputChange}
            onMotoPrecioInputChange={handleMotoPrecioInputChange}
            onMotoSubmit={handleMotoSubmit}
            onMotoEdit={handleMotoEdit}
            onMotoDelete={handleMotoDelete}
            categoriasMoto={categoriasMoto}
            categoriaMotoForm={categoriaMotoForm}
            categoriaMotoSaving={categoriaMotoSaving}
            onCategoriaMotoInputChange={handleCategoriaMotoInputChange}
            onCategoriaMotoSubmit={handleCategoriaMotoSubmit}
            onCategoriaMotoEdit={handleCategoriaMotoEdit}
            onCategoriaMotoDelete={handleCategoriaMotoDelete}
            accesoriosMotosMeta={accesoriosMotosMeta}
          />

          <FichasTecnicasPage
            activeSection={activeSection}
            motos={dashboard.motos}
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
            accesorioMotoImageUrl={accesorioMotoImageUrl}
            accesorioMotoSaving={accesorioMotoSaving}
            editingAccesorioMotoId={editingAccesorioMotoId}
            onAccesorioMotoInputChange={handleAccesorioMotoInputChange}
            onAccesorioMotoPrecioInputChange={handleAccesorioMotoPrecioInputChange}
            onAccesorioMotoSubmit={handleAccesorioMotoSubmit}
            onAccesorioMotoEdit={handleAccesorioMotoEdit}
            onAccesorioMotoDelete={handleAccesorioMotoDelete}
            onCancelAccesorioMotoEdit={handleCancelAccesorioMotoEdit}
            onToggleCompatibilidad={toggleAccesorioCompatibilidadMoto}
            motoMeta={motoMeta}
            accesoriosRiderMeta={accesoriosRiderMeta}
            accesoriosRiderAdmin={accesoriosRiderAdmin}
            accesorioRiderForm={accesorioRiderForm}
            accesorioRiderImageInputKey={accesorioRiderImageInputKey}
            accesorioRiderImageUrl={accesorioRiderImageUrl}
            accesorioRiderSaving={accesorioRiderSaving}
            onAccesorioRiderInputChange={handleAccesorioRiderInputChange}
            onAccesorioRiderPrecioInputChange={handleAccesorioRiderPrecioInputChange}
            onAccesorioRiderSubmit={handleAccesorioRiderSubmit}
            onAccesorioRiderEdit={handleAccesorioRiderEdit}
            onAccesorioRiderDelete={handleAccesorioRiderDelete}
          />

          <ConfiguracionPage
            activeSection={activeSection}
            contactoForm={contactoForm}
            contactoSaving={contactoSaving}
            onContactoInputChange={handleContactoInputChange}
            onContactoSubmit={handleContactoSubmit}
          />

          <MantencionesPage
            activeSection={activeSection}
            loading={mantencionesLoading}
            mantenciones={mantenciones}
            savingById={mantencionSavingById}
            onAcceptSolicitud={handleAcceptMantencionSolicitud}
            onUpdateMantencion={handleUpdateMantencion}
            horarios={horariosMantencion}
            horariosLoading={horariosMantencionLoading}
            horarioForm={horarioMantencionForm}
            horarioSaving={horarioMantencionSaving}
            onHorarioInputChange={handleHorarioMantencionInputChange}
            onHorarioSubmit={handleHorarioMantencionSubmit}
            onHorarioUpdate={handleUpdateHorarioMantencion}
            onHorarioDelete={handleDeleteHorarioMantencion}
          />

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
                </div>
                {renderAdminUsersTable()}
              </article>
            </section>
          )}

          {motoEditModal && (
            <div className="admin-entity-modal-overlay" onClick={closeMotoEditModal}>
              <section className="admin-entity-modal admin-moto-edit-modal" onClick={(event) => event.stopPropagation()}>
                <div className="admin-entity-modal-header">
                  <div>
                    <p className="admin-entity-modal-kicker">Edición de moto</p>
                    <h3>{motoEditModal.modelName || "Editar moto"}</h3>
                  </div>
                  <button type="button" onClick={closeMotoEditModal} disabled={motoEditSaving}>
                    Cerrar
                  </button>
                </div>

                <form className="admin-moto-form admin-moto-edit-modal-form" onSubmit={submitMotoEditModal} noValidate>
                  <label>
                    Marca *
                    <select
                      name="marca"
                      value={motoEditModal.form.marca}
                      onChange={handleMotoEditInputChange}
                      required
                    >
                      <option value="">Selecciona una marca</option>
                      {motoMeta.marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Modelo *
                    <select
                      name="modelo"
                      value={motoEditModal.form.modelo}
                      onChange={handleMotoEditInputChange}
                      required
                    >
                      <option value="">Selecciona un modelo</option>
                      {motoEditModelosFiltrados.map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>
                          {modelo.nombre} {modelo.marca_nombre ? `(${modelo.marca_nombre})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-form-span-2">
                    Descripcion (opcional)
                    <textarea
                      name="descripcion"
                      value={motoEditModal.form.descripcion}
                      onChange={handleMotoEditInputChange}
                      rows={4}
                    />
                  </label>

                  <label>
                    Precio *
                    <input
                      type="text"
                      name="precio"
                      value={formatPrecioDisplay(motoEditModal.form.precio)}
                      onChange={handleMotoEditPrecioInputChange}
                      inputMode="decimal"
                      required
                    />
                  </label>

                  <label>
                    {"A\u00f1o *"}
                    <select
                      name="anio"
                      value={motoEditModal.form.anio}
                      onChange={handleMotoEditInputChange}
                      required
                    >
                      <option value="">{"Selecciona un a\u00f1o"}</option>
                      {motoYearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Color (opcional)
                    <select
                      name="color"
                      value={motoEditModal.form.color}
                      onChange={handleMotoEditInputChange}
                    >
                      <option value="">Selecciona un color</option>
                      {MOTO_COLOR_PALETTE.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                      {motoEditModal.form.color && !MOTO_COLOR_PALETTE.includes(motoEditModal.form.color) && (
                        <option value={motoEditModal.form.color}>
                          {`Color actual: ${motoEditModal.form.color}`}
                        </option>
                      )}
                    </select>
                  </label>

                  <label>
                    Stock *
                    <input
                      type="number"
                      name="stock"
                      value={motoEditModal.form.stock}
                      onChange={handleMotoEditInputChange}
                      min="0"
                      required
                    />
                  </label>

                  <label>
                    Estado *
                    <select
                      name="estado"
                      value={motoEditModal.form.estado}
                      onChange={handleMotoEditInputChange}
                      required
                    >
                      <option value="disponible">Disponible</option>
                      <option value="reservada">Reservada</option>
                      <option value="vendida">Vendida</option>
                      <option value="inactiva">Inactiva</option>
                    </select>
                  </label>

                  <label>
                    Orden carrusel *
                    <input
                      type="number"
                      name="orden_carrusel"
                      value={motoEditModal.form.orden_carrusel}
                      onChange={handleMotoEditInputChange}
                      min="1"
                      required
                    />
                  </label>

                  <label>
                    Orden carrusel *
                    <input
                      type="number"
                      name="orden_carrusel"
                      value={accesorioRiderEditModal.form.orden_carrusel}
                      onChange={handleAccesorioRiderEditInputChange}
                      min="1"
                      required
                    />
                  </label>

                  <label className="admin-form-span-2">
                    Imagen principal (opcional)
                    <input
                      key={`moto-edit-image-${motoEditModal.imageInputKey}`}
                      type="file"
                      name="imagen_principal"
                      accept="image/*"
                      onChange={handleMotoEditInputChange}
                    />
                    {motoEditModal.imageFileName && (
                      <span className="admin-selected-file-name">{motoEditModal.imageFileName}</span>
                    )}
                  </label>

                  {motoEditModal.imagePreviewUrl && (
                    <div className="admin-form-span-2 admin-image-preview-box admin-moto-edit-preview">
                      <img src={motoEditModal.imagePreviewUrl} alt={motoEditModal.modelName || "Moto"} className="admin-image-preview" />
                    </div>
                  )}

                  {motoEditError && <p className="admin-entity-modal-error">{motoEditError}</p>}

                  <div className="admin-form-footer">
                    <div className="admin-form-footer-checks">
                      <label className="admin-form-check admin-form-check-compact">
                        <input
                          type="checkbox"
                          name="es_destacada"
                          checked={motoEditModal.form.es_destacada}
                          onChange={handleMotoEditInputChange}
                        />
                        Marcar como destacada
                      </label>

                      <label className="admin-form-check admin-form-check-compact">
                        <input
                          type="checkbox"
                          name="activa"
                          checked={motoEditModal.form.activa}
                          onChange={handleMotoEditInputChange}
                        />
                        Publicar como activa
                      </label>
                    </div>

                    <div className="admin-moto-edit-modal-actions">
                      <button type="button" className="btn-back" onClick={closeMotoEditModal} disabled={motoEditSaving}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-save" disabled={motoEditSaving}>
                        {motoEditSaving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          )}

          {accesorioRiderEditModal && (
            <div className="admin-entity-modal-overlay" onClick={closeAccesorioRiderEditModal}>
              <section className="admin-entity-modal admin-moto-edit-modal" onClick={(event) => event.stopPropagation()}>
                <div className="admin-entity-modal-header">
                  <div>
                    <p className="admin-entity-modal-kicker">Edición de producto</p>
                    <h3>{accesorioRiderEditModal.title}</h3>
                  </div>
                  <button type="button" onClick={closeAccesorioRiderEditModal} disabled={accesorioRiderEditSaving}>
                    Cerrar
                  </button>
                </div>

                <form className="admin-moto-form admin-moto-edit-modal-form" onSubmit={submitAccesorioRiderEditModal} noValidate>
                  <label>
                    Categoria *
                    <select
                      name="subcategoria"
                      value={accesorioRiderEditModal.form.subcategoria}
                      onChange={handleAccesorioRiderEditInputChange}
                      required
                    >
                      <option value="">Selecciona una categoria</option>
                      {accesoriosRiderMeta.subcategorias.map((subcategoria) => (
                        <option key={subcategoria.id} value={subcategoria.id}>
                          {subcategoria.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Marca *
                    <select
                      name="marca"
                      value={accesorioRiderEditModal.form.marca}
                      onChange={handleAccesorioRiderEditInputChange}
                      required
                    >
                      <option value="">Selecciona una marca</option>
                      {accesoriosRiderMeta.marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Nombre *
                    <input
                      name="nombre"
                      value={accesorioRiderEditModal.form.nombre}
                      onChange={handleAccesorioRiderEditInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label className="admin-form-span-2">
                    Descripcion (opcional)
                    <textarea
                      name="descripcion"
                      value={accesorioRiderEditModal.form.descripcion}
                      onChange={handleAccesorioRiderEditInputChange}
                      rows={4}
                    />
                  </label>

                  <label>
                    Precio *
                    <input
                      type="text"
                      name="precio"
                      value={formatPrecioDisplay(accesorioRiderEditModal.form.precio)}
                      onChange={handleAccesorioRiderEditPrecioInputChange}
                      inputMode="numeric"
                      required
                    />
                  </label>

                  <label>
                    Stock *
                    <input
                      type="number"
                      name="stock"
                      value={accesorioRiderEditModal.form.stock}
                      onChange={handleAccesorioRiderEditInputChange}
                      min="0"
                      required
                    />
                  </label>

                  <label className="admin-form-span-2">
                    Imagen principal (opcional)
                    <input
                      key={`acc-rider-edit-image-${accesorioRiderEditModal.imageInputKey}`}
                      type="file"
                      name="imagen_principal"
                      accept="image/*"
                      onChange={handleAccesorioRiderEditInputChange}
                    />
                    {accesorioRiderEditModal.imageFileName && (
                      <span className="admin-selected-file-name">{accesorioRiderEditModal.imageFileName}</span>
                    )}
                  </label>

                  {accesorioRiderEditModal.imagePreviewUrl && (
                    <div className="admin-form-span-2 admin-image-preview-box admin-moto-edit-preview">
                      <img
                        src={accesorioRiderEditModal.imagePreviewUrl}
                        alt={accesorioRiderEditModal.title || "Accesorio rider"}
                        className="admin-image-preview"
                      />
                    </div>
                  )}

                  {accesorioRiderEditError && <p className="admin-entity-modal-error">{accesorioRiderEditError}</p>}

                  <div className="admin-form-footer">
                    <div className="admin-form-footer-checks">
                      <label className="admin-form-check admin-form-check-compact">
                        <input
                          type="checkbox"
                          name="es_destacado"
                          checked={accesorioRiderEditModal.form.es_destacado}
                          onChange={handleAccesorioRiderEditInputChange}
                        />
                        Destacado
                      </label>
                      <label className="admin-form-check admin-form-check-compact">
                        <input
                          type="checkbox"
                          name="activo"
                          checked={accesorioRiderEditModal.form.activo}
                          onChange={handleAccesorioRiderEditInputChange}
                        />
                        Activo
                      </label>
                    </div>
                    <div className="admin-moto-edit-modal-actions">
                      <button type="button" className="btn-back" onClick={closeAccesorioRiderEditModal} disabled={accesorioRiderEditSaving}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-save" disabled={accesorioRiderEditSaving}>
                        {accesorioRiderEditSaving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          )}

          {adminUserEditModal && (
            <div className="admin-entity-modal-overlay" onClick={closeAdminUserEditModal}>
              <section className="admin-entity-modal" onClick={(event) => event.stopPropagation()}>
                <div className="admin-entity-modal-header">
                  <div>
                    <p className="admin-entity-modal-kicker">Edición de usuario</p>
                    <h3>Editar usuario</h3>
                  </div>
                  <button type="button" onClick={closeAdminUserEditModal} disabled={adminUserModalSaving}>
                    Cerrar
                  </button>
                </div>

                <form className="admin-entity-modal-form" onSubmit={submitAdminUserEdit} noValidate>
                  <label>
                    Nombres *
                    <input
                      name="first_name"
                      value={adminUserEditModal.first_name}
                      onChange={handleAdminUserEditInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label>
                    Apellidos *
                    <input
                      name="last_name"
                      value={adminUserEditModal.last_name}
                      onChange={handleAdminUserEditInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label>
                    Username *
                    <input
                      name="username"
                      value={adminUserEditModal.username}
                      onChange={handleAdminUserEditInputChange}
                      maxLength={150}
                      required
                    />
                  </label>

                  <label>
                    Correo (opcional)
                    <input
                      type="email"
                      name="email"
                      value={adminUserEditModal.email}
                      onChange={handleAdminUserEditInputChange}
                      maxLength={254}
                    />
                  </label>

                  <label>
                    Telefono *
                    <input
                      name="telefono"
                      value={adminUserEditModal.telefono}
                      onChange={handleAdminUserEditInputChange}
                      maxLength={30}
                      required
                    />
                  </label>

                  <label>
                    Rol *
                    <select name="rol" value={adminUserEditModal.rol} onChange={handleAdminUserEditInputChange} required>
                      <option value="">Selecciona un rol</option>
                      <option value="admin">Administrador</option>
                      <option value="encargado">Encargado</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </label>

                  {adminUserModalError && <p className="admin-entity-modal-error">{adminUserModalError}</p>}

                  <div className="admin-entity-modal-actions">
                    <button type="button" className="btn-back" onClick={closeAdminUserEditModal} disabled={adminUserModalSaving}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={adminUserModalSaving}>
                      {adminUserModalSaving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {adminUserDeleteModal && (
            <div className="admin-entity-modal-overlay" onClick={closeAdminUserDeleteModal}>
              <section className="admin-entity-delete-modal" onClick={(event) => event.stopPropagation()}>
                <img src="/images/informacion.png" alt="Informacion" className="admin-entity-delete-image" />
                <p className="admin-entity-delete-text">
                  Estas seguro que quieres eliminar a {adminUserDeleteModal.name}?
                </p>
                {adminUserModalError && <p className="admin-entity-modal-error">{adminUserModalError}</p>}
                <div className="admin-entity-delete-actions">
                  <button type="button" className="btn-back" onClick={closeAdminUserDeleteModal} disabled={adminUserModalSaving}>
                    Volver
                  </button>
                  <button type="button" className="btn-delete" onClick={submitAdminUserDelete} disabled={adminUserModalSaving}>
                    {adminUserModalSaving ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </section>
            </div>
          )}

          {entityEditModal && (
            <div className="admin-entity-modal-overlay" onClick={closeEntityEditModal}>
              <section className="admin-entity-modal admin-entity-modal-compact" onClick={(event) => event.stopPropagation()}>
                <div className="admin-entity-modal-header">
                  <div>
                    <p className="admin-entity-modal-kicker">Edición administrativa</p>
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

                <form className="admin-entity-modal-form admin-entity-modal-form-single" onSubmit={submitEntityEdit} noValidate>
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
