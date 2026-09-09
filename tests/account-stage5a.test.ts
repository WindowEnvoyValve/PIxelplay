import assert from "node:assert/strict";
import test from "node:test";
import { passwordChangeSchema, passwordResetRequestSchema, passwordResetSchema, profileUpdateSchema } from "@/lib/validation/auth";

test("profile updates require a valid email or phone field", () => {
  assert.equal(profileUpdateSchema.safeParse({ email: "NEW@Example.com" }).success, true);
  assert.equal(profileUpdateSchema.safeParse({ phone: "+375291234567" }).success, true);
  assert.equal(profileUpdateSchema.safeParse({ email: "not-an-email" }).success, false);
  assert.equal(profileUpdateSchema.safeParse({}).success, false);
});

test("birthday validation accepts real dates and rejects impossible dates", () => {
  assert.equal(profileUpdateSchema.safeParse({ birthday: "2020-02-29" }).success, true);
  assert.equal(profileUpdateSchema.safeParse({ birthday: "2020-99-99" }).success, false);
  assert.equal(profileUpdateSchema.safeParse({ birthday: "2021-02-29" }).success, false);
  assert.equal(profileUpdateSchema.safeParse({ email: "user@example.com", birthday: "" }).success, true);
});

test("contact values are trimmed, bounded, and reject control characters", () => {
  const parsed = profileUpdateSchema.safeParse({
    telegram: "  user123  ",
    discord: "byjimenez",
    vk: "https://vk.com/id1",
    matrix: "@admin:example.org",
    steam: "https://steamcommunity.com/id/example",
    jabber: "user@example.org",
    faceit: "player_123",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.telegram, "user123");
  assert.equal(profileUpdateSchema.safeParse({ telegram: "user\u0000name" }).success, false);
  assert.equal(profileUpdateSchema.safeParse({ discord: "x".repeat(129) }).success, false);
});

test("password changes require a strong matching confirmation", () => {
  assert.equal(passwordChangeSchema.safeParse({
    currentPassword: "old-password",
    newPassword: "new-password-123",
    confirmPassword: "new-password-123",
  }).success, true);
  assert.equal(passwordChangeSchema.safeParse({
    currentPassword: "old-password",
    newPassword: "short",
    confirmPassword: "short",
  }).success, false);
  assert.equal(passwordChangeSchema.safeParse({
    currentPassword: "old-password",
    newPassword: "new-password-123",
    confirmPassword: "different-password",
  }).success, false);
});

test("password reset schemas validate email, token, password length, and confirmation", () => {
  assert.equal(passwordResetRequestSchema.safeParse({ email: "user@example.com" }).success, true);
  assert.equal(passwordResetRequestSchema.safeParse({ email: "not-an-email" }).success, false);
  assert.equal(passwordResetSchema.safeParse({
    token: "a".repeat(64),
    newPassword: "new-password-123",
    confirmPassword: "new-password-123",
  }).success, true);
  assert.equal(passwordResetSchema.safeParse({
    token: "short",
    newPassword: "new-password-123",
    confirmPassword: "new-password-123",
  }).success, false);
  assert.equal(passwordResetSchema.safeParse({
    token: "a".repeat(64),
    newPassword: "new-password-123",
    confirmPassword: "different-password",
  }).success, false);
});
