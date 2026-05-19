import { useState } from "react";
import { ShoppingBag, Star, Heart, TrendingUp } from "lucide-react";
import { useCart } from "../context/CartContext";

const BADGE_COLORS = {
  "Best Seller": { bg: "#C9A96E22", text: "#C9A96E", border: "#C9A96E44" },
  "New Arrival": { bg: "#5ECFCA22", text: "#5ECFCA", border: "#5ECFCA44" },
  "Limited Deal": { bg: "#E8756A22", text: "#E8756A", border: "#E8756A44" },
  "Top Rated":   { bg: "#6BCB7722", text: "#6BCB77", border: "#6BCB7744" },
  "Hot Deal":    { bg: "#E8756A22", text: "#E8756A", border: "#E8756A44" },
  "Trending":    { bg: "#C9A96E22", text: "#C9A96E", border: "#C9A96E44" },
};

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const badge = BADGE_COLORS[product.badge];

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(product.id || product.name)}/400/300`;

  return (
    <div
      className="product-card"
      style={{
        animationDelay: `${index * 60}ms`,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "var(--transition)",
        cursor: "default",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-gold)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#1A1A1D" }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {/* Badge */}
        {product.badge && badge && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: badge.bg, color: badge.text,
            border: `1px solid ${badge.border}`,
            borderRadius: 4, fontSize: 10, fontWeight: 600,
            padding: "2px 8px", letterSpacing: "0.08em",
            textTransform: "uppercase", fontFamily: "var(--font-body)",
          }}>
            {product.badge}
          </span>
        )}
        {/* Discount */}
        {product.discount && (
          <span style={{
            position: "absolute", top: 10, right: 40,
            background: "#E8756A22", color: "#E8756A",
            border: "1px solid #E8756A44",
            borderRadius: 4, fontSize: 10, fontWeight: 600,
            padding: "2px 6px",
          }}>
            -{product.discount}
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: "absolute", top: 8, right: 8,
            background: liked ? "#E8756A22" : "rgba(0,0,0,0.5)",
            border: liked ? "1px solid #E8756A44" : "1px solid transparent",
            borderRadius: "50%", width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "var(--transition)", color: liked ? "#E8756A" : "#9A9490",
          }}
        >
          <Heart size={13} fill={liked ? "#E8756A" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px 16px" }}>
        {/* Brand */}
        <p style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>
          {product.brand}
        </p>
        {/* Name */}
        <h3 style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 6, letterSpacing: "0.01em" }}>
          {product.name}
        </h3>
        {/* Description */}
        <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 10, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.description}
        </p>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "#C9A96E" : "none"} color={i < Math.floor(product.rating) ? "#C9A96E" : "#3A3A3D"} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
            {product.rating} ({product.reviews?.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: 11, color: "var(--text-muted)", textDecoration: "line-through", marginLeft: 6 }}>
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: added ? "var(--success)" : "var(--gold-dim)",
              color: added ? "#fff" : "var(--gold)",
              border: `1px solid ${added ? "transparent" : "var(--border-hover)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "6px 12px", fontSize: 11, fontWeight: 500,
              cursor: "pointer", transition: "var(--transition)",
              fontFamily: "var(--font-body)", letterSpacing: "0.04em",
            }}
          >
            <ShoppingBag size={12} />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
