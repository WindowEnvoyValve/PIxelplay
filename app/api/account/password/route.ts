import { NextResponse, type NextRequest } from "next/server";
import { and, eq, isNull, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { requireSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { passwordChangeSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const current = await requireSession();
    const rateLimit = enforceRateLimit(`password:${current.user.id}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);
    const input = passwordChangeSchema.parse(await parseJson(request));
    if (!(await verifyPassword(input.currentPassword, current.user.passwordHash))) {
      throw new ApiError(400, "INVALID_CURRENT_PASSWORD", "Текущий пароль указан неверно.");
    }
    const passwordHash = await hashPassword(input.newPassword);
    const now = new Date();
    await getDb().transaction(async (tx) => {
      await tx.update(users).set({ passwordHash, updatedAt: now }).where(eq(users.id, current.user.id));
      await tx.update(sessions).set({ revokedAt: now }).where(and(
        eq(sessions.userId, current.user.id),
        ne(sessions.id, current.session.id),
        isNull(sessions.revokedAt),
      ));
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
