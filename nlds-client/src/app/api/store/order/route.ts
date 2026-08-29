import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/backend/db/prisma";
import { MerchDriveClient } from "@/lib/backend/merch/merch-drive";
import { MerchSheetsClient } from "@/lib/backend/merch/merch-sheets";

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
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    if (!mobileNumber || mobileNumber.length < 7) {
      return NextResponse.json(
        { error: "Valid mobile phone number is required." },
        { status: 400 }
      );
    }

    if (!entity) {
      return NextResponse.json(
        { error: "AIESEC entity is required." },
        { status: 400 }
      );
    }

    if (!receiptFile || receiptFile.size === 0) {
      return NextResponse.json(
        { error: "Payment receipt file is required." },
        { status: 400 }
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
        { status: 400 }
      );
    }

    const totalAmount = parseInt(totalRaw, 10) || items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

    // Format human-readable item summary for Google Sheet and DB
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
    const sanitizedCustomer = fullName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20);
    const driveFileName = `MERCH_${orderId}_${sanitizedCustomer}_${Date.now()}.${ext}`;

    console.log(`[Store Order API] Uploading receipt: ${driveFileName} (${receiptFile.size} bytes)...`);
    const { viewUrl: receiptDriveUrl } = await driveClient.uploadReceipt(
      fileBuffer,
      driveFileName,
      receiptFile.type || "application/octet-stream"
    );

    // 4. Persist Order in YugabyteDB (Prisma)
    console.log(`[Store Order API] Saving order ${orderId} in YugabyteDB...`);
    await prisma.merchOrder.create({
      data: {
        orderId,
        fullName,
        email,
        mobileNumber,
        entity,
        items: items as any,
        itemsSummary,
        totalUnits,
        totalAmount,
        paymentStatus: "PENDING_VERIFICATION",
        receiptDriveUrl,
        receiptFileName: driveFileName,
      },
    });

    // 5. Append Order Row to Google Sheets
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

    console.log(`[Store Order API] Order ${orderId} successfully processed in DB and Sheets.`);

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
      { status: 500 }
    );
  }
}
