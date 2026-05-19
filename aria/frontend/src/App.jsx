import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import CartSidebar from "./components/CartSidebar";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import SearchResults from "./components/SearchResults";
import ProductCard from "./components/ProductCard";
import { CartProvider } from "./context/CartContext";
import { useChat } from "./hooks/useChat";
import { productsAPI } from "./services/api";

const toastStyle = {
  background: "#141416",
  color: "#F2EDE4",
  border: "1px solid rgba(201,169,110,0.15)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
};

function ARIAApp() {
  const [cartOpen, setCartOpen]               = useState(false);
  const [input, setInput]                     = useState("");
  const [searchResults, setSearchResults]     = useState(null);
  const [searchQuery, setSearchQuery]         = useState("");
  const [trending, setTrending]               = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [activeTab, setActiveTab]             = useState("chat");
  const textareaRef = useRef(null);

  const { messages, loading, sendMessage, clearChat, suggestions, bottomRef } = useChat();

  useEffect(() => {
    setLoadingTrending(true);
    productsAPI.trending()
      .then(({ data }) => setTrending(data.products || []))
      .catch(() => {})
      .finally(() => setLoadingTrending(false));
  }, []);

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSuggestion(text) {
    sendMessage(text);
    setActiveTab("chat");
  }

  function handleSearchResults(results, query) {
    setSearchResults(results);
    setSearchQuery(query);
    if (!results || !results.length) {
      toast.error("No results found.", { style: toastStyle });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-void)" }}>
      <Toaster position="top-right" toastOptions={{ style: toastStyle }} />

      {/* Header */}
      <Header onCartOpen={() => setCartOpen(true)} onSearchResults={handleSearchResults} />

      {/* Search Results Panel */}
      {searchResults && (
        <SearchResults
          results={searchResults}
          query={searchQuery}
          onClose={() => setSearchResults(null)}
        />
      )}

      {/* Tab Bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--bg-deep)", padding: "0 24px" }}>
        {[
          { id: "chat", label: "✦  Chat with ARIA" },
          { id: "trending", label: "◈  Trending Now" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 16px", fontSize: 12, letterSpacing: "0.06em",
              color: activeTab === tab.id ? "var(--gold)" : "var(--text-muted)",
              borderBottom: activeTab === tab.id ? "1px solid var(--gold)" : "1px solid transparent",
              transition: "var(--transition)", fontFamily: "var(--font-body)", marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TRENDING TAB ── */}
      {activeTab === "trending" ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 300, color: "var(--gold)", marginBottom: 4, letterSpacing: "0.04em" }}>
            Trending Today
          </h2>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 28, letterSpacing: "0.06em" }}>
            Curated by ARIA · Powered by Gemini
          </p>
          {loadingTrending ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
              <div style={{ width: 28, height: 28, border: "2px solid var(--gold)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {trending.map((product, idx) => (
                <ProductCard key={product.id || idx} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── CHAT TAB ── */
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 0" }}>
            {/* Quick suggestions shown only before any user message */}
            {messages.length === 1 && suggestions.length > 0 && (
              <div style={{ marginBottom: 24, animation: "fadeUp 0.5s ease both" }}>
                <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                  Suggested
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(s)}
                      className="fade-up"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "8px 14px",
                        fontSize: 11.5, color: "var(--text-secondary)",
                        cursor: "pointer", transition: "var(--transition)",
                        fontFamily: "var(--font-body)",
                        animationDelay: `${i * 40}ms`,
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-hover)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} style={{ height: 24 }} />
          </div>

          {/* ── Chat Input ── */}
          <div style={{ padding: "14px 24px 20px", borderTop: "1px solid var(--border)", background: "rgba(8,8,8,0.97)" }}>
            <div
              style={{
                display: "flex", gap: 10, alignItems: "flex-end",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "10px 10px 10px 16px",
                transition: "var(--transition)",
              }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask ARIA anything about shopping…"
                rows={1}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  resize: "none", fontSize: 13.5, color: "var(--text-primary)",
                  fontFamily: "var(--font-body)", lineHeight: 1.6,
                  maxHeight: 120, overflow: "auto",
                }}
              />
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                <button
                  onClick={clearChat}
                  title="New conversation"
                  style={{
                    background: "none", border: "1px solid var(--border)", borderRadius: "50%",
                    width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--text-muted)", transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--gold)";
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  style={{
                    background: input.trim() && !loading ? "var(--gold)" : "var(--bg-hover)",
                    border: "none", borderRadius: "50%", width: 36, height: 36,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                    color: input.trim() && !loading ? "#080808" : "var(--text-muted)",
                    transition: "var(--transition)",
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 8, letterSpacing: "0.04em" }}>
              ARIA · Gemini 1.5 Flash · Enter to send · Shift+Enter for new line
            </p>
          </div>
        </>
      )}

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ARIAApp />
    </CartProvider>
  );
}
