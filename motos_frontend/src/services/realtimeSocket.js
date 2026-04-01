const ACCESS_TOKEN_KEY = "authToken";

function isRealtimeEnabled() {
  const explicit = String(import.meta.env.VITE_ENABLE_REALTIME || "").trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function buildSocketUrl() {
  const configured = String(import.meta.env.VITE_WS_URL || "").trim();
  if (configured) return configured;
  if (typeof window === "undefined") return "";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/realtime/`;
}

function appendToken(url) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return url;
    const parsed = new URL(url, window.location.origin);
    parsed.searchParams.set("token", token);
    return parsed.toString();
  } catch {
    return url;
  }
}

class RealtimeSocketClient {
  constructor() {
    this.ws = null;
    this.subscribers = new Set();
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.manuallyClosed = false;
    this.maxReconnectAttempts = 5;
  }

  subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    this.subscribers.add(listener);
    this.ensureConnected();
    return () => {
      this.subscribers.delete(listener);
      if (this.subscribers.size === 0) {
        this.disconnect();
      }
    };
  }

  ensureConnected() {
    if (!isRealtimeEnabled()) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    const baseUrl = buildSocketUrl();
    if (!baseUrl) return;

    this.manuallyClosed = false;
    const wsUrl = appendToken(baseUrl);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      let payload = null;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }
      this.subscribers.forEach((listener) => {
        try {
          listener(payload);
        } catch {
          // No-op: isolated listener error.
        }
      });
    };

    this.ws.onclose = () => {
      this.ws = null;
      if (!this.manuallyClosed && this.subscribers.size > 0) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    };
  }

  scheduleReconnect() {
    if (this.reconnectTimer || this.reconnectAttempts >= this.maxReconnectAttempts) return;
    const delay = Math.min(30000, 1000 * 2 ** Math.min(this.reconnectAttempts, 5));
    this.reconnectAttempts += 1;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.ensureConnected();
    }, delay);
  }

  disconnect() {
    this.manuallyClosed = true;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const realtimeSocketClient = new RealtimeSocketClient();

export function subscribeRealtime(listener) {
  return realtimeSocketClient.subscribe(listener);
}
