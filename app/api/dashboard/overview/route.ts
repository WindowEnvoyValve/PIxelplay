import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type Booking, type UserProfile, type Tournament } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();

    // Get profile
    const profileDoc = await db.collection("users").doc(user.uid).get();
    if (!profileDoc.exists) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    
    const profile = { id: profileDoc.id, ...profileDoc.data() } as UserProfile;

    // Get active bookings
    const bookingsSnapshot = await db.collection("bookings")
      .where("user_id", "==", user.uid)
      .where("status", "in", ["pending", "confirmed", "active"] as const)
      .get();
    
    const activeBookings: Booking[] = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));

    const tournamentsSnapshot = await db.collection("tournaments").get();
    const tournaments: Tournament[] = tournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Tournament));

    return NextResponse.json({
      profile,
      activeBookings,
      tournaments,
      stats: {
        activeBookings: activeBookings.length,
        totalBookings: bookingsSnapshot.size,
        totalHours3m: profile.hours_3m || 0,
        tournamentsCount: tournaments.length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
