import { BookingWidget } from "@/components/booking/BookingWidget";

export const metadata = { title: "Бронирование — PIXEL" };

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Бронирование</p>
        <h1 className="mt-2 font-display text-3xl font-black text-white">
          ЗАЙМИ СВОЁ <span className="text-gradient-brand">МЕСТО</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/50">
          Четыре шага — и место твоё. Бонусные баллы LETS PLAY можно списать до 50% стоимости,
          а после сессии вернётся кешбэк твоего уровня.
        </p>
      </div>
      <BookingWidget />
    </div>
  );
}
