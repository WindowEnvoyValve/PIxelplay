import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Простой фильтр мата
const BAD_WORDS = [
  "блять", "бля", "сука", "мудак", "пидор", "хуй", "ебать", "нахуй",
  "еблан", "уебан", "гандон", "шлюха", "ёбаный",
  "fuck", "shit", "bitch", "asshole", "dick", "bastard", "piss",
];

function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

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
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: "Слишком длинное сообщение (макс. 500 символов)" }, { status: 400 });
    }

    // Проверка бана (используем any пока типы не обновлены)
    const supabaseAny = supabase as any;
    const { data: isBanned } = await supabaseAny.rpc("is_chat_banned", { p_user_id: user.id });
    if (isBanned) {
      return NextResponse.json({ error: "Вы заблокированы в чате" }, { status: 403 });
    }

    // Проверка на мат
    if (containsProfanity(content)) {
      const { data: warnings } = await supabaseAny
        .from("chat_warnings")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (warnings && warnings.length >= 2) {
        await supabaseAny.from("chat_bans").upsert({
          user_id: user.id,
          banned_by: user.id,
          reason: "Множественные нарушения (мат)",
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
        return NextResponse.json({ error: "Заблокированы в чате на 24 часа" }, { status: 403 });
      }

      await supabaseAny.from("chat_warnings").insert({ user_id: user.id });
      return NextResponse.json({ error: "Предупреждение: запрещено использовать ненормативную лексику" }, { status: 400 });
    }

    // Проверка спама
    const { data: recent } = await supabaseAny
      .from("chat_messages")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 2000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json({ error: "Слишком быстро! Подождите 2 секунды" }, { status: 429 });
    }

    // Создание сообщения
    const { data, error } = await supabaseAny
      .from("chat_messages")
      .insert({ user_id: user.id, content })
      .select("*, profiles(nickname, role, user_prefixes(prefix, color))")
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

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

    const supabaseAny = supabase as any;
    const { data, error } = await supabaseAny
      .from("chat_messages")
      .select("*, profiles(nickname, role, user_prefixes(prefix, color))")
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
