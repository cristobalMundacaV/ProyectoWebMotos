import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredToken,
  hasAdminAccess,
  getStoredUser,
  logoutUser,
  updateStoredUser,
  updateAdminUser,
} from "../services/authService";
import { buildFallbackImageDataUrl } from "../services/apiConfig";
import AdminTopbar from "../admin/shared/components/AdminTopbar";
import AdminSidebar from "../admin/shared/components/AdminSidebar";
import AdminToastStack from "../admin/shared/components/AdminToastStack";
import useAdminToasts from "../admin/shared/hooks/useAdminToasts";
import { getErrorText as getErrorTextUtil } from "../admin/shared/utils/errorUtils";
import { clearInvalidFieldStyle, validateFormWithToast as validateFormWithToastUtil } from "../admin/shared/utils/formUtils";
import {
  buildSlug,
  limitSlug,
  normalizeUppercaseLabel,
  normalizeTitleCaseForInput,
  normalizeTitleCaseLabel,
  normalizeCategoryLabel,
  normalizeCompareLabel,
} from "../admin/shared/utils/adminText";
import useAdminDomains from "../admin/layout/hooks/useAdminDomains";
import AdminSectionRouter from "../admin/layout/AdminSectionRouter";
import AdminModalHost from "../admin/layout/AdminModalHost";
import "../styles/admin.css";

export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackImage = buildFallbackImageDataUrl({ width: 900, height: 600, text: "Sin Imagen" });

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

  const { toasts, pushToast, dismissToast } = useAdminToasts();
  const getErrorText = getErrorTextUtil;
  const validateFormWithToast = useCallback((formElement) => validateFormWithToastUtil(formElement, pushToast), [pushToast]);

  const { sectionRouterProps, modalHostProps } = useAdminDomains({
    activeSection,
    setActiveSection,
    locationSearch: location.search,
    navigate,
    dashboard,
    setDashboard,
    fallbackImage,
    pushToast,
    getErrorText,
    clearInvalidFieldStyle,
    validateFormWithToast,
    normalizeUppercaseLabel,
    normalizeTitleCaseForInput,
    normalizeTitleCaseLabel,
    normalizeCategoryLabel,
    normalizeCompareLabel,
    buildSlug,
    limitSlug,
  });

  useEffect(() => {
    let mounted = true;

    async function verifyAdminSession() {
      const token = getStoredToken();
      if (!token) {
        clearAuthSession();
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetchCurrentUser();
        const user = response?.user || response;
        if (!mounted) return;

        if (!hasAdminAccess(user)) {
          clearAuthSession();
          navigate("/", { replace: true });
          return;
        }

        setCurrentUser(user);
        updateStoredUser(user);
      } catch {
        if (!mounted) return;
        clearAuthSession();
        navigate("/login", { replace: true });
      }
    }

    verifyAdminSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

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

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // token expirado: igual cerramos sesion local.
    } finally {
      clearAuthSession();
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleTopbarProfileSave = useCallback(
    async (payload) => {
      const currentRole = currentUser?.rol || currentUser?.role;
      if (!currentUser?.id) {
        pushToast("No se encontro la sesion del usuario.", "error");
        return false;
      }
      if (!currentRole) {
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
          rol: currentRole,
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
    },
    [currentUser, getErrorText, pushToast]
  );

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
            userRole={currentUser?.rol || currentUser?.role || "admin"}
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
          <AdminSectionRouter {...sectionRouterProps} />
          <AdminModalHost {...modalHostProps} />
        </main>
      </div>
    </div>
  );
}
