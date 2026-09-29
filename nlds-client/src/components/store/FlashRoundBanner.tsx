"use client";

/**
 * MERGE '26 — Flash Round Banner
 *
 * Displays the Flash Round state inline in the store section:
 *   NOT_STARTED → "⚡ FLASH ROUND COMING SOON" + countdown to start
 *   LIVE        → "⚡ FLASH ROUND LIVE" + countdown to end
 *   CLOSED      → "FLASH ROUND CLOSED"
 *
 * If FLASH_ROUND_ENABLED = false, this component renders nothing.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useFlashRound } from "@/lib/flash-round/useFlashRound";
import { FLASH_ROUND_ENABLED } from "@/lib/flash-round/config";

// ─── Digit Block ─────────────────────────────────────────────────────────────

function FlashDigitBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative flex items-center justify-center w-[48px] h-[56px] sm:w-[64px] sm:h-[74px]"
        style={{
          background: "rgba(255, 200, 0, 0.06)",
          border: "1px solid rgba(255, 200, 0, 0.3)",
          boxShadow:
            "0 0 14px rgba(255,200,0,0.12), inset 0 0 12px rgba(255,200,0,0.06)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-yellow-400/60" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-yellow-400/60" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-yellow-400/60" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-yellow-400/60" />

        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,220,0,1) 2px, rgba(255,220,0,1) 4px)",
          }}
        />

        <span
          className="font-display text-2xl sm:text-3xl tabular-nums relative z-20"
          style={{
            color: "#FFD700",
            textShadow: "0 0 14px rgba(255,200,0,0.7)",
            lineHeight: 1,
            marginTop: "3px",
          }}
        >
          {value}
        </span>
      </div>
      <span
        className="font-classified text-[8px] sm:text-[9px] tracking-[0.25em] uppercase"
        style={{ color: "rgba(255,210,0,0.75)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Separator ───────────────────────────────────────────────────────────────

function FlashSeparator() {
  return (
    <div className="flex flex-col gap-1.5 pb-5 sm:pb-6">
      <div
        className="w-1 h-1 sm:w-1.5 sm:h-1.5"
        style={{
          background: "rgba(255,200,0,0.6)",
          boxShadow: "0 0 8px rgba(255,200,0,0.5)",
        }}
      />
      <div
        className="w-1 h-1 sm:w-1.5 sm:h-1.5"
        style={{
          background: "rgba(255,200,0,0.6)",
          boxShadow: "0 0 8px rgba(255,200,0,0.5)",
        }}
      />
    </div>
  );
}

// ─── Main Banner ──────────────────────────────────────────────────────────────

export default function FlashRoundBanner() {
  const { mounted, state, timeUntilStart, timeUntilEnd } = useFlashRound();

  // Don't render if feature is disabled or not yet mounted (hydration)
  if (!FLASH_ROUND_ENABLED || !mounted) return null;

  const countdown = state === "NOT_STARTED" ? timeUntilStart : timeUntilEnd;

  const dd = String(countdown.days).padStart(2, "0");
  const hh = String(countdown.hours).padStart(2, "0");
  const mm = String(countdown.minutes).padStart(2, "0");
  const ss = String(countdown.seconds).padStart(2, "0");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[720px] mx-auto mb-8"
        role="status"
        aria-live="polite"
        aria-label={`Flash Round status: ${state}`}
      >
        {/* Outer container */}
        <div
          className="relative overflow-hidden flex flex-col items-center py-6 px-4 sm:px-8"
          style={{
            background:
              state === "CLOSED"
                ? "rgba(196, 30, 58, 0.06)"
                : "rgba(255, 200, 0, 0.04)",
            border:
              state === "CLOSED"
                ? "1px solid rgba(196,30,58,0.3)"
                : "1px solid rgba(255,200,0,0.3)",
            boxShadow:
              state === "CLOSED"
                ? "0 0 40px rgba(196,30,58,0.08)"
                : "0 0 40px rgba(255,200,0,0.08)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background:
                state === "CLOSED"
                  ? "linear-gradient(90deg, transparent, rgba(196,30,58,0.7), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,200,0,0.8), transparent)",
            }}
          />

          {/* Corner accents */}
          {state !== "CLOSED" && (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400/50" />
            </>
          )}

          {/* ── CLOSED state ── */}
          {state === "CLOSED" && (
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className="font-classified text-[10px] sm:text-[11px] tracking-[0.28em]"
                style={{ color: "var(--red)" }}
              >
                ⚡ FLASH ROUND
              </span>
              <span
                className="font-display text-3xl sm:text-4xl"
                style={{
                  color: "var(--red)",
                  letterSpacing: "0.06em",
                  textShadow: "0 0 20px rgba(196,30,58,0.35)",
                }}
              >
                CLOSED
              </span>
              <span
                className="font-classified text-[8px] sm:text-[9px] tracking-[0.22em]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                FLASH ROUND ORDERING HAS ENDED
              </span>
            </div>
          )}

          {/* ── NOT_STARTED state ── */}
          {state === "NOT_STARTED" && (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {/* Heading */}
              <div className="flex flex-col items-center gap-1">
                {/* Live pulse indicator */}
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#FFD700",
                      boxShadow: "0 0 8px rgba(255,200,0,0.8)",
                    }}
                  />
                  <span
                    className="font-classified text-[9px] sm:text-[10px] tracking-[0.3em]"
                    style={{ color: "rgba(255,210,0,0.8)" }}
                  >
                    ⚡ FLASH ROUND
                  </span>
                </div>

                <h3
                  className="font-display text-2xl sm:text-3xl"
                  style={{
                    color: "#FFD700",
                    letterSpacing: "0.05em",
                    textShadow: "0 0 20px rgba(255,200,0,0.4)",
                    lineHeight: 1,
                  }}
                >
                  COMING SOON
                </h3>
                <p
                  className="font-classified text-[8.5px] sm:text-[9px] tracking-[0.22em] mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  LIMITED MERCH DROP — OPENS IN
                </p>
              </div>

              {/* Countdown digits */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
                <FlashDigitBlock value={dd} label="DAYS" />
                <FlashSeparator />
                <FlashDigitBlock value={hh} label="HRS" />
                <FlashSeparator />
                <FlashDigitBlock value={mm} label="MIN" />
                <FlashSeparator />
                <FlashDigitBlock value={ss} label="SEC" />
              </div>

              {/* Description */}
              <p
                className="font-classified text-[8px] sm:text-[8.5px] tracking-[0.18em] text-center"
                style={{ color: "rgba(255,255,255,0.3)", maxWidth: "28rem" }}
              >
                REGULAR T-SHIRTS (M/L) · WRISTBANDS · STICKERS · BUCKET HATS
              </p>
            </div>
          )}

          {/* ── LIVE state ── */}
          {state === "LIVE" && (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {/* Heading */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#FFD700",
                      boxShadow: "0 0 10px rgba(255,200,0,1)",
                    }}
                  />
                  <span
                    className="font-classified text-[9px] sm:text-[10px] tracking-[0.3em]"
                    style={{ color: "#FFD700", fontWeight: 700 }}
                  >
                    ⚡ FLASH ROUND — LIVE NOW
                  </span>
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#FFD700",
                      boxShadow: "0 0 10px rgba(255,200,0,1)",
                    }}
                  />
                </div>

                <h3
                  className="font-display text-3xl sm:text-4xl"
                  style={{
                    color: "#FFD700",
                    letterSpacing: "0.06em",
                    textShadow: "0 0 28px rgba(255,200,0,0.55)",
                    lineHeight: 1,
                  }}
                >
                  LIMITED MERCH DROP
                </h3>
                <p
                  className="font-classified text-[8.5px] sm:text-[9px] tracking-[0.24em] mt-0.5"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  ENDS IN
                </p>
              </div>

              {/* Countdown digits */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
                <FlashDigitBlock value={dd} label="DAYS" />
                <FlashSeparator />
                <FlashDigitBlock value={hh} label="HRS" />
                <FlashSeparator />
                <FlashDigitBlock value={mm} label="MIN" />
                <FlashSeparator />
                <FlashDigitBlock value={ss} label="SEC" />
              </div>

              {/* Eligible items note */}
              <p
                className="font-classified text-[8px] sm:text-[8.5px] tracking-[0.18em] text-center"
                style={{ color: "rgba(255,255,255,0.35)", maxWidth: "30rem" }}
              >
                REGULAR T-SHIRTS (M/L) · WRISTBANDS · STICKERS · BUCKET HATS
                ONLY
              </p>
            </div>
          )}

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background:
                state === "CLOSED"
                  ? "linear-gradient(90deg, transparent, rgba(196,30,58,0.4), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,200,0,0.4), transparent)",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
