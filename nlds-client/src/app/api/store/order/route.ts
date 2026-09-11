import * as React from "react";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { MerchDriveClient } from "@/lib/backend/merch/merch-drive";
import { MerchSheetsClient } from "@/lib/backend/merch/merch-sheets";
import { MerchOrderConfirmationEmail } from "@/lib/backend/email/templates/merch-order-confirmation";
import { render } from "@react-email/render";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/backend/db/prisma";

export const maxDuration = 60;

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
        const itemCodeStr = item.itemCode ? ` (${item.itemCode})` : "";
        return `${item.name}${itemCodeStr}${sizeStr} x${item.quantity} = LKR ${(item.unitPrice * item.quantity).toLocaleString()}`;
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

    // 4. Append Order Row to Google Sheets
    const sheetsClient = new MerchSheetsClient();
    console.log(`[Store Order API] Appending order ${orderId} to Google Sheet...`);
    await sheetsClient.appendOrder({
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
    });

    // 4b. Persist order to database
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – prisma.merchOrder exists at runtime; tsc resolves stale @prisma/client stub
    await prisma.merchOrder.create({
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
    });
    console.log(`[Store Order API] Order ${orderId} persisted to database.`);

    console.log(`[Store Order API] Order ${orderId} successfully processed.`);

    // 5. Send confirmation email to customer (using merch-specific SMTP)
    try {
      const merchSmtpUser =
        env.EMAIL_MERCH_USER || process.env.EMAIL_MERCH_USER;
      const merchSmtpPass =
        env.EMAIL_MERCH_PASS || process.env.EMAIL_MERCH_PASS;

      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: merchSmtpUser, pass: merchSmtpPass },
      });

      const emailHtml = await render(
        React.createElement(MerchOrderConfirmationEmail, {
          orderId,
          recipientName: fullName,
          items: items.map((i) => ({
            name: i.name,
            itemCode: i.itemCode,
            size: i.size,
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
    } catch (emailError: any) {
      // Non-fatal: log but don't fail the order
      console.error(
        `[Store Order API] Failed to send confirmation email: ${emailError.message}`,
      );
    }

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
