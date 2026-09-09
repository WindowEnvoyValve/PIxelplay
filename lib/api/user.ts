import "server-only";

import type { users } from "@/db/schema";

type UserRow = typeof users.$inferSelect;

export function toSafeUser(user: UserRow) {
  return {
    id: user.id,
    login: user.login,
    phone: user.phone,
    email: user.email,
    telegram: user.telegram,
    vk: user.vk,
    discord: user.discord,
    matrix: user.matrix,
    steam: user.steam,
    jabber: user.jabber,
    faceit: user.faceit,
    gender: user.gender,
    birthday: user.birthday,
    interests: user.interests,
    status: user.status,
    createdAt: user.createdAt,
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
  };
}
