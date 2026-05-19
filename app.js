// ══════════════════════════════════════════════════════════
//  ARIA — app.js
//  Handles: specific product queries, comparisons,
//           cross-questioning flows, small talk
// ══════════════════════════════════════════════════════════
let url = "https://api.anthropic.com/v1/messages";
// ── DOM ──────────────────────────────────────────────────
const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const suggestions = document.getElementById("suggestions");

// ── Conversation State ────────────────────────────────────
let state = {
  stage: "idle", // idle | questioning | comparing | done
  category: null,
  step: 0,
  answers: {},
  comparePending: null, // holds first product when comparing
};

// ══════════════════════════════════════════════════════════
//  PRODUCT DATABASE
//  Each product: price, specs[], pros[], cons[], rating, buy
// ══════════════════════════════════════════════════════════
const productDB = {
  // ── Phones ──────────────────────────────────────────────
  "iphone 15": {
    name: "Apple iPhone 15",
    category: "phone",
    price: "₹79,900",
    specs: [
      "6.1-inch Super Retina XDR OLED",
      "A16 Bionic chip",
      "48MP main + 12MP ultrawide camera",
      "USB-C (first time)",
      "3,349 mAh battery",
      "iOS 17",
    ],
    pros: [
      "Best single-camera quality",
      "Smooth iOS ecosystem",
      "5 years of software updates",
      "USB-C finally",
      "Premium build quality",
    ],
    cons: [
      "No 120Hz display",
      "Expensive",
      "No fast charging brick in box",
      "Only 6GB RAM",
    ],
    rating: "9/10",
    buy: "Apple Store, Amazon, Flipkart",
  },
  "samsung s24": {
    name: "Samsung Galaxy S24",
    category: "phone",
    price: "₹74,999",
    specs: [
      "6.2-inch Dynamic AMOLED 2X, 120Hz",
      "Snapdragon 8 Gen 3",
      "50MP + 12MP + 10MP triple camera",
      "4,000 mAh, 25W charging",
      "Android 14, 7 years updates",
    ],
    pros: [
      "Best Android camera system",
      "7 years OS updates",
      "Compact yet powerful",
      "Bright display",
      "Galaxy AI features",
    ],
    cons: ["No charger in box", "Average battery life", "Pricey vs OnePlus"],
    rating: "9/10",
    buy: "Samsung.com, Amazon, Flipkart",
  },
  "redmi note 13": {
    name: "Redmi Note 13",
    category: "phone",
    price: "₹14,999",
    specs: [
      "6.67-inch AMOLED 120Hz",
      "Snapdragon 685",
      "108MP main camera",
      "5,000 mAh, 33W charging",
      "Android 13 (MIUI 14)",
    ],
    pros: [
      "Stunning AMOLED display",
      "108MP camera at budget price",
      "Large battery",
      "Solid build quality",
    ],
    cons: [
      "Snapdragon 685 is mid-tier",
      "MIUI has bloatware",
      "No 5G on base model",
    ],
    rating: "7.5/10",
    buy: "Amazon, Flipkart, Mi.com",
  },
  "oneplus 12r": {
    name: "OnePlus 12R",
    category: "phone",
    price: "₹39,999",
    specs: [
      "6.78-inch LTPO AMOLED 120Hz",
      "Snapdragon 8 Gen 2",
      "50MP + 8MP + 2MP camera",
      "5,500 mAh, 100W SUPERVOOC",
      "OxygenOS 14 (Android 14)",
    ],
    pros: [
      "100W fast charging (fills in 26 min)",
      "Flagship chip at mid-range price",
      "Smooth OxygenOS",
      "Big battery",
    ],
    cons: ["No wireless charging", "Camera not flagship-grade", "No IP rating"],
    rating: "8.5/10",
    buy: "OnePlus.in, Amazon, Flipkart",
  },
  "nothing phone 2a": {
    name: "Nothing Phone 2a",
    category: "phone",
    price: "₹23,999",
    specs: [
      "6.7-inch AMOLED 120Hz",
      "MediaTek Dimensity 7200 Pro",
      "50MP + 50MP dual camera",
      "5,000 mAh, 45W charging",
      "Nothing OS 2.5 (Android 14)",
    ],
    pros: [
      "Unique Glyph interface",
      "Clean bloat-free OS",
      "Great cameras for price",
      "Solid performance",
    ],
    cons: [
      "No IP rating",
      "MediaTek chip",
      "Glyph is more style than function",
    ],
    rating: "8/10",
    buy: "Amazon, Flipkart",
  },
  "pixel 8a": {
    name: "Google Pixel 8a",
    category: "phone",
    price: "₹52,999",
    specs: [
      "6.1-inch OLED 120Hz",
      "Google Tensor G3 chip",
      "64MP + 13MP camera",
      "4,492 mAh, 18W charging",
      "Android 14, 7 years updates",
    ],
    pros: [
      "Best computational photography",
      "Pure Android experience",
      "7 years updates",
      "Google AI features",
      "IP67 rated",
    ],
    cons: ["Tensor G3 runs warm", "Slow charging", "Average battery"],
    rating: "8.5/10",
    buy: "Flipkart (India exclusive)",
  },

  // ── Laptops ─────────────────────────────────────────────
  "macbook air m2": {
    name: "Apple MacBook Air M2",
    category: "laptop",
    price: "₹1,14,900",
    specs: [
      "13.6-inch Liquid Retina (2560×1664)",
      "Apple M2 chip (8-core CPU, 8/10-core GPU)",
      "8GB unified RAM (16GB option)",
      "256GB–2TB SSD",
      "18-hour battery life",
      "MagSafe charging",
    ],
    pros: [
      "Fanless, completely silent",
      "18hr real-world battery",
      "Best-in-class performance per watt",
      "macOS ecosystem",
      "Thin & light (1.24kg)",
    ],
    cons: [
      "8GB base RAM is limiting in 2024",
      "Expensive",
      "Only 2 USB-C ports",
      "No SD card slot",
    ],
    rating: "9.5/10",
    buy: "Apple Store, Amazon, Croma",
  },
  "asus vivobook 16x": {
    name: "ASUS VivoBook 16X",
    category: "laptop",
    price: "₹62,990",
    specs: [
      "16-inch FHD IPS 144Hz",
      "AMD Ryzen 7 5800H",
      "16GB DDR4 RAM",
      "512GB NVMe SSD",
      "AMD Radeon graphics",
      "Windows 11",
    ],
    pros: [
      "16GB RAM great for dev/multitasking",
      "144Hz display",
      "Good thermals",
      "Value for money",
    ],
    cons: [
      "Battery life is average (~5hrs)",
      "Plastic build",
      "Display brightness could be better",
    ],
    rating: "8/10",
    buy: "Amazon, Flipkart, ASUS Store",
  },
  "lenovo ideapad slim 5": {
    name: "Lenovo IdeaPad Slim 5",
    category: "laptop",
    price: "₹57,990",
    specs: [
      "15.6-inch FHD IPS",
      "Intel Core i5-13th Gen",
      "16GB DDR5 RAM",
      "512GB SSD",
      "Intel Iris Xe graphics",
      "Windows 11",
    ],
    pros: [
      "DDR5 RAM is future-proof",
      "Good build quality",
      "Backlit keyboard",
      "Decent battery (~7hrs)",
    ],
    cons: [
      "Iris Xe GPU not for gaming",
      "No dedicated GPU option in this range",
      "Average speakers",
    ],
    rating: "7.5/10",
    buy: "Amazon, Flipkart, Lenovo.com",
  },
  "asus tuf gaming a15": {
    name: "ASUS TUF Gaming A15",
    category: "laptop",
    price: "₹62,990",
    specs: [
      "15.6-inch FHD 144Hz IPS",
      "AMD Ryzen 7 6800H",
      "16GB DDR5 RAM",
      "512GB NVMe SSD",
      "NVIDIA RTX 3050 4GB",
      "Windows 11",
    ],
    pros: [
      "RTX 3050 handles most games at 1080p",
      "144Hz display",
      "Military-grade durability",
      "Good cooling",
    ],
    cons: [
      "Heavy (2.3kg)",
      "Short battery in gaming (~2hrs)",
      "Speakers are average",
    ],
    rating: "8/10",
    buy: "Amazon, Flipkart, ASUS Store",
  },

  // ── Headphones ──────────────────────────────────────────
  "sony wh-1000xm5": {
    name: "Sony WH-1000XM5",
    category: "headphone",
    price: "₹26,990",
    specs: [
      "40mm drivers",
      "Industry-leading ANC (8 mics)",
      "30-hour battery (ANC on)",
      "Bluetooth 5.2",
      "Hi-Res Audio certified",
      "Multipoint connection (2 devices)",
    ],
    pros: [
      "Best ANC in the market",
      "Exceptional sound quality",
      "30hr battery",
      "Comfortable for long wear",
      "Multipoint Bluetooth",
    ],
    cons: [
      "Non-foldable design",
      "Expensive",
      "ANC is always-on (can't fully disable)",
      "Average mic quality for calls",
    ],
    rating: "9.5/10",
    buy: "Amazon, Flipkart, Sony Center",
  },
  "jbl tune 760nc": {
    name: "JBL Tune 760NC",
    category: "headphone",
    price: "₹4,999",
    specs: [
      "40mm drivers",
      "Active Noise Cancellation",
      "35-hour battery (ANC off)",
      "Bluetooth 5.0",
      "Foldable design",
      "JBL Pure Bass Sound",
    ],
    pros: [
      "Excellent ANC for the price",
      "35hr battery life",
      "Foldable and portable",
      "JBL Pure Bass signature",
    ],
    cons: [
      "Plasticky build at this price",
      "Average mic",
      "No multipoint Bluetooth",
      "No Hi-Res audio",
    ],
    rating: "8/10",
    buy: "Amazon, Flipkart, JBL Store",
  },
  "boat rockerz 450": {
    name: "boAt Rockerz 450",
    category: "headphone",
    price: "₹1,799",
    specs: [
      "40mm drivers",
      "Bluetooth 4.2",
      "15-hour battery",
      "Super Extra Bass",
      "Foldable earcups",
      "Built-in mic",
    ],
    pros: [
      "Great bass for the price",
      "Affordable",
      "Foldable",
      "Decent battery",
    ],
    cons: [
      "No ANC",
      "Bluetooth 4.2 (older standard)",
      "Average build quality",
      "No multipoint",
    ],
    rating: "7/10",
    buy: "Amazon, Flipkart, boAt website",
  },

  // ── Smartwatches ─────────────────────────────────────────
  "apple watch se": {
    name: "Apple Watch SE (2nd Gen)",
    category: "smartwatch",
    price: "₹29,900",
    specs: [
      "40mm / 44mm LTPO OLED",
      "Apple S8 chip",
      "Heart rate, SpO2, crash detection",
      "Fall detection",
      "GPS + GLONASS",
      "18hr battery",
      "WatchOS 10",
      "IP6X + WR50",
    ],
    pros: [
      "Best smartwatch for iPhone users",
      "Smooth watchOS experience",
      "Crash & fall detection",
      "Extensive app ecosystem",
      "Apple Pay support",
    ],
    cons: [
      "Requires iPhone",
      "No always-on display",
      "18hr battery needs daily charging",
      "Expensive for a 'budget' Apple watch",
    ],
    rating: "8.5/10",
    buy: "Apple Store, Amazon, Croma",
  },
  "samsung galaxy watch 6": {
    name: "Samsung Galaxy Watch 6",
    category: "smartwatch",
    price: "₹24,999",
    specs: [
      "40mm / 44mm Super AMOLED",
      "Exynos W930 chip",
      "Heart rate, SpO2, ECG, body composition",
      "GPS, BeiDou, Galileo",
      "40hr battery",
      "WearOS 4 + One UI Watch 5",
      "IP68 + MIL-STD-810H",
    ],
    pros: [
      "Best Android smartwatch",
      "ECG & body composition tracking",
      "Bright always-on display",
      "Works with any Android phone",
    ],
    cons: [
      "Best with Samsung phones",
      "WearOS can be laggy",
      "Subscription needed for some features",
    ],
    rating: "8.5/10",
    buy: "Samsung.com, Amazon, Flipkart",
  },
  "mi smart band 8": {
    name: "Xiaomi Mi Smart Band 8",
    category: "smartwatch",
    price: "₹2,499",
    specs: [
      "1.62-inch AMOLED",
      "Heart rate, SpO2, stress monitoring",
      "150+ workout modes",
      "16-day battery life",
      "Bluetooth 5.3",
      "5ATM water resistant",
    ],
    pros: [
      "16-day battery is incredible",
      "AMOLED display looks great",
      "Very affordable",
      "150+ workout modes",
    ],
    cons: [
      "No GPS",
      "No call functionality",
      "Limited app support",
      "Plastic build",
    ],
    rating: "8/10",
    buy: "Amazon, Flipkart, Mi.com",
  },

  // ── TVs ──────────────────────────────────────────────────
  "lg c3 oled": {
    name: "LG C3 OLED",
    category: "tv",
    price: "₹1,64,990",
    specs: [
      "55/65/77-inch OLED evo panel",
      "4K 120Hz, Dolby Vision IQ",
      "α9 Gen6 AI processor 4K",
      "4x HDMI 2.1 ports",
      "webOS 23",
      "ThinQ AI",
    ],
    pros: [
      "Perfect blacks (OLED)",
      "4 HDMI 2.1 ports — great for gaming",
      "Incredible color accuracy",
      "Slim & premium design",
      "Best in class picture quality",
    ],
    cons: [
      "OLED burn-in risk (rare but possible)",
      "Very expensive",
      "Glossy panel picks up reflections",
    ],
    rating: "9.5/10",
    buy: "Amazon, Flipkart, LG India, Croma",
  },
  "redmi smart tv x32": {
    name: "Redmi Smart TV X32",
    category: "tv",
    price: "₹14,499",
    specs: [
      "32-inch FHD LED",
      "60Hz",
      "Dolby Audio + DTS-HD",
      "Android TV 11",
      "3GB RAM + 32GB storage",
      "Chromecast built-in",
    ],
    pros: [
      "Very affordable",
      "Android TV (good app support)",
      "Chromecast built-in",
      "Decent picture for bedroom use",
    ],
    cons: [
      "Full HD only (no 4K)",
      "60Hz panel",
      "LED (not QLED/OLED)",
      "Weak speakers",
    ],
    rating: "7/10",
    buy: "Amazon, Flipkart, Mi.com",
  },

  // ── Gaming Chairs ────────────────────────────────────────
  "green soul beast": {
    name: "Green Soul Beast Series",
    category: "gaming chair",
    price: "₹11,999",
    specs: [
      "High-back design",
      "180° recline",
      "4D adjustable armrests",
      "Lumbar + neck cushion",
      "PU leather",
      "360° swivel, heavy-duty wheels",
      "Max weight: 120kg",
    ],
    pros: [
      "Best budget gaming chair in India",
      "180° recline",
      "4D armrests at this price",
      "Good lumbar support",
    ],
    cons: [
      "PU leather may peel after 2 years",
      "Assembly takes time",
      "Foam compresses over time",
    ],
    rating: "8/10",
    buy: "Amazon India",
  },
  "secretlab titan evo": {
    name: "Secretlab Titan Evo",
    category: "gaming chair",
    price: "₹38,000",
    specs: [
      "NEO Hybrid Leatherette or SoftWeave Fabric",
      "4-way L-ADAPT lumbar support",
      "Magnetic memory foam headrest",
      "Multi-tilt mechanism",
      "Pebble seat base",
      "Max weight: 130kg",
    ],
    pros: [
      "Premium build — lasts 5+ years",
      "Best lumbar support available",
      "Multiple size options (S/R/XL)",
      "Looks premium",
    ],
    cons: [
      "Very expensive",
      "Break-in period needed",
      "Limited availability in India",
    ],
    rating: "9.5/10",
    buy: "Secretlab.co (official site)",
  },

  // ── Shoes ────────────────────────────────────────────────
  "asics gel-contend": {
    name: "ASICS Gel-Contend 8",
    category: "shoes",
    price: "₹4,999",
    specs: [
      "Rearfoot GEL cushioning",
      "AHAR outsole (durable rubber)",
      "Mesh upper (breathable)",
      "Drop: 10mm",
      "Weight: ~280g",
      "For neutral runners",
    ],
    pros: [
      "Excellent cushioning for long runs",
      "Durable outsole",
      "Comfortable out of the box",
      "Trusted brand for runners",
    ],
    cons: [
      "Not the most stylish",
      "Heavy compared to Nike/Adidas options",
      "No wide fit option in India",
    ],
    rating: "8/10",
    buy: "Amazon, ASICS India, Myntra",
  },
  "nike react infinity run": {
    name: "Nike React Infinity Run Flyknit 3",
    category: "shoes",
    price: "₹12,995",
    specs: [
      "React foam midsole",
      "Flyknit upper",
      "Rocker geometry (reduces injury)",
      "Drop: 9mm",
      "Weight: ~260g",
      "Wider forefoot design",
    ],
    pros: [
      "Clinically proven to reduce injury",
      "Extremely cushioned & bouncy",
      "Breathable Flyknit upper",
      "Great for long distances",
    ],
    cons: [
      "Expensive",
      "Too cushioned for speed workouts",
      "Runs slightly narrow",
    ],
    rating: "8.5/10",
    buy: "Nike.com, Amazon, Myntra",
  },
};

// ── Product aliases (shorter names user might type) ───────
const productAliases = {
  xm5: "sony wh-1000xm5",
  wh1000xm5: "sony wh-1000xm5",
  "sony xm5": "sony wh-1000xm5",
  iphone15: "iphone 15",
  ip15: "iphone 15",
  s24: "samsung s24",
  "galaxy s24": "samsung s24",
  "note 13": "redmi note 13",
  "redmi 13": "redmi note 13",
  "pixel 8a": "pixel 8a",
  "google pixel": "pixel 8a",
  "macbook m2": "macbook air m2",
  "macbook air": "macbook air m2",
  m2: "macbook air m2",
  vivobook: "asus vivobook 16x",
  "asus vivobook": "asus vivobook 16x",
  "tuf gaming": "asus tuf gaming a15",
  "asus tuf": "asus tuf gaming a15",
  ideapad: "lenovo ideapad slim 5",
  "tune 760": "jbl tune 760nc",
  "jbl 760": "jbl tune 760nc",
  rockerz: "boat rockerz 450",
  "boat 450": "boat rockerz 450",
  "watch se": "apple watch se",
  "apple watch": "apple watch se",
  "galaxy watch": "samsung galaxy watch 6",
  "watch 6": "samsung galaxy watch 6",
  "mi band 8": "mi smart band 8",
  "smart band 8": "mi smart band 8",
  "lg oled": "lg c3 oled",
  "c3 oled": "lg c3 oled",
  "lg c3": "lg c3 oled",
  "redmi tv": "redmi smart tv x32",
  "green soul": "green soul beast",
  "gs beast": "green soul beast",
  secretlab: "secretlab titan evo",
  "titan evo": "secretlab titan evo",
  "gel contend": "asics gel-contend",
  asics: "asics gel-contend",
  "react infinity": "nike react infinity run",
  "nike react": "nike react infinity run",
  "oneplus 12r": "oneplus 12r",
  "12r": "oneplus 12r",
  "nothing 2a": "nothing phone 2a",
  "phone 2a": "nothing phone 2a",
};

// ── Find specific product in text ─────────────────────────
function findProduct(text) {
  const lower = text.toLowerCase();

  // Check aliases first
  for (const [alias, key] of Object.entries(productAliases)) {
    if (lower.includes(alias))
      return productDB[key] ? { key, data: productDB[key] } : null;
  }
  // Check direct DB keys
  for (const key of Object.keys(productDB)) {
    if (lower.includes(key)) return { key, data: productDB[key] };
  }
  return null;
}

// ── Detect compare intent (two products) ─────────────────
function detectCompare(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes(" vs ") ||
    lower.includes(" versus ") ||
    lower.includes("compare") ||
    lower.includes("difference between") ||
    lower.includes("better —") ||
    lower.includes("or the ")
  );
}

// ── Build product detail card ─────────────────────────────
function buildProductCard(p) {
  const stars = "⭐".repeat(Math.round(parseFloat(p.rating)));
  return (
    `**${p.name}**  |  ${p.price}  |  ${stars} ${p.rating}\n\n` +
    `📋 **Specs:**\n${p.specs.map((s) => "  • " + s).join("\n")}\n\n` +
    `✅ **Pros:**\n${p.pros.map((s) => "  • " + s).join("\n")}\n\n` +
    `❌ **Cons:**\n${p.cons.map((s) => "  • " + s).join("\n")}\n\n` +
    `🛒 **Where to buy:** ${p.buy}`
  );
}

// ── Build comparison card ─────────────────────────────────
function buildComparison(p1, p2) {
  return (
    `Here's a side-by-side comparison:\n\n` +
    `**${p1.name}** (${p1.price})  vs  **${p2.name}** (${p2.price})\n\n` +
    `✅ **${p1.name} Pros:** ${p1.pros.slice(0, 3).join(" • ")}\n` +
    `❌ **${p1.name} Cons:** ${p1.cons.slice(0, 2).join(" • ")}\n\n` +
    `✅ **${p2.name} Pros:** ${p2.pros.slice(0, 3).join(" • ")}\n` +
    `❌ **${p2.name} Cons:** ${p2.cons.slice(0, 2).join(" • ")}\n\n` +
    `🏆 **Verdict:** If budget is a priority, go with **${p1.price < p2.price ? p1.name : p2.name}**. For the best overall experience, **${p1.rating >= p2.rating ? p1.name : p2.name}** edges ahead with a ${p1.rating >= p2.rating ? p1.rating : p2.rating} rating.`
  );
}

// ══════════════════════════════════════════════════════════
//  CONVERSATION FLOWS (Cross-questioning per category)
// ══════════════════════════════════════════════════════════
const flows = {
  headphone: {
    questions: [
      "What's your **budget**?\n\n  1️⃣  Under ₹2,000\n  2️⃣  ₹2,000 – ₹5,000\n  3️⃣  ₹5,000 – ₹10,000\n  4️⃣  Above ₹10,000",
      "What **type** do you prefer?\n\n  1️⃣  Over-ear (max comfort)\n  2️⃣  In-ear / earbuds\n  3️⃣  No preference",
      "What will you mainly **use** them for?\n\n  1️⃣  Music / casual listening\n  2️⃣  Gaming\n  3️⃣  Work calls / meetings\n  4️⃣  Gym & workouts",
      "Wired or **wireless**?\n\n  1️⃣  Wireless Bluetooth\n  2️⃣  Wired\n  3️⃣  Either is fine",
    ],
    recommend(a) {
      const b = a[0] || "",
        use = a[2] || "";
      let picks;
      if (b.includes("1") || b.includes("2000"))
        picks = [
          "**boAt Rockerz 450** ₹1,799",
          "**JBL C50HI** ₹999",
          "**Zebronics Zeb-Bang Pro** ₹1,299",
        ];
      else if (b.includes("2") || b.includes("5000"))
        picks = [
          "**JBL Tune 510BT** ₹2,799",
          "**Sony MDR-ZX310** ₹2,490",
          "**boAt Rockerz 550** ₹2,999",
        ];
      else if (b.includes("3") || b.includes("10000"))
        picks = [
          "**JBL Tune 760NC** ₹4,999",
          "**Sony WH-CH520** ₹5,990",
          "**boAt Rockerz 551ANC** ₹4,499",
        ];
      else
        picks = [
          "**Sony WH-1000XM5** ₹26,990",
          "**Bose QC45** ₹24,000",
          "**Apple AirPods Max** ₹54,900",
        ];
      const tip =
        use.includes("4") || use.includes("gym")
          ? "\n\n💡 *For gym use, look for ear hooks so they stay in place.*"
          : use.includes("2") || use.includes("gaming")
            ? "\n\n💡 *For gaming, look for headsets with a boom mic — HyperX & SteelSeries are great.*"
            : "";
      return `Based on your needs, here are my picks:\n\n${picks.map((p) => "• " + p).join("\n")}${tip}\n\n🏆 **Top Rec:** ${picks[0]}\nType any product name above for full specs & details!`;
    },
  },
  laptop: {
    questions: [
      "What's your **budget**?\n\n  1️⃣  Under ₹35,000\n  2️⃣  ₹35,000 – ₹60,000\n  3️⃣  ₹60,000 – ₹1,00,000\n  4️⃣  Above ₹1,00,000",
      "What will you **primarily use** it for?\n\n  1️⃣  College / browsing\n  2️⃣  Programming / development\n  3️⃣  Video editing / design\n  4️⃣  Gaming",
      "Do you have an **OS preference**?\n\n  1️⃣  Windows\n  2️⃣  macOS\n  3️⃣  No preference",
      "How important is **portability**?\n\n  1️⃣  Very (lightweight, thin)\n  2️⃣  Not important (powerful over slim)\n  3️⃣  Balanced",
    ],
    recommend(a) {
      const use = a[1] || "";
      let picks;
      if (use.includes("4") || use.includes("gaming"))
        picks = [
          "**ASUS TUF Gaming A15** ₹62,990",
          "**Lenovo IdeaPad Gaming 3** ₹57,990",
          "**HP Victus 15** ₹49,990",
        ];
      else if (use.includes("3") || use.includes("edit"))
        picks = [
          "**MacBook Air M2** ₹1,14,900",
          "**ASUS ProArt Studiobook** ₹89,990",
          "**Dell XPS 15** ₹1,29,990",
        ];
      else if (use.includes("2") || use.includes("prog"))
        picks = [
          "**ASUS VivoBook 16X** ₹62,990",
          "**Lenovo IdeaPad Slim 5** ₹57,990",
          "**MacBook Air M2** ₹1,14,900",
        ];
      else
        picks = [
          "**Acer Aspire Lite** ₹38,990",
          "**HP 15s** ₹44,990",
          "**Lenovo IdeaPad Slim 3** ₹36,990",
        ];
      return `Perfect! Here are the best laptops for you:\n\n${picks.map((p) => "• " + p).join("\n")}\n\n🏆 **Top Rec:** ${picks[0]}\nType any laptop name above for full specs, pros & cons!`;
    },
  },
  phone: {
    questions: [
      "What's your **budget**?\n\n  1️⃣  Under ₹15,000\n  2️⃣  ₹15,000 – ₹30,000\n  3️⃣  ₹30,000 – ₹60,000\n  4️⃣  Above ₹60,000",
      "What matters most to you?\n\n  1️⃣  Camera quality\n  2️⃣  Battery life\n  3️⃣  Performance / gaming\n  4️⃣  Clean software experience",
      "Which **OS** do you prefer?\n\n  1️⃣  Android\n  2️⃣  iOS (iPhone)\n  3️⃣  No preference",
      "Is this your **daily driver**?\n\n  1️⃣  Yes — primary phone\n  2️⃣  No — secondary / backup",
    ],
    recommend(a) {
      const b = a[0] || "",
        os = a[2] || "";
      let picks;
      if (os.includes("2") || os.includes("ios"))
        picks = [
          "**iPhone 15** ₹79,900",
          "**iPhone 14** ₹64,900",
          "**iPhone SE 3rd Gen** ₹49,900",
        ];
      else if (b.includes("1") || b.includes("15000"))
        picks = [
          "**Redmi Note 13** ₹14,999",
          "**Realme 12** ₹13,999",
          "**Poco M6 Pro** ₹13,499",
        ];
      else if (b.includes("2") || b.includes("30000"))
        picks = [
          "**Nothing Phone 2a** ₹23,999",
          "**Samsung Galaxy A55** ₹27,999",
          "**OnePlus Nord CE4** ₹24,999",
        ];
      else if (b.includes("3") || b.includes("60000"))
        picks = [
          "**OnePlus 12R** ₹39,999",
          "**Google Pixel 8a** ₹52,999",
          "**Samsung Galaxy S23 FE** ₹34,999",
        ];
      else
        picks = [
          "**Samsung Galaxy S24** ₹74,999",
          "**iPhone 15** ₹79,900",
          "**OnePlus 12** ₹64,999",
        ];
      return `Great taste! Your best matches:\n\n${picks.map((p) => "• " + p).join("\n")}\n\n🏆 **Top Rec:** ${picks[0]}\nType any phone name for detailed specs & comparison!`;
    },
  },
  shoes: {
    questions: [
      "What's your **budget**?\n\n  1️⃣  Under ₹2,000\n  2️⃣  ₹2,000 – ₹5,000\n  3️⃣  ₹5,000 – ₹10,000\n  4️⃣  Above ₹10,000",
      "What will you **use them for**?\n\n  1️⃣  Running / jogging\n  2️⃣  Gym / cross training\n  3️⃣  Casual / daily wear\n  4️⃣  Hiking / outdoor",
      "What's your **priority**?\n\n  1️⃣  Maximum cushioning\n  2️⃣  Lightweight & fast\n  3️⃣  Style & looks\n  4️⃣  Durability",
    ],
    recommend(a) {
      const b = a[0] || "",
        use = a[1] || "";
      let picks;
      if (use.includes("4") || use.includes("hik"))
        picks = [
          "**Quechua NH100** ₹2,999",
          "**Columbia Newton Ridge** ₹7,499",
          "**Salomon X Ultra 3** ₹12,999",
        ];
      else if (b.includes("1") || b.includes("2000"))
        picks = [
          "**Puma Softride Vital** ₹1,799",
          "**Campus OFC** ₹999",
          "**Sparx Running Shoes** ₹1,299",
        ];
      else if (b.includes("2") || b.includes("5000"))
        picks = [
          "**ASICS Gel-Contend 8** ₹4,999",
          "**Nike Air Max SC** ₹5,295",
          "**Adidas Duramo SL** ₹3,999",
        ];
      else
        picks = [
          "**Nike React Infinity Run** ₹12,995",
          "**New Balance Fresh Foam 1080** ₹11,999",
          "**Adidas Ultraboost 22** ₹14,999",
        ];
      return `Here are your best shoe picks:\n\n${picks.map((p) => "• " + p).join("\n")}\n\n🏆 **Best Pick:** ${picks[0]}\nType any shoe name for full details!`;
    },
  },
  smartwatch: {
    questions: [
      "What's your **budget**?\n\n  1️⃣  Under ₹3,000\n  2️⃣  ₹3,000 – ₹8,000\n  3️⃣  ₹8,000 – ₹25,000\n  4️⃣  Above ₹25,000",
      "What's the **main use**?\n\n  1️⃣  Basic fitness tracking\n  2️⃣  Serious sports & GPS running\n  3️⃣  Smartwatch features (calls, notifications)\n  4️⃣  Health monitoring (ECG, SpO2)",
      "Which **phone** do you use?\n\n  1️⃣  iPhone (iOS)\n  2️⃣  Android\n  3️⃣  Doesn't matter",
    ],
    recommend(a) {
      const b = a[0] || "",
        ph = a[2] || "";
      let picks;
      if (ph.includes("1") || ph.includes("ios"))
        picks = [
          "**Apple Watch SE 2nd Gen** ₹29,900",
          "**Apple Watch Series 9** ₹41,900",
          "**Fitbit Sense 2** ₹14,999",
        ];
      else if (b.includes("1") || b.includes("3000"))
        picks = [
          "**Mi Smart Band 8** ₹2,499",
          "**Fire-Boltt Ninja Call Pro** ₹1,799",
          "**Noise ColorFit Pulse 2** ₹2,199",
        ];
      else if (b.includes("2") || b.includes("8000"))
        picks = [
          "**Amazfit GTS 4 Mini** ₹6,999",
          "**Samsung Galaxy Fit 3** ₹3,999",
          "**boAt Lunar Pro** ₹4,499",
        ];
      else if (b.includes("3") || b.includes("25000"))
        picks = [
          "**Samsung Galaxy Watch 6** ₹24,999",
          "**Garmin Forerunner 255** ₹32,000",
          "**Amazfit GTR 4** ₹13,999",
        ];
      else
        picks = [
          "**Apple Watch Ultra 2** ₹89,900",
          "**Garmin Fenix 7** ₹69,990",
          "**Samsung Galaxy Watch 6 Classic** ₹34,999",
        ];
      return `Here's what I'd suggest:\n\n${picks.map((p) => "• " + p).join("\n")}\n\n🏆 **Top Pick:** ${picks[0]}\nType any watch name for full spec breakdown!`;
    },
  },
  tv: {
    questions: [
      "What **screen size** do you need?\n\n  1️⃣  32 inch (bedroom)\n  2️⃣  43–50 inch (living room)\n  3️⃣  55+ inch (home theatre)",
      "What's your **budget**?\n\n  1️⃣  Under ₹20,000\n  2️⃣  ₹20,000 – ₹50,000\n  3️⃣  ₹50,000 – ₹1,20,000\n  4️⃣  Above ₹1,20,000",
      "What will you mainly **use** it for?\n\n  1️⃣  Streaming (Netflix, OTT)\n  2️⃣  Gaming (PS5 / Xbox)\n  3️⃣  Sports & live TV\n  4️⃣  Cinematic movies",
    ],
    recommend(a) {
      const b = a[1] || "",
        use = a[2] || "";
      let picks;
      if (use.includes("2") || use.includes("gaming"))
        picks = [
          "**Samsung Crystal 4K CU8000** ₹42,990",
          "**LG QNED80** ₹54,990",
          "**Sony Bravia X90L** ₹89,990",
        ];
      else if (b.includes("1") || b.includes("20000"))
        picks = [
          "**Redmi Smart TV X32** ₹14,499",
          "**VU 40-inch** ₹16,999",
          "**Thomson 40-inch** ₹13,999",
        ];
      else if (b.includes("2") || b.includes("50000"))
        picks = [
          "**Sony Bravia X75L** ₹42,990",
          "**LG UR7500** ₹35,990",
          "**Samsung CU7700** ₹32,990",
        ];
      else
        picks = [
          "**LG C3 OLED** ₹1,64,990",
          "**Samsung Neo QLED QN85C** ₹1,49,990",
          "**Sony Bravia A80L OLED** ₹1,89,990",
        ];
      return `Best TVs for your setup:\n\n${picks.map((p) => "• " + p).join("\n")}\n\n🏆 **My Pick:** ${picks[0]}\nType any TV name for detailed specs!`;
    },
  },
  gaming: {
    questions: [
      "What's your **budget**?\n\n  1️⃣  Under ₹8,000\n  2️⃣  ₹8,000 – ₹15,000\n  3️⃣  ₹15,000 – ₹30,000\n  4️⃣  Above ₹30,000",
      "How many **hours** do you sit daily?\n\n  1️⃣  1–3 hrs (casual)\n  2️⃣  4–6 hrs\n  3️⃣  6+ hrs (long sessions)",
      "What matters most?\n\n  1️⃣  Reclining\n  2️⃣  Lumbar & neck support\n  3️⃣  Adjustable armrests\n  4️⃣  Overall comfort",
    ],
    recommend(a) {
      const b = a[0] || "";
      let picks;
      if (b.includes("1") || b.includes("8000"))
        picks = [
          "**Green Soul Monster Ultimate** ₹6,999",
          "**Savya Home Apex** ₹5,499",
          "**AmazonBasics Gaming Chair** ₹7,299",
        ];
      else if (b.includes("2") || b.includes("15000"))
        picks = [
          "**Green Soul Beast** ₹11,999",
          "**AeroCool Crown** ₹9,999",
          "**Zebronics ZEB-GC2000** ₹12,499",
        ];
      else if (b.includes("3") || b.includes("30000"))
        picks = [
          "**DXRacer Formula Series** ₹22,000",
          "**AndaSeat Phantom 3** ₹24,999",
          "**AutoFull C3** ₹19,999",
        ];
      else
        picks = [
          "**Secretlab Titan Evo** ₹38,000",
          "**Noblechairs EPIC** ₹45,000",
          "**Herman Miller Embody** ₹1,20,000",
        ];
      return `Top gaming chairs for you:\n\n${picks.map((p) => "• " + p).join("\n")}\n\n🏆 **Best Pick:** ${picks[0]}\nFor 6hr+ sessions, always invest a tier higher — your back will thank you!`;
    },
  },
};

// ── Category keyword map ──────────────────────────────────
const categoryMap = [
  { keys: ["headphone", "earphone", "earbud", "audio"], cat: "headphone" },
  { keys: ["laptop", "notebook", "macbook", "computer"], cat: "laptop" },
  {
    keys: ["phone", "smartphone", "mobile", "iphone", "android"],
    cat: "phone",
  },
  { keys: ["shoe", "sneaker", "running shoe", "footwear"], cat: "shoes" },
  {
    keys: ["smartwatch", "watch", "fitness band", "tracker"],
    cat: "smartwatch",
  },
  { keys: ["tv", "television", "smart tv", "oled tv"], cat: "tv" },
  { keys: ["gaming chair", "chair", "gaming desk"], cat: "gaming" },
];

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const { keys, cat } of categoryMap)
    if (keys.some((k) => lower.includes(k))) return cat;
  return null;
}

// ── Small talk ────────────────────────────────────────────
const smallTalk = [
  {
    keys: ["hello", "hi", "hey", "start"],
    reply:
      "Hey! 👋 I'm **ARIA**, your personal shopping guide.\n\nI can help you find & compare **phones, laptops, headphones, TVs, smartwatches, shoes** and **gaming chairs** — or give you detailed specs on any specific product.\n\nJust tell me what you're looking for!",
  },
  {
    keys: ["thanks", "thank you", "perfect", "awesome", "great"],
    reply: "You're welcome! 😊 Come back anytime. Happy shopping! 🛍️",
  },
  {
    keys: ["bye", "goodbye", "see you"],
    reply: "Goodbye! 👋 Have a great day and good luck with your purchase!",
  },
];

function checkSmallTalk(text) {
  const lower = text.toLowerCase();
  for (const { keys, reply } of smallTalk)
    if (keys.some((k) => lower.includes(k))) return reply;
  return null;
}

// ── Detect detail-query intent ────────────────────────────
function isDetailQuery(text) {
  const triggers = [
    "tell me about",
    "details of",
    "specs of",
    "features of",
    "review of",
    "info on",
    "what is",
    "what about",
    "how is",
    "is it good",
    "worth buying",
    "should i buy",
    "price of",
    "cost of",
  ];
  const lower = text.toLowerCase();
  return triggers.some((t) => lower.includes(t));
}

// ══════════════════════════════════════════════════════════
//  RENDER & UI HELPERS
// ══════════════════════════════════════════════════════════
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

function renderMessage(role, text) {
  const row = document.createElement("div");
  row.classList.add("message", role);
  if (role === "bot") {
    const av = document.createElement("div");
    av.classList.add("msg-avatar");
    av.textContent = "🛍️";
    row.appendChild(av);
  }
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = formatText(text);
  row.appendChild(bubble);
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function showTyping() {
  const row = document.createElement("div");
  row.classList.add("message", "bot");
  row.id = "typingRow";
  const av = document.createElement("div");
  av.classList.add("msg-avatar");
  av.textContent = "🛍️";
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  row.appendChild(av);
  row.appendChild(bubble);
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById("typingRow");
  if (el) el.remove();
}

function botReply(text, delay = 900) {
  showTyping();
  setTimeout(() => {
    hideTyping();
    renderMessage("bot", text);
  }, delay);
}

// ══════════════════════════════════════════════════════════
//  CORE: process every user message
// ══════════════════════════════════════════════════════════
function processInput(raw) {
  const msg = raw.trim();
  if (!msg) return;

  suggestions.style.display = "none";
  renderMessage("user", msg);
  userInput.value = "";
  userInput.style.height = "auto";

  const lower = msg.toLowerCase();

  // ── 1. Compare two specific products ─────────────────
  if (detectCompare(lower)) {
    const found = [];
    for (const [key, data] of Object.entries(productDB)) {
      if (lower.includes(key)) found.push(data);
    }
    // Also check aliases
    for (const [alias, key] of Object.entries(productAliases)) {
      if (
        lower.includes(alias) &&
        productDB[key] &&
        !found.includes(productDB[key])
      )
        found.push(productDB[key]);
    }
    if (found.length >= 2) {
      botReply(buildComparison(found[0], found[1]), 1000);
      state = { stage: "done", category: null, step: 0, answers: {} };
      return;
    }
    // Only one product mentioned — ask for the second
    if (found.length === 1) {
      state = {
        stage: "comparing",
        category: null,
        step: 0,
        answers: {},
        comparePending: found[0],
      };
      botReply(
        `Got it — you want to compare **${found[0].name}**.\n\nWhat's the **second product** you want to compare it with?`,
      );
      return;
    }
    // No product found — ask
    state = {
      stage: "comparing",
      category: null,
      step: 0,
      answers: {},
      comparePending: null,
    };
    botReply(
      'Sure! Please name the **two products** you\'d like to compare. For example:\n\n*"Compare Sony WH-1000XM5 vs JBL Tune 760NC"*',
    );
    return;
  }

  // ── 2. Awaiting second product for comparison ─────────
  if (state.stage === "comparing") {
    const found = findProduct(msg);
    if (state.comparePending && found) {
      botReply(buildComparison(state.comparePending, found.data), 1000);
      state = { stage: "done", category: null, step: 0, answers: {} };
    } else if (!state.comparePending && found) {
      state.comparePending = found.data;
      botReply(
        `Got **${found.data.name}**. What's the **second product** to compare it with?`,
      );
    } else {
      botReply(
        "Hmm, I don't have details for that product yet. Try names like *Sony WH-1000XM5*, *Samsung S24*, *MacBook Air M2* etc.",
      );
    }
    return;
  }

  // ── 3. Specific product detail query ─────────────────
  const specificProduct = findProduct(msg);
  if (specificProduct && (isDetailQuery(lower) || !detectCategory(lower))) {
    botReply(buildProductCard(specificProduct.data), 800);
    state = { stage: "done", category: null, step: 0, answers: {} };
    return;
  }

  // ── 4. Small talk ─────────────────────────────────────
  const stReply = checkSmallTalk(msg);
  if (stReply) {
    botReply(stReply);
    return;
  }

  // ── 5. Restart / new product ─────────────────────────
  if (
    lower.includes("restart") ||
    lower.includes("new search") ||
    lower.includes("start over")
  ) {
    state = { stage: "idle", category: null, step: 0, answers: {} };
    botReply("Sure! What product are you looking for now? 🛍️");
    return;
  }

  // ── 6. Questioning stage — collect answers ────────────
  if (state.stage === "questioning") {
    const flow = flows[state.category];
    state.answers[state.step] = msg;
    state.step++;
    if (state.step < flow.questions.length) {
      botReply(flow.questions[state.step]);
    } else {
      state.stage = "done";
      botReply(flow.recommend(state.answers), 1100);
    }
    return;
  }

  // ── 7. Detect category → start questioning flow ───────
  const cat = detectCategory(msg);
  if (cat) {
    state = { stage: "questioning", category: cat, step: 0, answers: {} };
    botReply(
      `Sure! Let me ask you a few quick questions to find the best ${cat === "gaming" ? "gaming chair" : cat} for you. 🎯\n\n${flows[cat].questions[0]}`,
    );
    return;
  }

  // ── 8. Done stage — follow-ups ────────────────────────
  if (state.stage === "done") {
    if (specificProduct) {
      botReply(buildProductCard(specificProduct.data), 800);
      return;
    }
    botReply(
      'I can help you with **phones, laptops, headphones, TVs, smartwatches, shoes** and **gaming chairs**.\n\nYou can also type a specific product name (e.g. *"Sony WH-1000XM5"*) to get full details, or say *"compare X vs Y"* to compare two products! 🔍',
    );
    return;
  }

  // ── 9. Global fallback ────────────────────────────────
  botReply(
    'I\'m not sure about that one yet. 🤔\n\nHere\'s what I can do:\n• **"Best headphone under ₹5000"** → guided recommendations\n• **"Tell me about Sony WH-1000XM5"** → full specs & review\n• **"Compare iPhone 15 vs Samsung S24"** → side-by-side comparison\n\nWhat would you like?',
  );
}

// ── Events ────────────────────────────────────────────────
sendBtn.addEventListener("click", () => processInput(userInput.value));
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    processInput(userInput.value);
  }
});
userInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 120) + "px";
});
document.querySelectorAll(".chip").forEach((btn) => {
  btn.addEventListener("click", () => processInput(btn.textContent));
});

// ── Greeting ──────────────────────────────────────────────
renderMessage(
  "bot",
  "Hey there! 👋 I'm **ARIA**, your personal AI shopping guide.\n\nI can help you:\n• 🔍 **Find** the best product for your needs & budget\n• 📋 **Get full specs** of any specific product\n• ⚖️ **Compare** two products side by side\n\nJust tell me what you're looking for — or type a product name directly!",
);
