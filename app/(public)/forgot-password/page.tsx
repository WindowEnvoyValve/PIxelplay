import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Восстановление пароля | PIXEL",
  description: "Восстановление доступа к аккаунту PIXEL.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="w-full max-w-md"><div className="cyber-panel p-6 sm:p-8">
        <div className="mb-8 text-center"><p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">PIXEL ACCESS</p><h1 className="font-display text-3xl font-black text-white sm:text-4xl">Восстановление пароля</h1><p className="mt-3 text-sm text-white/50">Введите email, указанный при регистрации.</p></div>
        <ForgotPasswordForm />
      </div></div>
    </main>
  );
}
