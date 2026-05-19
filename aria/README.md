# ARIA — AI Shopping Assistant
### Powered by Google Gemini 1.5 Flash · MERN Stack

---

## Project Structure

```
aria/
├── backend/
│   ├── server.js              ← Express entry point
│   ├── .env                   ← API key + config (DO NOT commit)
│   ├── .env.example           ← Template for env vars
│   ├── package.json
│   ├── services/
│   │   └── gemini.js          ← Gemini client + session store
│   └── routes/
│       ├── chat.js            ← POST /api/chat/message
│       ├── products.js        ← Search, recommend, compare, trending
│       └── session.js         ← Session CRUD
│
└── frontend/
    ├── index.html
    ├── vite.config.js         ← Proxy /api → :5000
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx            ← Root layout + tab controller
        ├── styles/
        │   └── globals.css    ← CSS variables, animations
        ├── components/
        │   ├── Header.jsx     ← Nav, search bar, cart button
        │   ├── ChatMessage.jsx← Message bubble + product cards
        │   ├── ProductCard.jsx← Card with add-to-cart
        │   ├── CartSidebar.jsx← Slide-in cart panel
        │   ├── SearchResults.jsx
        │   └── TypingIndicator.jsx
        ├── context/
        │   └── CartContext.jsx ← Global cart state (useReducer)
        ├── hooks/
        │   └── useChat.js     ← Session init + message state
        └── services/
            └── api.js         ← Axios wrapper for all API calls
```

---

## ⚡ Quick Start

### 1. Backend

```bash
cd aria/backend
npm install
# Edit .env — add your Gemini API key
npm run dev       # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd aria/frontend
npm install
npm run dev       # Starts on http://localhost:5173
```

Open **http://localhost:5173** — done!

---

## API Endpoints

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| POST   | /api/chat/message         | Send message to ARIA             |
| GET    | /api/chat/suggestions     | Get starter prompts              |
| POST   | /api/products/search      | Search products by query         |
| POST   | /api/products/recommend   | Get personalized recommendations |
| POST   | /api/products/compare     | Compare 2+ products              |
| GET    | /api/products/trending    | Trending products across India   |
| POST   | /api/session/new          | Create a new chat session        |
| DELETE | /api/session/:id          | Delete a session                 |
| GET    | /api/health               | Health check                     |

---

## Features

- **Conversational AI** — Multi-turn chat with memory via Gemini 1.5 Flash
- **Product Cards** — ARIA returns structured product recommendations inline
- **Smart Search** — Header search generates AI-curated product results
- **Trending Feed** — Live trending products across categories
- **Cart System** — Add, remove, quantity management, checkout flow
- **Session Management** — Per-user chat sessions with auto-cleanup
- **Rate Limiting** — 60 req/min per IP on the API
- **Luxury Dark UI** — Gold accents, Cormorant Garamond display font

---

## Environment Variables

```env
PORT=5000
GEMINI_API_KEY=your_key_here   # ← Replace with fresh key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Security:** Rotate your API key immediately at https://aistudio.google.com if it was shared publicly.

---

## Tech Stack

| Layer     | Tech                                |
|-----------|-------------------------------------|
| AI        | Google Gemini 1.5 Flash             |
| Backend   | Node.js, Express, ES Modules        |
| Frontend  | React 18, Vite, Lucide Icons        |
| Styling   | Pure CSS (CSS Variables, no Tailwind)|
| HTTP      | Axios + Vite Proxy                  |
| State     | React Context + useReducer          |
