import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Logs the full resolved URL in development to aid debugging.
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    const fullURL = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.debug(`[ARIA API] ${config.method?.toUpperCase()} ${fullURL}`);
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Converts opaque network failures into a user-friendly message.
api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (!err.response) {
      return Promise.reject(
        new Error("Unable to reach ARIA server. Please check your connection.")
      );
    }
    return Promise.reject(err);
  }
);

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (message, sessionId) =>
    api.post("/chat/message", { message, sessionId }),

  getSuggestions: () =>
    api.get("/chat/suggestions"),
};

// ─── Session ──────────────────────────────────────────────────────────────────
export const sessionAPI = {
  create: () => api.post("/session/new"),
  destroy: (id) => api.delete(`/session/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsAPI = {
  search: (query, filters = {}) =>
    api.post("/products/search", { query, filters }),

  recommend: (category, budget, preferences = []) =>
    api.post("/products/recommend", { category, budget, preferences }),

  compare: (products) =>
    api.post("/products/compare", { products }),

  trending: () =>
    api.get("/products/trending"),
};

export default api;
