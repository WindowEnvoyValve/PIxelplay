"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function HistoryPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/dashboard/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error("Failed to load bookings:", e);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ru-RU", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Ожидание",
      confirmed: "Подтверждено",
      active: "Идёт",
      completed: "Завершено",
      cancelled: "Отменено",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-amber-400",
      confirmed: "text-blue-400",
      active: "text-green-400",
      completed: "text-white/50",
      cancelled: "text-red-400",
    };
    return colors[status] || "text-white/50";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-white/40">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Архив</p>
        <h1 className="mt-2 font-display text-3xl font-black text-white">
          ИСТОРИЯ <span className="text-gradient-brand">БРОНИРОВАНИЙ</span>
        </h1>
      </motion.div>

      {bookings.length === 0 ? (
        <div className="cyber-panel p-12 text-center">
          <p className="text-lg text-white/40 mb-2">История пуста</p>
          <p className="text-sm text-white/30">Вы ещё не бронировали места</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="cyber-panel p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-display text-base font-bold text-white">
                      {booking.clubs.name}
                    </p>
                    <span className={`text-[10px] font-bold uppercase ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30">ПК</span>
                      <p className="text-white/70">#{booking.computers.number} · {booking.computers.zone_type}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30">Адрес</span>
                      <p className="text-white/70">{booking.clubs.address}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30">Начало</span>
                      <p className="text-white/70">{formatTime(booking.start_time)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30">Оплата</span>
                      <p className="font-display font-bold text-brand">{booking.total_price} BYN</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
