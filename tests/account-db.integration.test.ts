import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import test from "node:test";
import { and, eq, isNull, ne } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { emailVerificationTokens, passwordResetTokens, sessions, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { issueEmailVerificationToken, issuePasswordResetToken, resetPasswordWithToken, verifyEmailToken } from "@/lib/auth/recovery";
import { POST as requestPasswordReset } from "@/app/api/auth/password-reset/request/route";

const integrationOptions = {
  skip: !process.env.DATABASE_URL
    ? "DATABASE_URL is required for account database integration tests."
    : false,
};

test("account database constraints, password changes, session ownership, contacts, and email verification reset", integrationOptions, async () => {
  const rollback = Symbol("rollback");
  const db = getDb();

  try {
    await db.transaction(async (tx) => {
      const passwordHash = await hashPassword("old-password-123");
      const [user] = await tx.insert(users).values({
        login: `stage5a_${randomUUID().slice(0, 8)}`,
        phone: "+375291234567",
        email: `stage5a_${randomUUID().slice(0, 8)}@example.com`,
        passwordHash,
        emailVerifiedAt: new Date(),
        telegram: "user123",
        discord: "discord_user",
        vk: "https://vk.com/id1",
        matrix: "@user:example.org",
        steam: "https://steamcommunity.com/id/user",
        jabber: "user@example.org",
        faceit: "faceit_user",
      }).returning({ id: users.id, email: users.email, phone: users.phone });

      await assert.rejects(
        () => tx.transaction((nested) => nested.insert(users).values({
          login: `duplicate_email_${randomUUID().slice(0, 8)}`,
          phone: `+375291${randomInt(100000, 999999)}`,
          email: user.email,
          passwordHash,
        })),
        (error: unknown) => typeof error === "object" && error !== null
          && "code" in error && (error as { code?: string }).code === "23505",
      );
      await assert.rejects(
        () => tx.transaction((nested) => nested.insert(users).values({
          login: `duplicate_phone_${randomUUID().slice(0, 8)}`,
          phone: user.phone,
          email: `duplicate_${randomUUID().slice(0, 8)}@example.com`,
          passwordHash,
        })),
        (error: unknown) => typeof error === "object" && error !== null
          && "code" in error && (error as { code?: string }).code === "23505",
      );

      const sessionDefaults = {
        tokenHash: randomUUID().replaceAll("-", "").padEnd(64, "0"),
        expiresAt: new Date(Date.now() + 86_400_000),
      };
      const [currentSession] = await tx.insert(sessions).values({ ...sessionDefaults, userId: user.id }).returning({ id: sessions.id });
      const [otherSession] = await tx.insert(sessions).values({
        ...sessionDefaults,
        tokenHash: randomUUID().replaceAll("-", "").padEnd(64, "1"),
        userId: user.id,
      }).returning({ id: sessions.id });
      const [foreignUser] = await tx.insert(users).values({
        login: `foreign_${randomUUID().slice(0, 8)}`,
        phone: `+375291${randomInt(100000, 999999)}`,
        email: `foreign_${randomUUID().slice(0, 8)}@example.com`,
        passwordHash,
      }).returning({ id: users.id });
      const [foreignSession] = await tx.insert(sessions).values({
        ...sessionDefaults,
        tokenHash: randomUUID().replaceAll("-", "").padEnd(64, "2"),
        userId: foreignUser.id,
      }).returning({ id: sessions.id });

      const newPasswordHash = await hashPassword("new-password-123");
      await tx.update(users).set({
        passwordHash: newPasswordHash,
        email: "changed@example.com",
        emailVerifiedAt: null,
        telegram: "updated_user",
      }).where(eq(users.id, user.id));
      await tx.update(sessions).set({ revokedAt: new Date() }).where(and(
        eq(sessions.userId, user.id),
        ne(sessions.id, currentSession.id),
        isNull(sessions.revokedAt),
      ));

      const [updatedUser] = await tx.select({
        email: users.email,
        emailVerifiedAt: users.emailVerifiedAt,
        telegram: users.telegram,
      }).from(users).where(eq(users.id, user.id));
      assert.equal(updatedUser.email, "changed@example.com");
      assert.equal(updatedUser.emailVerifiedAt, null);
      assert.equal(updatedUser.telegram, "updated_user");
      assert.equal(await verifyPassword("new-password-123", newPasswordHash), true);
      assert.equal(await verifyPassword("old-password-123", newPasswordHash), false);

      const [revokedOther] = await tx.select({ revokedAt: sessions.revokedAt }).from(sessions).where(eq(sessions.id, otherSession.id));
      const [keptCurrent] = await tx.select({ revokedAt: sessions.revokedAt }).from(sessions).where(eq(sessions.id, currentSession.id));
      assert.ok(revokedOther.revokedAt);
      assert.equal(keptCurrent.revokedAt, null);

      const foreignRevoke = await tx.update(sessions).set({ revokedAt: new Date() }).where(and(
        eq(sessions.id, foreignSession.id),
        eq(sessions.userId, user.id),
        isNull(sessions.revokedAt),
      )).returning({ id: sessions.id });
      assert.equal(foreignRevoke.length, 0);

      throw rollback;
    });
  } catch (error) {
    if (error !== rollback) throw error;
  }
});

test("email verification and password reset tokens are single-use, expiring, and revoke sessions", integrationOptions, async () => {
  const db = getDb();
  const oldPasswordHash = await hashPassword("old-password-123");
  const [user] = await db.insert(users).values({
    login: `stage5b_${randomUUID().slice(0, 8)}`,
    phone: `+375291${randomInt(100000, 999999)}`,
    email: `stage5b_${randomUUID().slice(0, 8)}@example.com`,
    passwordHash: oldPasswordHash,
  }).returning({ id: users.id });

  try {
    const oldVerificationToken = await issueEmailVerificationToken(user.id);
    const activeVerificationToken = await issueEmailVerificationToken(user.id);
    assert.equal(await verifyEmailToken(oldVerificationToken), false);
    assert.equal(await verifyEmailToken("invalid-verification-token"), false);
    assert.equal(await verifyEmailToken(activeVerificationToken), true);
    assert.equal(await verifyEmailToken(activeVerificationToken), false);
    const [verifiedUser] = await db.select({ emailVerifiedAt: users.emailVerifiedAt }).from(users).where(eq(users.id, user.id));
    assert.ok(verifiedUser.emailVerifiedAt);

    const expiredVerificationToken = await issueEmailVerificationToken(user.id);
    await db.update(emailVerificationTokens).set({ expiresAt: new Date(Date.now() - 1_000) })
      .where(eq(emailVerificationTokens.userId, user.id));
    assert.equal(await verifyEmailToken(expiredVerificationToken), false);

    const sessionDefaults = {
      tokenHash: randomUUID().replaceAll("-", "").padEnd(64, "a"),
      expiresAt: new Date(Date.now() + 86_400_000),
    };
    await db.insert(sessions).values({ ...sessionDefaults, userId: user.id });
    await db.insert(sessions).values({
      ...sessionDefaults,
      tokenHash: randomUUID().replaceAll("-", "").padEnd(64, "b"),
      userId: user.id,
    });

    const resetToken = await issuePasswordResetToken(user.id);
    const newPasswordHash = await hashPassword("new-password-123");
    assert.equal(await resetPasswordWithToken(resetToken, newPasswordHash), true);
    assert.equal(await resetPasswordWithToken(resetToken, await hashPassword("another-password-123")), false);
    assert.equal(await verifyPassword("new-password-123", newPasswordHash), true);
    assert.equal(await verifyPassword("old-password-123", newPasswordHash), false);
    const activeSessions = await db.select({ id: sessions.id }).from(sessions)
      .where(and(eq(sessions.userId, user.id), isNull(sessions.revokedAt)));
    assert.equal(activeSessions.length, 0);

    const expiredResetToken = await issuePasswordResetToken(user.id);
    await db.update(passwordResetTokens).set({ expiresAt: new Date(Date.now() - 1_000) })
      .where(eq(passwordResetTokens.userId, user.id));
    assert.equal(await resetPasswordWithToken(expiredResetToken, newPasswordHash), false);
  } finally {
    await db.delete(users).where(eq(users.id, user.id));
  }
});

test("password reset request has an equivalent response for existing and unknown emails", integrationOptions, async () => {
  const db = getDb();
  const [user] = await db.insert(users).values({
    login: `stage5b_request_${randomUUID().slice(0, 8)}`,
    phone: `+375291${randomInt(100000, 999999)}`,
    email: `stage5b_request_${randomUUID().slice(0, 8)}@example.com`,
    passwordHash: await hashPassword("old-password-123"),
  }).returning({ id: users.id, email: users.email });

  try {
    const makeRequest = (email: string) => new NextRequest("http://127.0.0.1:3000/api/auth/password-reset/request", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": randomUUID(),
      },
      body: JSON.stringify({ email }),
    });
    const existingResponse = await requestPasswordReset(makeRequest(user.email));
    const unknownResponse = await requestPasswordReset(makeRequest("unknown@example.com"));
    assert.equal(existingResponse.status, unknownResponse.status);
    assert.deepEqual(await existingResponse.json(), await unknownResponse.json());
  } finally {
    await db.delete(users).where(eq(users.id, user.id));
  }
});
