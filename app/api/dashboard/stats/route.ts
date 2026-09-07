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
        bookings (
          id, status, start_time, end_time, total_price,
          clubs(name),
          computers (number, zone_type)
        )
      `)
      .eq("id", user.id)
      .single();

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Дополнительный запрос для турниров
    const { data: tournaments } = await supabase
      .from("tournament_participants")
      .select(`
        id, tournament_id, team_name, registered_at,
        tournaments(title, game, status)
      `)
      .eq("user_id", user.id)
      .order("registered_at", { ascending: false });

    return NextResponse.json({ ...profile, tournaments: tournaments || [] });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
