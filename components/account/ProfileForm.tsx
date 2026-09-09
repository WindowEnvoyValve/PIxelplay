"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type ProfileUser = {
  id?: string | null;
  login: string;
  email: string;
  phone: string;
  telegram?: string | null;
  vk?: string | null;
  discord?: string | null;
  matrix?: string | null;
  steam?: string | null;
  jabber?: string | null;
  faceit?: string | null;
  gender?: string | null;
  birthday?: string | null;
  interests?: string | null;
  status: string;
  createdAt: string | Date;
  emailVerifiedAt: string | Date | null;
};

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

async function copySocial(value: string, setMessage: (message: string) => void) {
  await navigator.clipboard.writeText(value);
  setMessage("Скопировано.");
}

export function ProfileForm({ user, settingsMode = false, settingsSection = "personal", settingsLayout = false }: { user: ProfileUser; settingsMode?: boolean; settingsSection?: "personal" | "contacts"; settingsLayout?: boolean }) {
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [telegram, setTelegram] = useState(user.telegram ?? "");
  const [vk, setVk] = useState(user.vk ?? "");
  const [discord, setDiscord] = useState(user.discord ?? "");
  const [matrix, setMatrix] = useState(user.matrix ?? "");
  const [steam, setSteam] = useState(user.steam ?? "");
  const [jabber, setJabber] = useState(user.jabber ?? "");
  const [faceit, setFaceit] = useState(user.faceit ?? "");
  const [gender, setGender] = useState(user.gender ?? "");
  const [birthday, setBirthday] = useState(user.birthday ?? "");
  const [interests, setInterests] = useState(user.interests ?? "");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(settingsMode);
  const inputRef = useRef<HTMLInputElement>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "same-origin", body: JSON.stringify({ email, phone, telegram, vk, discord, matrix, steam, jabber, faceit, gender, birthday, interests }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error?.message || "Не удалось сохранить профиль.");
      setEmail(data.user.email); setPhone(data.user.phone);
      setTelegram(data.user.telegram ?? ""); setDiscord(data.user.discord ?? "");
      setVk(data.user.vk ?? ""); setMatrix(data.user.matrix ?? ""); setSteam(data.user.steam ?? ""); setJabber(data.user.jabber ?? ""); setFaceit(data.user.faceit ?? "");
      setGender(data.user.gender ?? ""); setBirthday(data.user.birthday ?? ""); setInterests(data.user.interests ?? "");
      setMessage("Профиль обновлён.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось подключиться к серверу.");
    } finally { setSaving(false); }
  }

  return (
    <main className={`relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 pb-20 sm:px-6 ${settingsLayout ? "pt-4" : "pt-28"}`}>
      <div className={`mx-auto grid w-full gap-4 ${settingsLayout ? "max-w-4xl" : "max-w-6xl lg:grid-cols-[15rem_minmax(0,1fr)]"}`}>
        <aside className={settingsLayout ? "hidden" : "rounded-2xl border border-[#22312e] bg-[#101716] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"}>
          <button type="button" onClick={() => inputRef.current?.click()} className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-[#1e2b29] bg-gradient-to-br from-brand/30 via-[#18201e] to-black font-display text-4xl font-black text-brand" aria-label="Выбрать аватар">
            {avatar ? <Image src={avatar} alt="" fill unoptimized className="object-cover" /> : user.login.slice(0, 2).toUpperCase()}
            <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0d1312] bg-brand text-xl font-bold text-black transition-transform group-hover:scale-110" aria-hidden="true">+</span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0]; if (file) setAvatar(URL.createObjectURL(file));
          }} />
          <h1 className="mt-4 truncate font-display text-xl font-bold text-white">{user.login}</h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />{user.status === "active" ? "Аккаунт активен" : user.status}</p>
          <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 lg:hidden">
            <InfoRow label="Регистрация" value={formatDate(user.createdAt)} />
            <InfoRow label="ID" value={user.id ?? "Не указан"} />
            <InfoRow label="Пол" value={gender || "Не указан"} />
            <InfoRow label="День рождения" value={birthday || "Не указан"} />
            <InfoRow label="Интересы" value={interests || "Не указаны"} />
            <InfoRow label="Статус" value={user.status === "active" ? "Активен" : user.status} />
          </div>
          <ContactButtons user={user} setMessage={setMessage} className="mt-4 border-t border-white/10 pt-4 lg:hidden" compact />
          <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/45">Профиль пользователя PIXEL</p>
          {settingsMode ? <button type="button" onClick={() => setEditing((value) => !value)} className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white/75 transition hover:border-brand/60 hover:text-white">{editing ? "Закрыть редактирование" : "Редактировать"}</button> : <Link href="/account/settings" className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white/75 transition hover:border-brand/60 hover:text-white">Настройки</Link>}
        </aside>
        {!settingsMode ? <section className="rounded-2xl border border-[#22312e] bg-[#101716] p-5 lg:hidden">
          <h2 className="font-display text-xl font-bold text-white">Активность профиля</h2>
          <div className="mt-4 rounded-xl border border-[#263532] bg-[#151d1b] p-4 text-sm text-white/35">Стена пользователя будет доступна после подключения социальных функций.</div>
        </section> : null}

        <div className={`min-w-0 space-y-4 ${settingsMode ? "" : "hidden lg:block"}`}>
          <form onSubmit={save} className="min-w-0 overflow-hidden rounded-2xl border border-[#22312e] bg-[#101716] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="border-b border-[#22312e] px-5 py-5 sm:px-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="font-display text-2xl font-black text-fuchsia-300 sm:text-3xl">{settingsMode ? (settingsSection === "contacts" ? "Контактная информация" : "Персональная информация") : "Профиль пользователя PIXEL"}</h2><p className="mt-2 text-sm text-white/75">{settingsMode ? "Настройки профиля" : user.login}</p></div>
                <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">Активен</span>
              </div>
            </div>
            {settingsSection === "personal" && !settingsLayout ? <div className="hidden gap-x-8 gap-y-3 border-b border-[#22312e] px-5 py-5 sm:grid-cols-2 sm:px-7 lg:grid">
              <InfoRow label="Регистрация" value={formatDate(user.createdAt)} />
              <InfoRow label="ID" value={user.id ?? "Не указан"} />
              <InfoRow label="Пол" value={gender || "Не указан"} />
              <InfoRow label="День рождения" value={birthday || "Не указан"} />
              <InfoRow label="Интересы" value={interests || "Не указаны"} />
              <InfoRow label="Статус" value={user.status === "active" ? "Активен" : user.status} />
            </div> : null}
            {settingsSection === "contacts" ? <ContactButtons user={user} setMessage={setMessage} className="border-b border-[#22312e] px-5 py-5 sm:px-7" /> : null}
            {!settingsMode ? <ContactButtons user={user} setMessage={setMessage} className="border-b border-[#22312e] px-5 py-5 sm:px-7" /> : null}
            {editing ? <div className="grid gap-4 border-b border-[#22312e] px-5 py-5 sm:grid-cols-2 sm:px-7">
              {settingsSection === "contacts" ? <>
                <label className="text-sm text-white/55">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" autoComplete="email" /></label>
                <label className="text-sm text-white/55">Телефон<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" autoComplete="tel" /></label>
                <label className="text-sm text-white/55">Telegram<input type="text" value={telegram} onChange={(event) => setTelegram(event.target.value)} placeholder="@username или ссылка" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55">ВКонтакте<input type="text" value={vk} onChange={(event) => setVk(event.target.value)} placeholder="Ссылка на профиль" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55">Discord<input type="text" value={discord} onChange={(event) => setDiscord(event.target.value)} placeholder="username или ссылка" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55">Matrix<input type="text" value={matrix} onChange={(event) => setMatrix(event.target.value)} placeholder="@user:server" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55">Steam<input type="text" value={steam} onChange={(event) => setSteam(event.target.value)} placeholder="Ссылка на профиль" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55">Jabber<input type="text" value={jabber} onChange={(event) => setJabber(event.target.value)} placeholder="Ваш Jabber" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55">FACEIT<input type="text" value={faceit} onChange={(event) => setFaceit(event.target.value)} placeholder="Ссылка на профиль" className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                </> : <>
                <div className="sm:col-span-2">
                  <p className="text-sm text-white/55">Статус</p>
                  <div className="mt-2 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-emerald-300">Активен</div>
                  <p className="mt-2 text-xs text-white/40">Статус аккаунта определяется системой и не редактируется.</p>
                </div>
                <label className="text-sm text-white/55 sm:col-span-2">Ник<input type="text" value={user.login} readOnly className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white/60 outline-none" /><span className="mt-2 block text-xs text-white/40">Логин является идентификатором аккаунта и не редактируется.</span></label>
                <label className="text-sm text-white/55">Пол<select value={gender} onChange={(event) => setGender(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70"><option value="">Не указан</option><option value="Мужской">Мужской</option><option value="Женский">Женский</option></select></label>
                <label className="text-sm text-white/55">День рождения<input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                <label className="text-sm text-white/55 sm:col-span-2">Интересы<textarea value={interests} onChange={(event) => setInterests(event.target.value)} placeholder="Расскажите о своих интересах" rows={3} className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-brand/70" /></label>
                </>}
            </div> : null}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7">
              <p className="text-xs text-white/45">{editing ? "Login изменить нельзя" : "Основная информация аккаунта"}</p>
              {editing ? <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50">{saving ? "Сохранение..." : "Сохранить"}</button> : null}
            </div>
            {error && <p className="mx-5 mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200 sm:mx-7" role="alert">{error}</p>}
            {message && <p className="mx-5 mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200 sm:mx-7" role="status">{message}</p>}
          </form>
          {!settingsMode ? <section className="rounded-2xl border border-[#22312e] bg-[#101716] p-5 sm:p-7">
            <div className="flex items-center justify-between"><h3 className="font-display text-lg font-bold text-white">Активность профиля</h3><span className="text-xs text-white/35">Пока нет публикаций</span></div>
            <div className="mt-5 rounded-xl border border-[#263532] bg-[#151d1b] p-4 text-sm text-white/35">Стена пользователя будет доступна после подключения социальных функций.</div>
          </section> : null}
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 text-sm"><span className="text-[#83a8a0]">{label}</span><span className="min-w-0 break-words text-white/85">{value}</span></div>;
}

function ContactButtons({ user, setMessage, className, compact = false }: { user: ProfileUser; setMessage: (message: string) => void; className: string; compact?: boolean }) {
  const contacts = [
    ["Telegram", user.telegram, "border-sky-400/30 bg-sky-400/10 text-sky-200 hover:border-sky-300/70"],
    ["ВКонтакте", user.vk, "border-blue-400/30 bg-blue-400/10 text-blue-200 hover:border-blue-300/70"],
    ["Discord", user.discord, "border-indigo-400/30 bg-indigo-400/10 text-indigo-200 hover:border-indigo-300/70"],
    ["Matrix", user.matrix, "border-green-400/30 bg-green-400/10 text-green-200 hover:border-green-300/70"],
    ["Steam", user.steam, "border-slate-400/30 bg-slate-400/10 text-slate-200 hover:border-slate-300/70"],
    ["Jabber", user.jabber, "border-amber-400/30 bg-amber-400/10 text-amber-200 hover:border-amber-300/70"],
    ["FACEIT", user.faceit, "border-orange-400/30 bg-orange-400/10 text-orange-200 hover:border-orange-300/70"],
  ] as const;
  const filledContacts = contacts.filter(([, value]) => value);

  if (!filledContacts.length) return null;

  return <div className={`flex flex-wrap ${compact ? "gap-2" : "gap-3"} ${className}`}>
    {filledContacts.map(([label, value, colorClass]) => <button key={label} type="button" className={`rounded-lg border ${colorClass} ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} font-semibold transition`} onClick={() => copySocial(value!, setMessage)}>{label}</button>)}
  </div>;
}
