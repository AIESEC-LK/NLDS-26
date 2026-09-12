import { google } from "googleapis";
import { env } from "@/lib/config/env";
import { withRetry } from "@/lib/backend/utils/retry";

export interface MerchOrderRowData {
  orderId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  entity: string;
  itemsSummary: string;
  totalUnits: number;
  totalAmount: number;
  paymentStatus: string;
  receiptDriveUrl: string;
}

export class MerchSheetsClient {
  private auth: any;
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    const clientEmail = env.GOOGLE_CLIENT_EMAIL?.trim() || "";
    const privateKeyRaw = env.GOOGLE_PRIVATE_KEY || "";
    this.spreadsheetId = env.GOOGLE_SHEETS_MERCH_SPREADSHEET_ID?.trim() || "";

    if (!clientEmail || !privateKeyRaw || !this.spreadsheetId) {
      console.warn(
        "[MerchSheetsClient] Missing credentials or GOOGLE_SHEETS_MERCH_SPREADSHEET_ID.",
      );
    }

    const privateKey = (privateKeyRaw || "").replace(/\\n/g, "\n");

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  /**
   * Formats the header row and columns with NLDS brand aesthetic:
   * - NLDS Crimson header background (#C41E3A)
   * - Bold white centered typography
   * - Frozen header row
   * - Optimized column widths
   * - Text wrapping and proper alignments
   */
  private async formatHeaderAndSheet(
    sheetId: number,
    sheetName: string,
  ): Promise<void> {
    try {
      const columnWidths = [
        { startIndex: 0, endIndex: 1, width: 170 }, // Timestamp
        { startIndex: 1, endIndex: 2, width: 150 }, // Order ID
        { startIndex: 2, endIndex: 3, width: 190 }, // Full Name
        { startIndex: 3, endIndex: 4, width: 240 }, // Email Address
        { startIndex: 4, endIndex: 5, width: 160 }, // Mobile Number
        { startIndex: 5, endIndex: 6, width: 180 }, // AIESEC Entity / IG
        { startIndex: 6, endIndex: 7, width: 380 }, // Items Ordered
        { startIndex: 7, endIndex: 8, width: 110 }, // Total Units
        { startIndex: 8, endIndex: 9, width: 160 }, // Total Amount (LKR)
        { startIndex: 9, endIndex: 10, width: 180 }, // Payment Status
        { startIndex: 10, endIndex: 11, width: 300 }, // Receipt Drive Link
      ];

      const dimensionRequests = columnWidths.map(
        ({ startIndex, endIndex, width }) => ({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "COLUMNS",
              startIndex,
              endIndex,
            },
            properties: {
              pixelSize: width,
            },
            fields: "pixelSize",
          },
        }),
      );

      const requests: any[] = [
        // 1. Header Row Formatting (NLDS Red #C41E3A, Bold White Text, Centered, 10.5pt)
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 11,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 196 / 255, // #C41E3A (0.768)
                  green: 30 / 255, // 0.118
                  blue: 58 / 255, // 0.227
                },
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  fontSize: 10,
                  bold: true,
                  fontFamily: "Roboto",
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                wrapStrategy: "WRAP",
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
          },
        },
        // 2. Set Header Row Height (44px)
        {
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: 0,
              endIndex: 1,
            },
            properties: {
              pixelSize: 44,
            },
            fields: "pixelSize",
          },
        },
        // 3. Freeze Header Row
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
        // 4. Custom Column Widths
        ...dimensionRequests,
      ];

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: { requests },
      });

      console.log(
        `[MerchSheetsClient] Successfully applied NLDS styling to sheet "${sheetName}".`,
      );
    } catch (err: any) {
      console.warn(
        "[MerchSheetsClient] Could not apply styling formatting:",
        err.message,
      );
    }
  }

  /**
   * Checks if the sheet has headers and initializes + formats them if needed.
   */
  private async ensureHeadersExist(): Promise<string> {
    try {
      // 1. Fetch spreadsheet metadata to get the active sheet name and sheetId
      const meta = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const firstSheet = meta.data.sheets?.[0];
      const sheetName = firstSheet?.properties?.title || "Sheet1";
      const sheetId = firstSheet?.properties?.sheetId || 0;

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1:K1`,
      });

      const rows = response.data.values;
      const headers = [
        "Timestamp",
        "Order ID",
        "Full Name",
        "Email Address",
        "Mobile Number",
        "AIESEC Entity / IG",
        "Items Ordered",
        "Total Units",
        "Total Amount (LKR)",
        "Payment Status",
        "Receipt Drive Link",
      ];

      if (!rows || rows.length === 0 || rows[0].length === 0) {
        // Initialize header row text
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1:K1`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [headers] },
        });

        console.log(
          `[MerchSheetsClient] Header row written to "${sheetName}".`,
        );
      }

      // Always ensure formatting (colors, freeze row, column widths) is applied
      await this.formatHeaderAndSheet(sheetId, sheetName);

      return sheetName;
    } catch (err: any) {
      console.warn(
        "[MerchSheetsClient] Could not verify/initialize headers:",
        err.message,
      );
      return "Sheet1";
    }
  }

  /**
   * Appends an order row to the merchandise spreadsheet.
   */
  async appendOrder(order: MerchOrderRowData): Promise<{ appended: boolean }> {
    if (!this.spreadsheetId) {
      throw new Error(
        "GOOGLE_SHEETS_MERCH_SPREADSHEET_ID is not configured in the environment.",
      );
    }

    // Ensure headers exist & styling is applied
    const sheetName = await this.ensureHeadersExist();

    // Format Sri Lanka timestamp (UTC+5:30)
    const now = new Date();
    const slTimestamp = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);

    const rowValues = [
      slTimestamp,
      order.orderId,
      order.fullName,
      order.email,
      order.mobileNumber,
      order.entity,
      order.itemsSummary,
      order.totalUnits,
      order.totalAmount,
      order.paymentStatus || "PENDING_VERIFICATION",
      order.receiptDriveUrl,
    ];

    try {
      await withRetry(() =>
        this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A:K`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [rowValues] },
        }),
      );

      console.log(
        `[MerchSheetsClient] Order ${order.orderId} appended successfully.`,
      );
      return { appended: true };
    } catch (error: any) {
      console.error(
        "[MerchSheetsClient] Failed to append order row:",
        error.response?.data || error.message,
      );
      throw new Error(`Sheets Append Failed: ${error.message}`);
    }
  }
}
