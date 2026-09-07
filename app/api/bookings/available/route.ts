import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("club_id");
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!clubId || !date || !time) {
      return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

    const { data: computers } = await supabase
      .from("computers")
      .select(`
        *,
        bookings (status, start_time, end_time)
      `)
      .eq("club_id", clubId)
      .eq("status", "available")
      .order("number");

    const availablePcs = (computers || []).filter((pc) => {
      const hasConflict = pc.bookings?.some((b: any) => {
        const bStart = new Date(b.start_time);
        const bEnd = new Date(b.end_time);
        return (startTime < bEnd && endTime > bStart);
      });
      return !hasConflict;
    });

    return NextResponse.json(availablePcs);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
