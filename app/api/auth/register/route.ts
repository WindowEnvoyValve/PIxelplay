import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nickname, birth_date } = body;

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль минимум 6 символов" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        data: { nickname, birth_date: birth_date || null },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Supabase signUp error:", data);
      return NextResponse.json({ error: data.message || "Ошибка регистрации" }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
