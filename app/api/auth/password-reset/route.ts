import { NextResponse, type NextRequest } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordWithToken } from "@/lib/auth/recovery";
import { clearSessionCookie } from "@/lib/auth/session";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit, getRateLimitClientKey } from "@/lib/security/rate-limit";
import { passwordResetSchema } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const rateLimit = enforceRateLimit(`password-reset-complete:${getRateLimitClientKey(request)}`, 10, 60 * 60 * 1000);
    if (!rateLimit.allowed) throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);
    const input = passwordResetSchema.parse(await parseJson(request));
    const passwordHash = await hashPassword(input.newPassword);
    const reset = await resetPasswordWithToken(input.token, passwordHash);
    if (!reset) throw new ApiError(400, "INVALID_REQUEST", "Reset link is invalid or expired.");
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: "Пароль изменён. Войдите с новым паролем." });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
