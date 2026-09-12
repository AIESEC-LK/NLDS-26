"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { OrderItem } from "@/lib/store/types";

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  total: number;
  items?: OrderItem[];
}

export default function OrderConfirmation({
  orderId,
  customerName,
  total,
  items = [],
}: OrderConfirmationProps) {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center w-full"
      style={{
        background: "var(--bg)",
        minHeight: "50vh",
        paddingTop: "clamp(3rem, 5vw, 5rem)",
        paddingBottom: "8rem",
      }}
    >
      {/* Red ambient glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse, rgba(196,30,58,0.8) 0%, transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.08,
        }}
      />

      <div className="relative z-10 w-full max-w-[680px] mx-auto px-5 sm:px-8 flex flex-col items-center gap-8">
        {/* Success Icon Badge */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              border: "2px solid rgba(196,30,58,0.4)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(196,30,58,0.12)",
              boxShadow: "0 0 24px rgba(196,30,58,0.25)",
            }}
          >
            <CheckCircle2 size={38} style={{ color: "var(--red)" }} />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-2.5"
        >
          <span
            className="font-classified font-bold"
            style={{
              fontSize: "11px",
              letterSpacing: "0.26em",
              color: "var(--red)",
            }}
          >
            TRANSMISSION SUCCESSFUL
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              letterSpacing: "0.04em",
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            MISSION GEAR ORDER CONFIRMED
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: "32rem",
              marginTop: 4,
            }}
          >
            Thank you,{" "}
            <span className="text-white font-medium">{customerName}</span>. Your
            merchandise request has been received and is queued for
            verification.
          </p>
        </motion.div>

        {/* Order Details Dossier Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full rounded-[4px] overflow-hidden"
          style={{
            background: "#0a0a0c",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <span
              className="font-classified font-bold"
              style={{
                fontSize: "10px",
                letterSpacing: "0.24em",
                color: "#ffffff",
              }}
            >
              ORDER DOSSIER
            </span>
            <span
              className="font-classified"
              style={{
                fontSize: "9px",
                letterSpacing: "0.16em",
                color: "var(--red)",
                background: "rgba(196,30,58,0.15)",
                border: "1px solid rgba(196,30,58,0.3)",
                padding: "2px 7px",
                borderRadius: "2px",
              }}
            >
              STATUS // PENDING VERIFICATION
            </span>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7 flex flex-col gap-4">
            {[
              { label: "ORDER ID", value: orderId, isId: true },
              { label: "OPERATIVE NAME", value: customerName },
              {
                label: "TOTAL PAYABLE",
                value: `LKR ${total.toLocaleString()}`,
                isPrice: true,
              },
              {
                label: "PAYMENT STATUS",
                value: "PENDING VERIFICATION",
                isStatus: true,
              },
            ].map(({ label, value, isId, isPrice, isStatus }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span
                  className="font-classified"
                  style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.24em",
                    color: "var(--text-ghost)",
                  }}
                >
                  {label}
                </span>
                <span
                  className={`tabular ${
                    isPrice
                      ? "font-display text-[1.4rem] text-white"
                      : isId
                        ? "font-display text-[1.15rem] text-white"
                        : isStatus
                          ? "font-classified text-[10px] tracking-[0.14em] text-[var(--red)]"
                          : "font-sans text-[0.95rem] text-white"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}

            {/* Items Ordered Section */}
            {items.length > 0 && (
              <div
                className="flex flex-col gap-0 mt-2 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span
                  className="font-classified mb-3"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.24em",
                    color: "var(--text-ghost)",
                  }}
                >
                  ITEMS ORDERED
                </span>
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 py-2.5"
                    style={{
                      borderBottom:
                        i < items.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0 text-left">
                      <span
                        className="font-display"
                        style={{
                          fontSize: "1.05rem",
                          letterSpacing: "0.03em",
                          color: "#fff",
                          lineHeight: 1.1,
                        }}
                      >
                        {item.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {item.size && (
                          <span
                            className="font-classified"
                            style={{
                              fontSize: "8px",
                              letterSpacing: "0.12em",
                              color: "#fff",
                              background: "rgba(196,30,58,0.2)",
                              border: "1px solid rgba(196,30,58,0.4)",
                              padding: "1px 6px",
                              borderRadius: "2px",
                            }}
                          >
                            SIZE: {item.size}
                          </span>
                        )}
                        {item.fit && (
                          <span
                            className="font-classified"
                            style={{
                              fontSize: "8px",
                              letterSpacing: "0.12em",
                              color: "#fff",
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              padding: "1px 6px",
                              borderRadius: "2px",
                            }}
                          >
                            {item.fit.toUpperCase()}
                          </span>
                        )}
                        <span
                          className="font-classified"
                          style={{
                            fontSize: "8px",
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          QTY: {String(item.quantity).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <span
                      className="font-display flex-shrink-0"
                      style={{
                        fontSize: "1rem",
                        letterSpacing: "0.03em",
                        color: "#fff",
                      }}
                    >
                      LKR {item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p
              className="font-classified text-center pt-2"
              style={{
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              PLEASE SAVE YOUR ORDER ID FOR COMMUNICATION WITH THE MISSION TEAM.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons: BACK TO STORE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <Link
            href="/store"
            className="btn-mission flex items-center justify-center gap-2.5 flex-1"
            style={{
              padding: "16px 28px",
              fontSize: "12.5px",
              letterSpacing: "0.16em",
            }}
            id="confirmation-back-to-store"
          >
            <ShoppingBag size={16} />
            BACK TO STORE
          </Link>
          <Link
            href="/"
            className="btn-ghost flex items-center justify-center gap-2.5 flex-1"
            style={{
              padding: "16px 28px",
              fontSize: "12.5px",
              letterSpacing: "0.16em",
            }}
            id="confirmation-back-to-home"
          >
            <ArrowLeft size={16} />
            HOME
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
