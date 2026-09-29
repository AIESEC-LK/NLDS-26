/**
 * MERGE '26 — FLASH ROUND CONFIGURATION
 *
 * This is the single authoritative source of truth for all Flash Round settings.
 * All Flash Round behavior is derived from this configuration.
 *
 * ─── DEPLOYMENT SAFETY ───────────────────────────────────────────────────────
 * The Flash Round will NOT open unless:
 *   currentTime >= FLASH_ROUND_START
 * Even if this code is merged to production, the Flash Round remains OFF
 * until the configured start time is reached.
 *
 * ─── TIMEZONE ────────────────────────────────────────────────────────────────
 * All timestamps use Asia/Colombo (UTC+05:30), i.e., Sri Lanka Standard Time.
 *
 * ─── CLOSING RULE ────────────────────────────────────────────────────────────
 * The Flash Round closes at 12:00 AM immediately after the final calendar day.
 * This is NOT calculated as START + N hours — it is an explicit timestamp.
 */

// ─── Feature Toggle ──────────────────────────────────────────────────────────

/**
 * Master kill-switch for the Flash Round feature.
 * Set to `false` to completely disable Flash Round logic
 * (store behaves exactly as before, countdown does not appear).
 * Set to `true` to activate the scheduled Flash Round behavior.
 *
 * NOTE: Setting this to `true` does NOT open the Flash Round immediately.
 * The Flash Round will only become LIVE when currentTime >= FLASH_ROUND_START.
 */
export const FLASH_ROUND_ENABLED = true;

// ─── Schedule ────────────────────────────────────────────────────────────────

/**
 * The exact moment the Flash Round opens (ISO 8601, Asia/Colombo = UTC+05:30).
 *
 * Before this timestamp: Flash Round is NOT_STARTED (store is normal).
 * At/After this timestamp: Flash Round is LIVE (filters apply).
 *
 * TODO: Set the actual campaign start date/time here before going live.
 * Example — Flash Round opening evening of Oct 1 2026 (6 PM Colombo):
 *   "2026-10-01T18:00:00+05:30"
 *
 * Currently set to a far-future placeholder so it is safely OFF on master.
 */
export const FLASH_ROUND_START = "2026-10-01T18:00:00+05:30";

/**
 * The exact moment the Flash Round closes (ISO 8601, Asia/Colombo = UTC+05:30).
 *
 * This must be 12:00 AM immediately after the final Flash Round calendar day.
 * Do NOT derive this from START + duration. Configure it explicitly.
 *
 * Example — If the final day is Oct 3 2026, the close is midnight Oct 4:
 *   "2026-10-04T00:00:00+05:30"
 *
 * Currently set to match the example above.
 */
export const FLASH_ROUND_END = "2026-10-01T23:59:59+05:30";

// ─── Flash Round State ────────────────────────────────────────────────────────

export type FlashRoundState = "NOT_STARTED" | "LIVE" | "CLOSED";

/**
 * Compute the current Flash Round state from the given timestamp.
 * Always pass `new Date()` for real usage; accepts a Date param for testability.
 */
export function getFlashRoundState(now: Date = new Date()): FlashRoundState {
  if (!FLASH_ROUND_ENABLED) return "NOT_STARTED";

  const startMs = new Date(FLASH_ROUND_START).getTime();
  const endMs = new Date(FLASH_ROUND_END).getTime();
  const nowMs = now.getTime();

  if (nowMs < startMs) return "NOT_STARTED";
  if (nowMs >= endMs) return "CLOSED";
  return "LIVE";
}

// ─── Allowed Products ────────────────────────────────────────────────────────

/**
 * Product IDs that are available for purchase during the Flash Round.
 * All other products are hidden from the catalogue.
 *
 * During Flash Round:
 *   ✅ Regular T-Shirt Packs  (combo-001  — Regular fit only)
 *   ✅ Regular T-Shirts       (tshirt-001 — Regular fit, M/L only)
 *   ✅ Wristbands             (wristband-001)
 *   ✅ Stickers               (stickers-001)
 *   ✅ Bucket Hats            (bucket-hat-001)
 *
 *   ❌ Oversize T-Shirts / Packs (any product with fit=Oversized or Oversize category)
 */
export const FLASH_ROUND_ALLOWED_PRODUCT_IDS: readonly string[] = [
  "combo-001",      // NLDS'26 COMBO PACK — Regular fit only
  "tshirt-001",     // NLDS'26 OFFICIAL DELEGATE T-SHIRT — Regular fit, M/L only
  "wristband-001",  // NLDS'26 WRIST BAND
  "stickers-001",   // NLDS'26 STICKER PACK
  "bucket-hat-001", // NLDS'26 BUCKET HAT
] as const;

/**
 * Allowed fit types during the Flash Round.
 * "Oversized" is NOT included — any item with fit=Oversized is rejected.
 */
export const FLASH_ROUND_ALLOWED_FITS: readonly string[] = [
  "Regular",
] as const;

/**
 * Allowed T-shirt sizes during the Flash Round.
 * Only M and L are permitted. All other sizes (XS, S, XL, XXL, etc.) are rejected.
 *
 * For products with NO sizes (wristband, stickers, bucket hat), this restriction
 * does not apply — size will be null.
 */
export const FLASH_ROUND_ALLOWED_TSHIRT_SIZES: readonly string[] = [
  "M",
  "L",
] as const;

// ─── Validation Helpers ───────────────────────────────────────────────────────

export interface FlashRoundValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validate whether a given product + fit + size combination is allowed
 * during an active Flash Round. This is used by both frontend (display)
 * and backend (order submission guard).
 *
 * Returns { allowed: true } if the combination passes.
 * Returns { allowed: false, reason: "..." } if rejected.
 */
export function validateFlashRoundItem(
  productId: string,
  fit: string | null | undefined,
  size: string | null | undefined,
): FlashRoundValidationResult {
  // 1. Product must be in the allowed list
  if (!FLASH_ROUND_ALLOWED_PRODUCT_IDS.includes(productId)) {
    return {
      allowed: false,
      reason: `Product "${productId}" is not available during the Flash Round.`,
    };
  }

  // 2. If a fit is specified, it must be "Regular"
  if (fit !== null && fit !== undefined && fit !== "") {
    if (!FLASH_ROUND_ALLOWED_FITS.includes(fit)) {
      return {
        allowed: false,
        reason: `Fit type "${fit}" is not available during the Flash Round. Only Regular fit is permitted.`,
      };
    }
  }

  // 3. If a size is specified (i.e. the product has sizes), it must be M or L
  if (size !== null && size !== undefined && size !== "") {
    if (!FLASH_ROUND_ALLOWED_TSHIRT_SIZES.includes(size)) {
      return {
        allowed: false,
        reason: `Size "${size}" is not available during the Flash Round. Only M and L are permitted.`,
      };
    }
  }

  return { allowed: true };
}
