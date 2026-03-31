import { createPortal } from "react-dom";

function getToastClass(variant) {
  if (variant === "error") return "admin-toast admin-toast-error";
  if (variant === "loading" || variant === "neutral") return "admin-toast admin-toast-neutral";
  return "admin-toast admin-toast-success";
}

function renderToastIcon(variant) {
  if (variant === "error") return "!";
  if (variant === "loading") return <span className="admin-toast-spinner" aria-hidden="true" />;
  return "\u2713";
}

export default function PublicToastStack({ toasts, onDismiss }) {
  if (!Array.isArray(toasts) || toasts.length === 0) return null;

  const content = (
    <div
      className="admin-toast-stack"
      aria-live="polite"
      aria-atomic="true"
      style={{ position: "fixed", top: "84px", right: "22px", zIndex: 4000 }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className={getToastClass(toast.variant)}>
          <span className="admin-toast-icon" aria-hidden="true">
            {renderToastIcon(toast.variant)}
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
