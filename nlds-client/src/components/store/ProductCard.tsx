"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/merchandise";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useClosingStatus } from "@/components/ui/Countdown";

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  onClick,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const { isClosed } = useClosingStatus();

  // Auto-play carousel
  useEffect(() => {
    if (product.images.length <= 1 || hovered) return;

    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product.images.length, hovered]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(product)}
      className="relative cursor-pointer group h-full flex flex-col"
      role="button"
      aria-label={`View ${product.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(product);
      }}
    >
      {/* Card container */}
      <motion.div
        animate={{
          y: hovered ? -6 : 0,
          boxShadow: hovered
            ? "0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,30,58,0.35)"
            : "0 4px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col h-full overflow-hidden"
        style={{
          background: "var(--surface-1)",
        }}
      >
        {/* Tactical Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20 group-hover:border-[var(--red)] transition-colors z-20" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20 group-hover:border-[var(--red)] transition-colors z-20" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20 group-hover:border-[var(--red)] transition-colors z-20" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20 group-hover:border-[var(--red)] transition-colors z-20" />

        {/* Image area */}
        <div
          className="relative overflow-hidden w-full"
          style={{ aspectRatio: "4/3.8", background: "#09090c" }}
        >
          {/* Scanline shimmer on hover */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0, x: "-30%" }}
            animate={
              hovered ? { opacity: 1, x: "130%" } : { opacity: 0, x: "-30%" }
            }
            transition={{ duration: 0.7, ease: "linear" }}
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
              width: "60%",
            }}
          />

          {/* Item code top-left */}
          <div
            className="absolute top-3.5 left-3.5 z-10"
            style={{
              padding: "4px 9px",
              background: "rgba(6,6,8,0.88)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="font-classified"
              style={{
                fontSize: "8.5px",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {product.itemCode}
            </span>
          </div>

          {/* Badge top-right */}
          {product.badge && (
            <div
              className="absolute top-3.5 right-3.5 z-10"
              style={{
                padding: "4px 10px",
                background:
                  product.badge === "COMING SOON"
                    ? "rgba(10, 10, 12, 0.88)"
                    : "var(--red)",
                border:
                  product.badge === "COMING SOON"
                    ? "1px solid rgba(255, 255, 255, 0.22)"
                    : "none",
                boxShadow:
                  product.badge === "COMING SOON"
                    ? "0 4px 12px rgba(0,0,0,0.5)"
                    : "0 0 12px rgba(196,30,58,0.4)",
              }}
            >
              <span
                className="font-classified font-semibold"
                style={{
                  fontSize: "8.5px",
                  letterSpacing: "0.18em",
                  color:
                    product.badge === "COMING SOON"
                      ? "rgba(255,255,255,0.85)"
                      : "#fff",
                }}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Product image */}
          {product.images.length > 0 ? (
            <div className="w-full h-full relative group/image">
              {product.images.map((imgSrc, idx) => (
                <motion.img
                  key={idx}
                  src={imgSrc}
                  alt={`${product.name} ${idx + 1}`}
                  initial={false}
                  animate={{ 
                    opacity: currentImageIdx === idx ? 1 : 0,
                    scale: hovered ? 1.06 : 1 
                  }}
                  transition={{ 
                    opacity: { duration: 0.9, ease: "easeInOut" },
                    scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
                  }}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ 
                    pointerEvents: currentImageIdx === idx ? "auto" : "none",
                    zIndex: currentImageIdx === idx ? 1 : 0
                  }}
                />
              ))}

              {/* Navigation Controls (Only show if multiple images) */}
              {product.images.length > 1 && (
                <>
                  {/* Left Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIdx((prev) => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 opacity-0 group-hover/image:opacity-100 transition-opacity z-20 border border-white/10"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Right Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIdx((prev) => 
                        (prev + 1) % product.images.length
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 opacity-0 group-hover/image:opacity-100 transition-opacity z-20 border border-white/10"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIdx(i);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          i === currentImageIdx ? "bg-white" : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 absolute inset-0">
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
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: "1px solid rgba(196,30,58,0.4)",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "-8px",
                      right: "-8px",
                      height: 1,
                      background: "rgba(196,30,58,0.3)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "-8px",
                      bottom: "-8px",
                      width: 1,
                      background: "rgba(196,30,58,0.3)",
                    }}
                  />
                </div>
              </div>
              <span
                className="font-classified"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.15)",
                }}
              >
                IMAGE CLASSIFIED
              </span>
            </div>
          )}

          {/* Red bottom accent on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "var(--red)", transformOrigin: "left" }}
          />
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 gap-3.5 justify-between">
          {/* Top section: Status & Title & Description */}
          <div className="flex flex-col gap-3">
            {/* Status row */}
            <div className="flex items-center justify-between">
              <span
                className="font-classified"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  color: "var(--text-ghost)",
                }}
              >
                OFFICIAL ISSUE
              </span>
              <span
                className="font-classified font-medium"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  color: isClosed 
                    ? "var(--red)" 
                    : product.available
                      ? "var(--red)"
                      : "rgba(255,255,255,0.45)",
                }}
              >
                {isClosed ? "● ORDERS CLOSED" : product.available ? "● AVAILABLE" : "○ COMING SOON"}
              </span>
            </div>

            {/* Product name */}
            <h3
              className="font-display group-hover:text-[var(--red)] transition-colors"
              style={{
                fontSize: "1.45rem",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                color: "var(--text)",
              }}
            >
              {product.name}
            </h3>

            {/* Short description */}
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              {product.shortDescription}
            </p>
          </div>

          {/* Bottom section: Price & Action button */}
          <div
            className="mt-4 pt-4 flex flex-col gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-classified text-[10px] tracking-[0.2em] text-[var(--text-ghost)]">
                PRICE
              </span>
              <div
                className="font-display"
                style={{
                  fontSize: "1.55rem",
                  letterSpacing: "0.04em",
                  color: "var(--text)",
                }}
              >
                {product.fitPrices ? (
                  <>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.14em",
                        color: "rgba(255,255,255,0.4)",
                        marginRight: "4px",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      FROM
                    </span>
                    LKR {Math.min(...Object.values(product.fitPrices)).toLocaleString()}
                  </>
                ) : (
                  `LKR ${product.price.toLocaleString()}`
                )}
              </div>
            </div>

            {/* CTA button */}
            <div
              className={`flex items-center justify-center gap-2 px-4 py-[15px] mt-1 transition-all ${
                !isClosed && product.available
                  ? "bg-[var(--red)] text-white hover:bg-[var(--red-hover,rgb(220,38,38))]"
                  : "bg-white/5 text-white/50 border border-white/10 group-hover:border-[var(--red)] group-hover:text-white/80"
              }`}
              style={{
                border: (!isClosed && product.available) ? "none" : undefined,
              }}
            >
              <span className="font-classified font-semibold text-[11px] tracking-[0.2em]">
                {isClosed ? "ORDERS CLOSED — PREVIEW" : product.available ? "VIEW ITEM SPECIFICATIONS" : "COMING SOON — PREVIEW"}
              </span>
              <ArrowRight
                size={14}
                className={`transition-transform ${(!isClosed && product.available) ? "group-hover:translate-x-1" : ""}`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
