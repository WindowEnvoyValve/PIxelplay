import "server-only";

import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const requestHost = request.headers.get("host") || new URL(request.url).host;

  if (!origin) return;

  const originUrl = new URL(origin);
  const allowedOrigins = new Set<string>();

  if (configuredOrigin) {
    allowedOrigins.add(new URL(configuredOrigin).origin);
  }

  if (!allowedOrigins.has(originUrl.origin) && originUrl.host !== requestHost) {
    throw new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.");
  }
}
