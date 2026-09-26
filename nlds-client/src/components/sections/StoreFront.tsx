"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProductGrid from "@/components/store/ProductGrid";
import CartDrawer from "@/components/store/CartDrawer";
import ClosingCountdown from "@/components/ui/Countdown";

export default function StoreFront() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      <section
        ref={ref}
        id="store"
        className="relative overflow-hidden w-full flex flex-col items-center"
        style={{
          background: "var(--bg)",
          paddingTop: "4rem",
          paddingBottom: "10rem",
        }}
      >
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Red ambient glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: "50%",
            top: "20%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(196,30,58,0.8) 0%, transparent 70%)",
            filter: "blur(140px)",
            opacity: 0.05,
          }}
        />

        {/* Centered Main Column */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 4vw, 3.5rem)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* ── Centered Section Header ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center w-full max-w-[800px]"
            style={{ marginBottom: "1rem" }}
          >
            {/* Pill / status indicator */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.45rem 1.25rem",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--red)",
                  display: "inline-block",
                }}
              />
              <span
                className="font-classified"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.26em",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                OFFICIAL INVENTORY // LIMITED EDITION
              </span>
            </div>

            {/* Heading */}
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                letterSpacing: "0.04em",
                lineHeight: 0.95,
                color: "var(--text)",
                marginBottom: "1.25rem",
              }}
            >
              AUTHORIZED{" "}
              <span style={{ color: "var(--red)" }}>MISSION GEAR</span>
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: "34rem",
                marginBottom: "2rem",
              }}
            >
              Select an item to view specifications, available sizes, and secure
              your order. All items are delivered during registration at
              NLDS&apos;26.
            </p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8"
            >
              <ClosingCountdown 
                title={<span className="font-classified text-[11px] tracking-[0.2em] text-[var(--red)] uppercase">FINAL CALL<br/>MERGE &apos;26</span>}
                labelBefore="ORDERS CLOSE IN"
                labelAfter="ORDERS CLOSED"
              />
            </motion.div>

            {/* Centered tactical metadata row */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 px-6 max-w-2xl w-full"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              {[
                ["OPERATION", "NLDS'26"],
                ["CLASSIFICATION", "OFFICIAL ISSUE"],
                ["STATUS", "INVENTORY ACTIVE"],
              ].map(([key, val], idx) => (
                <div key={key} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span
                      className="hidden sm:inline-block"
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        marginRight: "0.75rem",
                      }}
                    />
                  )}
                  <span
                    className="font-classified"
                    style={{
                      fontSize: "9.5px",
                      letterSpacing: "0.22em",
                      color: "var(--text-ghost)",
                    }}
                  >
                    {key}:
                  </span>
                  <span
                    className="font-classified"
                    style={{
                      fontSize: "9.5px",
                      letterSpacing: "0.18em",
                      color:
                        val === "INVENTORY ACTIVE"
                          ? "var(--red)"
                          : "var(--text-muted)",
                    }}
                  >
                    {val === "INVENTORY ACTIVE" ? `● ${val}` : val}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle centered accent divider */}
            <div
              style={{
                width: "140px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, var(--red), transparent)",
                opacity: 0.6,
                marginTop: "2.5rem",
                marginBottom: "1rem",
              }}
            />
          </motion.div>

          {/* ── Product Grid ───────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex justify-center"
            style={{
              marginTop: "clamp(3rem, 6vw, 5rem)",
              marginBottom: "clamp(4rem, 8vw, 6rem)",
            }}
          >
            <ProductGrid />
          </motion.div>
        </div>
      </section>

      {/* Cart Drawer (portal-level) */}
      <CartDrawer />
    </>
  );
}
