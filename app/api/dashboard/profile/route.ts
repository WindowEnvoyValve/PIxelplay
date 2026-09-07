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

    const { data: profile } = await supabase
      .from("profiles")
      .select(`
        *,
        user_prefixes(prefix, color)
      `)
      .eq("id", user.id)
      .single();

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Получаем активные бронирования
    const { data: activeBookings } = await supabase
      .from("bookings")
      .select(`
        *,
        clubs(name, address),
        computers (number, zone_type, club_id)
      `)
      .eq("user_id", user.id)
      .in("status", ["pending", "confirmed", "active"])
      .order("start_time", { ascending: true })
      .limit(5);

    return NextResponse.json({
      profile,
      activeBookings: activeBookings || [],
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
