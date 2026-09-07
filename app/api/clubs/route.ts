import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Публичный список клубов с текущим статусом (RLS: активные клубы видны всем)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("slug, name, address, status, is_active")
    .eq("is_active", true)
    .order("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ clubs: data });
}
