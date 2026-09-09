import "server-only";

import { z } from "zod";

const contactSchema = z.string()
  .trim()
  .max(128)
  .refine((value) => !/[\u0000-\u001F\u007F-\u009F]/.test(value), {
    message: "Contact value contains invalid control characters.",
  });

const birthdaySchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  }, {
    message: "Birthday must be a real calendar date.",
  });

export const registrationSchema = z.object({
  login: z.string().trim().min(3).max(32).regex(/^[a-z0-9._-]+$/i),
  phone: z.string().trim().min(8).max(32),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(128),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const profileUpdateSchema = z.object({
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().min(8).max(32).optional(),
  telegram: contactSchema.optional(),
  vk: contactSchema.optional(),
  discord: contactSchema.optional(),
  matrix: contactSchema.optional(),
  steam: contactSchema.optional(),
  jabber: contactSchema.optional(),
  faceit: contactSchema.optional(),
  gender: z.string().trim().max(32).optional(),
  birthday: z.union([birthdaySchema, z.literal("")]).optional(),
  interests: z.string().trim().max(500).optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), {
  message: "At least one profile field is required.",
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(10).max(128),
  confirmPassword: z.string().min(1).max(128),
}).refine((value) => value.newPassword === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export const passwordResetRequestSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const passwordResetSchema = z.object({
  token: z.string().trim().min(32).max(128),
  newPassword: z.string().min(10).max(128),
  confirmPassword: z.string().min(1).max(128),
}).refine((value) => value.newPassword === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});
