import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { normalizeEmail } from "@/lib/auth/normalize";
import { issuePasswordResetToken } from "@/lib/auth/recovery";
import { getEmailTransport, getPublicAppUrl } from "@/lib/email/transport";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit, getRateLimitClientKey } from "@/lib/security/rate-limit";
import { passwordResetRequestSchema } from "@/lib/validation/auth";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const rateLimit = enforceRateLimit(`password-reset:${getRateLimitClientKey(request)}`, 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);

    const input = passwordResetRequestSchema.parse(await parseJson(request));
    const email = normalizeEmail(input.email);
    const transport = getEmailTransport();
    const [user] = await getDb().select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email)).limit(1);
    if (user) {
      const token = await issuePasswordResetToken(user.id);
      const url = `${getPublicAppUrl()}/reset-password?token=${token}`;
      const htmlUrl = escapeHtml(url);
      await transport.send({
        to: user.email,
        subject: "Восстановление пароля PixelPlay",
        text: `Здравствуйте!\n\nПоступил запрос на восстановление пароля PixelPlay. Откройте ссылку:\n${url}\n\nСсылка действительна 1 час. Если вы не запрашивали восстановление, просто проигнорируйте это письмо.`,
        html: `<p>Здравствуйте!</p><p>Поступил запрос на восстановление пароля PixelPlay.</p><p><a href="${htmlUrl}" style="display:inline-block;padding:12px 20px;background:#ff6a00;color:#fff;text-decoration:none;border-radius:8px">Восстановить пароль</a></p><p>Если кнопка не работает, откройте URL:</p><p>${htmlUrl}</p><p>Ссылка действительна 1 час. Если вы не запрашивали восстановление, просто проигнорируйте это письмо.</p>`,
      });
    }
    return NextResponse.json({ message: "Если аккаунт с таким email существует, инструкции будут отправлены на почту." });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
