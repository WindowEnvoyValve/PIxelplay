import "server-only";

import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const requestOrigin = new URL(request.url).origin;
  const requestUrl = new URL(request.url);
  const requestHost = request.headers.get("host");

  if (requestHost && requestHost !== requestUrl.host) {
    throw new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.");
  }

  if (!origin) return;

  const allowedOrigins = new Set([requestOrigin]);

  if (configuredOrigin) {
    allowedOrigins.add(new URL(configuredOrigin).origin);
  }

  if (!allowedOrigins.has(origin)) {
    throw new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.");
  }
}
