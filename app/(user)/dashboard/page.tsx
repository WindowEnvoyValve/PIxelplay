"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp } from "@/lib/animations";
import { UserPrefix } from "@/components/ui/UserPrefix";

const LOYALTY_TIERS: Record<string, { title: string; minHours: number; cashback: number; color: string }> = {
  rookie: { title: "Rookie", minHours: 30, cashback: 5, color: "#9ca3af" },
  bronze: { title: "Bronze", minHours: 75, cashback: 10, color: "#cd7f32" },
  silver: { title: "Silver", minHours: 150, cashback: 15, color: "#e5e5e5" },
  gold: { title: "Gold", minHours: 250, cashback: 20, color: "#ff9040" },
  legend: { title: "Legend", minHours: 350, cashback: 25, color: "#ff6a00" },
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/dashboard/overview");
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error("Failed to load overview:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-white/40">Загрузка...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-white/40">Ошибка загрузки данных</p>
      </div>
    );
  }

  const { profile, stats, tournaments } = data;
  const tier = LOYALTY_TIERS[profile.loyalty_level] || LOYALTY_TIERS.rookie;
  const nextTier = Object.values(LOYALTY_TIERS).find(t => t.minHours > profile.hours_3m);
  const progress = nextTier ? Math.min(((profile.hours_3m / nextTier.minHours) * 100), 100) : 100;
  const prefix = profile.user_prefixes?.prefix || "";
  const prefixColor = profile.user_prefixes?.color || "#ff6a00";

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ru-RU", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Личный кабинет</p>
        <h1 className="mt-2 font-display text-3xl font-black text-white">
          ПРИВЕТ, <span className="text-gradient-brand">
            <UserPrefix prefix={prefix} color={prefixColor}>{profile.nickname}</UserPrefix>
          </span>
        </h1>
      </motion.div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { label: "Активных броней", value: stats.activeBookings.toString(), color: "text-brand" },
          { label: "Всего бронирований", value: stats.totalBookings.toString(), color: "text-white" },
          { label: "Часов за 3 мес", value: stats.totalHours3m.toString(), color: "text-brand" },
          { label: "Турниров", value: stats.tournamentsCount.toString(), color: "text-white" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="cyber-panel p-5"
          >
            <p className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</p>
            <p className={`mt-1 font-display text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Уровень лояльности */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="cyber-panel p-6">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            Программа LETS PLAY
          </h3>

          <div className="mb-4 flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 font-display text-xl font-black"
              style={{ borderColor: tier.color, color: tier.color, background: `${tier.color}15` }}
            >
              {tier.title[0]}
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">{tier.title}</p>
              <p className="text-sm text-white/50">Кешбэк: {tier.cashback}%</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>{profile.hours_3m} ч</span>
              <span>{nextTier ? `${nextTier.minHours} ч до ${nextTier.title}` : "Максимум!"}</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Активные бронирования */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="cyber-panel p-6">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            Активные бронирования
          </h3>

          {data.activeBookings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-white/40 mb-3">У вас пока нет активных броней</p>
              <Link href="/dashboard/booking" className="cyber-button !px-5 !py-2 text-[10px]">
                Забронировать
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.activeBookings.map((booking: any) => (
                <div key={booking.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display text-sm font-bold text-white">{booking.clubs.name}</p>
                    <span className={`text-[10px] font-bold uppercase ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    ПК #{booking.computers.number} · {booking.computers.zone_type}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {formatTime(booking.start_time)}
                  </p>
                  <p className="text-sm font-bold text-brand mt-1">
                    {booking.total_price} BYN
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Турниры */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6 cyber-panel p-6">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
          Мои турниры
        </h3>

        {tournaments.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-white/40 mb-3">Вы пока не участвовали в турнирах</p>
            <Link href="/tournaments" className="cyber-button !px-5 !py-2 text-[10px]">
              Смотреть турниры
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tournaments.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="font-display text-sm font-bold text-white">{t.tournaments.title}</p>
                  <p className="text-xs text-white/50">{t.tournaments.game}</p>
                  <p className="text-xs text-white/40 mt-1">Команда: {t.team_name || "Solo"}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase ${
                  t.tournaments.status === "registration" ? "text-emerald-400" :
                  t.tournaments.status === "ongoing" ? "text-brand" : "text-white/50"
                }`}>
                  {t.tournaments.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
