import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const ALLOWED = ["open", "closed", "special"] as const;
type ClubStatus = (typeof ALLOWED)[number];

// Смена статуса клуба — только admin/manager (RLS + явная проверка роли)
export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : null;
  const status = typeof body?.status === "string" ? body.status : null;

  if (!slug || !status || !ALLOWED.includes(status as ClubStatus)) {
    return NextResponse.json(
      { error: "Нужны поля slug и status (open | closed | special)" },
      { status: 400 }
    );
  }

  // Сессия из cookie (браузер) или Bearer-токен (бот / внешние интеграции)
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const cookieStore = await cookies();

  const supabase = bearer
    ? createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${bearer}` } } }
      )
    : createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Запись cookie в Route Handler не требуется — сессия не обновляется
              }
            },
          },
        }
      );

  // Валидация JWT + роли
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json(
      { error: "Недостаточно прав" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("clubs")
    .update({ status })
    .eq("slug", slug)
    .select("slug, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ club: data });
}
