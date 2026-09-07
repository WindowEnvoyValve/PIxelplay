"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPrefix } from "@/components/ui/UserPrefix";

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    nickname: string;
    role: string;
    user_prefixes?: { prefix: string; color: string };
  };
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Realtime обновление каждые 3 секунды
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (res.ok) {
        setInput("");
        fetchMessages();
      } else {
        const data = await res.json();
        alert(data.error || "Ошибка отправки");
      }
    } catch (err) {
      setError("Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="cyber-panel p-8 text-center">
        <p className="text-white/40">Загрузка чата...</p>
      </div>
    );
  }

  return (
    <div className="cyber-panel flex h-[600px] flex-col">
      {/* Заголовок */}
      <div className="border-b border-white/10 px-6 py-4">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
          💬 Чат клуба
        </h3>
        <p className="mt-1 text-xs text-white/40">{messages.length} сообщений</p>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/40">{formatTime(msg.created_at)}</span>
                    {msg.profiles?.user_prefixes?.prefix && (
                      <UserPrefix prefix={msg.profiles.user_prefixes.prefix} color={msg.profiles.user_prefixes.color}>
                        {msg.profiles.nickname}
                      </UserPrefix>
                    )}
                    {!msg.profiles?.user_prefixes?.prefix && (
                      <span className="font-display text-xs font-bold text-white/80">{msg.profiles?.nickname}</span>
                    )}
                  </div>
                  <p className="text-sm text-white/70">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Форма отправки */}
      <form onSubmit={sendMessage} className="border-t border-white/10 p-4">
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2 text-xs text-red-400">
            {error}
          </motion.p>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Написать сообщение..."
            className="cyber-input flex-1"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="cyber-button !py-2.5"
          >
            {sending ? "..." : "→"}
          </button>
        </div>
      </form>
    </div>
  );
}
