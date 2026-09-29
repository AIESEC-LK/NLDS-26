"use client";

/**
 * MERGE '26 — Flash Round Banner (v3)
 *
 * NOT_STARTED → "FLASH ROUND / COMING SOON" with countdown
 * LIVE        → "FLASH ROUND / LIMITED MERCH DROP" with countdown
 * CLOSED      → slim "FLASH ROUND — ORDERING CLOSED" strip
 *
 * No emojis. Proper margins. Dramatic section-break aesthetic.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useFlashRound } from "@/lib/flash-round/useFlashRound";
import { FLASH_ROUND_ENABLED } from "@/lib/flash-round/config";

// ─── Design tokens ────────────────────────────────────────────────────────────
const G = "#F5C518";          // gold
const GD = "rgba(245,197,24,0.5)"; // gold glow
const GB = "rgba(245,197,24,0.18)"; // gold border
const GF = "rgba(245,197,24,0.06)"; // gold fill

// ─── Pulse dot (no emoji) ─────────────────────────────────────────────────────
function PulseDot({ active }: { active: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
      {active && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: G }}
          animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.span
        className="relative w-1.5 h-1.5 rounded-full block"
        style={{ background: G, boxShadow: active ? `0 0 8px ${GD}` : "none" }}
        animate={active ? { opacity: [1, 0.3, 1] } : { opacity: 0.65 }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
}

// ─── Digit card ───────────────────────────────────────────────────────────────
function Digit({ value, label, live }: { value: string; label: string; live: boolean }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: "8px" }}>
      {/* Card */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: "clamp(62px, 10vw, 88px)",
          height: "clamp(70px, 11vw, 96px)",
          background: live ? "rgba(245,197,24,0.09)" : GF,
          border: `1px solid ${live ? "rgba(245,197,24,0.5)" : GB}`,
          boxShadow: live
            ? `0 0 24px rgba(245,197,24,0.18), inset 0 0 18px rgba(245,197,24,0.06)`
            : `inset 0 0 12px rgba(245,197,24,0.04)`,
        }}
      >
        {/* 2px corner marks */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
          style={{ borderColor: live ? G : "rgba(245,197,24,0.5)" }} />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
          style={{ borderColor: live ? G : "rgba(245,197,24,0.5)" }} />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
          style={{ borderColor: live ? G : "rgba(245,197,24,0.5)" }} />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
          style={{ borderColor: live ? G : "rgba(245,197,24,0.5)" }} />

        {/* Horizontal scanlines */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(245,197,24,0.03) 3px,rgba(245,197,24,0.03) 4px)",
          }}
        />

        {/* Number */}
        <span
          className="font-display tabular-nums relative z-10 select-none"
          style={{
            fontSize: "clamp(2.1rem, 5vw, 3.2rem)",
            lineHeight: 1,
            color: G,
            textShadow: live
              ? `0 0 22px ${GD}, 0 0 50px rgba(245,197,24,0.2)`
              : `0 0 14px rgba(245,197,24,0.35)`,
            marginTop: "5px",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
      </div>

      {/* Label */}
      <span
        className="font-classified select-none uppercase"
        style={{
          fontSize: "7.5px",
          letterSpacing: "0.32em",
          color: live ? "rgba(245,197,24,0.7)" : "rgba(245,197,24,0.42)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Colon dots ───────────────────────────────────────────────────────────────
function Sep({ live }: { live: boolean }) {
  return (
    <div className="flex flex-col gap-2" style={{ paddingBottom: "28px", opacity: live ? 0.9 : 0.45 }}>
      <span className="w-[5px] h-[5px] rounded-full block"
        style={{ background: G, boxShadow: live ? `0 0 8px ${GD}` : "none" }} />
      <span className="w-[5px] h-[5px] rounded-full block"
        style={{ background: G, boxShadow: live ? `0 0 8px ${GD}` : "none" }} />
    </div>
  );
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span
      className="font-classified uppercase"
      style={{
        fontSize: "8px",
        letterSpacing: "0.2em",
        color: "rgba(245,197,24,0.5)",
        border: "1px solid rgba(245,197,24,0.2)",
        padding: "4px 10px",
        background: "rgba(245,197,24,0.04)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FlashRoundBanner() {
  const { mounted, state, timeUntilStart, timeUntilEnd } = useFlashRound();
  if (!FLASH_ROUND_ENABLED || !mounted) return null;

  const live = state === "LIVE";
  const closed = state === "CLOSED";
  const cd = live ? timeUntilEnd : timeUntilStart;

  const dd = String(cd.days).padStart(2, "0");
  const hh = String(cd.hours).padStart(2, "0");
  const mm = String(cd.minutes).padStart(2, "0");
  const ss = String(cd.seconds).padStart(2, "0");

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={state}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-live="polite"
        aria-label={`Flash Round: ${state}`}
        className="w-full"
        style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
      >

        {/* ── CLOSED: slim strip ── */}
        {closed && (
          <div
            className="w-full flex items-center justify-center gap-5 py-3.5 px-6 relative"
            style={{
              background: "rgba(196,30,58,0.06)",
              border: "1px solid rgba(196,30,58,0.2)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(196,30,58,0.5),transparent)" }} />
            <span className="font-classified text-[9px] tracking-[0.32em] uppercase"
              style={{ color: "rgba(196,30,58,0.6)" }}>FLASH ROUND</span>
            <span className="w-px h-3.5 block" style={{ background: "rgba(196,30,58,0.2)" }} />
            <span className="font-classified text-[9px] tracking-[0.24em] uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}>ORDERING CLOSED</span>
          </div>
        )}

        {/* ── NOT_STARTED & LIVE ── */}
        {!closed && (
          <div
            className="relative w-full overflow-hidden"
            style={{
              background: live
                ? `linear-gradient(160deg, rgba(245,197,24,0.09) 0%, rgba(6,6,8,1) 50%, rgba(245,197,24,0.06) 100%)`
                : `linear-gradient(160deg, rgba(245,197,24,0.06) 0%, rgba(6,6,8,1) 100%)`,
              border: `1px solid ${live ? "rgba(245,197,24,0.42)" : "rgba(245,197,24,0.2)"}`,
              boxShadow: live
                ? `0 0 80px rgba(245,197,24,0.09), 0 0 0 1px rgba(245,197,24,0.05)`
                : "none",
            }}
          >

            {/* Animated shimmer on LIVE */}
            {live && (
              <motion.div
                className="absolute inset-y-0 pointer-events-none"
                style={{ width: "40%", background: "linear-gradient(90deg,transparent,rgba(245,197,24,0.045),transparent)" }}
                animate={{ x: ["-40%", "200%"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              />
            )}

            {/* Top accent — 2px gradient bar (gold→red on LIVE, gold on NOT_STARTED) */}
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background: live
                  ? `linear-gradient(90deg, transparent 0%, ${G} 30%, rgba(196,30,58,1) 70%, transparent 100%)`
                  : `linear-gradient(90deg, transparent 0%, ${G} 50%, transparent 100%)`,
              }}
            />

            {/* Bottom accent */}
            <div className="absolute inset-x-0 bottom-0 h-px"
              style={{ background: `linear-gradient(90deg,transparent,rgba(245,197,24,0.22),transparent)` }} />

            {/* Corner marks 8×8 */}
            {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2",
              "bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((c, i) => (
              <span key={i} className={`absolute w-8 h-8 ${c}`}
                style={{ borderColor: live ? G : "rgba(245,197,24,0.42)" }} />
            ))}

            {/* ── Inner layout ── */}
            <div className="relative z-10 flex flex-col items-center text-center"
              style={{ padding: "clamp(2rem, 5vw, 3rem) clamp(1.5rem, 6vw, 4rem)" }}>

              {/* — Section label row — */}
              <div className="flex items-center gap-3 mb-5">
                <PulseDot active={live} />
                <span
                  className="font-classified uppercase tracking-[0.42em]"
                  style={{ fontSize: "9.5px", color: G, fontWeight: 700, letterSpacing: "0.42em" }}
                >
                  FLASH ROUND
                </span>
                {live && (
                  <>
                    <span className="w-px h-4 block" style={{ background: "rgba(245,197,24,0.3)" }} />
                    <span className="font-classified uppercase" style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(245,197,24,0.65)" }}>
                      LIVE NOW
                    </span>
                  </>
                )}
              </div>

              {/* — BIG headline — */}
              <h2
                className="font-display leading-none"
                style={{
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  letterSpacing: "0.05em",
                  color: G,
                  textShadow: live
                    ? `0 0 40px ${GD}, 0 0 80px rgba(245,197,24,0.18)`
                    : `0 0 24px rgba(245,197,24,0.3)`,
                  marginBottom: live ? "0.6rem" : "2rem",
                }}
              >
                {live ? "LIMITED MERCH DROP" : "COMING SOON"}
              </h2>

              {live && (
                <>
                  {/* Sub-label: ends in */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="block h-px w-12"
                      style={{ background: "linear-gradient(90deg,transparent,rgba(245,197,24,0.45))" }} />
                    <span className="font-classified uppercase"
                      style={{ fontSize: "9px", letterSpacing: "0.32em", color: "rgba(245,197,24,0.5)" }}>
                      ENDS IN
                    </span>
                    <span className="block h-px w-12"
                      style={{ background: "linear-gradient(270deg,transparent,rgba(245,197,24,0.45))" }} />
                  </div>

                  {/* — Countdown — */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-7">
                    <Digit value={dd} label="DAYS" live={live} />
                    <Sep live={live} />
                    <Digit value={hh} label="HRS" live={live} />
                    <Sep live={live} />
                    <Digit value={mm} label="MIN" live={live} />
                    <Sep live={live} />
                    <Digit value={ss} label="SEC" live={live} />
                  </div>
                </>
              )}

              {/* — Product tags — */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <Tag label="Regular T-Shirts (M / L)" />
                <Tag label="Wristbands" />
                <Tag label="Stickers" />
                <Tag label="Bucket Hats" />
              </div>

              {/* — Metadata strip — */}
              <div
                className="w-full flex flex-wrap items-center justify-center gap-x-7 gap-y-2"
                style={{
                  paddingTop: "1.25rem",
                  borderTop: "1px solid rgba(245,197,24,0.08)",
                }}
              >
                {[["OPERATION","MERGE'26"],["CLASSIFICATION","FLASH ACCESS"],["WINDOW", live ? "OPEN" : "STANDBY"]].map(([k, v], i) => (
                  <div key={k} className="flex items-center gap-2">
                    {i > 0 && <span className="hidden sm:block w-px h-3" style={{ background: "rgba(245,197,24,0.14)" }} />}
                    <span className="font-classified" style={{ fontSize: "7.5px", letterSpacing: "0.22em", color: "rgba(245,197,24,0.3)" }}>
                      {k}:
                    </span>
                    <span
                      className="font-classified"
                      style={{
                        fontSize: "7.5px",
                        letterSpacing: "0.2em",
                        color: v === "OPEN" ? G : "rgba(245,197,24,0.55)",
                        fontWeight: v === "OPEN" ? 700 : 400,
                      }}
                    >
                      {v === "OPEN" ? "● OPEN" : v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </motion.section>
    </AnimatePresence>
  );
}
