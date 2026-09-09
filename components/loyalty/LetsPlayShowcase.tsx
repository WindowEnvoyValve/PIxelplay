"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

const levels = [
  ["Rookie", "30–74", "5%", "15"],
  ["Gamer", "75–149", "10%", "15"],
  ["Pro", "150–249", "15%", "15"],
  ["Elite", "250–349", "20%", "15"],
  ["Legend", "350+", "25%", "15"],
];

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <h3 className="font-display text-xl font-bold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
        {items.map((item) => <li key={item} className="flex gap-2"><span className="text-brand">—</span><span>{item}</span></li>)}
      </ul>
    </section>
  );
}

function Example({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <h4 className="font-semibold text-cyan-100">{title}</h4>
      <ul className="mt-3 space-y-1.5 text-sm text-white/70">
        {lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}

export function LetsPlayShowcase({ onOpen }: { onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []);
    const frame = requestAnimationFrame(() => focusable()[0]?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className="lets-play-float group relative flex w-full items-center justify-center whitespace-nowrap px-3 py-1.5 font-sans text-[17px] font-extrabold uppercase tracking-[0.12em] text-cyan-200 [text-shadow:0_0_8px_rgba(70,220,255,0.7),0_0_18px_rgba(70,220,255,0.35)] transition-all duration-300 hover:text-white hover:[text-shadow:0_0_14px_rgba(70,220,255,1),0_0_28px_rgba(70,220,255,0.7)] sm:w-auto sm:px-4 sm:text-xl sm:tracking-[0.2em]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="LETS PLAY"
      >
        <span aria-hidden="true" className="relative z-10 flex flex-col items-center leading-none transition-colors duration-300">
          <span className="mb-0.5 whitespace-nowrap font-display text-[6px] font-bold uppercase tracking-[0.16em] text-white/55 sm:text-[7px] sm:tracking-[0.22em]">
            Программа лояльности
          </span>
          <span>
            {"LETS PLAY".split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="lets-play-letter inline-block"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </span>
        </span>
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lets-play-title"
               className="relative max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-200/50 bg-slate-950/95 p-5 shadow-[0_0_100px_rgba(60,210,255,0.2),inset_0_0_45px_rgba(155,90,255,0.12)] sm:p-8"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,106,0,0.2),transparent_45%)]" />
              <div className="relative">
                <button type="button" onClick={() => setOpen(false)} className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-2xl text-white/60 hover:text-white" aria-label="Закрыть LETS PLAY">
                  ×
                </button>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">PIXEL PLAY · LOYALTY PROGRAM</p>
                <h2 id="lets-play-title" className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">Программа лояльности</h2>
                <p className="mt-3 max-w-2xl text-lg font-bold text-cyan-100">🎮 LETS PLAY — прокачайся и плати меньше</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">Уровневый кешбэк для наших клиентов. Играй, набирай опыт и получай до 25% возврата бонусами.</p>
                <p className="mt-4 inline-flex rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">1 бонус = 1 BYN <span className="mx-2 text-white/30">·</span> Период расчёта часов: 3 месяца</p>

                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  <InfoBlock title="Начисление бонусов" items={["Только если чек на 100% оплачен деньгами", "Кешбэк по вашему текущему уровню", "Начисляется после завершения сессии", "Если использовали хотя бы 1 бонус — кешбэк не начисляется"]} />
                  <InfoBlock title="Списание бонусов" items={["Можно оплатить до 50% суммы чека", "Остальное оплачивается деньгами", "Уровень зависит только от часов, не от бонусов", "Нельзя оплатить тариф только бонусами"]} />
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-sm">
                      <caption className="border-b border-white/10 px-4 py-4 text-left font-display text-xl font-bold text-white">Уровни LETS PLAY</caption>
                      <thead className="bg-white/[0.04] text-[10px] uppercase tracking-[0.16em] text-white/45">
                        <tr><th className="px-4 py-3">Уровень</th><th className="px-4 py-3">Название</th><th className="px-4 py-3">Часы за 3 мес</th><th className="px-4 py-3">Кешбэк</th><th className="px-4 py-3">Бонус на ДР</th></tr>
                      </thead>
                      <tbody>{levels.map(([name, hours, cashback, birthday], index) => <tr key={name} className="border-t border-white/10 text-white/75"><td className="px-4 py-3 font-bold text-brand">{index + 1}</td><td className="px-4 py-3 font-semibold text-white">{name}</td><td className="px-4 py-3">{hours}</td><td className="px-4 py-3 text-cyan-200">{cashback}</td><td className="px-4 py-3">{birthday}</td></tr>)}</tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <InfoBlock title="Повышение уровня" items={["Происходит автоматически при достижении порога часов", "Можно подняться на несколько уровней за период", "Новый кешбэк применяется сразу"]} />
                  <InfoBlock title="Пересчёт каждые 3 месяца" items={["1-го числа часы текущего периода обнуляются", "Не дотянули до порога — понижение на 1 уровень", "Дотянули или превысили — уровень сохраняется"]} />
                </div>

                <div className="mt-6 rounded-2xl border border-brand/25 bg-brand/[0.07] p-5">
                  <h3 className="font-display text-xl font-bold text-white">💡 Пример начисления бонусов</h3>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Example title="Гость группы Pro (15% кешбэк)" lines={["Оплата: 20 BYN деньгами", "Списано деньгами: 20 BYN", "Кешбэк 15%: +3 бонуса", "✅ Бонусы начислены после завершения сессии"]} />
                    <Example title="Гость группы Pro (15% кешбэк)" lines={["Оплата: 15 BYN + 5 бонусов", "Списано деньгами: 15 BYN", "Списано бонусами: 5 бонусов", "Кешбэк: 0 бонусов", "❌ Кешбэк не начисляется, т.к. использованы бонусы"]} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
