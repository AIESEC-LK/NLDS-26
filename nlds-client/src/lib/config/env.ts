// @ts-nocheck
import { z } from "zod";

/**
 * Validates explicitly the environment structures globally guarding Node logic
 * against undefined failures occurring silently during execution triggers.
 */
const envSchema = z.object({
  // Core Platform Defaults
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Core Backend Boundaries
  DATABASE_URL: z.string().min(1, "DATABASE_URL is explicitly required"),
  SESSION_SECRET: z
    .string()
    .min(16, "SESSION_SECRET must be explicitly defined and secure"),

  // Third-party Abstractions (Gracefully Degraded when omitted implicitly)
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),

  GOOGLE_CLIENT_EMAIL: z.string().email().optional().or(z.literal("")),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  
  // Admin Sync Webhook (Replaces direct Google Sheets integration)
  ADMIN_SYNC_URL: z.string().url().optional(),
  CRON_SECRET: z.string().optional(),

  // Drive Integ
  GOOGLE_DRIVE_CV_FOLDER_ID: z.string().optional(),
  GOOGLE_DRIVE_PHOTO_FOLDER_ID: z.string().optional(),
  GOOGLE_DRIVE_MERCH_FOLDER_ID: z.string().optional(),
  GOOGLE_DRIVE_CLIENT_EMAIL: z.string().email().optional().or(z.literal("")),
  GOOGLE_DRIVE_PRIVATE_KEY: z.string().optional(),

  EMAIL_SMTP_USER: z.string().optional(),
  EMAIL_SMTP_PASS: z.string().optional(),

  // Merch-specific SMTP (separate sender account)
  EMAIL_MERCH_USER: z.string().optional(),
  EMAIL_MERCH_PASS: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (typeof window === "undefined" && !_env.success) {
  console.error(
    "❌ Invalid runtime environment variables configuring NLDS 2026 Engine:\n",
    _env.error.format(),
  );
  throw new Error("Invalid Environment Variable configuration mapping");
}

export const env = _env.success ? _env.data : ({} as any);
