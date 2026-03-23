import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MotoDetalle from "../pages/MotoDetalle";
import CatalogoMotos from "../pages/CatalogoMotos";
import CatalogoIndumentaria from "../pages/CatalogoIndumentaria";
import CatalogoAccesorios from "../pages/CatalogoAccesorios";
import Mantenimiento from "../pages/Mantenimiento";
import ConsultarHora from "../pages/ConsultarHora";
import AdminPanel from "../pages/AdminPanel";
import ProductoDetalle from "../pages/ProductoDetalle";
import Login from "../pages/Login";
import { getStoredToken, getStoredUser, hasAdminAccess } from "../services/authService";

function ProtectedRoute({ children }) {
  const token = getStoredToken();
  const user = getStoredUser();
  const isAdmin = hasAdminAccess(user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moto/:slug" element={<MotoDetalle />} />
        <Route path="/catalogo" element={<CatalogoMotos />} />
        <Route path="/indumentaria" element={<CatalogoIndumentaria />} />
        <Route path="/accesorios" element={<CatalogoAccesorios />} />
        <Route path="/indumentaria-rider" element={<CatalogoIndumentaria />} />
        <Route path="/equipamiento-indumentaria" element={<CatalogoIndumentaria />} />
        <Route path="/equipamiento-accesorios" element={<CatalogoAccesorios />} />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/equipamiento/indumentaria"
          element={<CatalogoIndumentaria />}
        />
        <Route path="/equipamiento/accesorios" element={<CatalogoAccesorios />} />
        <Route path="/mantenimiento" element={<Navigate to="/mantenimiento/agendar" replace />} />
        <Route path="/mantenimiento/agendar" element={<Mantenimiento />} />
        <Route path="/mantenimiento/consultar" element={<ConsultarHora />} />
        <Route path="/producto/:slug" element={<ProductoDetalle />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
