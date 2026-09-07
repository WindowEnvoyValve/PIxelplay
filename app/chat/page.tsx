"use client";

import { motion } from "framer-motion";
import { Chat } from "@/components/chat/Chat";
import { fadeUp } from "@/lib/animations";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-brand">Общение</p>
        <h1 className="font-display text-4xl font-black text-white md:text-5xl">
          PIXEL <span className="text-gradient-brand">CHAT</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/50">
          Общайся с игроками, находи тиммейтов и следи за новостями клуба.
        </p>
      </motion.div>

      <Chat />
    </main>
  );
}
