import { NextResponse } from "next/server";
import {
  getFlashRoundState,
  FLASH_ROUND_START,
  FLASH_ROUND_END,
  FLASH_ROUND_ENABLED,
} from "@/lib/flash-round/config";

/**
 * GET /api/flash-round/status
 *
 * Returns the current Flash Round state based on the authoritative server clock.
 * The frontend must use this endpoint to determine Flash Round state rather than
 * trusting the user's local clock for order eligibility decisions.
 *
 * Response shape:
 *   { state: "NOT_STARTED" | "LIVE" | "CLOSED", serverTime: string, enabled: boolean }
 */
export async function GET() {
  const now = new Date();
  const state = getFlashRoundState(now);

  return NextResponse.json({
    state,
    serverTime: now.toISOString(),
    enabled: FLASH_ROUND_ENABLED,
    startTime: FLASH_ROUND_START,
    endTime: FLASH_ROUND_END,
  });
}
