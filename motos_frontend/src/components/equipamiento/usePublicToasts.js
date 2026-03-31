import { useCallback, useEffect, useRef, useState } from "react";

export default function usePublicToasts({ maxVisible = 3, timeoutMs = 3500 } = {}) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());
  const lastShownRef = useRef(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers.clear();
      lastShownRef.current.clear();
    };
  }, []);

  const dismissToast = useCallback((id) => {
    const timerId = timersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, variant = "success", options = {}) => {
      const normalizedMessage = String(message || "").trim();
      if (!normalizedMessage) return null;
      const { autoDismiss = true, dedupe = true } = options || {};
      const dedupeKey = `${variant}::${normalizedMessage}`;
      const now = Date.now();
      const lastShownAt = lastShownRef.current.get(dedupeKey) || 0;
      const dedupeWindow = Math.max(1200, Math.floor(timeoutMs / 2));
      if (dedupe && now - lastShownAt < dedupeWindow) return null;

      const createdId = `${Date.now()}-${Math.random()}`;

      setToasts((prev) => {
        const duplicate = dedupe ? prev.find((toast) => toast.message === normalizedMessage && toast.variant === variant) : null;
        if (duplicate) return prev;

        const id = duplicate?.id || createdId;
        const next = duplicate
          ? prev.map((toast) => (toast.id === id ? { ...toast, message: normalizedMessage, variant } : toast))
          : [...prev, { id, message: normalizedMessage, variant }];
        const limited = next.slice(-maxVisible);
        lastShownRef.current.set(dedupeKey, now);

        const previousTimerId = timersRef.current.get(id);
        if (previousTimerId) {
          window.clearTimeout(previousTimerId);
          timersRef.current.delete(id);
        }
        if (autoDismiss) {
          const timerId = window.setTimeout(() => dismissToast(id), timeoutMs);
          timersRef.current.set(id, timerId);
        }
        return limited;
      });
      return createdId;
    },
    [dismissToast, maxVisible, timeoutMs]
  );

  return { toasts, pushToast, dismissToast };
}
