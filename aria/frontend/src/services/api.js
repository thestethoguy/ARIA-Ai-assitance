import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

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
