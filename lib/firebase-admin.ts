import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

export interface Club {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone?: string;
  location: { lat: number; lng: number };
  layout_json: Record<string, unknown>;
  open_hours: Record<string, unknown>;
  is_active: boolean;
  status?: string;
  created_at: string;
}

export interface Computer {
  id: string;
  club_id: string;
  number: number;
  zone_type: string;
  specs: Record<string, string>;
  status: string;
  price_per_hour: number;
  grid_pos?: Record<string, number>;
}

export interface Booking {
  id: string;
  user_id: string;
  club_id: string;
  pc_id: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  payment_method: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  is_deleted: boolean;
  is_muted: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  role: string;
  loyalty_level: string;
  hours_3m: number;
  total_hours: number;
  balance: number;
  bonus_balance: number;
  birth_date?: string;
  phone?: string;
  created_at: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  discipline?: string;
  description?: string;
  prize_pool: number;
  entry_fee: number;
  max_teams: number;
  team_size: number;
  starts_at: string;
  status: string;
}

let db: Firestore | null = null;

export function getDb(): Firestore {
  if (!db && !getApps().length) {
    const app: App = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    db = getFirestore(app);
  }
  return db!;
}

export async function getUserFromRequest(req: NextRequest): Promise<import("firebase-admin/auth").DecodedIdToken | null> {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    if (!sessionCookie) return null;
    return await getAuth().verifyIdToken(sessionCookie);
  } catch {
    return null;
  }
}
