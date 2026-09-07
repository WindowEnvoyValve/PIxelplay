"use client";

import { motion } from "framer-motion";
import type { BracketRound } from "@/lib/mock-data";

export function Bracket({ rounds }: { rounds: BracketRound[] }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-10">
        {rounds.map((round, ri) => (
          <div key={round.name} className="flex flex-col justify-around gap-6">
            <h4 className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand">
              {round.name}
            </h4>
            {round.matches.map((match, mi) => (
              <motion.div
                key={mi}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ri * 0.15 + mi * 0.08 }}
                className="cyber-panel w-56 p-1.5"
              >
                {(["A", "B"] as const).map((side) => {
                  const team = side === "A" ? match.teamA : match.teamB;
                  const score = side === "A" ? match.scoreA : match.scoreB;
                  const isWinner = match.winner === side;
                  const isLoser = match.winner !== null && match.winner !== side;
                  return (
                    <div
                      key={side}
                      className={`flex items-center justify-between px-3 py-2.5 text-sm ${
                        isLoser ? "opacity-40" : ""
                      } ${isWinner ? "bg-brand/10" : ""}`}
                    >
                      <span className={`font-medium ${isWinner ? "text-brand" : "text-white/80"}`}>
                        {team.trim()}
                      </span>
                      <span className={`font-display font-bold ${isWinner ? "text-brand" : "text-white/50"}`}>
                        {score}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
