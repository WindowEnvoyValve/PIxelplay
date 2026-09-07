import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type Booking } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const snapshot = await db.collection("bookings")
      .where("user_id", "==", user.uid)
      .orderBy("created_at", "desc")
      .get();

    const bookings: Booking[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));

    return NextResponse.json(bookings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
