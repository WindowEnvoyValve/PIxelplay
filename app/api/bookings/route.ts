import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { clubId, pcId, startTime, endTime, total_price, notes } = body;

    if (!clubId || !pcId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Проверка пересечений
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id")
      .eq("pc_id", pcId)
      .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)
      .in("status", ["pending", "confirmed", "active"]);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: "Это время уже занято" }, { status: 409 });
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        club_id: clubId,
        pc_id: pcId,
        start_time: startTime,
        end_time: endTime,
        total_price,
        status: "pending",
        notes: notes || null,
        payment_method: "money",
        bonuses_used: 0,
        cashback_earned: 0,
      })
      .select(`
        *,
        clubs(name),
        computers(number, zone_type)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
