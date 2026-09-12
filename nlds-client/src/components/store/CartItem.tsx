"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/store/cartStore";
import type { CartItem as CartItemType } from "@/lib/store/types";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQty } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3.5 p-3 sm:p-3.5 rounded-[4px]"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Product image with tactical border */}
      <div
        className="flex-shrink-0 relative overflow-hidden rounded-[2px]"
        style={{
          width: 72,
          height: 86,
          background: "#0c0c0f",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              style={{
                width: 22,
                height: 22,
                border: "1px solid rgba(196,30,58,0.3)",
                borderRadius: "50%",
              }}
            />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <p
              className="font-display truncate"
              style={{
                fontSize: "1.1rem",
                letterSpacing: "0.03em",
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              {item.name}
            </p>
            <button
              onClick={() => removeItem(item.productId, item.size, item.fit)}
              aria-label={`Remove ${item.name}`}
              className="flex-shrink-0 transition-all duration-200 flex items-center justify-center rounded"
              style={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--red)";
                e.currentTarget.style.borderColor = "rgba(196,30,58,0.4)";
                e.currentTarget.style.background = "rgba(196,30,58,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <Trash2 size={17} />
            </button>
          </div>

          {/* Item code & size tags */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className="font-classified"
              style={{
                fontSize: "8.5px",
                letterSpacing: "0.16em",
                color: "var(--text-ghost)",
              }}
            >
              {item.itemCode}
            </span>
            {item.size && (
              <>
                <span
                  style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px" }}
                >
                  ·
                </span>
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
              </>
            )}
            {item.fit && (
              <>
                <span
                  style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px" }}
                >
                  ·
                </span>
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
              </>
            )}
          </div>
        </div>

        {/* Stepper + Total Line */}
        <div className="flex items-center justify-between mt-2 pt-1">
          {/* Touch-friendly Stepper */}
          <div
            className="flex items-center"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <button
              onClick={() =>
                updateQty(item.productId, item.size, item.fit, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="flex items-center justify-center transition-colors"
              style={{
                width: 30,
                height: 28,
                fontSize: "0.95rem",
                color:
                  item.quantity <= 1 ? "rgba(255,255,255,0.15)" : "#ffffff",
                background: "transparent",
                border: "none",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
              }}
            >
              −
            </button>
            <span
              className="font-classified tabular flex items-center justify-center"
              style={{
                width: 34,
                height: 28,
                fontSize: "12px",
                color: "#ffffff",
                fontWeight: 500,
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQty(item.productId, item.size, item.fit, item.quantity + 1)
              }
              aria-label="Increase quantity"
              className="flex items-center justify-center transition-colors"
              style={{
                width: 30,
                height: 28,
                fontSize: "0.95rem",
                color: "#ffffff",
                background: "transparent",
                border: "none",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          {/* Line total price */}
          <span
            className="font-display"
            style={{
              fontSize: "1.15rem",
              letterSpacing: "0.04em",
              color: "#ffffff",
            }}
          >
            LKR {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
