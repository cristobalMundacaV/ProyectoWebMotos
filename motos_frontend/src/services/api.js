import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const REFRESH_TOKEN_KEY = "authRefreshToken";
const ACCESS_TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

const PUBLIC_GET_PATHS = new Set([
  "/motos/",
  "/motos/categorias/",
  "/motos/marcas/",
  "/motos/modelos/",
  "/tienda/productos/",
  "/tienda/categorias/",
  "/tienda/motos-compatibles/",
  "/tienda/contacto/",
]);

function normalizeRequestPath(url = "") {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
}

function shouldAttachAuthHeader(config) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return false;

  const method = String(config?.method || "get").toLowerCase();
  const path = normalizeRequestPath(config?.url);

  if (method === "get" && PUBLIC_GET_PATHS.has(path)) {
    return false;
  }

  return true;
}

function isAdminOrProtectedPath(path = "") {
  const normalized = normalizeRequestPath(path);
  return (
    normalized.startsWith("/clientes/admin/") ||
    normalized.startsWith("/mantenciones/") ||
    normalized.startsWith("/motos/meta/") ||
    normalized.startsWith("/tienda/admin/") ||
    normalized.startsWith("/catalogo/accesorios-moto/") ||
    normalized.startsWith("/catalogo/accesorios-rider/")
  );
}

function shouldSilence401(error) {
  const status = error?.response?.status;
  if (status !== 401) return false;

  const hasAccessToken = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
  const logoutInProgress =
    typeof window !== "undefined" && window.__ADMIN_LOGOUT_IN_PROGRESS === true;
  const requestPath = normalizeRequestPath(error?.config?.url || "");

  // 401 esperado: token ausente/expirado en rutas protegidas o logout en curso.
  return logoutInProgress || (!hasAccessToken && isAdminOrProtectedPath(requestPath));
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && shouldAttachAuthHeader(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorCode = error?.code || "";
    const isCanceled =
      errorCode === "ERR_CANCELED" ||
      errorCode === "ECONNABORTED" ||
      String(error?.message || "").toLowerCase().includes("aborted");
    const silence401 = shouldSilence401(error);
    if (!isCanceled && !silence401) {
      console.error("API request failed:", error);
    }

    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/clientes/token/refresh/")) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (typeof window !== "undefined") {
        const currentPath = window.location?.pathname || "";
        if (currentPath.startsWith("/admin-panel")) {
          window.location.replace("/login");
        }
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await api.post("/clientes/token/refresh/", { refresh });
      const nextAccess = refreshResponse.data?.access;
      const nextRefresh = refreshResponse.data?.refresh;

      if (!nextAccess) {
        return Promise.reject(error);
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, nextAccess);
      if (nextRefresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, nextRefresh);
      }

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${nextAccess}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      if (typeof window !== "undefined") {
        const currentPath = window.location?.pathname || "";
        if (currentPath.startsWith("/admin-panel")) {
          window.location.replace("/login");
        }
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
