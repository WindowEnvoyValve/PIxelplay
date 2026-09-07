import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type Booking } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { clubId, pcId, startTime, endTime, totalPrice } = body;

    if (!clubId || !pcId || !startTime || !endTime || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    const bookingRef = db.collection("bookings").doc();
    
    await bookingRef.set({
      id: bookingRef.id,
      user_id: user.uid,
      club_id: clubId,
      pc_id: pcId,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice,
      status: "pending",
      payment_method: "money",
      created_at: new Date().toISOString(),
    });

    const booking: Booking = {
      id: bookingRef.id,
      user_id: user.uid,
      club_id: clubId,
      pc_id: pcId,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice,
      status: "pending",
      payment_method: "money",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
