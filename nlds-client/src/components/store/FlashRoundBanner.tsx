"use client";

/**
 * MERGE '26 — Flash Round Banner (v2 — Premium Redesign)
 *
 * NOT_STARTED → Gold tactical "⚡ FLASH ROUND COMING SOON" with countdown
 * LIVE        → Pulsing urgent "⚡ FLASH ROUND — LIVE" with closing countdown
 * CLOSED      → Muted "FLASH ROUND — MISSION COMPLETE"
 */

import { motion, AnimatePresence } from "framer-motion";
import { useFlashRound } from "@/lib/flash-round/useFlashRound";
import { FLASH_ROUND_ENABLED } from "@/lib/flash-round/config";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD = "#F5C518";
const GOLD_GLOW = "rgba(245,197,24,0.5)";

// ─── Digit Block ─────────────────────────────────────────────────────────────

function DigitBlock({
  value,
  label,
  live = false,
}: {
  value: string;
  label: string;
  live?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: "clamp(58px, 9vw, 82px)",
          height: "clamp(66px, 10vw, 92px)",
          background: live
            ? "rgba(245,197,24,0.08)"
            : "rgba(245,197,24,0.05)",
          border: `1px solid ${live ? "rgba(245,197,24,0.55)" : "rgba(245,197,24,0.28)"}`,
          boxShadow: live
            ? `0 0 32px rgba(245,197,24,0.2), inset 0 0 20px rgba(245,197,24,0.07)`
            : `0 0 12px rgba(245,197,24,0.07), inset 0 0 10px rgba(245,197,24,0.04)`,
        }}
      >
        {/* Corner marks */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: live ? GOLD : "rgba(245,197,24,0.5)" }} />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: live ? GOLD : "rgba(245,197,24,0.5)" }} />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: live ? GOLD : "rgba(245,197,24,0.5)" }} />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: live ? GOLD : "rgba(245,197,24,0.5)" }} />

        {/* Scan-line overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(245,197,24,0.035) 3px, rgba(245,197,24,0.035) 4px)",
          }}
        />

        {/* Digit */}
        <span
          className="font-display tabular-nums relative z-10 select-none"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.1rem)",
            color: GOLD,
            textShadow: live
              ? `0 0 20px ${GOLD_GLOW}, 0 0 50px rgba(245,197,24,0.22)`
              : `0 0 12px rgba(245,197,24,0.35)`,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            marginTop: "4px",
          }}
        >
          {value}
        </span>
      </div>

      {/* Label */}
      <span
        className="font-classified uppercase select-none"
        style={{
          fontSize: "8px",
          letterSpacing: "0.32em",
          color: live ? "rgba(245,197,24,0.7)" : "rgba(245,197,24,0.45)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Colon separator ─────────────────────────────────────────────────────────

function ColonSep({ live = false }: { live?: boolean }) {
  return (
    <div className="flex flex-col gap-2 pb-7" style={{ opacity: live ? 0.85 : 0.45 }}>
      <div
        className="w-[5px] h-[5px] rounded-full"
        style={{ background: GOLD, boxShadow: live ? `0 0 9px ${GOLD_GLOW}` : "none" }}
      />
      <div
        className="w-[5px] h-[5px] rounded-full"
        style={{ background: GOLD, boxShadow: live ? `0 0 9px ${GOLD_GLOW}` : "none" }}
      />
    </div>
  );
}

// ─── Product Tag ──────────────────────────────────────────────────────────────

function ProductTag({ label }: { label: string }) {
  return (
    <span
      className="font-classified uppercase"
      style={{
        fontSize: "8px",
        letterSpacing: "0.2em",
        color: "rgba(245,197,24,0.5)",
        border: "1px solid rgba(245,197,24,0.18)",
        padding: "3px 9px",
        background: "rgba(245,197,24,0.04)",
      }}
    >
      {label}
    </span>
  );
}

// ─── Main Banner ──────────────────────────────────────────────────────────────

export default function FlashRoundBanner() {
  const { mounted, state, timeUntilStart, timeUntilEnd } = useFlashRound();

  if (!FLASH_ROUND_ENABLED || !mounted) return null;

  const isLive = state === "LIVE";
  const isClosed = state === "CLOSED";
  const countdown = state === "NOT_STARTED" ? timeUntilStart : timeUntilEnd;

  const dd = String(countdown.days).padStart(2, "0");
  const hh = String(countdown.hours).padStart(2, "0");
  const mm = String(countdown.minutes).padStart(2, "0");
  const ss = String(countdown.seconds).padStart(2, "0");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: -14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[800px] mx-auto mb-10"
        role="status"
        aria-live="polite"
      >

        {/* ── CLOSED ── */}
        {isClosed && (
          <div
            className="relative flex items-center justify-center gap-5 py-4 px-6"
            style={{
              background: "rgba(196,30,58,0.05)",
              border: "1px solid rgba(196,30,58,0.22)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(196,30,58,0.55),transparent)" }} />
            <span className="font-classified tracking-[0.32em] text-[9.5px]" style={{ color: "rgba(196,30,58,0.65)" }}>⚡ FLASH ROUND</span>
            <div className="w-px h-4" style={{ background: "rgba(196,30,58,0.2)" }} />
            <span className="font-classified tracking-[0.25em] text-[9.5px]" style={{ color: "rgba(255,255,255,0.28)" }}>MISSION COMPLETE — ORDERING CLOSED</span>
          </div>
        )}

        {/* ── NOT_STARTED & LIVE ── */}
        {!isClosed && (
          <div
            className="relative overflow-hidden"
            style={{
              background: isLive
                ? "linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(8,8,10,0.97) 55%, rgba(245,197,24,0.05) 100%)"
                : "linear-gradient(135deg, rgba(245,197,24,0.05) 0%, rgba(6,6,8,0.98) 100%)",
              border: `1px solid ${isLive ? "rgba(245,197,24,0.45)" : "rgba(245,197,24,0.22)"}`,
              boxShadow: isLive
                ? "0 0 70px rgba(245,197,24,0.1), 0 0 0 1px rgba(245,197,24,0.06)"
                : "0 0 30px rgba(245,197,24,0.05)",
            }}
          >
            {/* Animated shimmer sweep (LIVE only) */}
            {isLive && (
              <motion.div
                className="absolute inset-y-0 pointer-events-none"
                style={{ width: "35%", background: "linear-gradient(90deg,transparent,rgba(245,197,24,0.05),transparent)" }}
                animate={{ x: ["-35%", "210%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2.5 }}
              />
            )}

            {/* Top gradient accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: isLive
                  ? `linear-gradient(90deg, transparent 0%, ${GOLD} 35%, rgba(196,30,58,0.9) 65%, transparent 100%)`
                  : `linear-gradient(90deg, transparent, rgba(245,197,24,0.65), transparent)`,
              }}
            />

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(245,197,24,0.2),transparent)" }} />

            {/* Large corner marks */}
            {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((cls, i) => (
              <div key={i} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: isLive ? GOLD : "rgba(245,197,24,0.45)" }} />
            ))}

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col items-center py-8 px-4 sm:px-10 gap-6">

              {/* Status badge */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-3 h-3">
                  {isLive && (
                    <motion.div
                      className="absolute w-full h-full rounded-full"
                      style={{ background: GOLD, opacity: 0.3 }}
                      animate={{ scale: [1, 2.4], opacity: [0.3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: GOLD, boxShadow: isLive ? `0 0 10px ${GOLD_GLOW}` : "none" }}
                    animate={isLive ? { opacity: [1, 0.25, 1] } : { opacity: 0.8 }}
                    transition={{ duration: 0.75, repeat: Infinity }}
                  />
                </div>

                <span
                  className="font-classified uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.4em", color: GOLD, fontWeight: 700 }}
                >
                  ⚡&nbsp; FLASH ROUND
                </span>

                {isLive && (
                  <>
                    <div className="w-px h-4" style={{ background: "rgba(245,197,24,0.3)" }} />
                    <span className="font-classified uppercase" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(245,197,24,0.7)" }}>
                      LIVE NOW
                    </span>
                  </>
                )}
              </div>

              {/* Headline */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h3
                  className="font-display leading-none"
                  style={{
                    fontSize: "clamp(2.6rem, 7vw, 4.2rem)",
                    letterSpacing: "0.06em",
                    color: GOLD,
                    textShadow: isLive
                      ? `0 0 35px ${GOLD_GLOW}, 0 0 70px rgba(245,197,24,0.2)`
                      : `0 0 22px rgba(245,197,24,0.3)`,
                  }}
                >
                  {isLive ? "LIMITED MERCH DROP" : "COMING SOON"}
                </h3>

                {/* Ends / Opens In label with flanking lines */}
                <div className="flex items-center gap-4 mt-1">
                  <div className="h-px w-14" style={{ background: "linear-gradient(90deg,transparent,rgba(245,197,24,0.4))" }} />
                  <span className="font-classified uppercase" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(245,197,24,0.5)" }}>
                    {isLive ? "ENDS IN" : "OPENS IN"}
                  </span>
                  <div className="h-px w-14" style={{ background: "linear-gradient(270deg,transparent,rgba(245,197,24,0.4))" }} />
                </div>
              </div>

              {/* Countdown row */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <DigitBlock value={dd} label="DAYS" live={isLive} />
                <ColonSep live={isLive} />
                <DigitBlock value={hh} label="HRS" live={isLive} />
                <ColonSep live={isLive} />
                <DigitBlock value={mm} label="MIN" live={isLive} />
                <ColonSep live={isLive} />
                <DigitBlock value={ss} label="SEC" live={isLive} />
              </div>

              {/* Product tags row */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <ProductTag label="Regular T-Shirts (M/L)" />
                <ProductTag label="Wristbands" />
                <ProductTag label="Stickers" />
                <ProductTag label="Bucket Hats" />
              </div>

              {/* Tactical metadata strip */}
              <div
                className="w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 pt-4"
                style={{ borderTop: "1px solid rgba(245,197,24,0.08)" }}
              >
                {[
                  ["OPERATION", "MERGE'26"],
                  ["CLASSIFICATION", "FLASH ACCESS"],
                  ["WINDOW", isLive ? "OPEN" : "STANDBY"],
                ].map(([k, v], i) => (
                  <div key={k} className="flex items-center gap-2">
                    {i > 0 && <div className="hidden sm:block w-px h-3" style={{ background: "rgba(245,197,24,0.12)" }} />}
                    <span className="font-classified" style={{ fontSize: "7.5px", letterSpacing: "0.22em", color: "rgba(245,197,24,0.3)" }}>{k}:</span>
                    <span className="font-classified" style={{ fontSize: "7.5px", letterSpacing: "0.2em", color: v === "OPEN" ? GOLD : "rgba(245,197,24,0.55)", fontWeight: v === "OPEN" ? 700 : 400 }}>
                      {v === "OPEN" ? `● ${v}` : v}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
