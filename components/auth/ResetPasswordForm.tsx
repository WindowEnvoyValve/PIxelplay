"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthFormNotice } from "@/components/auth/AuthFormNotice";
import { PasswordField } from "@/components/auth/PasswordField";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) window.history.replaceState({}, "", "/reset-password");
  }, [token]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!token) {
      setError("Ссылка восстановления недействительна.");
      return;
    }
    if (password !== confirmation) {
      setError("Пароли не совпадают.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password, confirmPassword: confirmation }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Ссылка восстановления недействительна.");
      setSuccess(true);
      window.setTimeout(() => router.replace("/login?reset=success"), 900);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return <div className="space-y-4 text-center"><p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200" role="status">Пароль изменён. Перенаправляем на страницу входа.</p><Link href="/login" className="text-sm text-brand hover:text-brand-light">Перейти ко входу</Link></div>;
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <AuthFormNotice message={error} />
      <PasswordField id="reset-password" label="Новый пароль" value={password} onChange={setPassword} autoComplete="new-password" />
      <PasswordField id="reset-password-confirm" label="Повторите новый пароль" value={confirmation} onChange={setConfirmation} autoComplete="new-password" error={confirmation && password !== confirmation ? "Пароли не совпадают." : undefined} />
      <button type="submit" className="cyber-button w-full" disabled={loading}>{loading ? "Сохраняем..." : "Сохранить новый пароль"}</button>
    </form>
  );
}
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthFormNotice } from "@/components/auth/AuthFormNotice";
import { PasswordField } from "@/components/auth/PasswordField";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!token) {
      setError("Ссылка восстановления недействительна.");
      return;
    }
    if (password !== confirmation) {
      setError("Пароли не совпадают.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password, confirmPassword: confirmation }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Ссылка восстановления недействительна.");
      setSuccess(true);
      window.setTimeout(() => router.replace("/login?reset=success"), 900);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return <div className="space-y-4 text-center"><p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200" role="status">Пароль изменён. Перенаправляем на страницу входа.</p><Link href="/login" className="text-sm text-brand hover:text-brand-light">Перейти ко входу</Link></div>;
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <AuthFormNotice message={error} />
      <PasswordField id="reset-password" label="Новый пароль" value={password} onChange={setPassword} autoComplete="new-password" />
      <PasswordField id="reset-password-confirm" label="Повторите новый пароль" value={confirmation} onChange={setConfirmation} autoComplete="new-password" error={confirmation && password !== confirmation ? "Пароли не совпадают." : undefined} />
      <button type="submit" className="cyber-button w-full" disabled={loading}>{loading ? "Сохраняем..." : "Сохранить новый пароль"}</button>
    </form>
  );
}
