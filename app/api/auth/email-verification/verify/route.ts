import { NextResponse, type NextRequest } from "next/server";
import { verifyEmailToken } from "@/lib/auth/recovery";
import { ApiError, apiErrorResponse } from "@/lib/api/errors";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit, getRateLimitClientKey } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const rateLimit = enforceRateLimit(`email-verification-verify:${getRateLimitClientKey(request)}`, 20, 15 * 60 * 1000);
    if (!rateLimit.allowed) throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);
    const token = request.nextUrl.searchParams.get("token")?.trim();
    if (!token) throw new ApiError(400, "INVALID_REQUEST", "Invalid verification link.");
    const verified = await verifyEmailToken(token);
    if (!verified) throw new ApiError(400, "INVALID_REQUEST", "Verification link is invalid or expired.");
    return NextResponse.json({ success: true, message: "Email успешно подтверждён." });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
