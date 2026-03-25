export default function AdminToastStack({ toasts, onDismiss }) {
  return (
    <div className="admin-toast-stack" aria-live="polite" aria-atomic="true">
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
}
