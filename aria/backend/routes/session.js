import express from "express";
import { v4 as uuidv4 } from "uuid";
import { deleteSession, getSessionCount } from "../services/gemini.js";

const router = express.Router();

// ─── POST /api/session/new ────────────────────────────────────────────────────
router.post("/new", (req, res) => {
  const sessionId = uuidv4();
  res.json({
    sessionId,
    message: "New ARIA session created",
    timestamp: new Date().toISOString(),
  });
});

// ─── DELETE /api/session/:id ──────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleted = deleteSession(id);
  res.json({ success: deleted, sessionId: id });
});

// ─── GET /api/session/stats ───────────────────────────────────────────────────
router.get("/stats", (req, res) => {
  res.json({
    activeSessions: getSessionCount(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

export default router;
