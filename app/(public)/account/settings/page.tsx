import { SettingsTabs } from "@/components/account/SettingsTabs";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountSettingsPage() {
  const user = process.env.NODE_ENV === "development" && process.env.PREVIEW_ACCOUNT === "1"
    ? { login: "PixelPlayUser", email: "demo@pixelplay.local", phone: "+7 900 000-00-00", status: "active", createdAt: new Date("2026-01-01"), emailVerifiedAt: new Date("2026-01-01") }
    : await getCurrentUser();
  if (!user) return null;

  return <SettingsTabs user={user} preview={process.env.NODE_ENV === "development" && process.env.PREVIEW_ACCOUNT === "1"} />;
}
