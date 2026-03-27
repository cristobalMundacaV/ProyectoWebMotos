import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { hasAdminAccess, loginUser, registerUser, saveAuthSession } from "../services/authService";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
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
      if (mode === "login") {
        const data = await loginUser({
          email: loginForm.email,
          password: loginForm.password,
        });
        saveAuthSession(data.access || data.token, data.user, data.refresh || null);
        const isAdmin = hasAdminAccess(data.user);
        navigate(isAdmin ? "/admin-panel" : "/");
        return;
      }

      const data = await registerUser(registerForm);
      saveAuthSession(data.access || data.token, data.user, data.refresh || null);
      const isAdmin = hasAdminAccess(data.user);
      navigate(isAdmin ? "/admin-panel" : "/");
    } catch (err) {
      const detail = pickApiError(err.response?.data);
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
          <p>{mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta para continuar"}</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <label htmlFor="first_name">Nombre</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Tu nombre"
                  value={registerForm.first_name}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, first_name: event.target.value }))
                  }
                />

                <label htmlFor="last_name">Apellido</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Tu apellido"
                  value={registerForm.last_name}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, last_name: event.target.value }))
                  }
                />

                <label htmlFor="username">Usuario</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="usuario"
                  value={registerForm.username}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                  required
                  onInvalid={setValidationMessage}
                  onInput={clearValidationMessage}
                />
              </>
            )}

            <label htmlFor="email">
              {mode === "login" ? "Correo o nombre de usuario" : "Correo electronico"}
            </label>
            <input
              id="email"
              name="email"
              type={mode === "login" ? "text" : "email"}
              placeholder={mode === "login" ? "tu@email.com o usuario" : "tu@email.com"}
              value={mode === "login" ? loginForm.email : registerForm.email}
              onChange={(event) => {
                if (mode === "login") {
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }));
                } else {
                  setRegisterForm((prev) => ({ ...prev, email: event.target.value }));
                }
              }}
              autoComplete={mode === "login" ? "username" : "email"}
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
                value={mode === "login" ? loginForm.password : registerForm.password}
                onChange={(event) => {
                  if (mode === "login") {
                    setLoginForm((prev) => ({ ...prev, password: event.target.value }));
                  } else {
                    setRegisterForm((prev) => ({ ...prev, password: event.target.value }));
                  }
                }}
                minLength={mode === "login" ? undefined : 8}
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

            {mode === "register" && (
              <>
                <label htmlFor="confirm_password">Confirmar contraseña</label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={registerForm.confirm_password}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, confirm_password: event.target.value }))
                  }
                  minLength={8}
                  required
                  onInvalid={setValidationMessage}
                  onInput={clearValidationMessage}
                />
              </>
            )}

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-submit">
              {mode === "login" ? "Continuar" : "Crear cuenta"}
            </button>

            {mode === "login" && (
              <>
                <div className="login-meta">
                  <label>
                    <input type="checkbox" name="remember" /> Recordarme
                  </label>
                  <Link to="/">¿Olvidaste tu contraseña?</Link>
                </div>

                <div className="login-register">
                  ¿No tienes cuenta?{" "}
                  <button type="button" className="register-link" onClick={() => setMode("register")}>
                    Registrate
                  </button>
                </div>
              </>
            )}

            {mode === "register" && (
              <div className="login-register">
                ¿Ya tienes cuenta?{" "}
                <button type="button" className="register-link" onClick={() => setMode("login")}>
                  Inicia sesión
                </button>
              </div>
            )}
          </form>
        </article>
      </section>
    </main>
  );
}
