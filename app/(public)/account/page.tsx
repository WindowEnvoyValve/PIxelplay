import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Личный кабинет | PIXEL",
  description: "Личный кабинет пользователя PIXEL.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  if (process.env.NODE_ENV === "development" && process.env.PREVIEW_ACCOUNT === "1") {
    return (
      <AccountShell
        user={{
          login: "PixelPlayUser",
          email: "demo@pixelplay.local",
          phone: "+7 900 000-00-00",
          status: "active",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          emailVerifiedAt: new Date("2026-01-01T00:00:00.000Z"),
        }}
      />
    );
  }

  const user = await getCurrentUser();
  if (!user) return null;
  return <AccountShell user={user} />;
}