"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function StoreCelebration() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 3 Day limit logic - set to end on September 15, 2026
    const deadline = new Date("2026-09-15T23:59:59Z").getTime();
    const now = new Date().getTime();

    if (now > deadline) return;

    // Check if user has already seen the celebration
    const hasSeen = localStorage.getItem("nlds_store_launch_seen");
    if (hasSeen === "true") return;

    // Mark as seen immediately
    localStorage.setItem("nlds_store_launch_seen", "true");

    // Trigger effect after a short dramatic delay
    setTimeout(() => {
      // NLDS brand colors
      const colors = ["#C41E3A", "#FFFFFF", "#444444", "#888888"];

      // Fire from left edge
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { x: -0.1, y: 0.7 },
        colors: colors,
        angle: 60,
        startVelocity: 55,
      });

      // Fire from right edge
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { x: 1.1, y: 0.7 },
        colors: colors,
        angle: 120,
        startVelocity: 55,
      });

      setShowToast(true);

      // Hide toast after a few seconds
      setTimeout(() => setShowToast(false), 5000);
    }, 700);
  }, []);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] px-5 py-3.5 border pointer-events-none"
          style={{
            background: "rgba(10, 10, 12, 0.95)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(196, 30, 58, 0.4)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(196,30,58,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="animate-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--red)",
                boxShadow: "0 0 10px var(--red)",
              }}
            />
            <span
              className="font-classified text-white tracking-widest uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              MISSION STORE IS LIVE
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
