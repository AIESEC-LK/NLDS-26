"use client";

/**
 * NLDS'26 Store — Cart Context
 *
 * Provides global cart state with localStorage persistence.
 * Wrap the app root with <CartProvider> to use.
 * Import `useCart` to access cart state and actions from any component.
 *
 * To connect to a backend later:
 *   - Replace localStorage logic with API calls in addItem / removeItem / updateQty
 *   - Or keep localStorage as optimistic state and sync with backend on checkout
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { CartItem, BuyNowSession } from "@/lib/store/types";
import type { Product } from "@/data/merchandise";

const CART_KEY = "nlds26_cart";

// ─── Context Shape ────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;

  // BuyNow — temporary single-item session (not persisted to localStorage)
  buyNowSession: BuyNowSession | null;
  setBuyNow: (session: BuyNowSession | null) => void;

  // Cart drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Actions
  addItem: (product: Product, size: string | null, fit: string | null, quantity: number, priceOverride?: number) => void;
  removeItem: (productId: string, size: string | null, fit: string | null) => void;
  updateQty: (productId: string, size: string | null, fit: string | null, quantity: number) => void;
  clearCart: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function itemKey(productId: string, size: string | null, fit: string | null) {
  return `${productId}::${size ?? ""}::${fit ?? ""}`;
}

function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calcCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Normalize any stale items that predate the `fit` field
    return parsed.map((item: CartItem) => ({
      ...item,
      size: item.size ?? null,
      fit: item.fit ?? null,
    }));
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota errors
  }
}

// ─── Context & Provider ────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [buyNowSession, setBuyNowSession] = useState<BuyNowSession | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (hydrated) {
      saveToStorage(items);
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, size: string | null, fit: string | null, quantity: number, priceOverride?: number) => {
      setItems((prev) => {
        const key = itemKey(product.id, size, fit);
        const existing = prev.find((i) => itemKey(i.productId, i.size, i.fit) === key);

        if (existing) {
          // Increase quantity of existing item
          return prev.map((i) =>
            itemKey(i.productId, i.size, i.fit) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }

        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          category: product.category,
          itemCode: product.itemCode,
          price: priceOverride ?? product.price,
          size,
          fit,
          quantity,
          image: product.images[0] ?? "",
        };

        return [...prev, newItem];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string | null, fit: string | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => itemKey(i.productId, i.size, i.fit) !== itemKey(productId, size, fit),
      ),
    );
  }, []);

  const updateQty = useCallback(
    (productId: string, size: string | null, fit: string | null, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, size, fit);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.productId, i.size, i.fit) === itemKey(productId, size, fit)
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const setBuyNow = useCallback((session: BuyNowSession | null) => {
    setBuyNowSession(session);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: calcCount(items),
      subtotal: calcSubtotal(items),
      buyNowSession,
      setBuyNow,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }),
    [
      items,
      buyNowSession,
      isCartOpen,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      setBuyNow,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
