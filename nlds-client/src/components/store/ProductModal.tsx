"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store/cartStore";
import ProductGallery from "@/components/store/ProductGallery";
import SizeSelector from "@/components/store/SizeSelector";
import QuantitySelector from "@/components/store/QuantitySelector";
import type { Product } from "@/data/merchandise";
import { X, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import FitSelector from "@/components/store/FitSelector";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem, setBuyNow, openCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFit, setSelectedFit] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<"added" | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [fitError, setFitError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!product) return;

    // Lock background scrolling on mobile & desktop
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [product]);

  // Reset state when product changes
  const handleClose = () => {
    setSelectedSize(null);
    setSelectedFit(null);
    setQuantity(1);
    setToast(null);
    setSizeError(false);
    setFitError(false);
    onClose();
  };

  const requiresSize = product ? product.sizes.length > 0 : false;
  const requiresFit = product ? (product.fitTypes?.length ?? 0) > 0 : false;

  // Compute the price to use based on selected fit (updates live as fit changes)
  const effectivePrice: number = product
    ? (selectedFit !== null && product.fitPrices?.[selectedFit] !== undefined
      ? product.fitPrices[selectedFit]
      : product.price)
    : 0;

  // For display when no fit is selected yet: show the lowest fit price as "from X"
  const minFitPrice = product?.fitPrices
    ? Math.min(...Object.values(product.fitPrices))
    : null;

  function validateSize(): boolean {
    let valid = true;
    if (requiresSize && !selectedSize) {
      setSizeError(true);
      valid = false;
    } else {
      setSizeError(false);
    }
    if (requiresFit && !selectedFit) {
      setFitError(true);
      valid = false;
    } else {
      setFitError(false);
    }
    return valid;
  }

  function handleAddToCart() {
    if (!product || !product.available || !validateSize()) return;
    addItem(product, selectedSize, selectedFit, quantity, effectivePrice);
    setToast("added");
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuyNow() {
    if (!product || !product.available || !validateSize()) return;
    // Override price in the product for BuyNow so checkout sees correct amount
    const productWithPrice = { ...product, price: effectivePrice };
    setBuyNow({ product: productWithPrice, size: selectedSize, fit: selectedFit, quantity });
    handleClose();
    router.push("/store/checkout?mode=buynow");
  }

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop with z-[300] directly in document.body to cover all elements completely */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300]"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(8px)",
            }}
            onClick={handleClose}
          />

          {/* Modal Overlay with z-[301] */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[301] inset-0 flex items-center justify-center p-3 sm:p-5 md:p-8 pointer-events-none"
          >
            <div
              data-lenis-prevent
              data-lenis-prevent-touch
              className="relative w-[95vw] max-w-[400px] sm:max-w-[460px] md:max-w-[880px] max-h-[96vh] sm:max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
              style={{
                background: "#0a0a0c",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(196,30,58,0.18)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle top red accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, var(--red), transparent 60%)",
                  opacity: 0.6,
                }}
              />

              {/* Compact Header bar */}
              <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 sticky top-0 z-20"
                style={{
                  background: "rgba(10,10,12,0.98)",
                  backdropFilter: "blur(12px)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    style={{
                      width: 4.5,
                      height: 4.5,
                      borderRadius: "50%",
                      background: "var(--red)",
                      opacity: 0.8,
                    }}
                  />
                  <span
                    className="font-classified"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.24em",
                      color: "var(--text-muted)",
                    }}
                  >
                    ITEM FILE
                  </span>
                  <span
                    className="font-classified"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    // {product.itemCode}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close product file"
                  className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 transition-colors hover:text-white"
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

              {/* Content Grid — Mobile Stack & Desktop Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch flex-1 min-h-0 overflow-hidden">
                {/* Left — Image Gallery (hidden on smallest mobile, visible sm+) */}
                <div
                  className="relative w-full hidden sm:flex md:flex h-[220px] sm:h-[260px] md:h-full md:min-h-[460px] flex-col flex-shrink-0"
                  style={{
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "#08080a",
                  }}
                >
                  <ProductGallery
                    images={product.images}
                    productName={product.name}
                    forcedIndex={
                      requiresFit && selectedFit
                        ? selectedFit.toLowerCase() === "oversized"
                          ? 0
                          : 1
                        : undefined
                    }
                  />
                </div>
                {/* Tiny image strip — only shown on very small mobile (below sm) */}
                <div
                  className="relative w-full flex sm:hidden h-[140px] flex-col flex-shrink-0"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "#08080a",
                  }}
                >
                  <ProductGallery
                    images={product.images}
                    productName={product.name}
                    forcedIndex={
                      requiresFit && selectedFit
                        ? selectedFit.toLowerCase() === "oversized"
                          ? 0
                          : 1
                        : undefined
                    }
                  />
                </div>

                {/* Right — Details with ultra compact mobile padding & spacing */}
                <div
                  className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 overflow-y-auto min-h-0"
                  style={{
                    textAlign: "left",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Top Block */}
                  <div
                    className="flex flex-col w-full text-left"
                    style={{ textAlign: "left", marginBottom: "0.5rem" }}
                  >
                    {/* Classification tags */}
                    <div
                      className="flex flex-wrap items-center gap-1.5"
                      style={{ marginBottom: "0.3rem" }}
                    >
                      <span
                        className="font-classified"
                        style={{
                          fontSize: "7.5px",
                          letterSpacing: "0.18em",
                          color: "var(--text-ghost)",
                        }}
                      >
                        ITEM // {product.itemCode}
                      </span>
                      <div
                        style={{
                          width: 2,
                          height: 2,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.15)",
                        }}
                      />
                      <span
                        className="font-classified"
                        style={{
                          fontSize: "7.5px",
                          letterSpacing: "0.16em",
                          color: product.available
                            ? "var(--red)"
                            : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {product.available ? "● AVAILABLE" : "○ COMING SOON"}
                      </span>
                      {product.badge && (
                        <>
                          <div
                            style={{
                              width: 2,
                              height: 2,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.15)",
                            }}
                          />
                          <span
                            className="font-classified font-medium"
                            style={{
                              fontSize: "7px",
                              letterSpacing: "0.14em",
                              color: "#fff",
                              background:
                                product.badge === "COMING SOON"
                                  ? "rgba(255, 255, 255, 0.12)"
                                  : "var(--red)",
                              border:
                                product.badge === "COMING SOON"
                                  ? "1px solid rgba(255, 255, 255, 0.2)"
                                  : "none",
                              padding: "1px 5px",
                            }}
                          >
                            {product.badge}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Product name & subtitle */}
                    <div style={{ marginBottom: "0.5rem" }}>
                      <h2
                        className="font-display"
                        style={{
                          fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)",
                          letterSpacing: "0.02em",
                          lineHeight: 1,
                          color: "var(--text)",
                          textTransform: "uppercase",
                        }}
                      >
                        {product.name}
                      </h2>
                      <p
                        className="font-classified"
                        style={{
                          fontSize: "8.5px",
                          letterSpacing: "0.2em",
                          color: "var(--red)",
                          opacity: 0.8,
                          marginTop: "0.25rem",
                        }}
                      >
                        OFFICIAL ISSUE
                      </p>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-[13px] sm:text-[14px] text-white/60 font-normal leading-[1.7] mb-4 pr-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div
                      className="flex items-baseline gap-1.5"
                      style={{ marginBottom: "0.3rem" }}
                    >
                      <span
                        className="font-classified"
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.16em",
                          color: "var(--text-ghost)",
                        }}
                      >
                        PRICE:
                      </span>
                      <span
                        className="font-display"
                        style={{
                          fontSize: "1.35rem",
                          letterSpacing: "0.04em",
                          color: "var(--text)",
                        }}
                      >
                        {!selectedFit && minFitPrice !== null ? (
                          <>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                letterSpacing: "0.12em",
                                color: "rgba(255,255,255,0.4)",
                                marginRight: "4px",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              FROM
                            </span>
                            LKR {minFitPrice.toLocaleString()}
                          </>
                        ) : (
                          `LKR ${effectivePrice.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      className="mission-line w-full"
                      style={{ opacity: 0.35, margin: "0.2rem 0 0.5rem 0" }}
                    />

                    {/* Fit selector — Oversized / Regular */}
                    {requiresFit && product.fitTypes && (
                      <div
                        style={{ marginBottom: "0.5rem" }}
                        className="w-full text-left"
                      >
                        <FitSelector
                          fitTypes={product.fitTypes}
                          selected={selectedFit}
                          error={fitError}
                          onChange={(f) => {
                            setSelectedFit(f);
                            setFitError(false);
                          }}
                        />
                        {fitError && (
                          <p
                            className="font-classified mt-1"
                            style={{
                              fontSize: "7.5px",
                              letterSpacing: "0.14em",
                              color: "var(--red)",
                            }}
                          >
                            ⚠ PLEASE SELECT A FIT TYPE
                          </p>
                        )}
                      </div>
                    )}

                    {/* Size selector */}
                    {requiresSize && (
                      <div
                        style={{ marginBottom: "0.5rem" }}
                        className="w-full text-left"
                      >
                        <SizeSelector
                          sizes={product.sizes}
                          selected={selectedSize}
                          sizeChart={product.sizeChart}
                          onChange={(s) => {
                            setSelectedSize(s);
                            setSizeError(false);
                          }}
                        />
                        {sizeError && (
                          <motion.p
                            initial={{ opacity: 0, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-classified mt-1"
                            style={{
                              fontSize: "7.5px",
                              letterSpacing: "0.14em",
                              color: "var(--red)",
                            }}
                          >
                            ⚠ PLEASE SELECT A SIZE
                          </motion.p>
                        )}
                      </div>
                    )}

                    {/* Quantity selector */}
                    {product.available && (
                      <div
                        style={{ marginBottom: "0.6rem" }}
                        className="w-full text-left"
                      >
                        <QuantitySelector
                          value={quantity}
                          onChange={setQuantity}
                        />
                      </div>
                    )}
                  </div>

                  {/* Desktop-only inline actions (hidden on mobile — shown in sticky footer instead) */}
                  <div className="hidden md:flex flex-col gap-1.5 w-full mt-auto pt-2">
                    {!product.available ? (
                      <div
                        className="w-full flex flex-col items-center justify-center py-2.5 px-3 text-center"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px dashed rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <span
                          className="font-classified"
                          style={{
                            fontSize: "9.5px",
                            letterSpacing: "0.2em",
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          MISSION STANDBY // COMING SOON
                        </span>
                        <span
                          className="font-classified mt-0.5"
                          style={{
                            fontSize: "7.5px",
                            letterSpacing: "0.12em",
                            color: "rgba(255, 255, 255, 0.4)",
                          }}
                        >
                          ITEM CURRENTLY UNAVAILABLE FOR ORDER
                        </span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleBuyNow}
                          className="btn-mission w-full flex items-center justify-center gap-1.5"
                          style={{ padding: "9px 14px", fontSize: "11px" }}
                          id={`buynow-${product.id}`}
                        >
                          BUY NOW
                          <ArrowRight size={12} />
                        </button>
                        <button
                          onClick={handleAddToCart}
                          className="btn-ghost w-full flex items-center justify-center gap-1.5"
                          style={{ padding: "7.5px 14px", fontSize: "10.5px" }}
                          id={`addtocart-${product.id}`}
                        >
                          <ShoppingBag size={12} />
                          ADD TO CART
                        </button>
                      </>
                    )}
                  </div>

                  {/* Toast confirmation */}
                  <AnimatePresence>
                    {toast === "added" && (
                      <motion.div
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        className="flex items-center gap-2 px-2.5 py-1.5 mt-1.5 w-full"
                        style={{
                          background: "rgba(196,30,58,0.08)",
                          border: "1px solid rgba(196,30,58,0.25)",
                        }}
                      >
                        <Check size={11} style={{ color: "var(--red)" }} />
                        <span
                          className="font-classified"
                          style={{
                            fontSize: "7.5px",
                            letterSpacing: "0.16em",
                            color: "var(--text)",
                          }}
                        >
                          ITEM ADDED TO MISSION INVENTORY ✓
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Mobile Sticky Action Footer (visible only below md) ── */}
              <div
                className="md:hidden flex-shrink-0 flex flex-col gap-1.5 px-3 pt-2 pb-3"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(10,10,12,0.98)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {!product.available ? (
                  <div
                    className="w-full flex flex-col items-center justify-center py-2.5 px-3 text-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px dashed rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span
                      className="font-classified"
                      style={{
                        fontSize: "9.5px",
                        letterSpacing: "0.2em",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      MISSION STANDBY // COMING SOON
                    </span>
                    <span
                      className="font-classified mt-0.5"
                      style={{
                        fontSize: "7.5px",
                        letterSpacing: "0.12em",
                        color: "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      ITEM CURRENTLY UNAVAILABLE FOR ORDER
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Mobile toast */}
                    <AnimatePresence>
                      {toast === "added" && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="flex items-center gap-2 px-2.5 py-1.5 w-full"
                          style={{
                            background: "rgba(196,30,58,0.08)",
                            border: "1px solid rgba(196,30,58,0.25)",
                          }}
                        >
                          <Check size={11} style={{ color: "var(--red)" }} />
                          <span
                            className="font-classified"
                            style={{
                              fontSize: "7.5px",
                              letterSpacing: "0.16em",
                              color: "var(--text)",
                            }}
                          >
                            ITEM ADDED TO MISSION INVENTORY ✓
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={handleBuyNow}
                      className="btn-mission w-full flex items-center justify-center gap-1.5"
                      style={{ padding: "10px 14px", fontSize: "11px" }}
                      id={`buynow-mobile-${product.id}`}
                    >
                      BUY NOW
                      <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="btn-ghost w-full flex items-center justify-center gap-1.5"
                      style={{ padding: "8px 14px", fontSize: "10.5px" }}
                      id={`addtocart-mobile-${product.id}`}
                    >
                      <ShoppingBag size={12} />
                      ADD TO CART
                    </button>
                  </>
                )}
                {/* Dismiss link */}
                <button
                  onClick={handleClose}
                  className="font-classified text-[8px] tracking-[0.18em] text-white/30 hover:text-white transition-colors cursor-pointer py-0.5 w-full text-center"
                  style={{ background: "transparent", border: "none" }}
                >
                  [ CLOSE FILE ]
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
