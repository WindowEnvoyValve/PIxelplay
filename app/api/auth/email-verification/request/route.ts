import { NextResponse, type NextRequest } from "next/server";
import { getEmailTransport, getPublicAppUrl } from "@/lib/email/transport";
import { issueEmailVerificationToken } from "@/lib/auth/recovery";
import { requireUser } from "@/lib/auth/session";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";
import { assertSameOrigin } from "@/lib/security/origin";
import { enforceRateLimit } from "@/lib/security/rate-limit";

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
    const user = await requireUser();
    const rateLimit = enforceRateLimit(`email-verification:${user.id}`, 3, 60 * 60 * 1000);
    if (!rateLimit.allowed) throw new ApiError(429, "RATE_LIMITED", "Too many requests.", rateLimit.headers);
    if (user.emailVerifiedAt) {
      return NextResponse.json({ status: "already_verified", message: "Email уже подтверждён." });
    }

    const transport = getEmailTransport();
    const token = await issueEmailVerificationToken(user.id);
    const url = `${getPublicAppUrl()}/api/auth/email-verification/verify?token=${token}`;
    const htmlUrl = escapeHtml(url);
    await transport.send({
      to: user.email,
      subject: "Подтвердите email в PixelPlay",
      text: `Здравствуйте!\n\nПодтвердите email в PixelPlay по ссылке:\n${url}\n\nСсылка действительна 24 часа. Если вы не регистрировались в PixelPlay, просто проигнорируйте это письмо.`,
      html: `<p>Здравствуйте!</p><p>Подтвердите email в PixelPlay, чтобы завершить настройку аккаунта.</p><p><a href="${htmlUrl}" style="display:inline-block;padding:12px 20px;background:#ff6a00;color:#fff;text-decoration:none;border-radius:8px">Подтвердить email</a></p><p>Если кнопка не работает, откройте URL:</p><p>${htmlUrl}</p><p>Ссылка действительна 24 часа. Если вы не регистрировались в PixelPlay, просто проигнорируйте это письмо.</p>`,
    });
    return NextResponse.json({ status: "sent", message: "Письмо с подтверждением отправлено." });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
