"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ChatMessage {
  id: string;
  from: "user" | "admin";
  text: string;
  time: string;
}

const STORE_KEY = "pixel-support-chat";
const OPEN_EVENT = "pixel:support-open";

function nowTime(): string {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

/** Открыть виджет поддержки программно (опционально с готовым вопросом) */
export function openSupport(topic?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { topic } }));
}

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Загрузка истории из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Открытие по событию (кнопки «Узнать подробнее»)
  useEffect(() => {
    function onOpen(e: Event) {
      const topic = (e as CustomEvent<{ topic?: string }>).detail?.topic;
      setOpen(true);
      setUnread(false);
      if (topic) {
        setInput(topic);
      }
    }
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Автоскролл вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function persist(next: ChatMessage[]) {
    setMessages(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: `m${Date.now()}`, from: "user", text, time: nowTime() };
    persist([...messages, userMsg]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const r = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) throw new Error(await r.text());
      // Ответ админа придёт в Telegram — здесь подтверждаем отправку
      persist([
        ...messages,
        userMsg,
        {
          id: `a${Date.now()}`,
          from: "admin",
          text: "Сообщение отправлено администратору. Ответим здесь или в Telegram в течение нескольких минут.",
          time: nowTime(),
        },
      ]);
    } catch {
      setError("Не удалось отправить. Попробуй ещё раз или напиши в Telegram: @pixelplay_bot");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Кнопка-пузырь */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { setOpen(true); setUnread(false); }}
            aria-label="Чат с администратором"
            className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-brand/60 bg-panel shadow-[0_0_28px_rgba(255,106,0,0.45)]"
          >
            <span className="text-2xl">💬</span>
            {unread && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulse rounded-full bg-brand" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Окно чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-[60] flex h-[520px] w-[min(380px,calc(100vw-3rem))] flex-col border border-brand/40 bg-void/95 shadow-[0_0_48px_rgba(255,106,0,0.25)] backdrop-blur-md"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between border-b border-brand/25 bg-panel/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand/15">
                  <Image src="/favicon.png" alt="Pixel" width={36} height={36} className="p-1.5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-void bg-emerald-400" />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">Администратор</p>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400">онлайн</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть чат"
                className="flex h-8 w-8 items-center justify-center text-white/40 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Сообщения */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="mt-8 text-center">
                  <Image src="/favicon.png" alt="Pixel" width={64} height={64} className="mx-auto" />
                  <p className="mt-3 text-sm font-semibold text-white">Привет! Мы на связи</p>
                  <p className="mx-auto mt-1.5 max-w-[240px] text-xs leading-relaxed text-white/40">
                    Спроси про бронирование, цены, турниры или дни рождения — ответим в течение пары минут.
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "bg-brand text-white"
                        : "border border-white/10 bg-white/5 text-white/85"
                    }`}
                  >
                    {m.text}
                    <span className={`mt-1 block text-right text-[10px] ${m.from === "user" ? "text-white/60" : "text-white/30"}`}>
                      {m.time}
                    </span>
                  </div>
                </motion.div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="flex gap-1 border border-white/10 bg-white/5 px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-white/70"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {error && (
              <p className="border-t border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">{error}</p>
            )}

            {/* Ввод */}
            <div className="flex items-center gap-2 border-t border-brand/25 bg-panel/80 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Твой вопрос..."
                className="cyber-input !py-2.5 flex-1 !text-sm"
              />
              <button
                onClick={send}
                disabled={sending || !input.trim()}
                aria-label="Отправить"
                className="cyber-button !px-4 !py-2.5 disabled:opacity-40"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
