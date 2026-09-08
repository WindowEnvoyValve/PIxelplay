"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CLUBS } from "@/lib/site-data";
import { fadeUp, staggerItem } from "@/lib/animations";

const CLUB_IMAGES: Record<string, string> = {
  play: "/club-play.jpg",
  centre: "/club-center.jpg",
  metro: "/club-metro.jpg",
};

const HALL_IMAGES: Record<string, string> = {
  play: "/hall-play.jpg",
  centre: "/hall-center.jpg",
  metro: "/hall-metro.jpg",
};

/** Цена за час по зонам (по официальному прайсу, 1 час) */
const ZONE_PRICE_MAP: Record<string, number> = {
  STANDART: 5,
  "STANDART+": 6,
  "VIP[1]": 7,
  "VIP[2]": 7,
  VIP: 7,
  TRIO: 7,
  DUO: 8,
  MID: 5,
  SPACE: 6,
};

export default function ClubsPage() {
  const [activeSlug, setActiveSlug] = useState(CLUBS[0].slug);
  const [activeZone, setActiveZone] = useState<string>("STANDART");
  const active = CLUBS.find((c) => c.slug === activeSlug)!;

  const activeZoneData = active.zones.find((z) => z.name === activeZone) ?? active.zones[0];
  const zonePrice = activeZoneData.pricePerHour;
  const samplePc = activeZoneData.specs;
  const zonePcCount = activeZoneData.pcCount;

  return (
    <main className="relative overflow-hidden">
      {/* Видео-фон */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 -z-10 h-full w-full object-cover opacity-70"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-void/30 via-void/25 to-void" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      {/* Заголовок */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Локации</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          ТРИ КЛУБА <span className="text-gradient-brand">PIXEL</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/50">
          Выбери клуб, посмотри схему зала в реальном времени и займи своё место.
        </p>
      </motion.div>

      {/* Выбор клуба */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10 grid gap-4 md:grid-cols-3">
        {CLUBS.map((club, i) => {
          const isActive = club.slug === activeSlug;
          return (
            <motion.button
              key={club.slug}
              onClick={() => setActiveSlug(club.slug)}
              variants={staggerItem}
              custom={i}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`cyber-panel p-5 text-left transition-all ${
                isActive ? "!border-brand shadow-[0_0_24px_rgba(255,106,0,0.2)]" : ""
              }`}
            >
              {/* Фото клуба */}
              <div className="mb-4 overflow-hidden rounded-lg border border-white/10 group">
                <img
                  src={CLUB_IMAGES[club.slug]}
                  alt={club.name}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{club.name}</h3>
                  <p className="mt-1 text-sm text-white/45">{club.address}</p>
                  <p className="mt-0.5 text-xs text-white/30">{club.hours}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isActive && (
                    <motion.span layoutId="club-active" className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(255,106,0,0.8)]" />
                  )}
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-emerald-400" />
                    Открыто
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-white/40">{club.zones.reduce((sum, z) => sum + z.pcCount, 0)} ПК в зале</span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Особенности клуба */}
      <motion.div
        key={active.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        {active.features.map((f) => (
          <span key={f} className="border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs text-brand-light">
            {f}
          </span>
        ))}
        <span className="border border-white/10 px-3 py-1.5 text-xs text-white/50">☎ {active.phone}</span>
      </motion.div>

      {/* Зоны клуба */}
      <motion.div
        key={active.slug + "-zones"}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        {/* Кнопки зон */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {active.zones.map((zone) => (
            <button
              key={zone.name}
              onClick={() => setActiveZone(zone.name)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                activeZone === zone.name
                  ? "bg-brand text-white shadow-[0_0_16px_rgba(255,106,0,0.4)]"
                  : "border border-white/10 text-white/50 hover:border-brand/50 hover:text-white"
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* Информация о зоне и ПК */}
        {samplePc && (
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="cyber-panel p-6"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* Иконка зоны */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border-2 border-brand bg-brand/10">
                  <span className="text-[10px] uppercase tracking-widest text-white/50">{zonePrice} руб</span>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">Зона {activeZone}</p>
                </div>
              </div>

              {/* Девайсы */}
              <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1.5 text-sm md:grid-cols-3">
                <SpecRow label="Видеокарта" value={samplePc.gpu} />
                <SpecRow label="Процессор" value={samplePc.cpu} />
                <SpecRow label="Монитор" value={`${samplePc.monitor} · ${samplePc.refresh}Hz`} />
                <SpecRow label="Кресло" value={samplePc.chair} />
                <SpecRow label="Мышь" value={samplePc.mouse} />
                <SpecRow label="Клавиатура" value={samplePc.keyboard} />
              </div>

              {/* Цена */}
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-brand">{zonePrice} руб</p>
                <p className="text-xs text-white/40">за час · {zonePcCount} ПК</p>
                <a
                  href="https://t.me/pixelplay_mogilev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button mt-3 !px-5 !py-2 text-[10px]"
                >
                  Забронировать
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Карточки зон */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {active.zones.slice(0, 3).map((zone, i) => (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="cyber-panel p-5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold tracking-widest text-white">{zone.name}</h4>
                <p className="font-display text-xl font-bold text-brand">{ZONE_PRICE_MAP[zone.name] ?? zone.pricePerHour} руб<span className="text-xs text-white/40">/час</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Схема зала */}
      <motion.div
        key={active.slug + "-map"}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-12 max-w-5xl"
      >
        <h2 className="mb-6 font-display text-xl font-bold tracking-widest text-white">
          СХЕМА ЗАЛА — {active.name.toUpperCase()}
        </h2>

        {/* Изображение схемы зала */}
        <div className="cyber-panel overflow-hidden">
          <img
            src={HALL_IMAGES[active.slug]}
            alt={`Схема зала ${active.name}`}
            className="w-full object-contain"
          />
        </div>
      </motion.div>
      </div>
    </main>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
      <p className="text-white/80">{value}</p>
    </div>
  );
}
