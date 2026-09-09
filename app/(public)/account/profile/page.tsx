import { ProfileForm } from "@/components/account/ProfileForm";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountProfilePage() {
  const user = process.env.NODE_ENV === "development" && process.env.PREVIEW_ACCOUNT === "1"
    ? { login: "PixelPlayUser", email: "demo@pixelplay.local", phone: "+7 900 000-00-00", status: "active", createdAt: new Date("2026-01-01"), emailVerifiedAt: new Date("2026-01-01") }
    : await getCurrentUser();
  if (!user) return null;
  return <ProfileForm user={user} />;
}