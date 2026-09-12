"use client";

import { useSearchParams } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import OrderConfirmation from "@/components/store/OrderConfirmation";
import type { OrderItem } from "@/lib/store/types";

export default function ConfirmationView() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") ?? "NLDS26-XXXXXX";
  const customerName = searchParams.get("name") ?? "OPERATIVE";
  const totalStr = searchParams.get("total") ?? "0";
  const total = parseInt(totalStr, 10) || 0;

  let items: OrderItem[] = [];
  try {
    const raw = searchParams.get("items");
    if (raw) items = JSON.parse(decodeURIComponent(raw));
  } catch {
    // ignore parse errors
  }

  return (
    <>
      <PageHero
        label="TRANSMISSION CONFIRMED"
        fileNo="NLDS-2026-CONFIRM"
        title="ORDER"
        subtitle="CONFIRMED"
        description="Your mission request has been successfully transmitted. Your gear is pending verification."
      />
      <OrderConfirmation
        orderId={orderId}
        customerName={customerName}
        total={total}
        items={items}
      />
    </>
  );
}

