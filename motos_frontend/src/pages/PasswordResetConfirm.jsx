import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/login.css";
import { confirmPasswordReset } from "../services/authService";

export default function PasswordResetConfirm() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const uid = useMemo(() => (searchParams.get("uid") || "").trim(), [searchParams]);
  const token = useMemo(() => (searchParams.get("token") || "").trim(), [searchParams]);
  const invalidLink = !uid || !token;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (invalidLink) {
      setError("El enlace de recuperacion no es valido.");
      return;
    }

    setLoading(true);
    try {
      const data = await confirmPasswordReset({
        uid,
        token,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      setSuccess(data?.detail || "Contraseña actualizada correctamente.");
      setForm({ new_password: "", confirm_password: "" });
    } catch (err) {
      setError(err?.response?.data?.detail || "No fue posible actualizar la contrasena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <article className="login-card">
          <img src="/images/logo.svg" alt="Delanoe Motos" className="login-logo" />
          <h1>Nueva contrasena</h1>
          <p>Define tu nueva contrasena para recuperar el acceso.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="new_password">Nueva contrasena</label>
            <div className="password-field">
              <input
                id="new_password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                minLength={8}
                value={form.new_password}
                onChange={(event) => setForm((prev) => ({ ...prev, new_password: event.target.value }))}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>

            <label htmlFor="confirm_password">Repetir nueva contrasena</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              minLength={8}
              value={form.confirm_password}
              onChange={(event) => setForm((prev) => ({ ...prev, confirm_password: event.target.value }))}
              required
            />

            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            <button type="submit" className="login-submit" disabled={loading || invalidLink}>
              {loading ? "Guardando..." : "Actualizar contrasena"}
            </button>

            <div className="login-register">
              <Link to="/login" className="register-link">
                Volver a iniciar sesion
              </Link>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

