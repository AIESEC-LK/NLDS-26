/**
 * NLDS'26 Store — Order Service
 *
 * Handles order submission to Next.js API route (/api/store/order)
 * which uploads payment receipt to Google Drive (GOOGLE_DRIVE_MERCH_FOLDER_ID)
 * and appends order records to Google Sheets (GOOGLE_SHEETS_MERCH_SPREADSHEET_ID).
 */

import type { OrderPayload, OrderResult } from "@/lib/store/types";

/**
 * Submit an order to the backend API.
 *
 * @param payload - The complete order payload including customer details,
 *                  items, totals, and receipt file.
 * @returns OrderResult with success flag, order ID, and message.
 */
export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  const formData = new FormData();

  formData.append("fullName", payload.customer.fullName);
  formData.append("email", payload.customer.email);
  formData.append("mobileNumber", payload.customer.mobileNumber);
  formData.append("entity", payload.customer.entity);
  formData.append("items", JSON.stringify(payload.items));
  formData.append("total", String(payload.total));

  if (payload.receiptFile) {
    formData.append("receipt", payload.receiptFile, payload.receiptFile.name);
  }

  if (payload.turnstileToken) {
    formData.append("turnstileToken", payload.turnstileToken);
  }

  try {
    const res = await fetch("/api/store/order", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to submit order.");
    }

    return {
      success: true,
      orderId: data.orderId,
      message:
        data.message ||
        "MISSION REQUEST RECEIVED. YOUR ORDER HAS BEEN RECORDED.",
    };
  } catch (error: any) {
    console.error("[OrderService] Order submission failed:", error);
    throw error;
  }
}
