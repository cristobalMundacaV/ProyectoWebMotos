import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { hasAdminAccess, loginUser, saveAuthSession } from "../services/authService";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const setValidationMessage = (event) => {
    const target = event.target;
    target.setCustomValidity("");

    if (target.validity.valueMissing) {
      target.setCustomValidity("Este campo es obligatorio.");
      return;
    }

    if (target.validity.typeMismatch) {
      target.setCustomValidity("Ingresa un correo electronico valido.");
      return;
    }

    if (target.validity.tooShort) {
      target.setCustomValidity("La contraseña debe tener al menos 8 caracteres.");
    }
  };

  const clearValidationMessage = (event) => {
    event.target.setCustomValidity("");
  };

  const pickApiError = (data) => {
    if (!data) return "No fue posible completar la solicitud.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstFieldError = Object.values(data).find((value) => Array.isArray(value) && value.length);
    if (firstFieldError) return firstFieldError[0];

    return "No fue posible completar la solicitud.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email: loginForm.email,
        password: loginForm.password,
      });
      saveAuthSession(data.access || data.token, data.user, data.refresh || null);
      const isAdmin = hasAdminAccess(data.user);
      navigate(isAdmin ? "/admin-panel" : "/");
    } catch (err) {
      const detail = pickApiError(err?.response?.data);
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <article className="login-card">
          <img src="/images/logo.svg" alt="Delanoe Motos" className="login-logo" />
          <h1>Bienvenido</h1>
          <p>Inicia sesion para continuar</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Correo o nombre de usuario</label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="tu@email.com o usuario"
              value={loginForm.email}
              onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
              autoComplete="username"
              required
              onInvalid={setValidationMessage}
              onInput={clearValidationMessage}
            />

            <label htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                required
                onInvalid={setValidationMessage}
                onInput={clearValidationMessage}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Procesando..." : "Continuar"}
            </button>

            <div className="login-meta">
              <label>
                <input type="checkbox" name="remember" /> Recordarme
              </label>
              <Link to="/recuperar-contrasena">Olvidaste tu contraseña?</Link>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}