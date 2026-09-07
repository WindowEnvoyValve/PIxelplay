"use client";

import { motion } from "framer-motion";
import { LOYALTY_TIERS } from "@/lib/mock-data";

interface LoyaltyProgressProps {
  currentLevelId: string;
  hours3m: number;
  hoursToNext: number;
  nextLevel: string | null;
}

export function LoyaltyProgress({ currentLevelId, hours3m, hoursToNext, nextLevel }: LoyaltyProgressProps) {
  const currentIndex = LOYALTY_TIERS.findIndex((t) => t.id === currentLevelId);
  const current = LOYALTY_TIERS[currentIndex];
  const next = nextLevel ? LOYALTY_TIERS[currentIndex + 1] : null;

  // Прогресс до следующего уровня
  const progress = next
    ? Math.min(100, ((hours3m - current.minHours) / (next.minHours - current.minHours)) * 100)
    : 100;

  return (
    <div className="cyber-panel p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-white/40">Программа</h3>
          <p className="font-display text-2xl font-black text-white">LETS PLAY</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-black text-brand">{current.cashback}%</p>
          <p className="text-[10px] uppercase tracking-widest text-white/40">кешбэк</p>
        </div>
      </div>

      {/* Шкала уровней */}
      <div className="relative">
        {/* Полоса прогресса */}
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/8" />
        <motion.div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-dark via-brand to-brand-light"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />

        <div className="relative flex justify-between">
          {LOYALTY_TIERS.map((tier, i) => {
            const reached = i <= currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={tier.id} className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 260 }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-display text-[10px] font-bold ${
                    isCurrent
                      ? "border-brand bg-brand text-white shadow-[0_0_18px_rgba(255,106,0,0.6)]"
                      : reached
                        ? "border-brand/60 bg-brand/20 text-brand-light"
                        : "border-white/15 bg-void text-white/30"
                  }`}
                >
                  {i + 1}
                </motion.div>
                <div className="text-center">
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${reached ? "text-white" : "text-white/30"}`}>
                    {tier.title}
                  </p>
                  <p className="text-[9px] text-white/30">{tier.minHours}ч · {tier.cashback}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Прогресс-инфо */}
      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-4 md:flex-row md:items-center">
        <p className="text-sm text-white/60">
          Игровых часов за 3 месяца: <span className="font-display font-bold text-white">{hours3m}</span>
        </p>
        {next ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-brand-light"
          >
            До уровня <b>{next.title}</b> осталось <b>{hoursToNext} ч</b> → кешбэк {next.cashback}%
          </motion.p>
        ) : (
          <p className="text-sm text-brand">Максимальный уровень достигнут! 🏆</p>
        )}
      </div>
    </div>
  );
}
