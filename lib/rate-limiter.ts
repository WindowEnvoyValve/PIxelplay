import { NextResponse, type NextRequest } from "next/server";

// Простой rate limiter в памяти
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  default: { windowMs: 60_000, maxRequests: 60 },
  "/api/chat": { windowMs: 60_000, maxRequests: 30 },
  "/api/auth": { windowMs: 60_000, maxRequests: 10 },
  "/api/admin": { windowMs: 60_000, maxRequests: 30 },
};

function getRateLimitConfig(path: string) {
  for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
    if (path.startsWith(prefix)) return config;
  }
  return RATE_LIMITS.default;
}

export function rateLimitMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const key = `${ip}:${path}`;
  const config = getRateLimitConfig(path);

  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
  } else if (limit.count >= config.maxRequests) {
    return NextResponse.json(
      { error: "Слишком много запросов. Подождите минуту" },
      { status: 429 }
    );
  } else {
    limit.count++;
  }

  return NextResponse.next();
}
