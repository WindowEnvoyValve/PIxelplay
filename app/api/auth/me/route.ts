import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { apiErrorResponse, ApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError(401, "UNAUTHORIZED", "Authentication required.");
    }
    return NextResponse.json({ user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
