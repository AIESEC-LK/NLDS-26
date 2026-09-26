"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import ClosingCountdown, { useClosingStatus } from "@/components/ui/Countdown";

type Phase = 0 | 1 | 2 | 3 | 4;

const PHASE_DELAYS = [700, 1900, 3100, 4400];

const COORDS = [
  { text: "6.9271°N", top: "14%", left: "7%", delay: 0 },
  { text: "79.8612°E", top: "20%", left: "7%", delay: 0.6 },
  { text: "ALT: 0287M", top: "76%", left: "5%", delay: 1.1 },
  { text: "REF: SL-2026", top: "13%", right: "22%", delay: 0.3 },
  { text: "FREQ: 147.3", top: "82%", right: "6%", delay: 0.9 },
  { text: "94.6 / 07.2", top: "60%", left: "4%", delay: 1.5 },
];

export default function Hero() {
  const [phase, setPhase] = useState<Phase>(0);
  const [scanPct, setScanPct] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { isClosed, mounted } = useClosingStatus();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* Phase progression */
  useEffect(() => {
    const timers = PHASE_DELAYS.map((delay, i) =>
      setTimeout(() => setPhase((i + 1) as Phase), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Scan bar progress */
  useEffect(() => {
    if (phase !== 3) return;
    setScanPct(0);
    let pct = 0;
    const id = setInterval(() => {
      pct += 1.6;
      setScanPct(Math.min(Math.round(pct), 100));
      if (pct >= 100) clearInterval(id);
    }, 13);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-[100dvh] min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Parallax Background Image ─────────────────── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Multi-layer dark vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.70) 40%, rgba(6,6,8,0.82) 70%, rgba(6,6,8,0.97) 100%)",
          }}
        />
        {/* Side vignettes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,6,8,0.7) 100%)",
          }}
        />
      </motion.div>

      {/* ── Atmospheric Red Glow ──────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            width: "700px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(196,30,58,1) 0%, transparent 70%)",
            filter: "blur(90px)",
            opacity: 0.055,
            transform: "translateY(-10%)",
          }}
        />
      </div>

      {/* ── Grid Overlay ──────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Film Grain ────────────────────────────────── */}
      <div
        className="animate-grain pointer-events-none absolute inset-0 z-50 opacity-[0.038]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Scanlines ─────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.011) 2px, rgba(255,255,255,0.011) 4px)",
        }}
      />

      {/* ── Moving Scan Bar ───────────────────────────── */}
      <div
        className="animate-scanline pointer-events-none absolute left-0 right-0 h-[2px]"
        style={{
          zIndex: 41,
          background:
            "linear-gradient(90deg, transparent, rgba(196,30,58,0.18), transparent)",
        }}
      />

      {/* ── Opening Sequence Overlay ──────────────────── */}
      <AnimatePresence>
        {phase < 4 && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeIn" }}
          >
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Phase 0: cursor blink */}
              {phase === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="font-classified text-[var(--text-dim)] text-base"
                >
                  ▌
                </motion.div>
              )}

              {/* Phase 1: Incoming transmission */}
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-3"
                >
                  <p className="font-classified text-[12px] tracking-[0.42em] text-[var(--text-dim)] uppercase">
                    ▸ INCOMING TRANSMISSION ◂
                  </p>

                  {/* Phase 2: Classification */}
                  {phase >= 2 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="font-classified text-[10px] tracking-[0.35em] uppercase"
                      style={{ color: "var(--red)" }}
                    >
                      CLASSIFICATION: TOP SECRET
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Phase 3: Scanning bar */}
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="w-72"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-classified text-[11px] tracking-[0.22em] text-[var(--text-muted)] uppercase">
                      SYSTEM VERIFICATION
                    </span>
                    <span className="font-classified text-[11px] text-[var(--text-muted)] tabular">
                      {scanPct}%
                    </span>
                  </div>
                  <div
                    className="h-[1px] relative overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 h-full"
                      style={{ background: "var(--red)", width: `${scanPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="font-classified text-[10px] tracking-[0.2em] text-white/40">
                      NLDS_SYSTEM_26
                    </span>
                    <span className="font-classified text-[10px] tracking-[0.2em] text-white/40">
                      AUTH: GRANTED
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Hero Content ─────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: fadeOut }}
        className="relative z-20 flex flex-col items-center justify-center flex-1 text-center px-6 pt-20 pb-10"
      >
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="flex flex-col items-center w-full"
          >
            {/* Classification bar */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-8"
            >
              <div
                className="h-[1px] w-8 sm:w-12 flex-shrink-0"
                style={{ background: "var(--red)" }}
              />
              <span className="font-classified text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.35em] text-[var(--text-muted)] uppercase whitespace-nowrap">
                TOP SECRET // AIESEC IN SRI LANKA
              </span>
              <div
                className="h-[1px] w-8 sm:w-12 flex-shrink-0"
                style={{ background: "var(--red)" }}
              />
            </motion.div>

            {/* ── NLDS 2026 LOGO ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-[15px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Logos/NLDS 2026.png"
                alt="NLDS 2026 — National Leadership Development Seminar"
                className="mx-auto w-auto max-w-[85vw] sm:max-w-[70vw] max-h-[50vh] object-contain"
                style={{
                  height: "clamp(140px, 35vw, 420px)",
                  filter:
                    "drop-shadow(0 0 50px rgba(196,30,58,0.45)) drop-shadow(0 0 100px rgba(196,30,58,0.2)) brightness(1.08)",
                }}
              />
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-4 mb-2"
            >
              <ClosingCountdown 
                labelBefore="REGISTRATION CLOSES IN"
                labelAfter="REGISTRATION CLOSED"
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-0 pt-0"
            >
              {!mounted || !isClosed ? (
                <Link href="/register" className="btn-mission" id="hero-cta">
                  ACCEPT THE MISSION →
                </Link>
              ) : (
                <button className="btn-mission opacity-50 cursor-not-allowed" id="hero-cta" disabled>
                  REGISTRATION CLOSED
                </button>
              )}
              <button
                className="btn-ghost"
                onClick={() => {
                  document
                    .getElementById("mission")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                VIEW BRIEFING ↓
              </button>
            </motion.div>

            {/* Scroll caret */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden [@media(min-height:760px)]:flex flex-col items-center gap-2"
            >
              <span className="font-classified text-[10px] tracking-[0.28em] text-white/40 uppercase">
                SCROLL
              </span>
              <div
                className="w-[1px] h-10"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Mission Status Panel (desktop) ───────────── */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
          >
            <div
              className="font-classified text-[9px] tracking-[0.14em] p-5 w-48"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(6,6,8,0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center gap-2 pb-3 mb-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="animate-blink w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#4ade80" }}
                />
                <span className="text-white/50 uppercase tracking-[0.2em]">
                  SYS. STATUS
                </span>
              </div>

              {/* Data rows */}
              {[
                { k: "STATUS", v: "ACTIVE", red: false, green: true },
                { k: "OPERATION", v: "NLDS'26", red: false, green: false },
                { k: "CLASS.", v: "TOP SECRET", red: true, green: false },
                { k: "LOCATION", v: "SRI LANKA", red: false, green: false },
                { k: "DATE", v: "OCT 09–11", red: false, green: false },
                { k: "YEAR", v: "2026", red: false, green: false },
              ].map(({ k, v, red, green }) => (
                <div key={k} className="mb-2.5">
                  <span className="block text-white/50 uppercase text-[10px] tracking-[0.18em]">
                    {k}
                  </span>
                  <span
                    className="block uppercase text-[12px] tracking-[0.12em]"
                    style={{
                      color: red
                        ? "var(--red)"
                        : green
                          ? "#4ade80"
                          : "rgba(240,237,232,0.65)",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Coordinates (desktop) ───────────── */}
      {phase >= 4 && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden hidden md:block">
          {COORDS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 1.4 + c.delay }}
              className="absolute font-classified text-white text-[8px] animate-float"
              style={{
                top: c.top,
                left: (c as any).left ?? "auto",
                right: (c as any).right ?? "auto",
                animationDelay: `${c.delay}s`,
              }}
            >
              {c.text}
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Corner Targeting Marks ────────────────────── */}
      {phase >= 4 && (
        <>
          {[
            { cls: "top-8 left-8 corner-tl", delay: 0.3 },
            { cls: "top-8 right-8 corner-tr", delay: 0.4 },
            { cls: "bottom-8 left-8 corner-bl", delay: 0.5 },
            { cls: "bottom-8 right-8 corner-br", delay: 0.6 },
          ].map(({ cls, delay }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay }}
              className={`absolute z-20 w-5 h-5 border-white/12 ${cls}`}
            />
          ))}
        </>
      )}
    </section>
  );
}
