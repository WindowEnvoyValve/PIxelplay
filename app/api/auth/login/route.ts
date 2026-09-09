import { NextResponse, type NextRequest } from "next/server";
import { eq, or } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { normalizeEmail, normalizeIdentifier, normalizeLogin, normalizePhone } from "@/lib/auth/normalize";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";
import { toSafeUser } from "@/lib/api/user";
import { parseJson } from "@/lib/api/request";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit, getRateLimitClientKey } from "@/lib/security/rate-limit";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const input = loginSchema.parse(await parseJson(request));
    const identifier = normalizeIdentifier(input.identifier);
    const rateLimit = enforceRateLimit(
      `login:${getRateLimitClientKey(request)}:${identifier}`,
      5,
      15 * 60 * 1000,
    );
    if (!rateLimit.allowed) {
      throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);
    }
    const phone = normalizePhone(identifier);
    const candidates = [identifier, normalizeLogin(identifier), normalizeEmail(identifier), phone];
    const [user] = await getDb()
      .select()
      .from(users)
      .where(
        or(
          ...candidates.map((candidate) => eq(users.login, candidate)),
          ...candidates.map((candidate) => eq(users.email, candidate)),
          ...candidates.map((candidate) => eq(users.phone, candidate)),
        ),
      )
      .limit(1);

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials.");
    }
    if (user.status !== "active") {
      throw new ApiError(403, "ACCOUNT_BLOCKED", "Account is not available.");
    }

    const [updatedUser] = await getDb()
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
    await createSession(user.id, request);
    return NextResponse.json({ user: toSafeUser(updatedUser) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
