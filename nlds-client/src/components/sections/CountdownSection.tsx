"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const TARGET_DATE = new Date("2026-10-09T00:00:00+05:30");

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

interface Unit {
  label: string;
  value: number;
}

function CountdownCell({ label, value }: { label: string; value: number }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Digit block */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "clamp(72px, 14vw, 140px)",
          height: "clamp(88px, 16vw, 164px)",
          background: "var(--surface-1)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 0 40px rgba(196,30,58,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Top shine */}
        <div
          className="absolute top-0 left-4 right-4 h-[1px]"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Corner marks */}
        <div className="absolute top-2 left-2 w-2 h-2 corner-tl border-white/10" />
        <div className="absolute top-2 right-2 w-2 h-2 corner-tr border-white/10" />
        <div className="absolute bottom-2 left-2 w-2 h-2 corner-bl border-white/10" />
        <div className="absolute bottom-2 right-2 w-2 h-2 corner-br border-white/10" />

        {/* Digits */}
        <span
          className="font-display tabular"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            color: "var(--text)",
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
        >
          {display}
        </span>
      </div>

      {/* Label */}
      <span className="font-classified text-[11px] sm:text-[12px] tracking-[0.28em] text-white/50 uppercase">
        {label}
      </span>
    </div>
  );
}

export default function CountdownSection() {
  const [time, setTime] = useState(getTimeLeft());
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: Unit[] = [
    { label: "DAYS", value: time.days },
    { label: "HOURS", value: time.hours },
    { label: "MINUTES", value: time.minutes },
    { label: "SECONDS", value: time.seconds },
  ];

  return (
    <section
      ref={ref}
      id="countdown"
      className="relative w-full overflow-hidden py-24 md:py-32"
      style={{
        background: "var(--surface-1)",
        marginTop: "clamp(4rem, 10vw, 8rem)",
      }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Red glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse, rgba(196,30,58,1) 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.04,
        }}
      />

      {/* Centered content */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingLeft: "clamp(1.5rem, 6vw, 5rem)",
          paddingRight: "clamp(1.5rem, 6vw, 5rem)",
        }}
      >
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "3rem",
            marginTop: "3rem",
          }}
        >
          <div
            style={{ height: "1px", width: "2.5rem", background: "var(--red)" }}
          />
          <span className="label-classified">MISSION LAUNCH</span>
          <div
            style={{ height: "1px", width: "2.5rem", background: "var(--red)" }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display leading-[0.88]"
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            color: "var(--text)",
            marginBottom: "1rem",
          }}
        >
          T-MINUS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="font-classified text-[12px] tracking-[0.3em] text-[var(--text-muted)]"
          style={{ marginBottom: "4rem" }}
        >
          09 OCTOBER 2026 // VENUE: CAROLINA BEACH RESORT, CHILLAW
        </motion.p>

        {/* Countdown cells */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {units.map((unit, i) => (
            <div
              key={unit.label}
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <CountdownCell
                label={unit.label}
                value={mounted ? unit.value : 0}
              />
              {i < units.length - 1 && (
                <span
                  className="font-display hidden sm:block"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                    color: "rgba(196,30,58,0.5)",
                    marginBottom: "2rem",
                  }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: "3.5rem",
            marginBottom: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "4rem",
              background: "var(--border-strong)",
            }}
          />
          <p className="font-classified text-[11px] tracking-[0.22em] text-white/40">
            NATIONAL LEADERSHIP DEVELOPMENT SEMINAR 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
