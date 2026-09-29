"use client";

/**
 * Registration Coming Soon screen.
 * Shown on /register when registrations are not yet open.
 * Static — no countdown. Replace this with RegistrationForm when registrations open.
 */

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegistrationComingSoon() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#040406" }}
    >
      {/* ── Background glow ── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            width: "70vw",
            height: "60vh",
            background:
              "radial-gradient(ellipse, rgba(196,30,58,1) 0%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.06,
          }}
        />
      </div>

      {/* ── Grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      {/* ── Top accent bar ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--red), transparent)",
          zIndex: 1,
        }}
      />

      {/* ── Corner marks ── */}
      {[
        "top-6 left-6 border-t-2 border-l-2",
        "top-6 right-6 border-t-2 border-r-2",
        "bottom-6 left-6 border-b-2 border-l-2",
        "bottom-6 right-6 border-b-2 border-r-2",
      ].map((cls, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          className={`absolute w-6 h-6 ${cls}`}
          style={{ borderColor: "rgba(196,30,58,0.4)", zIndex: 1 }}
        />
      ))}

      {/* ── Back link ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-10"
        style={{ zIndex: 10 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-classified text-[9px] tracking-[0.28em] uppercase hover:opacity-70 transition-opacity"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <ArrowLeft size={11} />
          BACK TO HOME
        </Link>
      </motion.div>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          maxWidth: "52rem",
          padding: "0 clamp(1.5rem, 6vw, 4rem)",
          gap: 0,
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-px w-8" style={{ background: "var(--red)" }} />
          <span
            className="font-classified uppercase tracking-[0.32em]"
            style={{ fontSize: "9px", color: "var(--red)" }}
          >
            REGISTRATION FLASH ROUND STATUS
          </span>
          <div className="h-px w-8" style={{ background: "var(--red)" }} />
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "2rem" }}
        >
          <h1
            className="font-display leading-none tracking-[0.04em]"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 9rem)",
              color: "var(--text)",
            }}
          >
            COMING
          </h1>
          <h1
            className="font-display leading-none tracking-[0.04em]"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              background:
                "linear-gradient(145deg, #C41E3A 0%, #8B0010 45%, #C41E3A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SOON
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            maxWidth: "28rem",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--red), transparent)",
            opacity: 0.4,
            transformOrigin: "center",
            marginBottom: "2.5rem",
          }}
        />

        {/* Sub-copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.9rem",
            marginBottom: "3rem",
            maxWidth: "34rem",
          }}
        >
          <p
            className="leading-relaxed"
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              fontWeight: 300,
            }}
          >
            The Registration Flash Round for NLDS&apos;26 is not yet open.
            <br />
            Stay tuned — your mission briefing is incoming.
          </p>
          <p
            className="font-classified tracking-[0.24em]"
            style={{ fontSize: "10px", color: "var(--text-ghost)" }}
          >
            09 — 11 OCTOBER 2026 // SRI LANKA
          </p>
        </motion.div>

        {/* CTA — back to home */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-3 items-center justify-center"
          style={{ marginBottom: "4rem" }}
        >
          <Link href="/" className="btn-mission">
            RETURN TO BASE →
          </Link>
          <a
            href="https://www.instagram.com/aiesec_in_srilanka/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            FOLLOW FOR UPDATES
          </a>
        </motion.div>

        {/* Footer tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            style={{ width: "2.5rem", height: "1px", background: "rgba(255,255,255,0.07)" }}
          />
          <div className="flex items-center gap-3">
            <div
              style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--red)", opacity: 0.45 }}
            />
            <p
              className="font-classified tracking-[0.28em]"
              style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.3)" }}
            >
              NLDS&apos;26 // AIESEC IN SRI LANKA
            </p>
            <div
              style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--red)", opacity: 0.45 }}
            />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
