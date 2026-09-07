"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tournament {
  id: string;
  title: string;
  game: string;
  team_size: number;
  max_teams: number;
  prize_pool: number;
  entry_fee: number;
  status: string;
}

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
  tournament: Tournament | null;
}

export function TournamentRegistrationModal({ open, onClose, tournament }: RegistrationModalProps) {
  const [step, setStep] = useState<"mode" | "team" | "success">("mode");
  const [isSolo, setIsSolo] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [playerNicknames, setPlayerNicknames] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !tournament) return null;

  const handleAddPlayer = () => {
    if (playerNicknames.length < tournament.team_size) {
      setPlayerNicknames([...playerNicknames, ""]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayerNicknames(playerNicknames.filter((_, i) => i !== index));
  };

  const handleNicknameChange = (index: number, value: string) => {
    const updated = [...playerNicknames];
    updated[index] = value;
    setPlayerNicknames(updated);
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const players = playerNicknames
        .filter(n => n.trim().length > 0)
        .map(n => ({ nickname: n.trim() }));

      if (!isSolo && players.length < tournament.team_size) {
        setError(`Нужно минимум ${tournament.team_size} игроков`);
        setSubmitting(false);
        return;
      }

      const res = await fetch(`/api/tournaments/${tournament.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_name: teamName || (isSolo ? "Solo" : undefined),
          is_solo: isSolo,
          players: players,
          nickname: players[0]?.nickname || "Solo Player",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/95 p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-brand/50 hover:text-brand"
              >
                ✕
              </button>

              <div className="mb-6 text-center">
                <h2 className="font-display text-2xl font-black text-white md:text-3xl">
                  РЕГИСТРАЦИЯ
                </h2>
                <p className="mt-2 text-sm text-white/50">{tournament.title}</p>
                <p className="mt-1 font-display text-lg font-bold text-brand">{tournament.game}</p>
              </div>

              {error && (
                <p className="mb-4 border-l-2 border-red-500 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              {step === "mode" && (
                <div className="space-y-3">
                  <p className="mb-2 text-sm text-white/50">Выберите тип участия:</p>
                  
                  <button
                    onClick={() => { setIsSolo(false); setStep("team"); setPlayerNicknames(Array(tournament.team_size).fill("")); }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-brand/40 hover:bg-brand/[0.06]"
                  >
                    <p className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">
                      Команда ({tournament.team_size} чел.)
                    </p>
                    <p className="mt-1 text-xs text-white/40">Зарегистрируйте команду с составом</p>
                  </button>

                  <button
                    onClick={() => { setIsSolo(true); setStep("team"); setPlayerNicknames([""]); }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-brand/40 hover:bg-brand/[0.06]"
                  >
                    <p className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">
                      Solo (в одиночку)
                    </p>
                    <p className="mt-1 text-xs text-white/40">Зарегистрируйтесь как свободный игрок — админ включит в команду</p>
                  </button>
                </div>
              )}

              {step === "team" && (
                <div className="space-y-4">
                  {!isSolo && (
                    <div>
                      <label className="mb-1 block text-xs text-white/50">Название команды</label>
                      <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="NaVi, Virtus.pro, Team Spirit..."
                        className="cyber-input"
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs text-white/50">
                      Никнейм{!isSolo ? ` игрока (${playerNicknames.length}/${tournament.team_size})` : " (ваш ник)"}
                    </label>
                    <div className="space-y-2">
                      {playerNicknames.map((nick, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={nick}
                            onChange={(e) => handleNicknameChange(i, e.target.value)}
                            placeholder={`Игрок ${i + 1}`}
                            className="cyber-input flex-1"
                          />
                          {!isSolo && playerNicknames.length > 1 && (
                            <button
                              onClick={() => handleRemovePlayer(i)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {!isSolo && playerNicknames.length < tournament.team_size && (
                      <button
                        onClick={handleAddPlayer}
                        className="mt-2 text-xs text-brand hover:underline"
                      >
                        + Добавить игрока
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("mode")}
                      className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/60 transition-all hover:border-brand/40 hover:text-brand"
                    >
                      ← Назад
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 cyber-button"
                    >
                      {submitting ? "РЕГИСТРАЦИЯ..." : "Зарегистрироваться"}
                    </button>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10">
                    <span className="text-2xl text-emerald-400">✓</span>
                  </div>
                  <p className="font-display text-lg font-bold text-white">Вы зарегистрированы!</p>
                  <p className="mt-2 text-sm text-white/50">
                    {isSolo
                      ? "Администратор включит вас в команду при формировании сетки"
                      : `Команда "${teamName || "Без названия"}" записана на турнир`
                    }
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 cyber-button"
                  >
                    Готово
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
