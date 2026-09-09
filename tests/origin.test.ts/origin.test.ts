import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { assertSameOrigin } from "@/lib/security/origin";

test("same-origin checks use the public host behind a reverse proxy", () => {
  const request = new NextRequest("http://internal-service/api/auth/login", {
    method: "POST",
    headers: {
      host: "pixelplay-production.up.railway.app",
      origin: "https://pixelplay-production.up.railway.app",
    },
  });

  assert.doesNotThrow(() => assertSameOrigin(request));
});

test("same-origin checks reject a foreign origin", () => {
  const request = new NextRequest("http://internal-service/api/auth/login", {
    method: "POST",
    headers: {
      host: "pixelplay-production.up.railway.app",
      origin: "https://attacker.example",
    },
  });

  assert.throws(() => assertSameOrigin(request), /Origin is not allowed/);
});
