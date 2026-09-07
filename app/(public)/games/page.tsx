"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const GAMES = [
  "Counter-Strike 2",
  "Dota 2",
  "League of Legends",
  "Valorant",
  "Fortnite",
  "Apex Legends",
  "PUBG",
  "GTA V",
  "Rocket League",
  "Overwatch 2",
  "Rainbow Six Siege",
  "Call of Duty: Warzone",
  "Minecraft",
  "FIFA 24",
  "NBA 2K24",
  "Among Us",
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Список <span className="text-brand">Игр</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            В наших клубах доступен широкий выбор популярных игр и аккаунтов к ним. Все игры обновляются и оптимизированы для максимальной производительности.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GAMES.map((game, i) => (
            <motion.div
              key={game}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center transition-all hover:border-brand/40 hover:bg-white/[0.05]"
            >
              <p className="text-white">{game}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
