import express from "express";
import { getOrCreateSession } from "../services/gemini.js";

const router = express.Router();

// ─── Parse product cards from Gemini response ────────────────────────────────
function parseProductCards(text) {
  const cardMatch = text.match(/PRODUCT_CARDS:\s*(\[[\s\S]*?\])\s*END_CARDS/);
  if (!cardMatch) return { cleanText: text, products: [] };

  let products = [];
  try {
    products = JSON.parse(cardMatch[1]);
  } catch (e) {
    console.error("Failed to parse product cards:", e.message);
  }

  const cleanText = text
    .replace(/PRODUCT_CARDS:\s*\[[\s\S]*?\]\s*END_CARDS/g, "")
    .trim();

  return { cleanText, products };
}

// ─── POST /api/chat/message ───────────────────────────────────────────────────
router.post("/message", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const session = getOrCreateSession(sessionId);
    session.messageCount++;

    const result = await session.chat.sendMessage(message);
    const rawText = result.response.text();

    const { cleanText, products } = parseProductCards(rawText);

    res.json({
      message: cleanText,
      products,
      sessionId,
      messageCount: session.messageCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({
      error: "ARIA encountered an issue. Please try again.",
      detail: err.message,
    });
  }
});

// ─── GET /api/chat/suggestions ────────────────────────────────────────────────
router.get("/suggestions", (req, res) => {
  const suggestions = [
    "Find me a wireless noise-cancelling headphone under ₹5000",
    "What's trending in men's casual wear this season?",
    "Compare iPhone 16 vs Samsung S25",
    "Best skincare routine for oily skin",
    "Gift ideas for a tech enthusiast under ₹3000",
    "Show me eco-friendly home décor",
    "Best running shoes for flat feet",
    "Laptop recommendations for college students",
  ];
  res.json({ suggestions });
});

export default router;
