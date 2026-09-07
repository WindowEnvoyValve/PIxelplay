import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Вход — PIXEL Cyberclub" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-2 text-center font-display text-xl font-bold tracking-widest text-white">
        ВХОД В АККАУНТ
      </h1>
      <p className="mb-8 text-center text-sm text-white/40">
        Твой прогресс LETS PLAY ждёт тебя
      </p>
      <LoginForm />
    </>
  );
}
