import { X } from "lucide-react";
import ProductCard from "./ProductCard";

export default function SearchResults({ results, query, onClose }) {
  if (!results || results.length === 0) return null;

  return (
    <div style={{
      background: "var(--bg-deep)",
      borderBottom: "1px solid var(--border)",
      padding: "20px 24px",
      animation: "fadeUp 0.3s ease both",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, letterSpacing: "0.04em" }}>
            Results for "{query}"
          </h2>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{results.length} products found</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
          <X size={13} />
        </button>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 14,
      }}>
        {results.map((product, idx) => (
          <ProductCard key={product.id || idx} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
}
