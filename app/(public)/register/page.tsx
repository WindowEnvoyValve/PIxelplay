import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация | PIXEL",
  description: "Создание аккаунта PIXEL.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="w-full max-w-md">
        <div className="cyber-panel p-6 sm:p-8">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">PIXEL ACCESS</p>
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl">Регистрация</h1>
            <p className="mt-3 text-sm text-white/50">Создайте аккаунт для будущих возможностей PIXEL.</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
