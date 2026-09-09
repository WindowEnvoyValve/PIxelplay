"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AccountUser = {
  login: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string | Date;
  emailVerifiedAt: string | Date | null;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function AccountShell({ user, overlay = false, onNavigate }: { user: AccountUser; overlay?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(user.status === "active" ? "Аккаунт активен" : `Статус: ${user.status}`);
  const [statusEditing, setStatusEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [notice, setNotice] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) {
        setError("Не удалось завершить сессию. Попробуйте ещё раз.");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Не удалось подключиться к серверу.");
    } finally {
      setLoggingOut(false);
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    avatarUrlRef.current = nextUrl;
    setAvatarPreview(nextUrl);
  }

  function handleBalanceAction(action: "Вывести" | "Перевести") {
    setNotice(`${action}: функция будет подключена на следующем этапе.`);
  }

  function handleProfileAction(action: string) {
    setNotice(`${action}: функция будет подключена на следующем этапе.`);
  }

  return (
    <main className={overlay ? "relative" : "relative min-h-[calc(100vh-5rem)] px-4 pb-20 pt-28 sm:px-6"}>
      <div className={overlay ? "w-full" : "mx-auto flex w-full max-w-6xl justify-end"}>
        <section className="w-full max-w-[25rem] rounded-2xl border border-white/10 bg-[#101513]/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-4" aria-labelledby="account-title">
          <div className="rounded-xl border border-white/10 bg-white/[0.035] px-5 pb-5 pt-6 text-center">
            <div className="relative mx-auto h-20 w-20">
              <Link
                href="/account/profile"
                onClick={onNavigate}
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-brand/70 bg-brand/15 font-display text-xl font-bold text-brand shadow-[0_0_28px_rgba(255,106,0,0.22)] transition hover:border-brand hover:shadow-[0_0_34px_rgba(255,106,0,0.38)]"
                aria-label="Открыть мой профиль"
              >
                {avatarPreview ? <Image src={avatarPreview} alt="" fill unoptimized className="object-cover" /> : user.login.slice(0, 2).toUpperCase()}
              </Link>
              <button type="button" onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#101513] bg-white/75 text-lg font-semibold leading-none text-[#101513] transition hover:bg-white" aria-label="Изменить аватар">+</button>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
            </div>
            <h1 id="account-title" className="mt-4 font-display text-xl font-bold text-white">
              <Link href="/account/profile" onClick={onNavigate} className="transition hover:text-brand">{user.login}</Link>
            </h1>
            <button type="button" onClick={() => setStatusEditing((value) => !value)} className="mt-1 text-xs text-emerald-300 transition-colors hover:text-emerald-200">
              {status}
            </button>
            {statusEditing ? (
              <div className="mx-auto mt-2 flex max-w-[12rem] flex-wrap justify-center gap-1.5">
                {["Аккаунт активен", "Отошёл", "Играю"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setStatus(option);
                      setStatusEditing(false);
                    }}
                    className="rounded-full border border-white/15 px-2 py-1 text-[10px] text-white/65 hover:border-brand/60 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
            <p className="mt-3 break-words text-xs leading-relaxed text-white/55">{user.email}</p>
          </div>

          {error ? (
            <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200" role="alert">
              {error}
            </p>
          ) : null}

          <section className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-3" aria-labelledby="balance-title">
            <h2 id="balance-title" className="text-[10px] uppercase tracking-[0.16em] text-white/45">Баланс</h2>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: "BYN", icon: "₿" },
                { label: "Бонусы", icon: "✦" },
                { label: "Медальки", icon: "●" },
              ].map((currency) => (
                <div key={currency.label} className="rounded-lg border border-white/8 bg-white/[0.035] px-2 py-2 text-center">
                  <span className="block text-sm text-brand-light" aria-hidden="true">{currency.icon}</span>
                  <span className="mt-1 block truncate text-[10px] text-white/50">{currency.label}</span>
                  <span className="mt-1 block font-display text-sm font-bold text-white/75">—</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleBalanceAction("Вывести")} className="account-secondary-action min-h-9 text-xs">Вывести</button>
              <button type="button" onClick={() => handleBalanceAction("Перевести")} className="account-secondary-action min-h-9 text-xs">Перевести</button>
            </div>
          </section>

          {notice ? <p className="mt-2 rounded-lg border border-brand/25 bg-brand/[0.08] px-3 py-2 text-center text-[11px] text-brand-light" role="status">{notice}</p> : null}

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="grid grid-cols-2 gap-2" aria-label="Разделы профиля">
              {["Друзья", "Инвентарь", "Мои сообщения", "Смена языка", "История турниров", "История баланса"].map((action) => (
                <button key={action} type="button" onClick={() => handleProfileAction(action)} className="account-secondary-action min-h-10 px-2 text-xs">
                  {action}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Link href="/account/settings" onClick={onNavigate} className="account-secondary-action min-w-0 flex-1">
                Настройки
              </Link>
              <button type="button" onClick={logout} disabled={loggingOut} className="account-logout shrink-0" aria-label="Выйти из аккаунта">
                {loggingOut ? "..." : "↪"}
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-white/30">В аккаунте с {formatDate(user.createdAt)}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
