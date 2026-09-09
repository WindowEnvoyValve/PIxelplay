import { NextResponse, type NextRequest } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions } from "@/db/schema";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";
import { requireSession } from "@/lib/auth/session";
import { assertSameOrigin } from "@/lib/security/origin";
import { z } from "zod";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const current = await requireSession();
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) {
      throw new ApiError(400, "INVALID_REQUEST", "Invalid session id.");
    }
    if (id === current.session.id) throw new ApiError(400, "INVALID_REQUEST", "Текущую сессию нельзя завершить здесь.");
    const [revoked] = await getDb().update(sessions).set({ revokedAt: new Date() }).where(and(
      eq(sessions.id, id),
      eq(sessions.userId, current.user.id),
      isNull(sessions.revokedAt),
    )).returning({ id: sessions.id });
    if (!revoked) throw new ApiError(404, "SESSION_NOT_FOUND", "Сессия не найдена.");
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
