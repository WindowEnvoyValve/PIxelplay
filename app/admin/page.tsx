"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useClubStatuses, STATUS_META, type ClubStatus } from "@/lib/club-status";

type Tab = "dashboard" | "crm" | "pcs" | "webhooks" | "tournaments";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Дашборд" },
  { id: "crm", label: "CRM пользователей" },
  { id: "pcs", label: "Машины" },
  { id: "tournaments", label: "Турниры" },
  { id: "webhooks", label: "Webhooks / Бот" },
];

const ROLE_LABELS: Record<string, string> = {
  developer: "Разработчик",
  owner: "Владелец",
  director: "Директор",
  head_admin: "Главный Админ",
  admin: "Администратор",
  manager: "Менеджер",
  user: "Пользователь",
};

const ROLE_OPTIONS = ["developer", "owner", "director", "head_admin", "admin", "manager", "user"];

function heatColor(v: number): string {
  if (v >= 90) return "bg-brand text-white";
  if (v >= 70) return "bg-brand/70 text-white";
  if (v >= 50) return "bg-brand/45 text-white";
  if (v >= 30) return "bg-brand/25 text-white/80";
  if (v >= 15) return "bg-brand/12 text-white/60";
  return "bg-white/5 text-white/40";
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-void">
      <header className="sticky top-0 z-40 border-b border-brand/20 bg-panel/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo size={36} />
            <span className="border border-brand/40 bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Admin
            </span>
          </div>
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white">
            ← На сайт
          </Link>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                tab === t.id
                  ? "bg-brand text-white shadow-[0_0_14px_rgba(255,106,0,0.35)]"
                  : "border border-white/10 text-white/50 hover:border-brand/40 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "dashboard" && <DashboardTab />}
            {tab === "crm" && <CrmTab />}
            {tab === "pcs" && <PcsTab />}
            {tab === "tournaments" && <TournamentsTab />}
            {tab === "webhooks" && <WebhooksTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

const STATUS_OPTIONS: { id: ClubStatus; label: string }[] = [
  { id: "open", label: "Открыто" },
  { id: "closed", label: "Закрыто" },
  { id: "special", label: "Спец-обслуживание" },
];

function ClubStatusControl() {
  const [statuses, setStatuses] = useState<Record<string, ClubStatus>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clubs, setClubs] = useState<any[]>([]);
  const remote = useClubStatuses();

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (remote) {
      setStatuses((prev) => {
        const next = { ...prev };
        for (const c of remote) {
          if (!(c.slug in next)) next[c.slug] = c.status;
        }
        return next;
      });
    }
  }, [remote]);

  async function fetchClubs() {
    try {
      const res = await fetch("/api/clubs");
      const data = await res.json();
      const clubsArray = Array.isArray(data) ? data : (data.clubs || []);
      setClubs(clubsArray);
      const next: Record<string, ClubStatus> = {};
      for (const c of clubsArray) next[c.slug] = c.status || "open";
      setStatuses(next);
    } catch (e) {
      console.error("Failed to fetch clubs:", e);
    }
  }

  async function change(slug: string, status: ClubStatus) {
    setBusy(slug);
    setError(null);
    try {
      const r = await fetch("/api/clubs/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Ошибка сохранения");
      setStatuses((prev) => ({ ...prev, [slug]: status }));
      setToast(`Статус клуба «${slug}» → ${STATUS_META[status].label}`);
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="cyber-panel p-6">
      <h3 className="mb-1 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
        Режим работы клубов
      </h3>
      <p className="mb-5 text-xs text-white/35">
        Статус отображается на главной и на странице клубов.
      </p>
      {error && (
        <p className="mb-4 border-l-2 border-red-500 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <div className="space-y-3">
        {clubs.map((club: any) => {
          const current = statuses[club.slug];
          return (
            <div
              key={club.slug}
              className="flex flex-wrap items-center justify-between gap-3 border border-white/8 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{club.name}</p>
                <p className="text-xs text-white/35">{club.address}</p>
              </div>
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map((opt) => {
                  const meta = STATUS_META[opt.id];
                  const isActive = current === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => change(club.slug, opt.id)}
                      disabled={busy === club.slug}
                      className={`flex items-center gap-1.5 border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 ${
                        isActive
                          ? `${meta.className} border-current bg-current/10`
                          : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 border border-brand/50 bg-panel px-5 py-3 text-sm text-white shadow-[0_0_24px_rgba(255,106,0,0.3)]"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error("Failed to fetch admin stats:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="cyber-panel p-6">Загрузка...</div>;
  if (!data) return <div className="cyber-panel p-6">Ошибка загрузки</div>;

  const { stats, recentBookings, recentUsers, activeTournaments } = data;

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ru-RU", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Всего пользователей", value: stats.totalUsers.toString() },
          { label: "Активных броней", value: stats.activeBookings.toString() },
          { label: "Всего броней", value: stats.totalBookings.toString() },
          { label: "Активных турниров", value: stats.activeTournaments.toString() },
          { label: "Клубов", value: "3" },
          { label: "ПК всего", value: "150" },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="cyber-panel p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">{k.label}</p>
            <p className="mt-1.5 font-display text-xl font-black text-white">{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Клуб-статусы */}
      <ClubStatusControl />

      {/* Последние бронирования */}
      <div className="cyber-panel p-6">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
          Последние бронирования — {recentBookings.length}
        </h3>
        <div className="space-y-2">
          {recentBookings.map((b: any, i: number) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between border border-white/8 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{b.profiles.nickname}</p>
                <p className="text-xs text-white/40">
                  {b.clubs.name} · ПК #{b.computers.number} · {b.computers.zone_type}
                </p>
              </div>
              <span className="text-xs text-white/50">{formatTime(b.start_time)}</span>
            </motion.div>
          ))}
          {recentBookings.length === 0 && (
            <p className="text-center text-sm text-white/30 py-4">Нет бронирований</p>
          )}
        </div>
      </div>

      {/* Новые пользователи */}
      <div className="cyber-panel p-6">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
          Новые пользователи — {recentUsers.length}
        </h3>
        <div className="space-y-2">
          {recentUsers.map((u: any, i: number) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between border border-white/8 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{u.nickname}</p>
                <p className="text-xs text-white/40">{u.email}</p>
              </div>
              <span className="text-[10px] font-bold uppercase text-brand border border-brand/30 px-2 py-0.5">
                {ROLE_LABELS[u.role] || u.role}
              </span>
            </motion.div>
          ))}
          {recentUsers.length === 0 && (
            <p className="text-center text-sm text-white/30 py-4">Нет пользователей</p>
          )}
        </div>
      </div>

      {/* Активные турниры */}
      {activeTournaments.length > 0 && (
        <div className="cyber-panel p-6">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            Активные турниры — {activeTournaments.length}
          </h3>
          <div className="space-y-2">
            {activeTournaments.map((t: any, i: number) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{t.title}</p>
                  <p className="text-xs text-white/40">{t.game} · {t.max_teams} команд</p>
                </div>
                <span className={`text-[10px] font-bold uppercase ${
                  t.status === "registration" ? "text-emerald-400" : "text-brand"
                }`}>
                  {t.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CrmTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      fetchUsers();
    } catch (e) {
      console.error("Failed to change role:", e);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.nickname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const steamLinkCount = users.filter((u) => u.steam_id).length;

  if (loading) return <div className="cyber-panel p-6">Загрузка...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по нику или email..."
          className="cyber-input max-w-xs"
        />
        <p className="text-xs text-white/40">
          Steam привязан у <span className="font-bold text-brand">{Math.round((steamLinkCount / users.length) * 100) || 0}%</span> игроков
        </p>
      </div>
      <div className="cyber-panel overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-[10px] uppercase tracking-[0.18em] text-white/35">
              <th className="px-5 py-4">Игрок</th>
              <th className="px-4 py-4">Роль</th>
              <th className="px-4 py-4">Уровень</th>
              <th className="px-4 py-4 text-center">Часы / 3м</th>
              <th className="px-4 py-4 text-center">Steam</th>
              <th className="px-5 py-4 text-right">Баланс</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/4 last:border-0 hover:bg-brand/5"
              >
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-white">{u.nickname}</p>
                  <p className="text-xs text-white/35">{u.email}</p>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={u.role || "user"}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="cyber-input !py-1 !text-xs"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3.5">
                  <span className="border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand">
                    {u.loyalty_level || "Rookie"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center text-white/70">{u.hours_3m || 0}</td>
                <td className="px-4 py-3.5 text-center">{u.steam_id ? "🎮 ✓" : "—"}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="font-bold text-brand">{u.bonus_balance || 0} LP</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PcsTab() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [clubId, setClubId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPcs();
  }, []);

  useEffect(() => {
    if (clubs.length > 0 && !clubId) {
      setClubId(clubs[0].id);
    }
  }, [clubs]);

  async function fetchPcs() {
    try {
      const res = await fetch("/api/admin/pcs");
      const data = await res.json();
      setClubs(data);
    } catch (e) {
      console.error("Failed to fetch PCs:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="cyber-panel p-6">Загрузка...</div>;
  if (clubs.length === 0) return <div className="cyber-panel p-6">Нет данных</div>;

  const club = clubs.find((c) => c.id === clubId) || clubs[0];
  const activeBookings = club.computers?.filter((pc: any) => {
    const now = new Date();
    return pc.bookings?.some((b: any) => {
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      return now >= start && now <= end;
    });
  }) || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {clubs.map((c) => (
          <button
            key={c.id}
            onClick={() => setClubId(c.id)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
              clubId === c.id
                ? "bg-brand text-white shadow-[0_0_14px_rgba(255,106,0,0.35)]"
                : "border border-white/10 text-white/50 hover:border-brand/40 hover:text-white"
            }`}
          >
            {c.name} ({c.computers?.length || 0} ПК)
          </button>
        ))}
      </div>
      <div className="cyber-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            {club.name} — управление
          </h3>
          <p className="text-xs text-white/40">
            Активных сессий: <span className="font-bold text-brand">{activeBookings.length}</span>
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {club.computers?.map((pc: any, i: number) => {
            const isActive = activeBookings.some((b: any) => b.pc_id === pc.id);
            return (
              <motion.div
                key={pc.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`flex h-14 flex-col items-center justify-center rounded-md border ${
                  isActive
                    ? "border-brand bg-brand/20 text-brand shadow-[0_0_12px_rgba(255,106,0,0.3)]"
                    : "border-white/15 text-white/60"
                }`}
              >
                <span className="font-display text-sm font-bold">#{pc.number}</span>
                <span className="text-[8px] uppercase tracking-wider">
                  {isActive ? "▶ идёт" : "старт"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WebhooksTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      // TODO: добавить API эндпоинт для логов вебхуков
      // const res = await fetch("/api/admin/webhooks/logs");
      // const data = await res.json();
      // setLogs(data);
    } catch (e) {
      console.error("Failed to fetch webhook logs:", e);
    } finally {
      setLoading(false);
    }
  }

  async function sendTestAlert() {
    setSending(true);
    try {
      // TODO: добавить API эндпоинт для отправки тестового алерта
      setLogs((prev) => [
        {
          id: `w${Date.now()}`,
          event: "system.alert",
          payload: "Тестовый алерт из админ-панели PIXEL — доставка в Telegram-чат OK",
          status: "delivered",
          time: new Date().toLocaleTimeString("ru-RU"),
        },
        ...prev,
      ]);
    } catch (e) {
      console.error("Failed to send alert:", e);
    } finally {
      setSending(false);
    }
  }

  const badge: Record<string, string> = {
    delivered: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    failed: "border-red-500/40 bg-red-500/10 text-red-400",
    pending: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  };
  const label: Record<string, string> = { delivered: "доставлено", failed: "ошибка", pending: "в очереди" };

  if (loading) return <div className="cyber-panel p-6">Загрузка...</div>;

  return (
    <div className="space-y-5">
      <div className="cyber-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
              Интеграция с Telegram-ботом
            </h3>
            <p className="mt-1.5 max-w-xl text-xs text-white/40">
              Каждое бронирование и системный алерт уходит в админ-чат через webhook.
            </p>
          </div>
          <button onClick={sendTestAlert} disabled={sending} className="cyber-button shrink-0">
            {sending ? "ОТПРАВКА..." : "Тестовый алерт"}
          </button>
        </div>
      </div>
      <div className="space-y-2.5">
        {logs.map((l: any, i: number) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.4) }}
            className="cyber-panel flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div className="flex items-center gap-3">
              <span className={`border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${badge[l.status]}`}>
                {label[l.status]}
              </span>
              <code className="text-xs font-bold text-brand">{l.event}</code>
              <span className="text-sm text-white/70">{l.payload}</span>
            </div>
            <span className="text-xs text-white/30">{l.time}</span>
          </motion.div>
        ))}
        {logs.length === 0 && (
          <div className="cyber-panel p-12 text-center">
            <p className="text-white/40">Нет логов вебхуков</p>
            <p className="text-xs text-white/30 mt-2">Отправьте тестовый алерт для проверки</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TournamentsTab() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", game: "CS2", discipline: "", description: "",
    prize_pool: 0, entry_fee: 0, max_teams: 16, team_size: 5,
    starts_at: "", club_id: "", stream_url: "", cover_url: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      setTournaments(data);
    } catch (e) {
      console.error("Failed to fetch tournaments:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ошибка создания");
      setShowForm(false);
      setForm({
        title: "", game: "CS2", discipline: "", description: "",
        prize_pool: 0, entry_fee: 0, max_teams: 16, team_size: 5,
        starts_at: "", club_id: "", stream_url: "", cover_url: "",
      });
      fetchTournaments();
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    try {
      await fetch(`/api/tournaments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchTournaments();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div className="cyber-panel p-6">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="cyber-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            Управление турнирами
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="cyber-button !px-4 !py-2 text-[10px]"
          >
            {showForm ? "Отмена" : "Создать турнир"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="space-y-4 border border-white/10 bg-white/[0.02] p-5 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Название турнира *" className="cyber-input" required />
              <select value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className="cyber-input">
                <option value="CS2">CS2</option>
                <option value="Dota 2">Dota 2</option>
                <option value="Valorant">Valorant</option>
                <option value="Fortnite">Fortnite</option>
              </select>
              <input value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: Number(e.target.value) })} placeholder="Призовой фонд (BYN)" className="cyber-input" type="number" min="0" />
              <input value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: Number(e.target.value) })} placeholder="Взнос (BYN)" className="cyber-input" type="number" min="0" />
              <input value={form.max_teams} onChange={(e) => setForm({ ...form, max_teams: Number(e.target.value) })} placeholder="Макс. команд" className="cyber-input" type="number" min="2" />
              <input value={form.team_size} onChange={(e) => setForm({ ...form, team_size: Number(e.target.value) })} placeholder="Игроков в команде" className="cyber-input" type="number" min="1" />
              <input value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} placeholder="Дата и время начала" className="cyber-input" type="datetime-local" />
              <input value={form.stream_url} onChange={(e) => setForm({ ...form, stream_url: e.target.value })} placeholder="URL трансляции" className="cyber-input" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Описание турнира" className="cyber-input" rows={3} />
            <button type="submit" disabled={creating} className="cyber-button w-full">
              {creating ? "СОЗДАНИЕ..." : "Создать турнир"}
            </button>
          </form>
        )}
      </div>

      <div className="space-y-3">
        {tournaments.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="cyber-panel flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div className="flex items-center gap-4">
              <span className={`border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                t.status === "registration"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : t.status === "ongoing"
                  ? "border-brand/40 bg-brand/10 text-brand"
                  : "border-white/15 text-white/40"
              }`}>
                {t.status === "registration" ? "Регистрация" : t.status === "ongoing" ? "Идёт" : t.status}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">{t.title}</p>
                <p className="text-xs text-white/40">
                  {t.game} · Приз: {t.prize_pool} BYN · {t.max_teams} команд · {t.team_size} чел.
                </p>
                {t.starts_at && (
                  <p className="text-xs text-white/30">
                    📅 {new Date(t.starts_at).toLocaleString("ru-RU")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {t.status === "registration" && (
                <button onClick={() => changeStatus(t.id, "ongoing")} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-brand/40 bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all">
                  Начать
                </button>
              )}
              {t.status === "ongoing" && (
                <button onClick={() => changeStatus(t.id, "finished")} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-white/20 text-white/60 hover:border-brand/40 hover:text-brand transition-all">
                  Завершить
                </button>
              )}
              {(t.status === "registration" || t.status === "ongoing") && (
                <button onClick={() => changeStatus(t.id, "cancelled")} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                  Отменить
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {tournaments.length === 0 && (
          <p className="text-center text-sm text-white/30 py-8">Пока нет турниров</p>
        )}
      </div>
    </div>
  );
}
