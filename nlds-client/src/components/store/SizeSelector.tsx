"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import type { SizeChart } from "@/data/merchandise";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (size: string) => void;
  sizeChart?: SizeChart;
}

export default function SizeSelector({
  sizes,
  selected,
  onChange,
  sizeChart,
}: SizeSelectorProps) {
  const [chartOpen, setChartOpen] = useState<"oversized" | "regular" | null>(
    null
  );

  if (!sizes || sizes.length === 0) return null;

  const chartImageSrc =
    chartOpen === "oversized"
      ? sizeChart?.oversized
      : chartOpen === "regular"
        ? sizeChart?.regular
        : null;

  return (
    <>
      <div
        className="flex flex-col gap-2.5 w-full text-left"
        style={{ textAlign: "left" }}
      >
        {/* Size label + selected */}
        <div
          className="flex items-center justify-between w-full"
          style={{ marginBottom: "0.25rem" }}
        >
          <span
            className="font-classified"
            style={{
              fontSize: "9.5px",
              letterSpacing: "0.22em",
              color: "var(--text-muted)",
              textAlign: "left",
            }}
          >
            SELECT SIZE
          </span>
          {selected && (
            <span
              className="font-classified"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                color: "var(--red)",
              }}
            >
              {selected}
            </span>
          )}
        </div>

        {/* Size buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {sizes.map((size) => {
            const isActive = selected === size;
            return (
              <button
                key={size}
                onClick={() => onChange(size)}
                className="transition-all duration-200 flex items-center justify-center min-w-[32px] sm:min-w-[40px] h-[28px] sm:h-[36px] px-1.5 sm:px-2.5 text-[9.5px] sm:text-[11px]"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                  background: isActive
                    ? "rgba(196,30,58,0.15)"
                    : "rgba(255,255,255,0.03)",
                  border: isActive
                    ? "1px solid var(--red)"
                    : "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 0 8px rgba(196,30,58,0.25), inset 0 0 4px rgba(196,30,58,0.1)"
                    : "none",
                }}
                aria-pressed={isActive}
                aria-label={`Size ${size}`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Size Chart section — only for products that have a sizeChart */}
        {sizeChart && (
          <div
            className="flex flex-col gap-1.5 mt-1 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-1.5">
              <Ruler size={9} style={{ color: "var(--text-ghost)" }} />
              <span
                className="font-classified"
                style={{
                  fontSize: "8.5px",
                  letterSpacing: "0.2em",
                  color: "var(--text-ghost)",
                }}
              >
                SIZE CHART
              </span>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setChartOpen("oversized")}
                className="flex-1 flex items-center justify-center gap-1 px-4 py-3 transition-all duration-200 bg-white/5 text-white/50 border border-white/10 hover:bg-[var(--red)] hover:border-[var(--red)] hover:text-white"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                aria-label="View oversized size chart"
                id="sizechart-oversized-btn"
              >
                OVERSIZED
              </button>
              <button
                onClick={() => setChartOpen("regular")}
                className="flex-1 flex items-center justify-center gap-1 px-4 py-3 transition-all duration-200 bg-white/5 text-white/50 border border-white/10 hover:bg-[var(--red)] hover:border-[var(--red)] hover:text-white"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                aria-label="View regular size chart"
                id="sizechart-regular-btn"
              >
                REGULAR
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {chartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="chart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[500]"
              style={{
                background: "rgba(0,0,0,0.94)",
                backdropFilter: "blur(10px)",
              }}
              onClick={() => setChartOpen(null)}
            />

            {/* Chart image panel */}
            <motion.div
              key="chart-panel"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[501] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
            >
              <div
                className="relative pointer-events-auto flex flex-col overflow-hidden"
                style={{
                  maxWidth: "min(90vw, 600px)",
                  maxHeight: "85vh",
                  width: "100%",
                  background: "#0a0a0c",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(196,30,58,0.18)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Red accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--red), transparent 60%)",
                    opacity: 0.6,
                  }}
                />

                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 shrink-0"
                  style={{
                    background: "rgba(10,10,12,0.98)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Ruler size={10} style={{ color: "var(--red)" }} />
                    <span
                      className="font-classified"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.22em",
                        color: "var(--text-muted)",
                      }}
                    >
                      SIZE CHART //&nbsp;
                    </span>
                    <span
                      className="font-classified"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.18em",
                        color: "var(--red)",
                      }}
                    >
                      {chartOpen === "oversized" ? "OVERSIZED" : "REGULAR"}
                    </span>
                  </div>

                  {/* Toggle buttons + close */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setChartOpen("oversized")}
                        className={`px-3 py-1.5 transition-all duration-200 border ${
                          chartOpen === "oversized"
                            ? "bg-[var(--red)] border-[var(--red)] text-white"
                            : "bg-transparent border-white/10 text-white/40 hover:border-[var(--red)] hover:text-white"
                        }`}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        OVERSIZED
                      </button>
                      <button
                        onClick={() => setChartOpen("regular")}
                        className={`px-3 py-1.5 transition-all duration-200 border ${
                          chartOpen === "regular"
                            ? "bg-[var(--red)] border-[var(--red)] text-white"
                            : "bg-transparent border-white/10 text-white/40 hover:border-[var(--red)] hover:text-white"
                        }`}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        REGULAR
                      </button>
                    </div>

                    <button
                      onClick={() => setChartOpen(null)}
                      aria-label="Close size chart"
                      className="flex items-center justify-center w-6 h-6 hover:text-white transition-colors ml-1"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Chart Image */}
                <div
                  className="overflow-y-auto overflow-x-hidden flex-1"
                  style={{ background: "#08080a" }}
                >
                  <AnimatePresence mode="wait">
                    {chartImageSrc ? (
                      <motion.img
                        key={chartOpen}
                        initial={{ opacity: 0, x: chartOpen === "oversized" ? -16 : 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        src={chartImageSrc}
                        alt={`${chartOpen === "oversized" ? "Oversized" : "Regular"} size chart`}
                        className="w-full h-auto block"
                        style={{ display: "block" }}
                      />
                    ) : (
                      /* Placeholder when chart image not yet available */
                      <motion.div
                        key="chart-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-4 py-20 px-8"
                      >
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            border: "1px solid rgba(196,30,58,0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ruler size={24} style={{ color: "rgba(196,30,58,0.4)" }} />
                        </div>
                        <div className="text-center">
                          <span
                            className="font-classified block"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.22em",
                              color: "rgba(255,255,255,0.2)",
                            }}
                          >
                            SIZE CHART
                          </span>
                          <span
                            className="font-classified block mt-1"
                            style={{
                              fontSize: "8.5px",
                              letterSpacing: "0.16em",
                              color: "rgba(255,255,255,0.12)",
                            }}
                          >
                            COMING SOON
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
