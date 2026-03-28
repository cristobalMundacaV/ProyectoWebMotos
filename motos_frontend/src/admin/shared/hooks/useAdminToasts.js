import { useCallback, useEffect, useRef, useState } from "react";

export default function useAdminToasts({ maxVisible = 4, timeoutMs = 3500 } = {}) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers.clear();
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
    (message, variant = "success") => {
      const normalizedMessage = String(message || "").trim();
      if (!normalizedMessage) return;

      setToasts((prev) => {
        const duplicate = prev.find((toast) => toast.message === normalizedMessage && toast.variant === variant);
        const id = duplicate?.id || `${Date.now()}-${Math.random()}`;
        const next = duplicate
          ? prev.map((toast) => (toast.id === id ? { ...toast, message: normalizedMessage, variant } : toast))
          : [...prev, { id, message: normalizedMessage, variant }];
        const limited = next.slice(-maxVisible);

        const existingTimer = timersRef.current.get(id);
        if (existingTimer) window.clearTimeout(existingTimer);

        const timerId = window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
          timersRef.current.delete(id);
        }, timeoutMs);
        timersRef.current.set(id, timerId);

        return limited;
      });
    },
    [maxVisible, timeoutMs]
  );

  return {
    toasts,
    pushToast,
    dismissToast,
  };
}
