import { useCallback, useEffect, useRef, useState } from "react";

export default function useAdminToasts({ maxVisible = 4, timeoutMs = 3500 } = {}) {
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

  const clearToasts = useCallback(() => {
    const timers = timersRef.current;
    timers.forEach((timerId) => window.clearTimeout(timerId));
    timers.clear();
    setToasts([]);
  }, []);

  const pushToast = useCallback(
    (message, variant = "success") => {
      const normalizedMessage = String(message || "").trim();
      if (!normalizedMessage) return;
      const dedupeKey = `${variant}::${normalizedMessage}`;
      const now = Date.now();
      const lastShownAt = lastShownRef.current.get(dedupeKey) || 0;
      const dedupeWindow = Math.max(1200, Math.floor(timeoutMs / 2));
      if (now - lastShownAt < dedupeWindow) return;

      setToasts((prev) => {
        const duplicate = prev.find((toast) => toast.message === normalizedMessage && toast.variant === variant);
        if (duplicate) return prev;

        const id = duplicate?.id || `${Date.now()}-${Math.random()}`;
        const next = duplicate
          ? prev.map((toast) => (toast.id === id ? { ...toast, message: normalizedMessage, variant } : toast))
          : [...prev, { id, message: normalizedMessage, variant }];
        const limited = next.slice(-maxVisible);
        lastShownRef.current.set(dedupeKey, now);

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
    clearToasts,
  };
}
