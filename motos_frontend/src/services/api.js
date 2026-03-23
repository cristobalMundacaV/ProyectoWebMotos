import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const REFRESH_TOKEN_KEY = "authRefreshToken";
const ACCESS_TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API request failed:", error);

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
