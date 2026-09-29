"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data/merchandise";
import type { Product } from "@/data/merchandise";
import ProductCard from "@/components/store/ProductCard";
import ProductModal from "@/components/store/ProductModal";
import { useFlashRound } from "@/lib/flash-round/useFlashRound";
import { FLASH_ROUND_ALLOWED_PRODUCT_IDS, FLASH_ROUND_ENABLED } from "@/lib/flash-round/config";

/**
 * ProductGrid — Flash Round aware.
 *
 * During a LIVE Flash Round:
 *   - Only products in FLASH_ROUND_ALLOWED_PRODUCT_IDS are shown.
 *   - This is a DISPLAY filter only — no products are deleted from the catalogue.
 *   - When Flash Round is NOT_STARTED or CLOSED, all products are shown normally.
 *
 * Backend enforcement (sizes, fits, order window) is handled separately
 * in the API route and the ProductModal.
 */
export default function ProductGrid() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { state, mounted } = useFlashRound();

  // Determine which products to display
  const visibleProducts: Product[] = (() => {
    // Before mount (SSR/hydration) — show all products to avoid layout flash
    if (!mounted) return PRODUCTS;
    // Flash Round is LIVE → apply the allowed-product filter
    if (FLASH_ROUND_ENABLED && state === "LIVE") {
      return PRODUCTS.filter((p) =>
        FLASH_ROUND_ALLOWED_PRODUCT_IDS.includes(p.id),
      );
    }
    // If Flash Round is active but not LIVE, hide the store completely
    if (FLASH_ROUND_ENABLED && state !== "LIVE") {
      return [];
    }

    // Fallback if Flash Round feature is disabled entirely
    return PRODUCTS;
  })();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Centered Flex Grid with balanced spacing & automatic centering on all rows */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-9 w-full max-w-[1100px] mx-auto">
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.5rem)] min-w-[260px] max-w-[315px] flex flex-col"
          >
            <ProductCard
              product={product}
              index={index}
              onClick={setSelectedProduct}
            />
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
