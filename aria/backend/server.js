import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";
import productRoutes from "./routes/products.js";
import sessionRoutes from "./routes/session.js";

dotenv.config();

// ─── Environment Validation ───────────────────────────────────────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL: GEMINI_API_KEY is not set. Server cannot start.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan("dev"));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// FRONTEND_URL may be a comma-separated list of allowed origins, e.g.:
//   "http://localhost:5173,https://your-app.vercel.app"
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { error: "Too many requests. Please slow down." },
});
app.use("/api/", limiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);
app.use("/api/session", sessionRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ARIA Shopping Assistant API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ ARIA Backend running on http://localhost:${PORT}`);
  console.log(`🔑 Gemini API Key : ${process.env.GEMINI_API_KEY ? "Present ✓" : "MISSING ✗"}`);
  console.log(`🌐 CORS origins   : ${allowedOrigins.join(", ")}`);
  console.log(`🚀 Environment    : ${process.env.NODE_ENV || "development"}\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = () => {
  console.log("ARIA server shutting down gracefully...");
  process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
