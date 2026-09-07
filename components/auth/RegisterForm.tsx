"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export function RegisterForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов");
      setLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", user.uid), {
        nickname,
        email,
        birth_date: birthDate || null,
        role: "user",
        loyalty_level: "rookie",
        hours_3m: 0,
        total_hours: 0,
        balance: 0,
        bonus_balance: 0,
        created_at: new Date().toISOString(),
      });

      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      setError(
        err.code?.includes("already")
          ? "Аккаунт с таким email уже существует"
          : err.message || "Не удалось создать аккаунт"
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
        <label htmlFor="nickname" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand/80">
          Никнейм
        </label>
        <input
          id="nickname"
          type="text"
          required
          minLength={3}
          maxLength={24}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="ShadowFrag"
          className="cyber-input"
        />
      </div>

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="cyber-input"
        />
      </div>

      <div>
        <label htmlFor="birth" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand/80">
          Дата рождения <span className="text-white/30">(+15 бонусов в ДР)</span>
        </label>
        <input
          id="birth"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="cyber-input [color-scheme:dark]"
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
        {loading ? <span className="animate-pulse">СОЗДАНИЕ ПРОФИЛЯ...</span> : "НАЧАТЬ ИГРАТЬ"}
      </button>

      <p className="text-center text-sm text-white/50">
        Уже с нами?{" "}
        <Link href="/login" className="text-brand underline-offset-4 hover:underline">
          Вход
        </Link>
      </p>
    </motion.form>
  );
}
