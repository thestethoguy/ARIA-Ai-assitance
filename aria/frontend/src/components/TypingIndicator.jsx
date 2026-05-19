export default function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg, #C9A96E33, #C9A96E11)",
        border: "1px solid var(--border-hover)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, flexShrink: 0,
      }}>
        ✦
      </div>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)",
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 5, height: 5,
            borderRadius: "50%",
            background: "var(--gold)",
            animation: `typing-dot 1.2s ease ${i * 0.2}s infinite`,
            opacity: 0.4,
          }} />
        ))}
      </div>
    </div>
  );
}
