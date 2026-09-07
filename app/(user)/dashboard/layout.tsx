"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { UserPrefix } from "@/components/ui/UserPrefix";

const LOYALTY_TIERS: Record<string, { title: string; color: string }> = {
  rookie: { title: "Rookie", color: "#9ca3af" },
  bronze: { title: "Bronze", color: "#cd7f32" },
  silver: { title: "Silver", color: "#e5e5e5" },
  gold: { title: "Gold", color: "#ff9040" },
  legend: { title: "Legend", color: "#ff6a00" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/dashboard/profile");
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <p className="text-white/40">Загрузка...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <p className="text-white/40">Ошибка загрузки данных</p>
      </div>
    );
  }

  const tier = LOYALTY_TIERS[profile.loyalty_level] || { title: "Rookie", color: "#9ca3af" };
  const prefix = profile.user_prefixes?.prefix || "";
  const prefixColor = profile.user_prefixes?.color || "#ff6a00";

  return (
    <div className="flex min-h-screen bg-void">
      {/* Сайдбар */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-brand/15 bg-panel/60 backdrop-blur-md lg:flex">
        <div className="px-6 py-6">
          <Logo size={40} />
        </div>

        {/* Мини-профиль */}
        <div className="mx-4 mb-6 border border-brand/25 bg-brand/5 p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full font-display font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${tier.color}40, ${tier.color}10)`,
                border: `2px solid ${tier.color}60`,
              }}
            >
              {profile.nickname?.[0] || "P"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                <UserPrefix prefix={prefix} color={prefixColor}>
                  {profile.nickname}
                </UserPrefix>
              </p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: tier.color }}>
                {tier.title}
              </p>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex-1 space-y-1 px-4">
          {[
            { href: "/dashboard", label: "Обзор", icon: "◉" },
            { href: "/dashboard/booking", label: "Бронирование", icon: "▣" },
            { href: "/dashboard/history", label: "История", icon: "≡" },
            { href: "/dashboard/profile", label: "Профиль", icon: "★" },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 border border-brand/40 bg-brand/10"
                  />
                )}
                <span className={`relative text-xs ${active ? "text-brand" : ""}`}>{item.icon}</span>
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-5">
          <LogoutButton />
        </div>
      </aside>

      {/* Мобильная навигация */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-brand/20 bg-void/95 backdrop-blur-md lg:hidden">
        {[
          { href: "/dashboard", label: "Обзор", icon: "◉" },
          { href: "/dashboard/booking", label: "Бронь", icon: "▣" },
          { href: "/dashboard/history", label: "История", icon: "≡" },
          { href: "/dashboard/profile", label: "Профиль", icon: "★" },
        ].map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider ${
                active ? "text-brand" : "text-white/40"
              }`}
            >
              <span>{item.icon}</span>
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>

      {/* Контент */}
      <main className="flex-1 pb-24 lg:ml-64 lg:pb-0">{children}</main>
    </div>
  );
}
