import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, hashSessionToken } from "@/lib/auth/session-token";
import {
  normalizeEmail,
  normalizeIdentifier,
  normalizeLogin,
  normalizePhone,
} from "@/lib/auth/normalize";
import { toSafeUser } from "@/lib/api/user";

test("Argon2id hashes verify without exposing the plaintext password", async () => {
  const password = "correct horse battery staple";
  const hash = await hashPassword(password);

  assert.notEqual(hash, password);
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword("wrong password", hash), false);
});

test("identifiers are normalized before persistence", () => {
  assert.equal(normalizeLogin(" Player.One "), "player.one");
  assert.equal(normalizeEmail(" USER@Example.COM "), "user@example.com");
  assert.equal(normalizePhone(" +375 (29) 123-45-67 "), "+375291234567");
  assert.equal(normalizeIdentifier(" Player.One "), "player.one");
});

test("session tokens are random and only their hashes are persisted", () => {
  const first = createSessionToken();
  const second = createSessionToken();

  assert.equal(first.length, 64);
  assert.equal(second.length, 64);
  assert.notEqual(first, second);
  assert.match(hashSessionToken(first), /^[a-f0-9]{64}$/);
  assert.notEqual(hashSessionToken(first), first);
});

test("safe user serialization excludes passwordHash", () => {
  const safeUser = toSafeUser({
    id: "user-id",
    login: "player",
    phone: "+375291234567",
    email: "player@example.com",
    telegram: null,
    vk: null,
    discord: null,
    matrix: null,
    steam: null,
    jabber: null,
    faceit: null,
    gender: null,
    birthday: null,
    interests: null,
    passwordHash: "secret-hash",
    status: "active",
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null,
  });

  assert.equal("passwordHash" in safeUser, false);
  assert.equal(safeUser.login, "player");
});
