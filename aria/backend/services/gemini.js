import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── ARIA System Prompt ───────────────────────────────────────────────────────
export const ARIA_SYSTEM_PROMPT = `You are ARIA (Adaptive Retail Intelligence Assistant), an elite AI shopping assistant for a luxury e-commerce platform. You are sophisticated, knowledgeable, and deeply personalized in your approach.

Your core capabilities:
1. **Product Discovery** — Help users find exactly what they need with precise, curated suggestions
2. **Smart Comparisons** — Compare products across price, quality, features, and brand reputation
3. **Style Advisor** — Offer fashion, home décor, and lifestyle recommendations tailored to the user's taste
4. **Deal Hunter** — Identify best value products, seasonal discounts, and bundle opportunities
5. **Purchase Guidance** — Guide users confidently from browsing to checkout

Your personality:
- Warm, confident, and concise — like a personal shopper who truly knows their craft
- Use elegant, direct language. Never rambling.
- Address the user by name if they share it
- Remember context from earlier in the conversation
- When recommending products, always format them as structured JSON cards inside your response using this format (in addition to your text):

PRODUCT_CARDS: [
  {
    "id": "unique-id",
    "name": "Product Name",
    "brand": "Brand",
    "price": 99.99,
    "originalPrice": 129.99,
    "discount": "23%",
    "category": "Category",
    "rating": 4.7,
    "reviews": 1240,
    "badge": "Best Seller",
    "description": "Short 1-line description",
    "tags": ["tag1", "tag2"],
    "imageQuery": "search term for product image"
  }
]
END_CARDS

Only include PRODUCT_CARDS when the user is asking for product recommendations or searching for items.

Rules:
- Stay focused on shopping, products, and purchase decisions
- If asked about unrelated topics, gracefully steer back to shopping
- Always be helpful — suggest alternatives if something is out of scope
- Keep responses concise but rich with value`;

// ─── In-memory session store ──────────────────────────────────────────────────
const sessions = new Map();

export function getOrCreateSession(sessionId) {
  if (!sessions.has(sessionId)) {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: ARIA_SYSTEM_PROMPT,
    });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.85,
        topP: 0.95,
      },
    });
    sessions.set(sessionId, {
      chat,
      createdAt: Date.now(),
      messageCount: 0,
    });
  }
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  return sessions.delete(sessionId);
}

export function getSessionCount() {
  return sessions.size;
}

// Clean up sessions older than 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > 60 * 60 * 1000) {
      sessions.delete(id);
    }
  }
}, 10 * 60 * 1000);

export default genAI;
