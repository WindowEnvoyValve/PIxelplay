import { NextResponse, type NextRequest } from "next/server";
import { eq, or } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth/session";
import { normalizeEmail, normalizeLogin, normalizePhone } from "@/lib/auth/normalize";
import { hashPassword } from "@/lib/auth/password";
import { apiErrorResponse, ApiError, isUniqueViolation } from "@/lib/api/errors";
import { toSafeUser } from "@/lib/api/user";
import { parseJson } from "@/lib/api/request";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit, getRateLimitClientKey } from "@/lib/security/rate-limit";
import { registrationSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const rateLimit = enforceRateLimit(
      `register:${getRateLimitClientKey(request)}`,
      5,
      60 * 60 * 1000,
    );
    if (!rateLimit.allowed) {
      throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);
    }

    const input = registrationSchema.parse(await parseJson(request));
    const login = normalizeLogin(input.login);
    const phone = normalizePhone(input.phone);
    const email = normalizeEmail(input.email);

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request.");
    }

    const existing = await getDb()
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.login, login), eq(users.phone, phone), eq(users.email, email)))
      .limit(1);
    if (existing.length > 0) {
      throw new ApiError(409, "IDENTIFIER_ALREADY_EXISTS", "Registration data is already in use.");
    }

    const passwordHash = await hashPassword(input.password);
    const [user] = await getDb()
      .insert(users)
      .values({ login, phone, email, passwordHash })
      .returning();

    await createSession(user.id, request);
    return NextResponse.json({ user: toSafeUser(user) }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return apiErrorResponse(new ApiError(409, "IDENTIFIER_ALREADY_EXISTS", "Registration data is already in use."));
    }
    return apiErrorResponse(error);
  }
}
