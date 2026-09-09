import "server-only";

import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";

export async function parseJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "INVALID_REQUEST", "Invalid request.");
  }
}
