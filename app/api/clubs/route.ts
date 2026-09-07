import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type Club } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    await getUserFromRequest(req);
    const db = getDb();
    const snapshot = await db.collection("clubs").where("is_active", "==", true).get();
    
    const clubs: Club[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Club));

    return NextResponse.json(clubs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
