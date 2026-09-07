"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

type Row = {
  label: string;
  note?: string;
  prices: Record<string, string>;
  dayPrices?: Record<string, string>;
};

const TARIFFS = ["STANDART", "STANDART+", "VIP/TRIO", "DUO", "PS5"];

const ROWS: Row[] = [
  { label: "1 час", prices: { STANDART: "5", "STANDART+": "6", "VIP/TRIO": "7", DUO: "8", PS5: "10" } },
  {
    label: "3 часа",
    prices: { STANDART: "13", "STANDART+": "15", "VIP/TRIO": "18", DUO: "25", PS5: "25" },
    dayPrices: { STANDART: "10", "STANDART+": "13", "VIP/TRIO": "15", DUO: "20" },
  },
  {
    label: "5 часов",
    note: "не сгорает 7 дней",
    prices: { STANDART: "18", "STANDART+": "25", "VIP/TRIO": "30", DUO: "35", PS5: "35" },
    dayPrices: { STANDART: "15", "STANDART+": "20", "VIP/TRIO": "25", DUO: "30" },
  },
  {
    label: "10 часов",
    note: "не сгорает 14 дней",
    prices: { STANDART: "30", "STANDART+": "35", "VIP/TRIO": "40", DUO: "45" },
  },
  {
    label: "Утречко",
    note: "6:00-10:00",
    prices: { STANDART: "10", "STANDART+": "15", "VIP/TRIO": "20", DUO: "25" },
  },
  {
    label: "День / Ночь",
    note: "10:00–21:00 / 23:00–8:00",
    prices: { STANDART: "17", "STANDART+": "25", "VIP/TRIO": "30", DUO: "45" },
  },
  {
    label: "Ночь+",
    note: "20:00–8:00",
    prices: { STANDART: "20", "STANDART+": "30", "VIP/TRIO": "35", DUO: "50" },
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {/* Заголовок */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Тарифы</p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Наши <span className="text-gradient-brand">Цены</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Единый прайс для всех клубов PIXEL. Цены указаны в BYN.
          </p>
        </motion.div>

        {/* Таблица тарифов */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="relative -mt-16 overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-6"
        >
          {/* Декоративное свечение */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-center">
              <thead>
                <tr>
                  <th className="border-b border-white/10 px-3 py-4 text-left text-xs uppercase tracking-[0.2em] text-white/40">
                    Время
                  </th>
                  {TARIFFS.map((t) => (
                    <th
                      key={t}
                      className="border-b border-white/10 px-3 py-4 font-display text-sm font-bold uppercase tracking-wider text-white"
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`transition-colors hover:bg-brand/[0.06] ${
                      i % 2 === 0 ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    <td className="border-b border-white/5 px-3 py-4 text-left">
                      <p className="font-semibold text-white">{row.label}</p>
                      {row.note && (
                        <p className="mt-0.5 text-xs text-white/40">{row.note}</p>
                      )}
                    </td>
                    {TARIFFS.map((t) => (
                      <td
                        key={t}
                        className="border-b border-white/5 px-3 py-4"
                      >
                        {row.prices[t] ? (
                          <span className="relative inline-block">
                            {/* Дневная цена — бейдж над основной */}
                            {row.dayPrices?.[t] && (
                              <span
                                title={`Дневной тариф (8:00–15:00): ${row.dayPrices[t]} р`}
                                className="absolute -top-2.5 left-1/2 ml-2 rounded bg-blue-600 px-1.5 py-0.5 font-display text-[11px] font-bold leading-none text-white shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                              >
                                {row.dayPrices[t]}
                              </span>
                            )}
                            <span
                              className={`inline-block rounded-md border px-3 py-1 font-display text-lg font-bold ${
                                t === "PS5"
                                  ? "border-brand bg-brand text-white shadow-[0_0_12px_rgba(255,106,0,0.35)]"
                                  : "border-brand/40 bg-brand/15 text-white"
                              }`}
                            >
                              {row.prices[t]}
                              <span className="ml-1 text-xs font-normal opacity-60">BYN</span>
                            </span>
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Примечания */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="mt-6 grid gap-3 text-sm text-white/50 md:grid-cols-2"
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <span className="text-brand">Дневной тариф:</span> с 8:00 до 15:00{" "}
            <span className="text-white/40">(остаток времени сгорает)</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            Несгораемые пакеты действуют только при наличии{" "}
            <span className="text-white/80">личного кабинета</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
