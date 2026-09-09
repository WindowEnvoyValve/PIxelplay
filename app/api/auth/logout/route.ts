import { NextResponse, type NextRequest } from "next/server";
import { assertSameOrigin } from "@/lib/security/origin";
import { destroySession } from "@/lib/auth/session";
import { apiErrorResponse } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await destroySession();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
