import "server-only";

export function normalizeLogin(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  const compact = value.trim().replace(/[\s().-]/g, "");
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (/^8\d{10}$/.test(compact)) return `+375${compact.slice(2)}`;
  return compact;
}

export function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}
