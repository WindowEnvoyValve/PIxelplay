import { SecurityPanel } from "@/components/account/SecurityPanel";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountSecurityPage() {
  const preview = process.env.NODE_ENV === "development" && process.env.PREVIEW_ACCOUNT === "1";
  const user = preview
    ? { email: "demo@pixelplay.local", emailVerifiedAt: new Date("2026-01-01") }
    : await getCurrentUser();
  return <SecurityPanel preview={preview} user={user ?? undefined} />;
}