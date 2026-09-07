import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    const { data: tournament, error: tErr } = await supabase
      .from("tournaments")
      .select("*, clubs(name, address)")
      .eq("id", id)
      .single();

    if (tErr) throw tErr;

    const { data: participants, error: pErr } = await supabase
      .from("tournament_participants")
      .select("*, profiles(nickname, steam_id)")
      .eq("tournament_id", id)
      .order("registered_at");

    if (pErr) throw pErr;

    return NextResponse.json({ tournament, participants });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

// Регистрация на турнир
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized — войдите в аккаунт" }, { status: 401 });
    }

    const body = await req.json();
    const { team_name, is_solo } = body;

    // Проверяем турнир
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("status, max_teams, team_size")
      .eq("id", id)
      .single();

    if (!tournament || tournament.status !== "registration") {
      return NextResponse.json({ error: "Регистрация закрыта" }, { status: 400 });
    }

    // Проверяем количество участников
    const { count } = await supabase
      .from("tournament_participants")
      .select("*", { count: "exact", head: true })
      .eq("tournament_id", id);

    if ((count || 0) >= tournament.max_teams) {
      return NextResponse.json({ error: "Мест нет" }, { status: 400 });
    }

    // Регистрация пользователя/команды
    const { data: participant, error: pErr } = await supabase
      .from("tournament_participants")
      .insert({
        tournament_id: id,
        user_id: user.id,
        team_name: team_name || (is_solo ? "Solo" : body.nickname),
        seed: count || 0,
      })
      .select()
      .single();

    if (pErr) throw pErr;

    return NextResponse.json(participant);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

// Обновить статус турнира (админ)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status, bracket_json } = body;

    const { data, error } = await supabase
      .from("tournaments")
      .update({ status, bracket_json: bracket_json || undefined })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
