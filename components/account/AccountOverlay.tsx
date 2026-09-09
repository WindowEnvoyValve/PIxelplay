"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";

type AccountUser = {
  login: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string | Date;
  emailVerifiedAt: string | Date | null;
};

export function AccountOverlay({ user }: { user: AccountUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    return null;
  }

  return (
    <>
      {user ? (
        <button type="button" onClick={() => setOpen((value) => !value)} className="account-launcher" aria-expanded={open} aria-controls="account-overlay">
          <span className="account-launcher-avatar">{user.login.slice(0, 2).toUpperCase()}</span>
          <span>{user.login}</span>
        </button>
      ) : null}
      {!user ? (
        <a href="/login" className="account-launcher" aria-label="Войти в аккаунт">
          <span className="account-launcher-avatar">PI</span>
          <span>Войти</span>
        </a>
      ) : null}
      {open && user ? (
        <div id="account-overlay" className="fixed right-4 top-20 z-50 w-[min(25rem,calc(100vw-2rem))]">
          <AccountShell user={user} overlay onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
