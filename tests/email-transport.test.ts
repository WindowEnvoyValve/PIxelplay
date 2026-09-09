import assert from "node:assert/strict";
import test from "node:test";
import { getEmailTransport } from "@/lib/email/transport";

function setNodeEnv(value: string | undefined) {
  if (value === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
  else Object.defineProperty(process.env, "NODE_ENV", { value, configurable: true, enumerable: true, writable: true });
}

test("production email transport refuses incomplete SMTP configuration", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalUser = process.env.SMTP_USER;
  const originalPassword = process.env.SMTP_PASSWORD;
  const originalFrom = process.env.EMAIL_FROM;

  try {
    setNodeEnv("production");
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    delete process.env.EMAIL_FROM;
    assert.throws(() => getEmailTransport(), /SMTP email transport is not configured/);
  } finally {
    setNodeEnv(originalNodeEnv);
    if (originalUser === undefined) delete process.env.SMTP_USER;
    else process.env.SMTP_USER = originalUser;
    if (originalPassword === undefined) delete process.env.SMTP_PASSWORD;
    else process.env.SMTP_PASSWORD = originalPassword;
    if (originalFrom === undefined) delete process.env.EMAIL_FROM;
    else process.env.EMAIL_FROM = originalFrom;
  }
});

test("development email transport remains available without SMTP credentials", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  try {
    setNodeEnv("development");
    assert.doesNotThrow(() => getEmailTransport());
  } finally {
    setNodeEnv(originalNodeEnv);
  }
});
