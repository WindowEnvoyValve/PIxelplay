"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      setError(
        err.code?.includes("invalid")
          ? "Неверный email или пароль"
          : err.message || "Ошибка входа"
      );
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand/80">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="cyber-input"
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm text-brand-light"
        >
          {error}
        </motion.p>
      )}

      <button type="submit" disabled={loading} className="cyber-button w-full">
        {loading ? <span className="animate-pulse">ПОДКЛЮЧЕНИЕ...</span> : "ВОЙТИ В СИСТЕМУ"}
      </button>

      <p className="text-center text-sm text-white/50">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-brand underline-offset-4 hover:underline">
          Регистрация
        </Link>
      </p>
    </motion.form>
  );
}
