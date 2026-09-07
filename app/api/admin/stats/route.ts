import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    // Проверка роли admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "manager", "head_admin", "director", "owner", "developer"].includes(profile.role)) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    // Статистика
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: activeBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true }).in("status", ["pending", "confirmed", "active"]);
    const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true });

    // Последние бронирования
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("*, profiles(nickname, id), clubs(name), computers(number, zone_type)")
      .order("start_time", { ascending: false })
      .limit(10);

    // Последние пользователи
    const { data: recentUsers } = await supabase
      .from("profiles")
      .select("*, user_prefixes(prefix, color)")
      .order("created_at", { ascending: false })
      .limit(10);

    // Активные турниры
    const { data: activeTournaments } = await supabase
      .from("tournaments")
      .select("*")
      .in("status", ["registration", "ongoing"])
      .order("starts_at", { ascending: true });

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeBookings: activeBookings || 0,
        totalBookings: totalBookings || 0,
        activeTournaments: activeTournaments?.length || 0,
      },
      recentBookings: recentBookings || [],
      recentUsers: recentUsers || [],
      activeTournaments: activeTournaments || [],
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
