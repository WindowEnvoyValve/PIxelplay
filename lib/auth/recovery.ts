import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { emailVerificationTokens, passwordResetTokens, sessions, users } from "@/db/schema";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

function createToken() {
  return randomBytes(32).toString("hex");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueEmailVerificationToken(userId: string) {
  const token = createToken();
  const now = new Date();
  await getDb().transaction(async (tx) => {
    await tx.update(emailVerificationTokens)
      .set({ usedAt: now })
      .where(and(eq(emailVerificationTokens.userId, userId), isNull(emailVerificationTokens.usedAt)));
    await tx.insert(emailVerificationTokens).values({
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(now.getTime() + EMAIL_VERIFICATION_TTL_MS),
      createdAt: now,
    });
  });
  return token;
}

export async function verifyEmailToken(token: string) {
  const now = new Date();
  return getDb().transaction(async (tx) => {
    const [claimed] = await tx.update(emailVerificationTokens)
      .set({ usedAt: now })
      .where(and(
        eq(emailVerificationTokens.tokenHash, hashToken(token)),
        isNull(emailVerificationTokens.usedAt),
        gt(emailVerificationTokens.expiresAt, now),
      ))
      .returning({ userId: emailVerificationTokens.userId });
    if (!claimed) return false;

    await tx.update(users)
      .set({ emailVerifiedAt: now, updatedAt: now })
      .where(eq(users.id, claimed.userId));
    return true;
  });
}

export async function issuePasswordResetToken(userId: string) {
  const token = createToken();
  const now = new Date();
  await getDb().transaction(async (tx) => {
    await tx.update(passwordResetTokens)
      .set({ usedAt: now })
      .where(and(eq(passwordResetTokens.userId, userId), isNull(passwordResetTokens.usedAt)));
    await tx.insert(passwordResetTokens).values({
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(now.getTime() + PASSWORD_RESET_TTL_MS),
      createdAt: now,
    });
  });
  return token;
}

export async function resetPasswordWithToken(token: string, passwordHash: string) {
  const now = new Date();
  return getDb().transaction(async (tx) => {
    const [claimed] = await tx.update(passwordResetTokens)
      .set({ usedAt: now })
      .where(and(
        eq(passwordResetTokens.tokenHash, hashToken(token)),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, now),
      ))
      .returning({ userId: passwordResetTokens.userId });
    if (!claimed) return false;

    await tx.update(users)
      .set({ passwordHash, updatedAt: now })
      .where(eq(users.id, claimed.userId));
    await tx.update(sessions)
      .set({ revokedAt: now })
      .where(and(eq(sessions.userId, claimed.userId), isNull(sessions.revokedAt)));
    return true;
  });
}
