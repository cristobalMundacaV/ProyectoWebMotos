import axios from "axios";

// Instancia centralizada de axios — cambia solo aquí si la URL base del backend cambia
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const REFRESH_TOKEN_KEY = "authRefreshToken";
const ACCESS_TOKEN_KEY = "authToken";

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
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/api/clientes/token/refresh/")) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post(
        "http://127.0.0.1:8000/api/clientes/token/refresh/",
        { refresh }
      );

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
      localStorage.removeItem("authUser");
      return Promise.reject(refreshError);
    }
  }
);

export default api;
