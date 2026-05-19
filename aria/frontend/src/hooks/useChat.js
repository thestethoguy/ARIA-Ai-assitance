import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { chatAPI, sessionAPI } from "../services/api";

const WELCOME = {
  id: "welcome",
  role: "assistant",
  text: "Welcome. I'm **ARIA** — your personal shopping intelligence.\n\nI can help you discover products, compare options, find the best deals, and get style advice tailored to you. What are you looking for today?",
  products: [],
  timestamp: new Date().toISOString(),
};

export function useChat() {
  const [messages, setMessages]     = useState([WELCOME]);
  const [loading, setLoading]       = useState(false);
  const [sessionId, setSessionId]   = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError]           = useState(null);
  const bottomRef = useRef(null);

  // Init session
  useEffect(() => {
    sessionAPI.create()
      .then(({ data }) => setSessionId(data.sessionId))
      .catch(() => setSessionId(uuidv4()));

    chatAPI.getSuggestions()
      .then(({ data }) => setSuggestions(data.suggestions))
      .catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading || !sessionId) return;

    const userMsg = {
      id: uuidv4(),
      role: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const { data } = await chatAPI.sendMessage(text.trim(), sessionId);
      const assistantMsg = {
        id: uuidv4(),
        role: "assistant",
        text: data.message,
        products: data.products || [],
        timestamp: data.timestamp,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError("ARIA is temporarily unavailable. Please try again.");
      const errMsg = {
        id: uuidv4(),
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        products: [],
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME]);
    if (sessionId) {
      sessionAPI.destroy(sessionId).catch(() => {});
    }
    sessionAPI.create()
      .then(({ data }) => setSessionId(data.sessionId))
      .catch(() => setSessionId(uuidv4()));
  }, [sessionId]);

  return { messages, loading, sendMessage, clearChat, suggestions, error, bottomRef };
}
