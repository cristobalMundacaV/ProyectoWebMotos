import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { requestPasswordReset } from "../services/authService";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await requestPasswordReset(email);
      setSuccess(data?.detail || "Si el correo existe, enviaremos un enlace de recuperacion.");
      setEmail("");
    } catch (err) {
      setError(err?.response?.data?.detail || "No fue posible procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <article className="login-card">
          <img src="/images/logo.svg" alt="Delanoe Motos" className="login-logo" />
          <h1>Recuperar contrasena</h1>
          <p>Ingresa tu correo para recibir el enlace de recuperacion.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electronico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
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

