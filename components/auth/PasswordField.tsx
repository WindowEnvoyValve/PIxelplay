"use client";

import { useId, useState } from "react";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  autoComplete: "current-password" | "new-password";
  error?: string;
  onChange: (value: string) => void;
};

export function PasswordField({
  id,
  label,
  value,
  autoComplete,
  error,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-white/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`cyber-input pr-24 ${error ? "!border-red-400/90 !border-l-red-400" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-1 right-1 rounded px-3 text-xs font-semibold uppercase tracking-wider text-white/55 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brand-light"
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
          aria-pressed={visible}
        >
          {visible ? "Скрыть" : "Показать"}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
