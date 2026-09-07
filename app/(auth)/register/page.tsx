import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Регистрация — PIXEL Cyberclub" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-2 text-center font-display text-xl font-bold tracking-widest text-white">
        НОВЫЙ ИГРОК
      </h1>
      <p className="mb-8 text-center text-sm text-white/40">
        Кешбэк 5–25%, бонусы и бронирование за 30 секунд
      </p>
      <RegisterForm />
    </>
  );
}
