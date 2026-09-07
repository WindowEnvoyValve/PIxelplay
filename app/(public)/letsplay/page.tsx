"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ============================================================
// Частицы — фоновая анимация
// ============================================================
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 106, 0, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}

// ============================================================
// Данные
// ============================================================
interface LoyaltyTier {
  level: number;
  name: string;
  hoursMin: number;
  hoursMax: number | null;
  cashback: number;
  birthdayBonus: number;
  color: string;
  glow: string;
}

const TIERS: LoyaltyTier[] = [
  { level: 1, name: "Rookie", hoursMin: 30, hoursMax: 74, cashback: 5, birthdayBonus: 15, color: "#9ca3af", glow: "rgba(156,163,175,0.3)" },
  { level: 2, name: "Gamer", hoursMin: 75, hoursMax: 149, cashback: 10, birthdayBonus: 15, color: "#f97316", glow: "rgba(249,115,22,0.3)" },
  { level: 3, name: "Pro", hoursMin: 150, hoursMax: 249, cashback: 15, birthdayBonus: 15, color: "#eab308", glow: "rgba(234,179,8,0.3)" },
  { level: 4, name: "Elite", hoursMin: 250, hoursMax: 349, cashback: 20, birthdayBonus: 15, color: "#a855f7", glow: "rgba(168,85,247,0.3)" },
  { level: 5, name: "Legend", hoursMin: 350, hoursMax: null, cashback: 25, birthdayBonus: 15, color: "#f97316", glow: "rgba(255,106,0,0.5)" },
];

interface RuleItem {
  icon: string;
  title: string;
  items: string[];
}

const ACCRUAL_RULES: RuleItem = {
  icon: "📥",
  title: "Начисление бонусов",
  items: [
    "Только если чек на 100% оплачен деньгами",
    "Кешбэк по вашему текущему уровню",
    "Начисляется после завершения сессии",
    "Если использовали хотя бы 1 бонус — кешбэк не начисляется",
  ],
};

const SPEND_RULES: RuleItem = {
  icon: "📤",
  title: "Списание бонусов",
  items: [
    "Можно оплатить до 50% суммы чека",
    "Остальное оплачивается деньгами",
    "Уровень зависит только от часов, не от бонусов",
    "Нельзя оплатить тариф только бонусами",
  ],
};

const LEVEL_UP_RULES: RuleItem = {
  icon: "🚀",
  title: "Повышение уровня",
  items: [
    "Происходит автоматически при достижении порога часов",
    "Можно подняться на несколько уровней за период",
    "Новый кешбэк применяется сразу",
    "Пересчёт каждые 3 месяца, 1-го числа часы обнуляются",
    "Не дотянули — понижение на 1 уровень",
    "Дотянули или превысили — уровень сохраняется",
  ],
};

const EXAMPLES = [
  {
    tier: TIERS[2], // Pro
    description: "Гость уровня Pro (15% кешбэк)",
    paid: "20 BYN деньгами",
    spentBonuses: "0 бонусов",
    cashback: "+3 бонуса",
    note: "Кешбэк начислен после завершения сессии",
  },
  {
    tier: TIERS[2], // Pro
    description: "Гость уровня Pro (15% кешбэк)",
    paid: "15 BYN деньгами",
    spentBonuses: "Списано бонусами: 5 бонусов",
    cashback: "0 бонусов",
    note: "Кешбэк не начисляется, т.к. использованы бонусы",
  },
];

// ============================================================
// Компоненты
// ============================================================
function TierCard({ tier, index }: { tier: LoyaltyTier; index: number }) {
  const isLegend = tier.name === "Legend";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
        isLegend
          ? "border-brand/50 bg-gradient-to-br from-brand/20 via-brand/10 to-void/30 shadow-[0_0_30px_rgba(255,106,0,0.25)]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {/* Фоновое свечение */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: tier.glow }}
      />

      <div className="relative">
        {/* Номер уровня */}
        <div className="mb-2 flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white"
            style={{ backgroundColor: tier.color }}
          >
            {tier.level}
          </span>
          <h3 className="font-display text-xl font-black uppercase tracking-[0.15em] text-white">
            {tier.name}
          </h3>
        </div>

        {/* Часы */}
        <p className="mb-4 text-sm text-white/50">
          {tier.hoursMin} — {tier.hoursMax ?? "∞"} ч / 3 мес
        </p>

        {/* Кешбэк */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Кешбэк</p>
            <p className="font-display text-2xl font-black text-brand">{tier.cashback}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">На ДР</p>
            <p className="font-display text-2xl font-black text-brand">{tier.birthdayBonus}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RuleBlock({ rule }: { rule: RuleItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
        <span className="text-2xl">{rule.icon}</span>
        {rule.title}
      </h3>
      <ul className="space-y-2.5">
        {rule.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-white/60">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ExampleCard({ example, index }: { example: typeof EXAMPLES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`rounded-2xl border p-6 ${
        example.cashback.includes("0")
          ? "border-red-500/30 bg-red-500/[0.05]"
          : "border-green-500/30 bg-green-500/[0.05]"
      }`}
    >
      <p className="mb-3 text-sm font-medium text-white/70">{example.description}</p>
      <div className="space-y-1.5 text-sm text-white/50">
        <p>Оплата: <span className="text-white/80">{example.paid}</span></p>
        {example.spentBonuses !== "0 бонусов" && (
          <p>Списано бонусами: <span className="text-white/80">{example.spentBonuses}</span></p>
        )}
        <p>Кешбэк: <span className={`font-bold ${example.cashback.includes("0") ? "text-red-400" : "text-green-400"}`}>{example.cashback}</span></p>
      </div>
      <p className="mt-3 text-xs text-white/35">{example.note}</p>
    </motion.div>
  );
}

// ============================================================
// Страница
// ============================================================
export default function LetsPlayPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* Курсорное свечение */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,106,0,0.06), transparent 40%)`,
        }}
      />

      {/* Частицы */}
      <ParticleField />

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-16 text-center"
        >
          {/* Свечение за заголовком */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full bg-brand/20 blur-[100px]" />

          <div className="relative">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Программа лояльности</p>
            <h1 className="mb-4 font-display text-5xl font-black text-white md:text-7xl">
              LETS{" "}
              <span
                className="text-gradient-brand"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.2)",
                  filter: "drop-shadow(0 0 20px rgba(255,106,0,0.6))",
                }}
              >
                PLAY
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl font-medium text-white/70">
              Прокачайся и плати меньше
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/40">
              Уровневый кешбэк для наших клиентов. Играй, набирай опыт и получай до 25% возврата бонусами.
            </p>
            <div className="mx-auto mt-5 flex flex-wrap justify-center gap-4 text-xs text-white/40">
              <span>1 бонус = 1 BYN</span>
              <span className="text-brand/50">•</span>
              <span>Период расчёта: 3 месяца</span>
            </div>
          </div>
        </motion.div>

        {/* Уровни */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="mb-8 text-center font-display text-2xl font-black uppercase tracking-[0.2em] text-white">
            Уровни
          </h2>
          <div className="grid gap-4 md:grid-cols-5">
            {TIERS.map((tier, i) => (
              <TierCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Правила начисления и списания */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 grid gap-4 md:grid-cols-2"
        >
          <RuleBlock rule={ACCRUAL_RULES} />
          <RuleBlock rule={SPEND_RULES} />
        </motion.section>

        {/* Повышение уровня */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <RuleBlock rule={LEVEL_UP_RULES} />
        </motion.section>

        {/* Примеры */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="mb-8 text-center font-display text-2xl font-black uppercase tracking-[0.2em] text-white">
            Примеры начисления
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {EXAMPLES.map((ex, i) => (
              <ExampleCard key={i} example={ex} index={i} />
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent p-8 text-center"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
          <p className="relative text-lg font-bold text-white md:text-xl">
            Присоединяйся к LETS PLAY — играй с кешбэком
          </p>
          <a
            href="https://t.me/pixelplay_mogilev"
            target="_blank"
            className="relative mt-4 inline-block rounded-md border-2 border-brand bg-brand/20 px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_20px_rgba(255,106,0,0.3)] transition-all hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_0_40px_rgba(255,106,0,0.5)]"
          >
            Начать играть
          </a>
        </motion.div>
      </div>
    </main>
  );
}
