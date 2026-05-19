import ProductCard from "./ProductCard";

// Very lightweight markdown → JSX converter
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      elements.push(<div key={i} style={{ height: 8 }} />);
      i++;
      continue;
    }

    // Bold + italic inline
    const renderInline = (str) => {
      const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={j} style={{ color: "var(--gold-light)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={j}>{part.slice(1, -1)}</em>;
        return part;
      });
    };

    if (line.startsWith("### ")) {
      elements.push(<p key={i} style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 400, color: "var(--gold-light)", marginBottom: 4 }}>{renderInline(line.slice(4))}</p>);
    } else if (line.startsWith("## ")) {
      elements.push(<p key={i} style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "var(--gold)", marginBottom: 6 }}>{renderInline(line.slice(3))}</p>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
          <span style={{ color: "var(--gold)", fontSize: 12, marginTop: 2, flexShrink: 0 }}>◆</span>
          <span style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-primary)" }}>{renderInline(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)[1];
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
          <span style={{ color: "var(--gold)", fontSize: 11, fontFamily: "var(--font-mono)", minWidth: 18, marginTop: 2 }}>{num}.</span>
          <span style={{ fontSize: 13, lineHeight: 1.6 }}>{renderInline(line.replace(/^\d+\. /, ""))}</span>
        </div>
      );
    } else {
      elements.push(<p key={i} style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-primary)", marginBottom: 4 }}>{renderInline(line)}</p>);
    }
    i++;
  }
  return elements;
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 20,
        paddingRight: isUser ? 0 : "10%",
        paddingLeft: isUser ? "10%" : 0,
      }}
    >
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #C9A96E33, #C9A96E11)",
          border: "1px solid var(--border-hover)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, marginTop: 2,
        }}>
          ✦
        </div>
      )}

      <div style={{ maxWidth: "100%", flex: 1 }}>
        {/* Bubble */}
        <div style={{
          background: isUser ? "var(--gold-dim)" : "var(--bg-card)",
          border: `1px solid ${isUser ? "var(--border-hover)" : "var(--border)"}`,
          borderRadius: isUser
            ? "var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)"
            : "var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)",
          padding: "12px 16px",
          ...(message.isError && { borderColor: "#E8756A44", background: "#E8756A11" }),
        }}>
          {isUser ? (
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-primary)" }}>{message.text}</p>
          ) : (
            <div>{renderMarkdown(message.text)}</div>
          )}
        </div>

        {/* Product Cards */}
        {!isUser && message.products?.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}>
            {message.products.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} index={idx} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, textAlign: isUser ? "right" : "left", letterSpacing: "0.04em" }}>
          {new Date(message.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
