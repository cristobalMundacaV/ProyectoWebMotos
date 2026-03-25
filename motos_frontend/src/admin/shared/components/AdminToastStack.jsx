import { createPortal } from "react-dom";

export default function AdminToastStack({ toasts, onDismiss }) {
  if (!Array.isArray(toasts) || toasts.length === 0) return null;

  const content = (
    <div
      className="admin-toast-stack"
      aria-live="polite"
      aria-atomic="true"
      style={{ position: "fixed", top: "84px", right: "22px", zIndex: 4000 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
            toast.variant === "error" ? "admin-toast admin-toast-error" : "admin-toast admin-toast-success"
          }
        >
          <span className="admin-toast-icon" aria-hidden="true">
            {toast.variant === "error" ? "!" : "OK"}
          </span>
          <span>{toast.message}</span>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Cerrar notificacion">
            X
          </button>
        </div>
      ))}
    </div>
  );

  if (typeof document === "undefined") return content;
  return createPortal(content, document.body);
}
