"use client";

import { useState } from "react";
import { ProfileForm, type ProfileUser } from "@/components/account/ProfileForm";
import { SecurityPanel } from "@/components/account/SecurityPanel";

type SettingsTab = "personal" | "contacts" | "security";

export function SettingsTabs({ user, preview }: { user: ProfileUser; preview: boolean }) {
  const [tab, setTab] = useState<SettingsTab>("personal");
  const tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: "personal", label: "Персональная информация" },
    { id: "contacts", label: "Контакты" },
    { id: "security", label: "Безопасность" },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav className="h-fit rounded-2xl border border-[#22312e] bg-[#101716] p-3" aria-label="Разделы настроек">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`mb-2 flex w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${tab === item.id ? "border-brand/70 bg-brand/10 text-brand" : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"}`}
            aria-current={tab === item.id ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
        <div>{tab === "security" ? <SecurityPanel preview={preview} user={user} /> : <ProfileForm user={user} settingsMode settingsLayout settingsSection={tab} />}</div>
        </div>
    </main>
  );
}
