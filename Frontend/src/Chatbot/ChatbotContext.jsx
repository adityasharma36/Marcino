import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

// Shared state for opening/closing the chatbot widget.
const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Stable callbacks so consumers don't re-render unnecessarily.
  const openChatbot = useCallback(() => setIsOpen(true), []);
  const closeChatbot = useCallback(() => setIsOpen(false), []);
  const toggleChatbot = useCallback(() => setIsOpen((prev) => !prev), []);

  // Memoize context value for predictable renders.
  const value = useMemo(
    () => ({ isOpen, openChatbot, closeChatbot, toggleChatbot }),
    [isOpen, openChatbot, closeChatbot, toggleChatbot]
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) {
    // Guard against missing provider wrapper.
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return ctx;
}
