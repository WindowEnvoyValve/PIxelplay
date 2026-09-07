import { NextResponse, type NextRequest } from "next/server";
import { getDb, getUserFromRequest, type UserProfile } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const doc = await db.collection("users").doc(user.uid).get();
    
    if (!doc.exists) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const profile: UserProfile = {
      id: doc.id,
      ...doc.data(),
    } as UserProfile;

    return NextResponse.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
