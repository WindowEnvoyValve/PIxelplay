"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bracket } from "@/components/tournaments/Bracket";
import { TournamentRegistrationModal } from "@/components/tournaments/TournamentRegistrationModal";
import { fadeUp, cardHover } from "@/lib/animations";

const STATUS_BADGE = {
  registration: { label: "Регистрация открыта", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  ongoing: { label: "Идёт сейчас", cls: "bg-brand/15 text-brand border-brand/40" },
  finished: { label: "Завершён", cls: "bg-white/10 text-white/50 border-white/15" },
  draft: { label: "Черновик", cls: "bg-white/10 text-white/30 border-white/10" },
  cancelled: { label: "Отменён", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
} as const;

interface Tournament {
  id: string;
  title: string;
  game: string;
  discipline?: string;
  description?: string;
  prize_pool: number;
  entry_fee: number;
  max_teams: number;
  team_size: number;
  starts_at: string;
  status: string;
  clubs?: { name: string };
  participants?: any[];
}

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<"bracket" | "stream">("bracket");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [regModalOpen, setRegModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/tournaments")
      .then(res => res.json())
      .then(data => {
        setTournaments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRegister = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setRegModalOpen(true);
  };

  const registeredCount = (t: Tournament) => t.participants?.length || 0;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-14">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Турниры</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          БИТВЫ <span className="text-gradient-brand">КАЖДЫЕ ВЫХОДНЫЕ</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/50">
          CS2, Dota 2, Valorant и другие дисциплины. Призовые фонды, живые трансляции
          и турнирная атмосфера на наших сценах.
        </p>
      </motion.div>

      {/* Карточки турниров */}
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="cyber-panel h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {tournaments.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              {...cardHover}
              className="cyber-panel overflow-hidden"
            >
              {/* Обложка */}
              <div className={`relative flex h-36 items-end bg-gradient-to-br from-brand/30 via-void to-void p-5`}>
                <div className="absolute inset-0 cyber-grid opacity-0" />
                <div className="relative">
                  <span className="bg-void/70 px-2 py-1 font-display text-xs font-bold uppercase tracking-widest text-brand">
                    {t.game}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">{t.title}</h3>
                </div>
              </div>

              <div className="p-5">
                <span className={`inline-block border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_BADGE[t.status as keyof typeof STATUS_BADGE]?.cls || STATUS_BADGE.draft.cls}`}>
                  {STATUS_BADGE[t.status as keyof typeof STATUS_BADGE]?.label || STATUS_BADGE.draft.label}
                </span>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-white/30">Призовой</dt>
                    <dd className="font-display font-bold text-brand">{t.prize_pool} BYN</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-white/30">Взнос</dt>
                    <dd className="font-semibold text-white/80">{t.entry_fee > 0 ? t.entry_fee + " BYN" : "Бесплатно"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-white/30">Дата</dt>
                    <dd className="text-white/80">{new Date(t.starts_at).toLocaleDateString("ru-RU")}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-white/30">Участники</dt>
                    <dd className="text-white/80">{registeredCount(t)} / {t.max_teams}</dd>
                  </div>
                </dl>

                {t.clubs && (
                  <p className="mt-2 text-xs text-white/30">📍 {t.clubs.name}</p>
                )}

                <button
                  className={`mt-5 w-full ${t.status === "registration" ? "cyber-button" : "cyber-button !opacity-50"}`}
                  disabled={t.status !== "registration"}
                  onClick={() => handleRegister(t)}
                >
                  {t.status === "registration" ? "Записаться" : "Регистрация закрыта"}
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {/* Сетка + стрим */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-20">
        <h2 className="mb-8 font-display text-2xl font-black text-white">
          АКТИВНЫЙ ТУРНИР
        </h2>

        {/* Переключатель */}
        <div className="mb-8 flex gap-2">
          {(["bracket", "stream"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                activeTab === tab
                  ? "bg-brand text-white shadow-[0_0_16px_rgba(255,106,0,0.4)]"
                  : "border border-white/10 text-white/50 hover:border-brand/50 hover:text-white"
              }`}
            >
              {tab === "bracket" ? "Сетка плей-офф" : "Трансляция"}
            </button>
          ))}
        </div>

        {activeTab === "bracket" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-panel p-8">
            <Bracket rounds={[]} />
            <p className="mt-4 text-center text-sm text-white/40">Сетка появится после начала турнира</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-panel relative overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand/20 via-void to-void">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand shadow-[0_0_30px_rgba(255,106,0,0.4)]">
                  <span className="ml-1 text-2xl text-brand">▶</span>
                </div>
                <p className="font-display font-bold text-white">ТРАНСЛЯЦИЯ НАЧНЁТСЯ В 18:00</p>
                <p className="mt-2 text-sm text-white/40">twitch.tv/pixel_cyberclub</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
              <span className="flex items-center gap-2 text-xs text-red-500">
                <span className="h-2 w-2 animate-glow-pulse rounded-full bg-red-500" />
                LIVE — 1 248 зрителей
              </span>
              <a href="https://twitch.tv" target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline">
                Смотреть на Twitch →
              </a>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Модальное окно регистрации */}
      <TournamentRegistrationModal
        open={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        tournament={selectedTournament}
      />
    </main>
  );
}
