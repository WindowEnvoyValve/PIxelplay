"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthFormNotice } from "@/components/auth/AuthFormNotice";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Не удалось отправить запрос.");
      setMessage(data.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <AuthFormNotice message={error} />
      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200" role="status">{message}</p> : null}
      <div className="space-y-2">
        <label htmlFor="forgot-email" className="block text-sm font-semibold text-white/80">Email</label>
        <input id="forgot-email" name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="cyber-input" placeholder="you@example.com" />
      </div>
      <button type="submit" className="cyber-button w-full" disabled={loading}>{loading ? "Отправляем..." : "Восстановить пароль"}</button>
      <div className="text-center text-xs"><Link href="/login" className="text-brand hover:text-brand-light">Вернуться ко входу</Link></div>
    </form>
  );
}
