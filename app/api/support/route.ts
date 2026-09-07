import { NextResponse, type NextRequest } from "next/server";

// Простая защита от спама: не более 10 сообщений в минуту с одного IP
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function limited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

/**
 * POST /api/support — пересылка вопроса игрока админам в Telegram.
 * Требуются переменные окружения:
 *   TELEGRAM_BOT_TOKEN — токен бота (от @BotFather)
 *   TELEGRAM_ADMIN_CHAT_ID — ID админ-чата (узнать через @userinfobot)
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Слишком много сообщений, подожди минуту" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 2000) : "";

  if (!text) {
    return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  // Локальная разработка без настроенного бота: имитируем успех
  if (!token || !chatId || token.includes("placeholder")) {
    console.log("[support] (демо-режим, бот не настроен):", text);
    return NextResponse.json({ ok: true, demo: true });
  }

  const payload = {
    chat_id: chatId,
    text: `💬 <b>Вопрос с сайта</b>\n\n${text.replace(/</g, "&lt;")}`,
    parse_mode: "HTML",
  };

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!tg.ok) throw new Error(`Telegram: ${tg.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[support] telegram error:", e);
    return NextResponse.json({ error: "Ошибка доставки" }, { status: 502 });
  }
}
