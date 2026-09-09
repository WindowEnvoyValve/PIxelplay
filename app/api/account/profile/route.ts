import { NextResponse, type NextRequest } from "next/server";
import { and, eq, isNull, ne, or } from "drizzle-orm";
import { getDb } from "@/db";
import { emailVerificationTokens, users } from "@/db/schema";
import { apiErrorResponse, ApiError, isUniqueViolation } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { requireUser } from "@/lib/auth/session";
import { normalizeEmail, normalizePhone } from "@/lib/auth/normalize";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { profileUpdateSchema } from "@/lib/validation/auth";
import { toSafeUser } from "@/lib/api/user";

export async function PATCH(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const rateLimit = enforceRateLimit(`profile:${user.id}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);

    const input = profileUpdateSchema.parse(await parseJson(request));
    const email = input.email === undefined ? undefined : normalizeEmail(input.email);
    const phone = input.phone === undefined ? undefined : normalizePhone(input.phone);
    const telegram = input.telegram === undefined ? undefined : input.telegram || null;
    const vk = input.vk === undefined ? undefined : input.vk || null;
    const discord = input.discord === undefined ? undefined : input.discord || null;
    const matrix = input.matrix === undefined ? undefined : input.matrix || null;
    const steam = input.steam === undefined ? undefined : input.steam || null;
    const jabber = input.jabber === undefined ? undefined : input.jabber || null;
    const faceit = input.faceit === undefined ? undefined : input.faceit || null;
    const gender = input.gender === undefined ? undefined : input.gender || null;
    const birthday = input.birthday === undefined ? undefined : input.birthday || null;
    const interests = input.interests === undefined ? undefined : input.interests || null;
    if (phone !== undefined && !/^\+[1-9]\d{7,14}$/.test(phone)) {
      throw new ApiError(400, "INVALID_REQUEST", "Invalid request.");
    }

    const values: { email?: string; phone?: string; telegram?: string | null; vk?: string | null; discord?: string | null; matrix?: string | null; steam?: string | null; jabber?: string | null; faceit?: string | null; gender?: string | null; birthday?: string | null; interests?: string | null; emailVerifiedAt?: Date | null; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (email !== undefined) {
      values.email = email;
      if (email !== user.email) values.emailVerifiedAt = null;
    }
    if (phone !== undefined) values.phone = phone;
    if (telegram !== undefined) values.telegram = telegram;
    if (vk !== undefined) values.vk = vk;
    if (discord !== undefined) values.discord = discord;
    if (matrix !== undefined) values.matrix = matrix;
    if (steam !== undefined) values.steam = steam;
    if (jabber !== undefined) values.jabber = jabber;
    if (faceit !== undefined) values.faceit = faceit;
    if (gender !== undefined) values.gender = gender;
    if (birthday !== undefined) values.birthday = birthday;
    if (interests !== undefined) values.interests = interests;
    const updated = await getDb().transaction(async (tx) => {
      const conflicts = [email ? eq(users.email, email) : undefined, phone ? eq(users.phone, phone) : undefined]
        .filter((condition): condition is ReturnType<typeof eq> => condition !== undefined);
      if (conflicts.length) {
        const existing = await tx.select({ id: users.id }).from(users)
          .where(and(ne(users.id, user.id), or(...conflicts))).limit(1);
        if (existing.length) throw new ApiError(409, "IDENTIFIER_ALREADY_EXISTS", "Email or phone is already in use.");
      }
      const [updatedUser] = await tx.update(users).set(values).where(eq(users.id, user.id)).returning();
      if (email !== undefined && email !== user.email) {
        await tx.update(emailVerificationTokens).set({ usedAt: new Date() }).where(and(
          eq(emailVerificationTokens.userId, user.id),
          isNull(emailVerificationTokens.usedAt),
        ));
      }
      return updatedUser;
    });
    return NextResponse.json({ user: toSafeUser(updated) });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return apiErrorResponse(new ApiError(409, "IDENTIFIER_ALREADY_EXISTS", "Email or phone is already in use."));
    }
    return apiErrorResponse(error);
  }
}
