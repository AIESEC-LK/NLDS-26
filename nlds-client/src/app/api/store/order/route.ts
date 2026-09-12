import * as React from "react";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { MerchDriveClient } from "@/lib/backend/merch/merch-drive";
import { MerchSheetsClient } from "@/lib/backend/merch/merch-sheets";
import { MerchOrderConfirmationEmail } from "@/lib/backend/email/templates/merch-order-confirmation";
import { render } from "@react-email/render";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/backend/db/prisma";
import { verifyTurnstileToken } from "@/lib/captcha";

export const maxDuration = 60;

// Global cached nodemailer transporter to prevent SMTP initialization limits
let cachedTransporter: any = null;
async function getEmailTransporter() {
  if (!cachedTransporter) {
    const nodemailer = await import("nodemailer");
    const merchSmtpUser = env.EMAIL_MERCH_USER || process.env.EMAIL_MERCH_USER;
    const merchSmtpPass = env.EMAIL_MERCH_PASS || process.env.EMAIL_MERCH_PASS;
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: merchSmtpUser, pass: merchSmtpPass },
    });
  }
  return cachedTransporter;
}

/** Generate a unique Order ID in the format NLDS26-(Entity)Randomnumber, e.g., NLDS26-CS84920 */
function generateOrderId(entity: string): string {
  const primaryEntity =
    entity
      ?.split(/[\s(]/)[0]
      ?.toUpperCase()
      ?.replace(/[^A-Z0-9]/g, "") || "GEN";

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `NLDS26-${primaryEntity}${randomNum}`;
}

interface IncomingOrderItem {
  productId: string;
  name: string;
  itemCode?: string;
  size?: string | null;
  fit?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const mobileNumber = (formData.get("mobileNumber") as string)?.trim();
    const entity = (formData.get("entity") as string)?.trim();
    const itemsRaw = formData.get("items") as string;
    const totalRaw = formData.get("total") as string;
    const receiptFile = formData.get("receipt") as File | null;
    const turnstileToken = formData.get("turnstileToken") as string;

    // 1. Basic validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: "Full name is required (minimum 2 characters)." },
        { status: 400 },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 },
      );
    }

    if (!mobileNumber || mobileNumber.length < 7) {
      return NextResponse.json(
        { error: "Valid mobile phone number is required." },
        { status: 400 },
      );
    }

    if (!entity) {
      return NextResponse.json(
        { error: "AIESEC entity is required." },
        { status: 400 },
      );
    }

    if (!receiptFile || receiptFile.size === 0) {
      return NextResponse.json(
        { error: "Payment receipt file is required." },
        { status: 400 },
      );
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security check failed. Missing CAPTCHA token." },
        { status: 400 },
      );
    }

    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Security check failed. Invalid CAPTCHA." },
        { status: 400 },
      );
    }

    // 2. Parse Items
    let items: IncomingOrderItem[] = [];
    try {
      items = JSON.parse(itemsRaw);
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Items list cannot be empty");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid order items payload." },
        { status: 400 },
      );
    }

    const totalAmount =
      parseInt(totalRaw, 10) ||
      items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

    // Format human-readable item summary for Google Sheet
    const itemsSummary = items
      .map((item) => {
        const sizeStr = item.size ? ` [Size: ${item.size}]` : "";
        const fitStr = item.fit ? ` [Fit: ${item.fit}]` : "";
        const itemCodeStr = item.itemCode ? ` (${item.itemCode})` : "";
        return `${item.name}${itemCodeStr}${sizeStr}${fitStr} x${item.quantity} = LKR ${(item.unitPrice * item.quantity).toLocaleString()}`;
      })
      .join(" | ");

    const orderId = generateOrderId(entity);

    // 3. Upload Receipt to Google Drive
    const driveClient = new MerchDriveClient();
    const arrayBuffer = await receiptFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const ext = receiptFile.name.split(".").pop() || "png";
    const sanitizedCustomer = fullName
      .replace(/[^a-zA-Z0-9]/g, "_")
      .slice(0, 20);
    const driveFileName = `MERCH_${orderId}_${sanitizedCustomer}_${Date.now()}.${ext}`;

    console.log(
      `[Store Order API] Uploading receipt: ${driveFileName} (${receiptFile.size} bytes)...`,
    );
    const { viewUrl: receiptDriveUrl } = await driveClient.uploadReceipt(
      fileBuffer,
      driveFileName,
      receiptFile.type || "application/octet-stream",
    );

    // 4. Run Sheets, DB, and Email concurrently
    const sheetsClient = new MerchSheetsClient();
    
    const sheetsPromise = sheetsClient.appendOrder({
      orderId,
      fullName,
      email,
      mobileNumber,
      entity,
      itemsSummary,
      totalUnits,
      totalAmount,
      paymentStatus: "PENDING_VERIFICATION",
      receiptDriveUrl,
    }).then(() => console.log(`[Store Order API] Order ${orderId} appended to Google Sheet.`));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – prisma.merchOrder exists at runtime
    const dbPromise = prisma.merchOrder.create({
      data: {
        id: randomUUID(),
        orderId,
        fullName,
        email,
        mobileNumber,
        entity,
        itemsSummary,
        totalUnits,
        totalAmount,
        paymentStatus: "PENDING_VERIFICATION",
        receiptDriveUrl,
        receiptFileName: driveFileName,
        items: items as any,
        updatedAt: new Date(),
      },
    }).then(() => console.log(`[Store Order API] Order ${orderId} persisted to database.`));

    const emailPromise = (async () => {
      const transporter = await getEmailTransporter();
      const merchSmtpUser = env.EMAIL_MERCH_USER || process.env.EMAIL_MERCH_USER;
      
      const emailHtml = await render(
        React.createElement(MerchOrderConfirmationEmail, {
          orderId,
          recipientName: fullName,
          items: items.map((i) => ({
            name: i.name,
            itemCode: i.itemCode,
            size: i.size,
            fit: i.fit,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          totalAmount,
          entity,
        }),
      );

      await transporter.sendMail({
        from: `"NLDS'26 Store" <${merchSmtpUser}>`,
        to: email,
        subject: `[NLDS'26] Order Received — ${orderId}`,
        html: emailHtml,
      });
      console.log(`[Store Order API] Confirmation email sent to ${email} via merch SMTP.`);
    })();

    // Await all background tasks concurrently
    const results = await Promise.allSettled([sheetsPromise, dbPromise, emailPromise]);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const taskName = index === 0 ? "Sheets Append" : index === 1 ? "DB Persist" : "Email Send";
        console.error(`[Store Order API] ${taskName} failed for order ${orderId}:`, result.reason);
      }
    });

    console.log(`[Store Order API] Order ${orderId} successfully processed.`);

    return NextResponse.json({
      success: true,
      orderId,
      message: "MISSION REQUEST RECEIVED. YOUR ORDER HAS BEEN RECORDED.",
    });
  } catch (error: any) {
    console.error("[Store Order API] Error processing order:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to process merchandise order.",
      },
      { status: 500 },
    );
  }
}
