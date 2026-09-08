"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, cardHover } from "@/lib/animations";
import { CLUBS, SITE_STATS, clubStatusLabel, getLowestClubPrice, totalNetworkPcCount, totalPcCount } from "@/lib/site-data";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Видео-фон */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="fixed inset-0 -z-10 h-full w-full object-cover opacity-70"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-void/30 via-void/25 to-void" aria-hidden />

      {/* Hero */}
      <motion.section
        className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-28 pt-12 text-center md:pt-24"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={staggerItem} className="mb-6 text-xs uppercase tracking-[0.4em] text-brand">
          Сеть компьютерных клубов PIXEL
        </motion.p>

        <motion.h1
          variants={staggerItem}
          className="font-display text-5xl font-black leading-tight text-white md:text-7xl"
        >
          ИГРАЙ НА
          <br />
          <span className="text-gradient-brand" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', filter: 'drop-shadow(0 0 12px rgba(255,106,0,0.6))' }}>
            МАКСИМУМЕ
          </span>
        </motion.h1>

        <motion.p variants={staggerItem} className="mt-8 max-w-xl text-white/60">
          Атмосферные киберпространства в Могилеве. RTX 40/50, мониторы до 540Hz,
          программа лояльности LETS PLAY с кешбэком до 25% и живые турниры.
        </motion.p>

        {/* Карточки клубов */}
        <motion.div variants={staggerItem} className="mx-auto w-full max-w-5xl grid gap-4 md:grid-cols-3">
          {CLUBS.map((club, i) => (
            <motion.div key={club.slug} className="cyber-panel flex flex-col p-5 text-left" {...cardHover} custom={i}>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
                  {club.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-emerald-400" />
                  {clubStatusLabel(club.status)}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/35">{club.address}</p>
              <p className="mt-3 font-display text-2xl font-bold text-brand">
                от {getLowestClubPrice(club)} <span className="text-sm font-medium text-white/50">BYN/час</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/60">
                  {totalPcCount(club)} ПК
                </span>
                {club.features.map((f) => (
                  <span key={f} className="border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/60">
                    {f}
                  </span>
                ))}
              </div>
              <Link
                href="/clubs"
                className="mt-4 inline-block border-t border-white/5 pt-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand transition-colors hover:text-brand-light"
              >
                Подробнее о клубе →
              </Link>
              <a
                href={club.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-brand"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" className="text-red-500" />
                  <circle cx="12" cy="10" r="3" className="text-red-500" fill="currentColor" />
                </svg>
                Проложить маршрут
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Кнопки */}
        <motion.div variants={staggerItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://t.me/pixelplay_mogilev"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-button"
          >
            Начать играть
          </a>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/clubs"
              className="inline-block rounded-md border-2 border-brand bg-brand/15 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_16px_rgba(255,106,0,0.25)] transition-all hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.5)]"
            >
              Выбрать клуб
            </Link>
          </motion.div>
        </motion.div>

        {/* Кнопка Правила — под основными кнопками */}
        <motion.div variants={fadeUp} className="mt-4 flex justify-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/rules"
              className="inline-block rounded-md border border-white/15 bg-white/[0.03] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-all hover:border-brand/40 hover:text-white"
            >
              Правила
            </Link>
          </motion.div>
        </motion.div>

        {/* Полоса преимуществ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-10 max-w-5xl grid grid-cols-4 gap-4"
        >
          {[
            { value: `${totalNetworkPcCount(CLUBS)}+`, label: "игровых ПК" },
            { value: `${Math.max(...CLUBS.flatMap((club) => club.zones.map((zone) => zone.specs.refreshRate)))}Hz`, label: "мониторы в VIP" },
            { value: SITE_STATS.cashbackLegend, label: "кешбэк Legend" },
            { value: SITE_STATS.networkHours, label: "ОТКРЫТЫ" },
          ].map((stat) => (
            <div key={stat.label} className="border-l-2 border-brand/40 py-2 pl-4 text-left">
              <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>
    </main>
  );
}