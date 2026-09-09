import { NextResponse, type NextRequest } from "next/server";
import { and, eq, gt, isNull, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions } from "@/db/schema";
import { apiErrorResponse } from "@/lib/api/errors";
import { requireSession } from "@/lib/auth/session";
import { assertSameOrigin } from "@/lib/security/origin";

function getDevice(userAgent: string | null) {
  if (!userAgent) return "Неизвестное устройство";
  if (/mobile|android|iphone|ipad/i.test(userAgent)) return "Мобильное устройство";
  return "Браузер на компьютере";
}

export async function GET() {
  try {
    const current = await requireSession();
    const rows = await getDb().select({
      id: sessions.id,
      userAgent: sessions.userAgent,
      ipAddress: sessions.ipAddress,
      createdAt: sessions.createdAt,
      lastSeenAt: sessions.lastSeenAt,
      expiresAt: sessions.expiresAt,
    }).from(sessions).where(and(
      eq(sessions.userId, current.user.id),
      isNull(sessions.revokedAt),
      gt(sessions.expiresAt, new Date()),
    ));
    return NextResponse.json({
      sessions: rows.map((session) => ({
        id: session.id,
        ipAddress: session.ipAddress,
        createdAt: session.createdAt,
        lastSeenAt: session.lastSeenAt,
        device: getDevice(session.userAgent),
        current: session.id === current.session.id,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const current = await requireSession();
    const now = new Date();
    await getDb().update(sessions).set({ revokedAt: now }).where(and(
      eq(sessions.userId, current.user.id),
      ne(sessions.id, current.session.id),
      isNull(sessions.revokedAt),
    ));
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
