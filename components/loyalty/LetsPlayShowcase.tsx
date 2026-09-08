"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

type Variant = "A" | "B" | "C";

const variants: Array<{ id: Variant; label: string; name: string }> = [
  { id: "A", label: "Variant A", name: "Pulse Lift" },
  { id: "B", label: "Variant B", name: "Signal Type" },
  { id: "C", label: "Variant C", name: "Orbit Letters" },
];

const triggerStyles: Record<Variant, string> = {
  A: "text-white hover:text-brand hover:[text-shadow:0_0_14px_rgba(255,106,0,0.9)]",
  B: "text-cyan-200 [text-shadow:0_0_8px_rgba(70,220,255,0.7),0_0_18px_rgba(70,220,255,0.35)] hover:text-white hover:[text-shadow:0_0_14px_rgba(70,220,255,1),0_0_28px_rgba(70,220,255,0.7)]",
  C: "text-amber-100 hover:text-amber-300 hover:[text-shadow:0_0_14px_rgba(255,145,40,0.9)]",
};

const panelStyles: Record<Variant, string> = {
  A: "border-brand/60 bg-[#17110d] shadow-[0_0_80px_rgba(255,106,0,0.22),inset_0_1px_0_rgba(255,255,255,0.18)]",
  B: "border-cyan-200/50 bg-slate-950/75 shadow-[0_0_100px_rgba(60,210,255,0.2),inset_0_0_45px_rgba(155,90,255,0.12)]",
  C: "border-amber-300/60 bg-[#17110d] shadow-[0_12px_0_#512500,0_0_90px_rgba(255,137,35,0.22)]",
};

export function LetsPlayShowcase({ onOpen }: { onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>("B");
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

  const current = variants.find((item) => item.id === variant) ?? variants[0];

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className={`lets-play-float lets-play-float-${variant} group relative flex w-full items-center justify-center whitespace-nowrap px-3 py-1.5 font-sans text-[17px] font-extrabold uppercase tracking-[0.12em] transition-all duration-300 sm:w-auto sm:px-4 sm:text-xl sm:tracking-[0.2em] ${triggerStyles[variant]}`}
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
                className={`lets-play-letter lets-play-letter-${variant} inline-block`}
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
              className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border p-5 sm:p-8 ${panelStyles[variant]}`}
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
                <h2 id="lets-play-title" className="mt-3 font-display text-3xl font-black text-white sm:text-5xl">LETS PLAY</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">Информация о программе LETS PLAY скоро появится.</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {variants.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVariant(item.id)}
                      aria-pressed={variant === item.id}
                      className={`rounded-xl border px-3 py-4 text-left transition-all ${variant === item.id ? "border-white bg-white/10" : "border-white/10 bg-black/10 hover:border-white/35"}`}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand">{item.label}</span>
                      <span className="mt-1 block text-sm font-bold text-white">{item.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">Выбранная концепция</p>
                  <p className="mt-2 font-display text-xl font-bold text-white">{current.name}</p>
                  <p className="mt-2 text-sm text-white/50">Все три варианта доступны для сравнения. Выберите лучший после просмотра.</p>
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
