"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLUBS = [
  {
    id: "metro",
    name: "PIXEL METRO",
    address: "ул. Мигая, 13",
    phone: "+375293193015",
    telegram: "@PixelPlay_Metro",
    telegramLink: "https://t.me/PixelPlay_Metro",
    instagram: null,
  },
  {
    id: "center",
    name: "PIXEL CENTRE",
    address: "ул. Космонавтов, 2",
    phone: "+375293193015",
    telegram: "pixelplay_center",
    telegramLink: "https://t.me/pixelplay_center",
    instagram: null,
  },
  {
    id: "play",
    name: "PIXEL PLAY",
    address: "ул. Мовчанского, 53Б",
    phone: "+375293193015",
    telegram: "@PixelPlayBy",
    telegramLink: "https://t.me/pixelplay_mogilev",
    instagram: "https://www.instagram.com/pixelplay_mogilev",
  },
];

const MIN_HOURS = 3;

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const club = CLUBS.find((c) => c.id === selectedClub);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/95 p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
              {/* Кнопка закрытия */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-brand/50 hover:text-brand"
              >
                ✕
              </button>

              {/* Шапка */}
              <div className="mb-6 text-center">
                <p className="mb-1 text-xs uppercase tracking-[0.4em] text-brand">Бронирование</p>
                <h2 className="font-display text-2xl font-black text-white md:text-3xl">
                  ЗАБРОНИРОВАТЬ МЕСТО
                </h2>
                <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
                <p className="mt-3 text-sm text-white/40">
                  Минимальное время бронирования: <span className="text-brand font-bold">{MIN_HOURS} ч</span>
                </p>
              </div>

              {!club ? (
                /* Выбор клуба */
                <div className="space-y-3">
                  <p className="mb-2 text-sm text-white/50">Выберите клуб:</p>
                  {CLUBS.map((c) => (
                    <motion.button
                      key={c.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedClub(c.id)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-brand/40 hover:bg-brand/[0.06]"
                    >
                      <p className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">
                        {c.name}
                      </p>
                      <p className="mt-1 text-xs text-white/40">{c.address}</p>
                    </motion.button>
                  ))}
                </div>
              ) : (
                /* Контакты клуба */
                <div>
                  <div className="mb-6 rounded-xl border border-brand/20 bg-brand/[0.06] p-4">
                    <p className="font-display text-sm font-bold uppercase tracking-[0.15em] text-brand">
                      {club.name}
                    </p>
                    <p className="mt-1 text-xs text-white/40">{club.address}</p>
                  </div>

                  <p className="mb-3 text-sm text-white/50">Свяжитесь с нами:</p>
                  <div className="space-y-2.5">
                    {/* Телефон */}
                    <a
                      href={`tel:${club.phone.replace(/\D/g, "")}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-brand/40 hover:bg-brand/[0.06]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">Позвонить</p>
                        <p className="text-xs text-white/40">{club.phone}</p>
                      </div>
                    </a>

                    {/* Telegram */}
                    <a
                      href={club.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[#229ED9]/40 hover:bg-[#229ED9]/[0.06]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#229ED9]/30 bg-[#229ED9]/10 text-[#229ED9] transition-colors group-hover:bg-[#229ED9] group-hover:text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.04 15.51l-.38 5.32c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.66.25 1.92-.89L23.9 3.83c.31-1.42-.51-1.98-1.45-1.63L2.4 9.87c-1.39.54-1.37 1.31-.24 1.66l4.69 1.46L18.5 6.02c.51-.34.98-.15.6.19L9.04 15.51z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">Telegram</p>
                        <p className="text-xs text-white/40">{club.telegram}</p>
                      </div>
                    </a>

                    {/* Instagram */}
                    {club.instagram && (
                      <a
                        href={club.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[#E1306C]/40 hover:bg-[#E1306C]/[0.06]"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E1306C]/30 bg-[#E1306C]/10 text-[#E1306C] transition-colors group-hover:bg-gradient-to-br group-hover:from-[#feda75] group-hover:via-[#E1306C] group-hover:to-[#515bd4] group-hover:text-white">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">Instagram</p>
                          <p className="text-xs text-white/40">@pixelplay_mogilev</p>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Кнопка «Назад» */}
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-white/60 transition-all hover:border-brand/40 hover:text-brand"
                  >
                    ← Выбрать другой клуб
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
