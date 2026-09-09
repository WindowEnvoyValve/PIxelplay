"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthFormNotice } from "@/components/auth/AuthFormNotice";
import { PasswordField } from "@/components/auth/PasswordField";

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

function getLoginError(code?: string) {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return "Неверный логин, телефон, email или пароль.";
    case "ACCOUNT_BLOCKED":
      return "Этот аккаунт временно недоступен.";
    case "RATE_LIMITED":
      return "Слишком много попыток. Попробуйте позже.";
    case "ORIGIN_NOT_ALLOWED":
      return "Запрос отклонён. Обновите страницу и попробуйте снова.";
    default:
      return "Не удалось выполнить вход. Попробуйте ещё раз.";
  }
}

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [resetMessage] = useState(() => typeof window !== "undefined"
    && new URLSearchParams(window.location.search).get("reset") === "success"
    ? "Пароль изменён. Войдите с новым паролем."
    : "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError("");
    setServerError("");

    if (!identifier.trim() || !password) {
      setFieldError("Заполните логин, email или телефон и пароль.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;

      if (!response.ok) {
        setServerError(getLoginError(payload?.error?.code));
        return;
      }

      const meResponse = await fetch("/api/auth/me", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!meResponse.ok) {
        setServerError("Вход выполнен, но не удалось подтвердить сессию.");
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch {
      setServerError("Не удалось подключиться к серверу. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <AuthFormNotice message={serverError || fieldError} />
      {resetMessage ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200" role="status">{resetMessage}</p> : null}
      <div className="space-y-2">
        <label htmlFor="identifier" className="block text-sm font-semibold text-white/80">
          Логин / Email / Телефон
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          autoComplete="username"
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "login-form-error" : undefined}
          className="cyber-input"
          placeholder="Введите логин, email или телефон"
        />
      </div>
      <PasswordField
        id="login-password"
        label="Пароль"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      <div className="flex items-center justify-between gap-4 text-xs">
        <Link href="/forgot-password" className="text-white/55 transition-colors hover:text-brand-light">
          Забыли пароль?
        </Link>
        <Link href="/register" className="text-brand transition-colors hover:text-brand-light">
          Создать аккаунт
        </Link>
      </div>
      {fieldError ? (
        <span id="login-form-error" className="sr-only">
          {fieldError}
        </span>
      ) : null}
      <button type="submit" className="cyber-button w-full" disabled={loading}>
        {loading ? "Выполняется вход..." : "Войти"}
      </button>
    </form>
  );
}
