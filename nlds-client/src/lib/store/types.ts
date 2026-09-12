/**
 * NLDS'26 Store — TypeScript Types
 *
 * All types related to the merchandise store, cart, and checkout flow.
 * Designed to be backend-agnostic — the cart and order objects map cleanly
 * to whatever API schema is implemented later.
 */

import type { Product } from "@/data/merchandise";

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  itemCode: string;
  price: number;
  size: string | null; // null for products without sizes
  fit: string | null;  // e.g. "Oversized" | "Regular" | null
  quantity: number;
  image: string; // first image from product
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

// ─── Checkout ───────────────────────────────────────────────────────────────

export interface CustomerDetails {
  fullName: string;
  email: string;
  mobileNumber: string;
  entity: string; // AIESEC entity / university / external
}

// ─── Order ──────────────────────────────────────────────────────────────────

export type PaymentStatus = "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";

export interface OrderItem {
  productId: string;
  name: string;
  itemCode: string;
  size: string | null;
  fit: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderPayload {
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  total: number;
  receiptFile: File; // for real backend: will be FormData
  paymentStatus: PaymentStatus;
}

export interface OrderResult {
  success: boolean;
  orderId: string;
  message: string;
}

// ─── "Buy Now" session ──────────────────────────────────────────────────────

/**
 * Used when user clicks "BUY NOW" — a temporary single-item checkout
 * that bypasses the cart drawer and goes directly to checkout.
 */
export interface BuyNowSession {
  product: Product;
  size: string | null;
  fit: string | null;
  quantity: number;
}
