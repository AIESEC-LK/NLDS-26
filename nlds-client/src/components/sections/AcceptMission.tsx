"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { REGISTRATION_OPEN } from "@/lib/constants";
import { useClosingStatus } from "@/components/ui/Countdown";

export default function AcceptMission() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isClosed } = useClosingStatus();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      id="accept"
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "#040406",
        minHeight: "90vh",
        paddingTop: "7rem",
        paddingBottom: "7rem",
      }}
    >
      {/* Parallax bg glow */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          style={{
            width: "80vw",
            height: "60vh",
            background:
              "radial-gradient(ellipse, rgba(196,30,58,1) 0%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.065,
          }}
        />
      </motion.div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Corner marks */}
      {[
        "top-8 left-8 corner-tl",
        "top-8 right-8 corner-tr",
        "bottom-8 left-8 corner-bl",
        "bottom-8 right-8 corner-br",
      ].map((cls, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 + i * 0.1 }}
          className={`absolute z-10 w-6 h-6 border-white/08 ${cls}`}
        />
      ))}

      {/* Content — centered flex column with explicit gaps */}
      <div
        className="relative z-10 text-center flex flex-col items-center"
        style={{
          width: "100%",
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 6vw, 5rem)",
          gap: 0,
        }}
      >
        {/* FINAL DIRECTIVE label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div className="h-[1px] w-10" style={{ background: "var(--red)" }} />
          <span className="label-classified">FINAL DIRECTIVE</span>
          <div className="h-[1px] w-10" style={{ background: "var(--red)" }} />
        </motion.div>

        {/* WILL YOU / ACCEPT THE MISSION? */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          style={{ marginBottom: "3rem" }}
        >
          <h2
            className="font-display leading-[0.85] tracking-[0.04em] text-white animate-flicker"
            style={{ fontSize: "clamp(3.5rem, 13vw, 12rem)" }}
          >
            WILL YOU
          </h2>
          <h2
            className="font-display leading-[0.85] tracking-[0.04em]"
            style={{
              fontSize: "clamp(3rem, 11vw, 10rem)",
              background:
                "linear-gradient(145deg, #C41E3A 0%, #8B0010 45%, #C41E3A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ACCEPT THE MISSION?
          </h2>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          style={{
            width: "100%",
            maxWidth: "32rem",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--red), transparent)",
            opacity: 0.4,
            transformOrigin: "center",
            marginBottom: "3rem",
          }}
        />

        {/* Supporting copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "3rem",
            maxWidth: "36rem",
          }}
        >
          <p
            className="leading-relaxed"
            style={{
              fontSize: "1.05rem",
              color: "var(--text-dim)",
              fontWeight: 300,
            }}
          >
            Some challenges are not meant to be easy.
            <br />
            They are meant to change you.
          </p>
          <p
            className="font-classified text-[12px] tracking-[0.25em]"
            style={{ color: "var(--text-muted)" }}
          >
            09 — 11 OCTOBER 2026 // SRI LANKA
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85 }}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          {!isClosed && REGISTRATION_OPEN ? (
            <Link href="/register" className="btn-mission" id="final-cta">
              ACCEPT THE MISSION →
            </Link>
          ) : (
            <button
              className="btn-mission opacity-50 cursor-not-allowed"
              id="final-cta"
              disabled
            >
              REGISTRATIONS CLOSED
            </button>
          )}
          <button
            className="btn-ghost"
            onClick={() =>
              document
                .getElementById("mission")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            VIEW THE BRIEFING
          </button>
        </motion.div>

        {/* Footer classified tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--red)",
                opacity: 0.5,
              }}
            />
            <p
              className="font-classified text-[10px] tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              THIS MESSAGE WILL SELF-DESTRUCT
            </p>
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--red)",
                opacity: 0.5,
              }}
            />
          </div>
          <p
            className="font-classified text-[10px] tracking-[0.22em]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            NLDS'26 // AIESEC IN SRI LANKA
          </p>
        </motion.div>
      </div>
    </section>
  );
}
