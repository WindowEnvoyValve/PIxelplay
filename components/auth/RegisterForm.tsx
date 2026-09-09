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

function getRegisterError(code?: string) {
  switch (code) {
    case "IDENTIFIER_ALREADY_EXISTS":
      return "Логин, телефон или email уже используются.";
    case "RATE_LIMITED":
      return "Слишком много попыток регистрации. Попробуйте позже.";
    case "INVALID_REQUEST":
      return "Проверьте формат введённых данных.";
    case "ORIGIN_NOT_ALLOWED":
      return "Запрос отклонён. Обновите страницу и попробуйте снова.";
    default:
      return "Не удалось создать аккаунт. Попробуйте ещё раз.";
  }
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    login: "",
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError("");
    setServerError("");

    if (!form.login.trim() || !form.phone.trim() || !form.email.trim() || !form.password) {
      setFieldError("Заполните все обязательные поля.");
      return;
    }
    if (form.password !== form.repeatPassword) {
      setFieldError("Пароли не совпадают.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          login: form.login.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;

      if (!response.ok) {
        setServerError(getRegisterError(payload?.error?.code));
        return;
      }

      const meResponse = await fetch("/api/auth/me", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!meResponse.ok) {
        setServerError("Аккаунт создан, но не удалось подтвердить сессию.");
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
      <div className="space-y-2">
        <label htmlFor="register-login" className="block text-sm font-semibold text-white/80">
          Логин
        </label>
        <input
          id="register-login"
          name="login"
          type="text"
          value={form.login}
          onChange={(event) => updateField("login", event.target.value)}
          autoComplete="username"
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "register-form-error" : undefined}
          className="cyber-input"
          placeholder="Например, pixel_player"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-phone" className="block text-sm font-semibold text-white/80">
          Номер телефона
        </label>
        <input
          id="register-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          autoComplete="tel"
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "register-form-error" : undefined}
          className="cyber-input"
          placeholder="+375 29 123 45 67"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-email" className="block text-sm font-semibold text-white/80">
          Почта
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          autoComplete="email"
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "register-form-error" : undefined}
          className="cyber-input"
          placeholder="you@example.com"
        />
      </div>
      <PasswordField
        id="register-password"
        label="Пароль"
        value={form.password}
        onChange={(value) => updateField("password", value)}
        autoComplete="new-password"
      />
      <PasswordField
        id="register-repeat-password"
        label="Повторите пароль"
        value={form.repeatPassword}
        onChange={(value) => updateField("repeatPassword", value)}
        autoComplete="new-password"
        error={form.repeatPassword && form.password !== form.repeatPassword ? "Пароли не совпадают." : undefined}
      />
      <div className="flex items-center justify-end text-xs">
        <Link href="/login" className="text-brand transition-colors hover:text-brand-light">
          Уже есть аккаунт? Войти
        </Link>
      </div>
      {fieldError ? (
        <span id="register-form-error" className="sr-only">
          {fieldError}
        </span>
      ) : null}
      <button type="submit" className="cyber-button w-full" disabled={loading}>
        {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
