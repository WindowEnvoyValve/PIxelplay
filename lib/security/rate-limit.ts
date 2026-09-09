import "server-only";

import type { NextRequest } from "next/server";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export type RateLimitStore = {
  consume(key: string, limit: number, windowMs: number): RateLimitResult;
};

type Entry = {
  count: number;
  resetAt: number;
};

class InMemoryRateLimitStore implements RateLimitStore {
  private readonly entries = new Map<string, Entry>();

  consume(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const current = this.entries.get(key);
    const entry = current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + windowMs };

    entry.count += 1;
    this.entries.set(key, entry);

    return {
      allowed: entry.count <= limit,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
}

let store: RateLimitStore | undefined;

export function setRateLimitStore(nextStore: RateLimitStore) {
  store = nextStore;
}

function getStore() {
  if (store) return store;

  if (process.env.NODE_ENV !== "production" || process.env.RATE_LIMIT_STORE === "memory") {
    store = new InMemoryRateLimitStore();
    return store;
  }

  throw new Error(
    "A shared rate-limit store must be configured in production. Set RATE_LIMIT_STORE to a shared adapter.",
  );
}

export function getClientIp(request: NextRequest) {
  const trustProxyHeaders = process.env.NODE_ENV !== "production"
    || process.env.TRUST_PROXY_HEADERS === "1";
  if (!trustProxyHeaders) return null;

  const forwarded = request.headers.get("x-forwarded-for");
  const forwardedIp = forwarded?.split(",").map((value) => value.trim()).find(Boolean);
  return forwardedIp || request.headers.get("x-real-ip")?.trim() || null;
}

export function getRateLimitClientKey(request: NextRequest) {
  return getClientIp(request) || "untrusted-client";
}

export function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const result = getStore().consume(key, limit, windowMs);
  if (!result.allowed) {
    return {
      allowed: false,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    };
  }

  return { allowed: true, headers: undefined };
}
