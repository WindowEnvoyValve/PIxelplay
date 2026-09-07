"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register" | null;

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Закрытие при авторизации
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      router.push("/dashboard");
    }
  }, [user, isOpen, onClose, router]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setMode(null);
      setEmail("");
      setPassword("");
      setNickname("");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (password.length < 6) {
          setError("Пароль должен быть не короче 6 символов");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err.code?.includes("email-already-in-use")) {
        setError("Аккаунт уже существует — войди");
      } else if (err.code?.includes("user-not-found") || err.code?.includes("wrong-password") || err.code?.includes("invalid-credential")) {
        setError("Неверный email или пароль");
      } else {
        setError(err.message || "Ошибка");
      }
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-lg border border-brand/20 bg-black/90 p-8 shadow-2xl shadow-brand/10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/30 transition-colors hover:text-brand"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold tracking-widest text-white">
              {mode === "login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}
            </h2>
            <p className="mt-2 text-sm text-white/40">
              {mode === "login" ? "Твой прогресс LETS PLAY ждёт тебя" : "Присоединяйся к PIXEL"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="nickname" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand/80">
                  Никнейм
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Jimenez"
                  className="cyber-input"
                />
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@pixel.gg"
                className="cyber-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand/80">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="cyber-input"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm text-brand-light"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="cyber-button w-full"
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="animate-pulse"
                >
                  ПОДКЛЮЧЕНИЕ...
                </motion.span>
              ) : mode === "login" ? (
                "ВОЙТИ"
              ) : (
                "НАЧАТЬ ИГРАТЬ"
              )}
            </motion.button>

            {/* Toggle mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="text-sm text-brand/60 transition-colors hover:text-brand"
              >
                {mode === "login" ? "Нет аккаунта? Регистрация" : "Уже с нами? Вход"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
