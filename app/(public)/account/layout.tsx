import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "development" && process.env.PREVIEW_ACCOUNT === "1") {
    return children;
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return children;
}