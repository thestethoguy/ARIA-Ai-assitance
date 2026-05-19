import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartSidebar({ open, onClose }) {
  const { items, total, count, updateQty, removeItem, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.7)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.3s ease",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 360, zIndex: 50,
        background: "var(--bg-deep)",
        borderLeft: "1px solid var(--border)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 300, letterSpacing: "0.05em" }}>
              Your Cart
            </h2>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)", transition: "var(--transition)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "var(--text-muted)" }}>
              <ShoppingBag size={40} strokeWidth={1} />
              <p style={{ fontSize: 14, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Your cart is empty</p>
              <p style={{ fontSize: 12 }}>Ask ARIA to find something for you</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                {/* Thumbnail placeholder */}
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={`https://source.unsplash.com/112x112/?${encodeURIComponent(item.imageQuery || item.name)}&sig=${item.id}`}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{item.brand}</p>
                  <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 6, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>₹{(item.price * item.qty).toLocaleString()}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
                        <Minus size={10} />
                      </button>
                      <span style={{ fontSize: 12, minWidth: 16, textAlign: "center", fontFamily: "var(--font-mono)" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
                        <Plus size={10} />
                      </button>
                      <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E8756A66", marginLeft: 4, padding: 2 }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#E8756A"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#E8756A66"}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>₹{total.toLocaleString()}</span>
            </div>
            <button style={{
              width: "100%", padding: "13px", borderRadius: "var(--radius)",
              background: "var(--gold)", color: "#080808",
              border: "none", fontSize: 13, fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.08em",
              textTransform: "uppercase", fontFamily: "var(--font-body)",
              transition: "var(--transition)",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--gold-light)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--gold)"}
            >
              Proceed to Checkout
            </button>
            <button onClick={clearCart} style={{ width: "100%", padding: "8px", background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", marginTop: 8, letterSpacing: "0.06em" }}>
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
