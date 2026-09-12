"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  forcedIndex?: number;
}

export default function ProductGallery({
  images,
  productName,
  forcedIndex,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (
      forcedIndex !== undefined &&
      forcedIndex >= 0 &&
      forcedIndex < images.length &&
      forcedIndex !== activeIndex
    ) {
      setDirection(forcedIndex > activeIndex ? 1 : -1);
      setActiveIndex(forcedIndex);
    }
  }, [forcedIndex, images.length]); // Intentionally omitting activeIndex so it only triggers on forcedIndex change

  const validImages = images.filter(Boolean);
  const hasMultiple = validImages.length > 1;

  function selectImage(idx: number) {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  }

  function prev() {
    const idx = (activeIndex - 1 + validImages.length) % validImages.length;
    setDirection(-1);
    setActiveIndex(idx);
  }

  function next() {
    const idx = (activeIndex + 1) % validImages.length;
    setDirection(1);
    setActiveIndex(idx);
  }

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {/* Primary Image */}
      <div
        className="relative overflow-hidden w-full flex-1 min-h-0 flex items-center justify-center p-2"
        style={{ background: "#08080a" }}
      >
        {/* Scan-line overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          {validImages.length > 0 ? (
            <motion.img
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              src={validImages[activeIndex]}
              alt={`${productName} — image ${activeIndex + 1}`}
              className="w-full h-full object-contain"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                maxHeight: "100%",
              }}
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center gap-4 py-16"
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    border: "1px solid rgba(196,30,58,0.4)",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <span
                className="font-classified"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                IMAGE CLASSIFIED
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prev / Next arrow buttons */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-1.5 transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(20, 20, 25, 0.85)",
                filter: "drop-shadow(0 1px 1.5px rgba(255, 255, 255, 0.35))",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(0, 0, 0, 1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(20, 20, 25, 0.85)")
              }
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-1.5 transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(20, 20, 25, 0.85)",
                filter: "drop-shadow(0 1px 1.5px rgba(255, 255, 255, 0.35))",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(0, 0, 0, 1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(20, 20, 25, 0.85)")
              }
            >
              <ChevronRight size={24} strokeWidth={2.4} />
            </button>
          </>
        )}

        {/* Image counter badge */}
        {hasMultiple && (
          <div
            className="absolute bottom-2 right-2 z-20 font-classified"
            style={{
              fontSize: "8px",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.6)",
              background: "rgba(6,6,8,0.80)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "3px 7px",
            }}
          >
            {activeIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Corner marks */}
        <div
          className="absolute top-4 left-4 w-4 h-4 corner-tl pointer-events-none z-10"
          style={{ borderColor: "rgba(196,30,58,0.45)" }}
        />
        <div
          className="absolute bottom-4 right-4 w-4 h-4 corner-br pointer-events-none z-10"
          style={{ borderColor: "rgba(196,30,58,0.45)" }}
        />
      </div>

      {/* Thumbnail strip — horizontal scroll so all images always fit */}
      {hasMultiple && (
        <div
          className="flex gap-2 p-2.5 z-10 overflow-x-auto"
          style={{
            background: "rgba(6,6,8,0.85)",
            backdropFilter: "blur(6px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => selectImage(idx)}
              aria-label={`View image ${idx + 1}`}
              className="relative overflow-hidden transition-all duration-200 flex-shrink-0"
              style={{
                width: 44,
                height: 44,
                background: "#0a0a0c",
                border:
                  idx === activeIndex
                    ? "1px solid var(--red)"
                    : "1px solid rgba(255,255,255,0.1)",
                opacity: idx === activeIndex ? 1 : 0.5,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

