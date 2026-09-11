"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";

import { useCart } from "@/lib/store/cartStore";
import { submitOrder } from "@/lib/store/mockOrderService";
import type { OrderPayload, OrderItem } from "@/lib/store/types";
import {
  AIESEC_ENTITIES,
  ENTITY_IG_MAPPING,
  OTHER_ENTITY_IGS,
} from "@/lib/register/constants";

import OrderSummary from "@/components/store/OrderSummary";
import PaymentDetails from "@/components/store/PaymentDetails";
import ReceiptUpload from "@/components/store/ReceiptUpload";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name is required (min 2 characters)")
      .max(100),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    mobileNumber: z
      .string()
      .min(9, "Please enter a valid mobile number")
      .max(15)
      .regex(/^[+\d\s\-()]+$/, "Invalid mobile number format"),
    entity: z.string().min(1, "Please select your AIESEC entity"),
    initiativeGroup: z.string().optional(),
    customEntity: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.entity === "Other") {
        return Boolean(
          data.customEntity && data.customEntity.trim().length >= 2,
        );
      }
      return true;
    },
    {
      message: "Please enter your organisation or university name",
      path: ["customEntity"],
    },
  );

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ─── Field Component ────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

function FormField({ id, label, error, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans font-medium uppercase tracking-wide"
        style={{
          fontSize: "11px",
          letterSpacing: "0.14em",
          color: error ? "var(--red)" : "var(--text-muted)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <AlertCircle
            size={11}
            style={{ color: "var(--red)", flexShrink: 0 }}
          />
          <span style={{ fontSize: "11px", color: "var(--red)" }}>{error}</span>
        </div>
      )}
      {hint && !error && (
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div
      className="flex items-center gap-4 pb-5 mb-6"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span
        className="font-classified"
        style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          color: "var(--red)",
          opacity: 0.6,
        }}
      >
        {number}
      </span>
      <span
        className="font-classified"
        style={{
          fontSize: "11px",
          letterSpacing: "0.28em",
          color: "var(--text-muted)",
        }}
      >
        {title}
      </span>
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buynow";

  const { buyNowSession, items, subtotal, clearCart, setBuyNow } = useCart();

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const isSubmittedRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      entity: "",
      initiativeGroup: "",
      customEntity: "",
    },
  });

  const selectedEntity = watch("entity");
  const selectedIG = watch("initiativeGroup");

  // Derive IG options based on selected entity (same logic as registration form)
  const igOptions = selectedEntity
    ? selectedEntity === "Other"
      ? OTHER_ENTITY_IGS
      : ENTITY_IG_MAPPING[selectedEntity] || []
    : [];

  useEffect(() => {
    if (
      selectedEntity &&
      selectedIG &&
      !igOptions.includes(selectedIG as never)
    ) {
      setValue("initiativeGroup", "");
    }
  }, [selectedEntity, igOptions, selectedIG, setValue]);

  useEffect(() => {
    if (selectedEntity !== "Other") {
      setValue("customEntity", "");
    }
  }, [selectedEntity, setValue]);

  // If buy-now but no session, or if cart but no items, redirect to store (unless form was just submitted)
  useEffect(() => {
    if (isSubmittedRef.current) return;
    if (isBuyNow && !buyNowSession) {
      router.replace("/store");
    } else if (!isBuyNow && items.length === 0) {
      router.replace("/store");
    }
  }, [isBuyNow, buyNowSession, items, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    // Validate receipt
    if (!receiptFile) {
      setReceiptError("Payment receipt is required to complete the mission.");
      return;
    }
    setReceiptError("");
    setSubmitError("");

    // Build order items
    let orderItems: OrderItem[] = [];
    let total = 0;

    if (isBuyNow && buyNowSession) {
      const item: OrderItem = {
        productId: buyNowSession.product.id,
        name: buyNowSession.product.name,
        itemCode: buyNowSession.product.itemCode,
        size: buyNowSession.size,
        quantity: buyNowSession.quantity,
        unitPrice: buyNowSession.product.price,
        totalPrice: buyNowSession.product.price * buyNowSession.quantity,
      };
      orderItems = [item];
      total = item.totalPrice;
    } else {
      orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        itemCode: i.itemCode,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
      }));
      total = subtotal;
    }

    let finalEntity = data.entity;
    if (data.entity === "Other" && data.customEntity) {
      finalEntity = data.customEntity;
    } else if (data.initiativeGroup) {
      finalEntity = `${data.entity} (${data.initiativeGroup})`;
    }

    const payload: OrderPayload = {
      customer: {
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        entity: finalEntity,
      },
      items: orderItems,
      subtotal: total,
      total,
      receiptFile,
      paymentStatus: "PENDING_VERIFICATION",
    };

    setIsSubmitting(true);
    try {
      const result = await submitOrder(payload);
      if (result.success) {
        isSubmittedRef.current = true;
        // Clear state
        if (isBuyNow) {
          setBuyNow(null);
        } else {
          clearCart();
        }
        // Navigate to confirmation
        router.push(
          `/store/confirmation?orderId=${encodeURIComponent(result.orderId)}&name=${encodeURIComponent(data.fullName)}&total=${total}`,
        );
      } else {
        setSubmitError("Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{
        background: "var(--bg)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "clamp(3.5rem, 6vw, 5.5rem)",
        paddingBottom: "8rem",
      }}
    >
      {/* Grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{
          maxWidth: "860px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "clamp(1rem, 4vw, 2rem)",
          paddingRight: "clamp(1rem, 4vw, 2rem)",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full flex flex-col gap-8 sm:gap-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8 sm:gap-10 w-full"
          >
            {/* TOP: Order Summary (Full-Width Stretched) */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--red)",
                  }}
                />
                <span
                  className="font-classified font-medium"
                  style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.24em",
                    color: "var(--text-ghost)",
                  }}
                >
                  ORDER SUMMARY // MISSION ASSETS
                </span>
              </div>
              <OrderSummary buyNow={isBuyNow ? buyNowSession : null} />
            </div>

            {/* SECTION 1: Operative details (Full-Width Stretched) */}
            <div
              className="w-full rounded-[4px]"
              style={{
                background: "#0a0a0c",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "clamp(1.5rem, 3.5vw, 2.25rem)",
              }}
            >
              <SectionHeader number="01" title="OPERATIVE DETAILS" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <FormField
                  id="fullName"
                  label="Full Name *"
                  error={errors.fullName?.message}
                >
                  <input
                    id="fullName"
                    className="reg-field"
                    placeholder="Full Name"
                    aria-invalid={!!errors.fullName}
                    {...register("fullName")}
                  />
                </FormField>

                <FormField
                  id="email"
                  label="Email Address *"
                  error={errors.email?.message}
                >
                  <input
                    id="email"
                    type="email"
                    className="reg-field"
                    placeholder="agent@example.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </FormField>

                <FormField
                  id="mobileNumber"
                  label="Mobile Number *"
                  error={errors.mobileNumber?.message}
                  hint="+94 7X XXX XXXX"
                >
                  <input
                    id="mobileNumber"
                    type="tel"
                    className="reg-field"
                    placeholder="+94 77 000 0000"
                    aria-invalid={!!errors.mobileNumber}
                    {...register("mobileNumber")}
                  />
                </FormField>

                <FormField
                  id="entity"
                  label="AIESEC Entity *"
                  error={errors.entity?.message}
                  hint="Select the AIESEC entity you represent"
                >
                  <select
                    id="entity"
                    className="reg-field cursor-pointer"
                    aria-invalid={!!errors.entity}
                    style={{
                      appearance: "none",
                      cursor: "pointer",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "40px",
                    }}
                    {...register("entity")}
                  >
                    <option
                      value=""
                      disabled
                      style={{
                        background: "#0a0a0c",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      Identify your AIESEC entity...
                    </option>
                    {AIESEC_ENTITIES.map((ent) => (
                      <option
                        key={ent}
                        value={ent}
                        style={{ background: "#0a0a0c", color: "#ffffff" }}
                      >
                        {ent}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Conditional Initiative Group (IG) Dropdown */}
                {selectedEntity && igOptions.length > 0 && (
                  <FormField
                    id="initiativeGroup"
                    label="Initiative Group (IG)"
                    error={errors.initiativeGroup?.message}
                  >
                    <select
                      id="initiativeGroup"
                      className="reg-field cursor-pointer"
                      style={{
                        appearance: "none",
                        cursor: "pointer",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 14px center",
                        paddingRight: "40px",
                      }}
                      {...register("initiativeGroup")}
                    >
                      <option
                        value=""
                        style={{
                          background: "#0a0a0c",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        Select Initiative Group (Optional)...
                      </option>
                      {igOptions.map((ig) => (
                        <option
                          key={ig}
                          value={ig}
                          style={{ background: "#0a0a0c", color: "#ffffff" }}
                        >
                          {ig}
                        </option>
                      ))}
                    </select>
                  </FormField>
                )}

                {/* Conditional Custom Entity Input for Other */}
                {selectedEntity === "Other" && (
                  <FormField
                    id="customEntity"
                    label="Custom Entity / University *"
                    error={errors.customEntity?.message}
                  >
                    <input
                      id="customEntity"
                      className="reg-field"
                      placeholder="Enter your organisation or university name"
                      aria-invalid={!!errors.customEntity}
                      {...register("customEntity")}
                    />
                  </FormField>
                )}
              </div>
            </div>

            {/* SECTION 2: Payment details (Full-Width Stretched) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <PaymentDetails />
            </motion.div>

            {/* SECTION 3: Receipt upload (Full-Width Stretched) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <ReceiptUpload
                file={receiptFile}
                onChange={(f) => {
                  setReceiptFile(f);
                  if (f) setReceiptError("");
                }}
                error={receiptError}
              />
            </motion.div>

            {/* Submit error */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-[3px]"
                  style={{
                    background: "rgba(196,30,58,0.08)",
                    border: "1px solid rgba(196,30,58,0.25)",
                  }}
                >
                  <AlertCircle size={15} style={{ color: "var(--red)" }} />
                  <span style={{ fontSize: "12px", color: "var(--red)" }}>
                    {submitError}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button (Full-Width Stretched) */}
            <div className="flex flex-col gap-3 w-full pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-mission flex items-center justify-center gap-2 w-full"
                style={{
                  padding: "18px 32px",
                  fontSize: "13px",
                  letterSpacing: "0.16em",
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
                id="checkout-submit"
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    TRANSMITTING ORDER DOSSIER...
                  </>
                ) : (
                  <>
                    SUBMIT MISSION REQUEST
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p
                className="font-classified text-center"
                style={{
                  fontSize: "8.5px",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                RECEIPT REQUIRED · BANK TRANSFER ONLY · ORDERS PROCESSED AFTER
                VERIFICATION
              </p>
            </div>
          </motion.div>
        </form>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
