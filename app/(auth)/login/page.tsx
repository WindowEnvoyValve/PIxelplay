import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Вход — PIXEL Cyberclub" };

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-brand/20 bg-black/40 p-8 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="mb-2 font-display text-2xl font-bold tracking-widest text-white">
            ВХОД В АККАУНТ
          </h1>
          <p className="text-sm text-white/40">
            Твой прогресс LETS PLAY ждёт тебя
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
