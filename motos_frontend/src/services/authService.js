import api from "./api";

const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "authRefreshToken";
const USER_KEY = "authUser";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAuthSession(token, user, refreshToken = null) {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function hasAdminAccess(user) {
  if (!user) return false;
  return Boolean(
    user.is_superuser ||
    user.is_staff ||
    ["superadmin", "admin", "encargado"].includes((user.rol || "").toLowerCase())
  );
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function registerUser(payload) {
  const response = await api.post("/api/clientes/register/", payload);
  return response.data;
}

export async function createAdminUser(payload) {
  const response = await api.post("/api/clientes/admin/users/", payload);
  return response.data;
}

export async function listAdminUsers() {
  const response = await api.get("/api/clientes/admin/users/");
  return response.data;
}

export async function updateAdminUser(userId, payload) {
  const response = await api.patch(`/api/clientes/admin/users/${userId}/`, payload);
  return response.data;
}

export async function deleteAdminUser(userId) {
  await api.delete(`/api/clientes/admin/users/${userId}/`);
}

export async function loginUser(payload) {
  const response = await api.post("/api/clientes/login/", payload);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get("/api/clientes/me/");
  return response.data;
}

export async function logoutUser() {
  const refresh = getStoredRefreshToken();
  await api.post("/api/clientes/logout/", refresh ? { refresh } : {});
}
