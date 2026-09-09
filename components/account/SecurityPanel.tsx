"use client";

import { useEffect, useState } from "react";

type Session = { id: string; device: string; userAgent: string | null; ipAddress: string | null; createdAt: string; lastSeenAt: string | null; current: boolean };
type SecurityUser = { email: string; emailVerifiedAt: string | Date | null };

function date(value: string | null) {
  return value ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

export function SecurityPanel({ initialSessions = [], preview = false, user }: { initialSessions?: Session[]; preview?: boolean; user?: SecurityUser }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const [emailVerified, setEmailVerified] = useState(Boolean(user?.emailVerifiedAt));
  const [verificationSending, setVerificationSending] = useState(false);

  async function loadSessions() {
    const response = await fetch("/api/account/sessions", { credentials: "same-origin" });
    if (response.ok) setSessions((await response.json()).sessions);
  }
  useEffect(() => {
    if (preview) return;
    let active = true;
    void fetch("/api/account/sessions", { credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active && data?.sessions) setSessions(data.sessions); });
    return () => { active = false; };
  }, [preview]);

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/account/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Не удалось изменить пароль.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setMessage("Пароль изменён. Остальные сессии завершены.");
      await loadSessions();
    } catch (changeError) { setError(changeError instanceof Error ? changeError.message : "Не удалось подключиться к серверу."); }
    finally { setSaving(false); }
  }

  async function revoke(id: string) {
    setError("");
    const response = await fetch(`/api/account/sessions/${id}`, { method: "DELETE" });
    if (!response.ok) { setError("Не удалось завершить сессию."); return; }
    setSessions((items) => items.filter((item) => item.id !== id));
  }
  async function revokeOthers() {
    setError("");
    const response = await fetch("/api/account/sessions", { method: "POST" });
    if (!response.ok) { setError("Не удалось завершить другие сессии."); return; }
    setSessions((items) => items.filter((item) => item.current));
  }

  async function requestVerification() {
    setVerificationSending(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/auth/email-verification/request", { method: "POST", credentials: "same-origin" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Не удалось отправить письмо.");
      if (data?.status === "already_verified") setEmailVerified(true);
      setMessage(data?.message || "Письмо с подтверждением отправлено.");
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Не удалось подключиться к серверу.");
    } finally { setVerificationSending(false); }
  }

  return (
    <div className="space-y-4">
      {user ? <section className="rounded-2xl border border-[#22312e] bg-[#101716] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-7"><h2 className="font-display text-2xl font-bold text-white">Email</h2><p className="mt-2 text-sm text-white/55">{user.email}</p><p className={`mt-3 text-sm ${emailVerified ? "text-emerald-300" : "text-amber-200"}`}>{emailVerified ? "Email подтверждён" : "Email не подтверждён"}</p>{!emailVerified ? <button type="button" onClick={() => void requestVerification()} disabled={preview || verificationSending} className="cyber-button mt-4 disabled:opacity-50">{preview ? "Недоступно в preview" : verificationSending ? "Отправляем..." : "Отправить письмо"}</button> : null}</section> : null}
      <form onSubmit={changePassword} className="min-w-0 overflow-hidden rounded-2xl border border-[#22312e] bg-[#101716] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"><div className="border-b border-[#22312e] px-5 py-5 sm:px-7"><h2 className="font-display text-2xl font-black text-fuchsia-300 sm:text-3xl">Безопасность</h2><p className="mt-2 text-sm text-white/60">Защитите аккаунт и управляйте активными сессиями.</p></div><div className="px-5 py-5 sm:px-7"><p className="text-sm text-white/55">Пароль хранится только в виде Argon2id-хеша.</p>
        {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => <label key={field} className="mt-4 block text-sm text-white/70">{field === "currentPassword" ? "Текущий пароль" : field === "newPassword" ? "Новый пароль" : "Повторите новый пароль"}<input required type="password" minLength={field === "currentPassword" ? 1 : 10} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" autoComplete={field === "currentPassword" ? "current-password" : "new-password"} /></label>)}
        {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}{message && <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200" role="status">{message}</p>}
        <div className="mt-6 flex flex-wrap gap-3"><button type="submit" disabled={saving} className="cyber-button disabled:opacity-50">{saving ? "Сохранение..." : "Изменить пароль"}</button></div></div>
      </form>
      <section className="rounded-2xl border border-[#22312e] bg-[#101716] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-bold text-white">Активные сессии</h2><p className="mt-1 text-sm text-white/50">Токены и password hash здесь не отображаются.</p></div><button type="button" onClick={revokeOthers} className="account-secondary-action text-xs">Завершить все остальные</button></div>
        <div className="mt-5 space-y-3">{sessions.length ? sessions.map((session) => <article key={session.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{session.device} {session.current && <span className="ml-2 text-xs text-emerald-300">Это устройство</span>}</h3><p className="mt-1 text-xs text-white/50">IP: {session.ipAddress || "не определён"}</p><p className="mt-1 text-xs text-white/45">Создана: {date(session.createdAt)} · Активность: {date(session.lastSeenAt)}</p></div>{!session.current && <button type="button" onClick={() => void revoke(session.id)} className="text-xs text-red-200 hover:text-white">Завершить</button>}</div></article>) : <p className="text-sm text-white/50">Активные сессии недоступны в preview-режиме.</p>}</div>
      </section>
    </div>
  );
}
