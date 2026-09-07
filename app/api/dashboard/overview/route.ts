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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Получаем профиль
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Статистика бронирований
    const { count: totalBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: activeBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["pending", "confirmed", "active"]);

    // История за 3 месяца
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("start_time, end_time")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("start_time", threeMonthsAgo.toISOString());

    const totalHours3m = recentBookings?.reduce((sum, b) => {
      return sum + (new Date(b.end_time).getTime() - new Date(b.start_time).getTime()) / 3600000;
    }, 0) || 0;

    // Турниры
    const { data: tournaments } = await supabase
      .from("tournament_participants")
      .select(`
        *,
        tournaments(title, game, status, starts_at)
      `)
      .eq("user_id", user.id)
      .order("registered_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      profile,
      stats: {
        totalBookings: totalBookings || 0,
        activeBookings: activeBookings || 0,
        totalHours3m: Math.round(totalHours3m * 10) / 10,
        tournamentsCount: tournaments?.length || 0,
      },
      tournaments: tournaments || [],
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
