import { ShoppingBag, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";

export default function Header({ onCartOpen, onSearchResults }) {
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data } = await productsAPI.search(query);
      onSearchResults?.(data.products, query);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "rgba(8,8,8,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      height: 64,
      display: "flex", alignItems: "center", gap: 20,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #C9A96E33, #C9A96E11)",
          border: "1px solid var(--border-hover)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, animation: "pulse-ring 3s infinite",
        }}>
          ✦
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 300, letterSpacing: "0.15em", color: "var(--gold)", lineHeight: 1 }}>
            ARIA
          </h1>
          <p style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Shopping AI
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, position: "relative" }}>
        <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, categories..."
          style={{
            width: "100%",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "9px 40px 9px 34px",
            fontSize: 12.5,
            color: "var(--text-primary)",
            outline: "none",
            fontFamily: "var(--font-body)",
            transition: "var(--transition)",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--border-hover)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
        {searching && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, border: "2px solid var(--gold)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        )}
      </form>

      {/* Tagline */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 11 }}>
        <Sparkles size={12} color="var(--gold)" />
        <span style={{ letterSpacing: "0.04em" }}>Powered by Gemini</span>
      </div>

      {/* Cart */}
      <button
        onClick={onCartOpen}
        style={{
          position: "relative", background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "8px 14px",
          display: "flex", alignItems: "center", gap: 6,
          cursor: "pointer", color: "var(--text-secondary)",
          transition: "var(--transition)", fontSize: 12,
          fontFamily: "var(--font-body)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <ShoppingBag size={15} />
        <span>Cart</span>
        {count > 0 && (
          <span style={{
            position: "absolute", top: -6, right: -6,
            background: "var(--gold)", color: "#080808",
            borderRadius: "50%", width: 18, height: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700,
          }}>
            {count}
          </span>
        )}
      </button>
    </header>
  );
}
