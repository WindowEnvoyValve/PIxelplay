import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type Tournament } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection("tournaments").orderBy("starts_at", "desc").get();
    
    const tournaments: Tournament[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Tournament));

    return NextResponse.json(tournaments);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
