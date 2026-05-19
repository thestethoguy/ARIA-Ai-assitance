import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { ARIA_SYSTEM_PROMPT } from "../services/gemini.js";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── POST /api/products/search ────────────────────────────────────────────────
router.post("/search", async (req, res) => {
  const { query, filters = {} } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a product database. Return ONLY valid JSON arrays with product objects. No markdown, no explanation text.`,
    });

    const filterText = Object.keys(filters).length
      ? `Filters: ${JSON.stringify(filters)}`
      : "";

    const prompt = `Generate 6 realistic product results for: "${query}". ${filterText}
    
Return ONLY a JSON array with this exact structure:
[
  {
    "id": "prod-1",
    "name": "Full Product Name",
    "brand": "Brand Name",
    "price": 1999,
    "originalPrice": 2499,
    "discount": "20%",
    "category": "Category",
    "rating": 4.5,
    "reviews": 2341,
    "badge": "Best Seller",
    "description": "One compelling sentence description",
    "tags": ["tag1", "tag2", "tag3"],
    "inStock": true,
    "imageQuery": "specific product search query for images"
  }
]

Make prices realistic in Indian Rupees (INR). Use real brand names. Vary badges: Best Seller, New Arrival, Limited Deal, Top Rated, Hot Deal, null.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown fences if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const products = JSON.parse(text);
    res.json({ products, query, total: products.length });
  } catch (err) {
    console.error("Product search error:", err.message);
    res.status(500).json({ error: "Failed to fetch products", detail: err.message });
  }
});

// ─── POST /api/products/recommend ────────────────────────────────────────────
router.post("/recommend", async (req, res) => {
  const { category, budget, preferences = [] } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a product recommendation engine. Return ONLY valid JSON.`,
    });

    const prompt = `Generate 4 top product recommendations.
Category: ${category || "general"}
Budget: ${budget ? `₹${budget}` : "flexible"}
Preferences: ${preferences.join(", ") || "none specified"}

Return ONLY a JSON array with this structure (no extra text):
[{"id":"rec-1","name":"Name","brand":"Brand","price":999,"originalPrice":1299,"discount":"23%","category":"Cat","rating":4.6,"reviews":890,"badge":"Top Rated","description":"Compelling description","tags":["t1","t2"],"inStock":true,"imageQuery":"search query"}]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const products = JSON.parse(text);
    res.json({ products, category, budget });
  } catch (err) {
    console.error("Recommendation error:", err.message);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// ─── POST /api/products/compare ──────────────────────────────────────────────
router.post("/compare", async (req, res) => {
  const { products } = req.body; // array of product names

  if (!products || products.length < 2) {
    return res.status(400).json({ error: "Provide at least 2 products to compare" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are a product comparison expert. Return ONLY valid JSON with no markdown, no explanation, and no extra text.",
    });

    const prompt = `Compare these products: ${products.join(" vs ")}.
    
Return a JSON object:
{
  "products": [
    {
      "name": "Product Name",
      "brand": "Brand",
      "price": 9999,
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should buy this",
      "score": 8.5,
      "verdict": "One sentence verdict"
    }
  ],
  "recommendation": "Overall recommendation",
  "winner": "Product Name"
}

Use realistic Indian market prices. Return ONLY JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const comparison = JSON.parse(text);
    res.json(comparison);
  } catch (err) {
    console.error("Compare error:", err.message);
    res.status(500).json({ error: "Failed to compare products" });
  }
});

// ─── GET /api/products/trending ──────────────────────────────────────────────
router.get("/trending", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "Return ONLY valid JSON, no markdown.",
    });

    const prompt = `List 8 trending products in India right now across different categories (electronics, fashion, beauty, home, fitness).
Return ONLY a JSON array:
[{"id":"t-1","name":"Product","brand":"Brand","price":1999,"originalPrice":2499,"discount":"20%","category":"Electronics","rating":4.7,"reviews":5621,"badge":"Trending","description":"Why it's trending","tags":["tag1"],"inStock":true,"imageQuery":"query"}]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const products = JSON.parse(text);
    res.json({ products });
  } catch (err) {
    console.error("Trending error:", err.message);
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
});

export default router;
