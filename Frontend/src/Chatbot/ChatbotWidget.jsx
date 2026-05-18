// import 'dotenv/config'
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { LiaRobotSolid } from "react-icons/lia";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { addProInCart } from "../store/Action/CartAction";
import { getProduct } from "../store/Action/ProductAction";
import ProductAxios from "../Utils/productAxios";
import { useChatbot } from "./ChatbotContext";

const SOCKET_PATH = "/api/socket/socket.io/";

// Normalize user input and server replies to avoid whitespace-only messages.
function normalizeText(value) {
  return String(value ?? "").trim();
}

// Parse "add to cart" commands so the widget can handle them locally.
function parseAddToCartCommand(text) {
  const t = normalizeText(text);

  // Supported examples:
  // - "add to cart iphone 15 qty 2"
  // - "add cart iphone 15 x2"
  // - "cart add iphone 15"
  // - "add iphone 15 to cart qty 2"
  const patterns = [
    /^\s*(add\s+to\s+cart|add\s+cart|cart\s+add)\s+(.+)$/i,
    /^\s*add\s+(.+?)\s+to\s+cart\s*$/i,
  ];

  let rest = null;
  for (const pattern of patterns) {
    const match = t.match(pattern);
    if (match) {
      rest = normalizeText(match[match.length - 1]);
      break;
    }
  }
  if (!rest) return null;

  let qty = 1;
  const qtyMatch = rest.match(/\b(?:qty|quantity)\s*[:=]?\s*(\d+)\b/i);
  if (qtyMatch) {
    qty = Math.max(1, Number(qtyMatch[1]));
    rest = normalizeText(rest.replace(qtyMatch[0], ""));
  }

  const xMatch = rest.match(/\bx\s*(\d+)\s*$/i);
  if (xMatch) {
    qty = Math.max(1, Number(xMatch[1]));
    rest = normalizeText(rest.replace(xMatch[0], ""));
  }

  const query = rest;
  if (!query) return null;

  return { query, qty };
}

// Pick the most relevant product from available results.
function findBestProductMatch(products, query) {
  const q = normalizeText(query).toLowerCase();
  if (!q) return null;

  const list = Array.isArray(products) ? products : [];

  // Prefer exact title match, then includes.
  const exact = list.find((p) => normalizeText(p?.title).toLowerCase() === q);
  if (exact) return exact;

  const includes = list.find((p) => normalizeText(p?.title).toLowerCase().includes(q));
  if (includes) return includes;

  return null;
}

export default function ChatbotWidget() {
  const { isOpen, toggleChatbot, closeChatbot } = useChatbot();
  const dispatch = useDispatch();

  const products = useSelector((state) => state?.product?.products) || [];

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    { role: "bot", text: "Hi! Send a prompt, or type: add to cart <product name> qty 2", ts: Date.now() },
  ]);
  const [status, setStatus] = useState("disconnected");

  const socketRef = useRef(null);
  const listRef = useRef(null);

  const socketBaseUrl = useMemo(() => {
    return import.meta.env.VITE_AI_BUDDY_SOCKET_URL || window.location.origin;
  }, []);

  // Open and manage the socket connection only while the widget is open.
  useEffect(() => {
    if (!isOpen) return;

    setStatus("connecting");

    const socket = io(socketBaseUrl, {
      path: SOCKET_PATH,
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", (err) => {
      setStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Socket error: ${err?.message || "failed to connect"}`,
          ts: Date.now(),
        },
      ]);
    });

    socket.on("message", (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: normalizeText(data), ts: Date.now() },
      ]);
    });

    return () => {
      socket.off();
      socket.disconnect();
      socketRef.current = null;
      setStatus("disconnected");
    };
  }, [isOpen, socketBaseUrl]);

  useEffect(() => {
    if (!isOpen) return;
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isOpen]);

  // Send user input: handle cart commands locally, otherwise call AI buddy.
  const sendPrompt = async () => {
    const text = normalizeText(input);
    if (!text) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text, ts: Date.now() }]);

    // Separate functionality: add-to-cart command handled locally.
    const addCmd = parseAddToCartCommand(text);
    if (addCmd) {
      try {
        let availableProducts = Array.isArray(products) ? products : [];
        if (availableProducts.length === 0) {
          const payload = await dispatch(getProduct());
          if (Array.isArray(payload)) availableProducts = payload;
          else if (Array.isArray(payload?.data)) availableProducts = payload.data;
          else if (Array.isArray(payload?.products)) availableProducts = payload.products;
        }

        let best = findBestProductMatch(availableProducts, addCmd.query);

        // Fallback: search from API by query (more reliable than loading only the first page).
        if (!best) {
          const res = await ProductAxios.get("/", {
            params: {
              q: addCmd.query,
              limit: 20,
            },
          });
          const apiProducts = Array.isArray(res?.data?.data) ? res.data.data : [];
          best = findBestProductMatch(apiProducts, addCmd.query) || apiProducts[0] || null;
        }

        if (!best) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: `I couldn't find a product matching "${addCmd.query}". Try a more specific name.`,
              ts: Date.now(),
            },
          ]);
          return;
        }

        await dispatch(addProInCart(best, addCmd.qty));
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `Added to cart: ${normalizeText(best?.title)} (qty ${addCmd.qty}).`,
            ts: Date.now(),
          },
        ]);
      } catch (err) {
        const statusCode = err?.response?.status;
        const serverMsg = err?.response?.data?.message;

        const friendly =
          statusCode === 401
            ? "You are not logged in. Please login as a user, then try again."
            : statusCode === 403
              ? "You don't have permission to add to cart (must be logged in as user)."
              : null;

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `Failed to add to cart: ${friendly || serverMsg || err?.message || "unknown error"}`,
            ts: Date.now(),
          },
        ]);
      }
      return;
    }

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Not connected to AI buddy yet.", ts: Date.now() },
      ]);
      return;
    }

    socket.emit("message", text);
  };

  return (
    <>
      {/* Floating toggle button (right side) */}
      <button
        type="button"
        onClick={toggleChatbot}
        className="fixed right-4 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-300 px-2 py-2 cursor-pointer"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <LiaRobotSolid className="h-8 w-8" />
      </button>

      {isOpen ? (
        <div className="fixed right-4 bottom-24 z-50 w-88 max-w-[90vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <LiaRobotSolid className="h-6 w-6" />
              <div>
                <p className="text-sm font-semibold">AI Buddy</p>
                <p className="text-xs text-gray-500">Status: {status}</p>
              </div>
            </div>
            <button type="button" onClick={closeChatbot} className="cursor-pointer">
              <CgClose />
            </button>
          </div>

          <div ref={listRef} className="h-72 overflow-y-auto px-3 py-2">
            {messages.map((m) => (
              <div
                key={`${m.ts}-${m.role}-${m.text.slice(0, 12)}`}
                className={`mb-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-gray-100 px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendPrompt();
              }}
              placeholder="Type your prompt..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={sendPrompt}
              className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
