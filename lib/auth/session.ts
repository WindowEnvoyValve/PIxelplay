import "server-only";

import { and, eq, gt, isNull, or, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { ApiError } from "@/lib/api/errors";
import { toSafeUser } from "@/lib/api/user";
import { createSessionToken, hashSessionToken } from "@/lib/auth/session-token";
import { getClientIp } from "@/lib/security/rate-limit";

const DEFAULT_COOKIE_NAME = "pixelplay_session";
const DEFAULT_TTL_DAYS = 30;
const LAST_SEEN_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

function getCookieName() {
  return process.env.AUTH_SESSION_COOKIE || DEFAULT_COOKIE_NAME;
}

function getSessionTtlDays() {
  const value = Number(process.env.AUTH_SESSION_TTL_DAYS || DEFAULT_TTL_DAYS);
  return Number.isFinite(value) && value > 0 && value <= 365 ? value : DEFAULT_TTL_DAYS;
}

function getRequestIp(request: NextRequest) {
  return getClientIp(request);
}

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

async function setSessionCookie(token: string, maxAge: number) {
  const cookieStore = await cookies();
  cookieStore.set(getCookieName(), token, getCookieOptions(maxAge));
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(getCookieName(), "", { ...getCookieOptions(0), expires: new Date(0) });
}

export async function createSession(userId: string, request: NextRequest) {
  const token = createSessionToken();
  const now = new Date();
  const ttlSeconds = getSessionTtlDays() * 24 * 60 * 60;
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

  await getDb().insert(sessions).values({
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
    createdAt: now,
    lastSeenAt: now,
    ipAddress: getRequestIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  await setSessionCookie(token, ttlSeconds);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!token) return null;

  const now = new Date();
  const tokenHash = hashSessionToken(token);
  const result = await getDb()
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, now),
        eq(users.status, "active"),
      ),
    )
    .limit(1);

  const record = result[0];
  if (!record) return null;

  if (
    !record.session.lastSeenAt
    || now.getTime() - record.session.lastSeenAt.getTime() > LAST_SEEN_UPDATE_INTERVAL_MS
  ) {
    await getDb()
      .update(sessions)
      .set({ lastSeenAt: now })
      .where(
        and(
          eq(sessions.id, record.session.id),
          or(
            isNull(sessions.lastSeenAt),
            lt(sessions.lastSeenAt, new Date(now.getTime() - LAST_SEEN_UPDATE_INTERVAL_MS)),
          ),
        ),
      );
  }

  return { session: record.session, user: record.user };
}

export async function getCurrentUser() {
  const session = await getSession();
  return session ? toSafeUser(session.user) : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required.");
  }
  return user;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required.");
  }
  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (token) {
    await getDb()
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.tokenHash, hashSessionToken(token)), isNull(sessions.revokedAt)));
  }
  await clearSessionCookie();
}
