"use client";

import { useCart } from "@/lib/store/cartStore";
import type { BuyNowSession } from "@/lib/store/types";
import type { CartItem } from "@/lib/store/types";

interface OrderSummaryProps {
  buyNow?: BuyNowSession | null;
}

interface DisplayItem {
  name: string;
  itemCode: string;
  size: string | null;
  fit: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function OrderSummary({ buyNow }: OrderSummaryProps) {
  const { items, subtotal } = useCart();

  let displayItems: DisplayItem[] = [];
  let displayTotal = 0;

  if (buyNow) {
    const item: DisplayItem = {
      name: buyNow.product.name,
      itemCode: buyNow.product.itemCode,
      size: buyNow.size,
      fit: buyNow.fit,
      quantity: buyNow.quantity,
      unitPrice: buyNow.product.price,
      total: buyNow.product.price * buyNow.quantity,
    };
    displayItems = [item];
    displayTotal = item.total;
  } else {
    displayItems = items.map((i: CartItem) => ({
      name: i.name,
      itemCode: i.itemCode,
      size: i.size,
      fit: i.fit,
      quantity: i.quantity,
      unitPrice: i.price,
      total: i.price * i.quantity,
    }));
    displayTotal = subtotal;
  }

  return (
    <div
      className="rounded-[4px] overflow-hidden"
      style={{
        background: "#0a0a0c",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 8,
              height: 8,
              background: "var(--red)",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(196,30,58,0.5)",
            }}
          />
          <span
            className="font-classified font-bold"
            style={{
              fontSize: "11px",
              letterSpacing: "0.26em",
              color: "#ffffff",
            }}
          >
            MISSION INVENTORY
          </span>
        </div>
        <span
          className="font-classified"
          style={{
            fontSize: "9.5px",
            letterSpacing: "0.16em",
            color: "var(--red)",
            background: "rgba(196,30,58,0.15)",
            border: "1px solid rgba(196,30,58,0.3)",
            padding: "2px 8px",
            borderRadius: "2px",
          }}
        >
          {displayItems.length} ITEM{displayItems.length > 1 ? "S" : ""}
        </span>
      </div>

      {/* Items */}
      <div className="px-6 py-6 sm:px-8 sm:py-7 flex flex-col gap-5">
        {displayItems.length === 0 ? (
          <p
            className="font-classified py-6 text-center"
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            NO ITEMS FOUND
          </p>
        ) : (
          displayItems.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4"
              style={{
                borderBottom:
                  i < displayItems.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
              }}
            >
              <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
                <span
                  className="font-display"
                  style={{
                    fontSize: "1.35rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                    color: "#ffffff",
                  }}
                >
                  {item.name}
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="font-classified"
                    style={{
                      fontSize: "9.5px",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {item.itemCode}
                  </span>
                  {item.size && (
                    <>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.2)",
                          fontSize: "10px",
                        }}
                      >
                        ·
                      </span>
                      <span
                        className="font-classified"
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          color: "#fff",
                          background: "rgba(196,30,58,0.2)",
                          border: "1px solid rgba(196,30,58,0.4)",
                          padding: "2px 7px",
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
                        style={{
                          color: "rgba(255,255,255,0.2)",
                          fontSize: "10px",
                        }}
                      >
                        ·
                      </span>
                      <span
                        className="font-classified"
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          color: "#fff",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          padding: "2px 7px",
                          borderRadius: "2px",
                        }}
                      >
                        {item.fit.toUpperCase()}
                      </span>
                    </>
                  )}
                  <span
                    style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}
                  >
                    ·
                  </span>
                  <span
                    className="font-classified"
                    style={{
                      fontSize: "9.5px",
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    QTY: {String(item.quantity).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <span
                className="font-display tabular flex-shrink-0"
                style={{
                  fontSize: "1.4rem",
                  letterSpacing: "0.04em",
                  color: "#ffffff",
                }}
              >
                LKR {item.total.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      <div
        className="px-6 py-6 sm:px-8 sm:py-7 flex items-center justify-between"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span
          className="font-classified font-bold"
          style={{
            fontSize: "11px",
            letterSpacing: "0.24em",
            color: "var(--text-muted)",
          }}
        >
          TOTAL PAYABLE
        </span>
        <span
          className="font-display"
          style={{
            fontSize: "2rem",
            letterSpacing: "0.04em",
            color: "#ffffff",
          }}
        >
          LKR {displayTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
