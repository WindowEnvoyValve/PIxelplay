"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, cardHover } from "@/lib/animations";

interface ZoneSpec {
  zone: string;
  price: number;
  desc: string;
  specs: { label: string; value: string }[];
}

interface ClubSpec {
  club: string;
  zones: ZoneSpec[];
}

const CLUBS: ClubSpec[] = [
  {
    club: "Pixel Play",
    zones: [
      {
        zone: "STANDART",
        price: 5,
        desc: "Универсальный вариант на каждый день: комфортно, удобно, всё работает как надо. Самый популярный формат, когда нужен стабильный игровой опыт без сюрпризов.",
        specs: [
          { label: "CPU", value: "Intel Core i5-10400F" },
          { label: "GPU", value: "GeForce 1660 SUPER" },
          { label: "RAM", value: "16 GB" },
          { label: "Монитор", value: '24" 144 Hz' },
        ],
      },
      {
        zone: "STANDART+",
        price: 6,
        desc: "Улучшенная версия стандарта: больше комфорта и приятнее ощущения от посадки и игры. Берут те, кто любит «чуть лучше», но без перехода в VIP.",
        specs: [
          { label: "CPU", value: "Intel Core i5-12400F" },
          { label: "GPU", value: "GeForce RTX 4060" },
          { label: "RAM", value: "32 GB" },
          { label: "Монитор", value: '27" 165 Hz' },
        ],
      },
      {
        zone: "VIP",
        price: 7,
        desc: "Максимум удобства и атмосферы для тех, кто ценит приватность и высокий уровень комфорта. Подходит для долгих сессий, важных каток, дней рождения и «сделайте красиво».",
        specs: [
          { label: "CPU", value: "Intel Core i5-12400F" },
          { label: "GPU", value: "GeForce RTX 4070" },
          { label: "RAM", value: "32 GB" },
          { label: "Монитор", value: '27" 240 Hz' },
        ],
      },
      {
        zone: "DUO",
        price: 8,
        desc: "Зал для двоих: играете рядом, общаетесь, собираете командные связки и кайфуете вместе. Лучший выбор для пары, друзей или постоянного тиммейта.",
        specs: [
          { label: "CPU", value: "AMD Ryzen 5 9600X" },
          { label: "GPU", value: "GeForce RTX 5070" },
          { label: "RAM", value: "64 GB" },
          { label: "Монитор", value: '27" 300 Hz' },
        ],
      },
    ],
  },
  {
    club: "Pixel Centre",
    zones: [
      {
        zone: "STANDART",
        price: 5,
        desc: "Универсальный вариант на каждый день: комфортно, удобно, всё работает как надо. Самый популярный формат, когда нужен стабильный игровой опыт без сюрпризов.",
        specs: [
          { label: "CPU", value: "Intel Core i5-10400F" },
          { label: "GPU", value: "GeForce 1660 SUPER" },
          { label: "RAM", value: "16 GB" },
          { label: "Монитор", value: '24" 144 Hz' },
        ],
      },
      {
        zone: "STANDART+",
        price: 6,
        desc: "Улучшенная версия стандарта: больше комфорта и приятнее ощущения от посадки и игры. Берут те, кто любит «чуть лучше», но без перехода в VIP.",
        specs: [
          { label: "CPU", value: "Intel Core i5-12400F" },
          { label: "GPU", value: "GeForce RTX 4060" },
          { label: "RAM", value: "32 GB" },
          { label: "Монитор", value: '27" 165 Hz' },
        ],
      },
      {
        zone: "VIP",
        price: 7,
        desc: "Максимум удобства и атмосферы для тех, кто ценит приватность и высокий уровень комфорта. Подходит для долгих сессий, важных каток, дней рождения и «сделайте красиво».",
        specs: [
          { label: "CPU", value: "Intel Core i5-12400F" },
          { label: "GPU", value: "GeForce RTX 4070" },
          { label: "RAM", value: "32 GB" },
          { label: "Монитор", value: '27" 240 Hz' },
        ],
      },
    ],
  },
  {
    club: "Pixel Metro",
    zones: [
      {
        zone: "MID",
        price: 5,
        desc: "Универсальный вариант на каждый день: комфортно, удобно, всё работает как надо. Самый популярный формат, когда нужен стабильный игровой опыт без сюрпризов.",
        specs: [
          { label: "CPU", value: "Intel Core i5-10400F" },
          { label: "GPU", value: "GeForce 4060" },
          { label: "RAM", value: "16 GB" },
          { label: "Монитор", value: '27" 165 Hz' },
        ],
      },
      {
        zone: "SPACE",
        price: 6,
        desc: "Улучшенная версия стандарта: больше комфорта и приятнее ощущения от посадки и игры. Берут те, кто любит «чуть лучше», но без перехода в VIP.",
        specs: [
          { label: "CPU", value: "Intel Core i5-12400F" },
          { label: "GPU", value: "GeForce RTX 4060" },
          { label: "RAM", value: "16 GB" },
          { label: "Монитор", value: '27" 240 Hz' },
        ],
      },
      {
        zone: "TRIO/VIP",
        price: 7,
        desc: "VIP-формат — это максимум свободы и комфорта для вас и ваших близких. Никаких лишних глаз, только ваша команда, живое общение и полное погружение в игру. Идеально подходит для пары, проверенных тиммейтов или шумной компании друзей, которые ценят качественный отдых.",
        specs: [
          { label: "CPU", value: "AMD Ryzen 5 7500F" },
          { label: "GPU", value: "GeForce RTX 5060" },
          { label: "RAM", value: "16 GB DDR5" },
          { label: "Монитор", value: '24,5" 320 Hz' },
        ],
      },
      {
        zone: "DUO",
        price: 8,
        desc: "Зал для двоих: играете рядом, общаетесь, собираете командные связки и кайфуете вместе. Лучший выбор для пары, друзей или постоянного тиммейта.",
        specs: [
          { label: "CPU", value: "AMD Ryzen 5 7500F" },
          { label: "GPU", value: "GeForce RTX 5070 12GB" },
          { label: "RAM", value: "32 GB DDR5" },
          { label: "Монитор", value: '24,5" 320 Hz' },
        ],
      },
    ],
  },
];

function ZoneCard({ zone }: { zone: ZoneSpec }) {
  return (
    <motion.div
      variants={staggerItem}
      {...cardHover}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm"
    >
      {/* Свечение по углу */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />

      {/* Шапка карточки: название зоны + цена */}
      <div className="relative flex items-center justify-between gap-3">
        <h4 className="font-display text-lg font-bold uppercase tracking-[0.15em] text-white">
          {zone.zone}
        </h4>
        <span className="shrink-0 rounded-md border border-brand/40 bg-brand/15 px-2.5 py-1 font-display text-sm font-bold text-white">
          {zone.price} <span className="text-[10px] font-normal opacity-70">руб/час</span>
        </span>
      </div>

      {/* Описание */}
      <p className="relative mt-3 text-sm leading-relaxed text-white/55">{zone.desc}</p>

      {/* Характеристики */}
      <div className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4">
        {zone.specs.map((s) => (
          <div key={s.label}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{s.label}</p>
            <p className="mt-0.5 text-sm font-medium text-white/85">{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SpecsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      {/* Заголовок */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-14 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Спецификации</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ЖЕЛЕЗО ПО <span className="text-gradient-brand">КЛУБАМ</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/50">
          Характеристики залов каждого клуба сети PIXEL — выбери формат под свой стиль игры.
        </p>
      </motion.div>

      {/* Клубы */}
      <div className="space-y-16">
        {CLUBS.map((club) => (
          <motion.section
            key={club.club}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Шапка клуба */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/40 to-brand/40" />
              <h2 className="font-display text-2xl font-black uppercase tracking-[0.2em] text-white md:text-3xl">
                {club.club}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-brand/40 to-brand/40" />
            </div>

            {/* Залы клуба */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {club.zones.map((zone) => (
                <ZoneCard key={club.club + zone.zone} zone={zone} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </main>
  );
}
