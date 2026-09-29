"use client";

/**
 * MERGE '26 — Flash Round React Hook
 *
 * Provides the Flash Round state and countdown to any client component.
 * Uses both client-side time (for smooth countdown display) and periodically
 * polls the server for the authoritative state.
 *
 * The hook:
 *   - Updates the countdown every second
 *   - Polls the server every 30 s for authoritative state sync
 *   - Never trusts the client clock for "is the Flash Round open" decisions —
 *     the authoritative `serverState` field comes from the server
 *   - Transitions smoothly between NOT_STARTED → LIVE → CLOSED
 */

import { useState, useEffect, useCallback } from "react";
import {
  getFlashRoundState,
  FLASH_ROUND_START,
  FLASH_ROUND_END,
  FLASH_ROUND_ENABLED,
  type FlashRoundState,
} from "@/lib/flash-round/config";
import { getTimeRemaining } from "@/lib/utils";

export interface FlashRoundCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface UseFlashRoundReturn {
  /** Whether this hook has finished mounting (safe to render). */
  mounted: boolean;
  /** Current Flash Round state based on client clock (for display). */
  state: FlashRoundState;
  /** Most recent state confirmed by server (authoritative for order validation). */
  serverState: FlashRoundState | null;
  /** Countdown until the Flash Round starts (when state = NOT_STARTED). */
  timeUntilStart: FlashRoundCountdown;
  /** Countdown until the Flash Round ends (when state = LIVE). */
  timeUntilEnd: FlashRoundCountdown;
  /** Whether the feature is enabled at all. */
  enabled: boolean;
}

const ZERO_COUNTDOWN: FlashRoundCountdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

/**
 * Converts a getTimeRemaining result into a FlashRoundCountdown,
 * resolving days+hours into separate fields.
 */
function toCountdown(target: string): FlashRoundCountdown {
  const raw = getTimeRemaining(target);
  return {
    days: raw.days,
    hours: raw.hours,
    minutes: raw.minutes,
    seconds: raw.seconds,
  };
}

const SERVER_POLL_INTERVAL_MS = 30_000; // 30 seconds

export function useFlashRound(): UseFlashRoundReturn {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<FlashRoundState>(() =>
    getFlashRoundState(),
  );
  const [serverState, setServerState] = useState<FlashRoundState | null>(null);
  const [timeUntilStart, setTimeUntilStart] =
    useState<FlashRoundCountdown>(ZERO_COUNTDOWN);
  const [timeUntilEnd, setTimeUntilEnd] =
    useState<FlashRoundCountdown>(ZERO_COUNTDOWN);

  // Poll server for authoritative state
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch("/api/flash-round/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setServerState(data.state as FlashRoundState);
        // Also update client state to match server if they differ
        setState(data.state as FlashRoundState);
      }
    } catch {
      // Silently ignore network errors — client-side state is still shown
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Initialize countdown state immediately
    setState(getFlashRoundState());
    setTimeUntilStart(toCountdown(FLASH_ROUND_START));
    setTimeUntilEnd(toCountdown(FLASH_ROUND_END));

    // Initial server sync
    syncWithServer();

    // Tick every second for countdown display
    const tickInterval = setInterval(() => {
      const currentState = getFlashRoundState();
      setState(currentState);
      setTimeUntilStart(toCountdown(FLASH_ROUND_START));
      setTimeUntilEnd(toCountdown(FLASH_ROUND_END));
    }, 1000);

    // Periodic server sync for authoritative state
    const pollInterval = setInterval(syncWithServer, SERVER_POLL_INTERVAL_MS);

    return () => {
      clearInterval(tickInterval);
      clearInterval(pollInterval);
    };
  }, [syncWithServer]);

  return {
    mounted,
    state,
    serverState,
    timeUntilStart,
    timeUntilEnd,
    enabled: FLASH_ROUND_ENABLED,
  };
}
