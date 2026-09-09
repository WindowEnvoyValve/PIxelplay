import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Новый пароль | PIXEL",
  description: "Установка нового пароля аккаунта PIXEL.",
  alternates: { canonical: "/reset-password" },
};

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="w-full max-w-md"><div className="cyber-panel p-6 sm:p-8">
        <div className="mb-8 text-center"><p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">PIXEL ACCESS</p><h1 className="font-display text-3xl font-black text-white sm:text-4xl">Новый пароль</h1><p className="mt-3 text-sm text-white/50">Задайте новый пароль для аккаунта.</p></div>
        <Suspense fallback={<p className="text-center text-sm text-white/50">Загрузка...</p>}><ResetPasswordForm /></Suspense>
      </div></div>
    </main>
  );
}
