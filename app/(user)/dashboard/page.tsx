"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
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
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || authLoading) return;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setProfile({
            nickname: user.email?.split("@")[0] || "Player",
            email: user.email || "",
            role: "user",
            loyalty_level: "rookie",
            hours_3m: 0,
            total_hours: 0,
            balance: 0,
            bonus_balance: 0,
          });
        }
      } catch {
        setProfile({
          nickname: user.email?.split("@")[0] || "Player",
          email: user.email || "",
          role: "user",
          loyalty_level: "rookie",
          hours_3m: 0,
          total_hours: 0,
          balance: 0,
          bonus_balance: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-brand">ЗАГРУЗКА...</div>
      </div>
    );
  }

  if (!user) return null;

  const tier = LOYALTY_TIERS[profile.loyalty_level] || LOYALTY_TIERS.rookie;
  const nextTier = Object.values(LOYALTY_TIERS).find(t => t.minHours > (profile.hours_3m || 0));
  const progress = nextTier ? Math.min((((profile.hours_3m || 0) / nextTier.minHours) * 100), 100) : 100;
  const prefix = "";
  const prefixColor = "#ff6a00";

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
          { label: "Активных броней", value: "0", color: "text-brand" },
          { label: "Всего бронирований", value: "0", color: "text-white" },
          { label: "Часов за 3 мес", value: (profile.hours_3m || 0).toString(), color: "text-brand" },
          { label: "Бонусов", value: (profile.bonus_balance || 0).toString(), color: "text-white" },
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
              <span>{profile.hours_3m || 0} ч</span>
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

        {/* Быстрые действия */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="cyber-panel p-6">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            Быстрые действия
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/booking" className="cyber-button !px-4 !py-3 text-[10px]">
              Забронировать
            </Link>
            <Link href="/tournaments" className="cyber-button !px-4 !py-3 text-[10px]">
              Турниры
            </Link>
            <Link href="/dashboard/profile" className="cyber-button !px-4 !py-3 text-[10px]">
              Профиль
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
