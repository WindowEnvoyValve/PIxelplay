"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SHOWCASE_SKINS, DEMO_PROFILE } from "@/lib/mock-data";
import { fadeUp } from "@/lib/animations";

export function SteamShowcase() {
  const [connected, setConnected] = useState(Boolean(DEMO_PROFILE.steam_id));
  const [selectedSkin, setSelectedSkin] = useState(
    SHOWCASE_SKINS.find((s) => s.name === DEMO_PROFILE.showcase_skin)?.id ?? SHOWCASE_SKINS[0].id
  );
  const [saved, setSaved] = useState(false);

  const skin = SHOWCASE_SKINS.find((s) => s.id === selectedSkin)!;
  const steam = DEMO_PROFILE.steam_profile as { level: number; games: number; hoursTotal: number } | null;

  async function handleSave() {
    // Демо: здесь будет update profiles.showcase_skin через Supabase
    setSaved(false);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Steam-аккаунт */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="cyber-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2838] to-[#2a475e] text-2xl">
              🎮
            </div>
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Steam аккаунт</h3>
              {connected ? (
                <p className="mt-1 text-xs text-white/40">
                  ID: {DEMO_PROFILE.steam_id} · уровень {steam?.level} · {steam?.games} игр · {steam?.hoursTotal?.toLocaleString("ru")} ч
                </p>
              ) : (
                <p className="mt-1 text-xs text-white/40">Привяжи Steam для вывода инвентаря и трекинга статистики</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setConnected(!connected)}
            className={connected ? "border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 hover:border-red-500/50 hover:text-red-400" : "cyber-button !px-5 !py-2.5"}
          >
            {connected ? "Отвязать" : "Подключить Steam"}
          </button>
        </div>
      </motion.div>

      {/* Витрина-фон профиля */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="cyber-panel p-6">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Витрина профиля</h3>
          <span className="text-[10px] uppercase tracking-widest text-white/30">Фон карточки игрока</span>
        </div>
        <p className="mb-6 text-xs text-white/40">
          Выбери редкий скин из инвентаря — он станет фоном твоего профиля в зале и в турнирных сетках.
        </p>

        {/* Превью */}
        <AnimatePresence mode="wait">
          <motion.div
            key={skin.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            className={`relative mb-6 overflow-hidden bg-gradient-to-br p-8 ${skin.gradient}`}
          >
            <div className="absolute inset-0 bg-void/35" />
            <div className="absolute inset-0 cyber-grid opacity-0" />
            <div className="relative flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/60 bg-void/60 font-display text-2xl font-black text-white">
                {DEMO_PROFILE.nickname[0]}
              </div>
              <div>
                <p className="font-display text-xl font-black text-white">{DEMO_PROFILE.nickname}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">{skin.name}</p>
                <p className="text-[10px] text-white/50">{skin.exterior} · {skin.price}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Сетка скинов */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE_SKINS.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setSelectedSkin(s.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`relative overflow-hidden border p-3 text-left transition-all ${
                selectedSkin === s.id
                  ? "border-brand shadow-[0_0_20px_rgba(255,106,0,0.25)]"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className={`mb-2 h-14 bg-gradient-to-r ${s.gradient} opacity-80`} />
              <p className="truncate text-xs font-bold text-white">{s.name}</p>
              <p className="text-[10px] text-white/40">{s.exterior} · {s.price}</p>
              {selectedSkin === s.id && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] text-white">✓</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleSave} className="cyber-button">
            Сохранить витрину
          </button>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-brand">
              ✓ Витрина обновлена
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
