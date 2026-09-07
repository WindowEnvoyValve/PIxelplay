"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteamShowcase } from "@/components/profile/SteamShowcase";
import { fadeUp } from "@/lib/animations";
import { UserPrefix } from "@/components/ui/UserPrefix";

const ROLE_LABELS: Record<string, string> = {
  developer: "Разработчик",
  owner: "Владелец",
  director: "Директор",
  head_admin: "Главный Админ",
  admin: "Администратор",
  manager: "Менеджер",
  user: "Игрок",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfile(data);
      setNickname(data.nickname || "");
      setPhone(data.phone || "");
      setBirthDate(data.birth_date || "");
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    // TODO: update via Supabase
    await new Promise((r) => setTimeout(r, 700));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-10">Загрузка...</div>;
  if (!profile) return <div className="mx-auto max-w-6xl px-6 py-10">Ошибка загрузки</div>;

  const prefix = profile.user_prefixes?.prefix || "";
  const color = profile.user_prefixes?.color || "#ff6a00";
  const role = ROLE_LABELS[profile.role] || profile.role;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Профиль</p>
        <h1 className="mt-2 font-display text-3xl font-black text-white">
          НАСТРОЙКИ И <span className="text-gradient-brand">STEAM</span>
        </h1>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Данные аккаунта */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onSubmit={handleSave}
          className="cyber-panel h-fit p-6"
        >
          <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Данные аккаунта</h3>

          {/* Информация о роли */}
          <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-widest text-white/40">Ваша роль</p>
              <p className="font-display text-sm font-bold text-white">{role}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Префикс</p>
              <UserPrefix prefix={prefix} color={color}>
                {profile.nickname}
              </UserPrefix>
            </div>
          </div>

          {/* Бонусы и уровень */}
          <div className="mb-5 rounded-xl border border-brand/20 bg-brand/[0.06] p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Баланс бонусов</p>
                <p className="font-display text-xl font-bold text-brand">{profile.bonus_balance || 0} LP</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Уровень</p>
                <p className="font-display text-xl font-bold text-white uppercase">{profile.loyalty_level || "Rookie"}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-white/40">
                <span>Часы за 3 мес</span>
                <span>{profile.hours_3m || 0} ч</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand to-brand-light transition-all"
                  style={{ width: `${Math.min(((profile.hours_3m || 0) / 350) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/40">Никнейм</span>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="cyber-input" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/40">Телефон</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="cyber-input" placeholder="+7 (___) ___-__-__" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-white/40">
                Дата рождения <span className="text-brand">(+15 LP в ДР)</span>
              </span>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="cyber-input [color-scheme:dark]" />
            </label>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" className="cyber-button">Сохранить</button>
            <AnimatePresence>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-brand">
                  ✓ Сохранено
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4 text-xs text-white/35">
            <p>ID: {profile.id}</p>
            {profile.steam_id && <p className="mt-1">Steam: {profile.steam_id}</p>}
          </div>
        </motion.form>

        {/* Steam-витрина */}
        <SteamShowcase />
      </div>
    </div>
  );
}
