import { google } from "googleapis";
import { env } from "@/lib/config/env";
import { Readable } from "stream";
import { withRetry } from "@/lib/backend/utils/retry";

export class MerchDriveClient {
  private drive: any;
  private folderId: string;

  constructor() {
    const clientEmail =
      env.GOOGLE_DRIVE_CLIENT_EMAIL?.trim() ||
      env.GOOGLE_CLIENT_EMAIL?.trim() ||
      "";
    const privateKeyRaw =
      env.GOOGLE_DRIVE_PRIVATE_KEY || env.GOOGLE_PRIVATE_KEY || "";
    this.folderId = env.GOOGLE_DRIVE_MERCH_FOLDER_ID?.trim() || "";

    if (!clientEmail || !privateKeyRaw || !this.folderId) {
      console.warn(
        "[MerchDriveClient] Missing Drive credentials or GOOGLE_DRIVE_MERCH_FOLDER_ID.",
      );
    }

    const privateKey = (privateKeyRaw || "").replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    this.drive = google.drive({ version: "v3", auth });
  }

  /**
   * Uploads a merchandise payment receipt to Google Drive.
   * @param fileBuffer - The binary buffer of the uploaded receipt.
   * @param fileName - Desired file name on Google Drive.
   * @param mimeType - MIME type of the file.
   * @returns Object with fileId and viewUrl.
   */
  async uploadReceipt(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<{ fileId: string; viewUrl: string }> {
    if (!this.drive) {
      throw new Error(
        "Google Drive client is not initialized. Please verify GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.",
      );
    }

    if (!this.folderId) {
      throw new Error(
        "GOOGLE_DRIVE_MERCH_FOLDER_ID is not configured in the environment.",
      );
    }

    const fileMetadata = {
      name: fileName,
      parents: [this.folderId],
    };

    const media = {
      mimeType: mimeType || "application/octet-stream",
      body: Readable.from(fileBuffer),
    };

    try {
      const response = await withRetry<any>(() =>
        this.drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: "id, webViewLink, webContentLink",
          supportsAllDrives: true,
        }),
      );

      const fileId = response.data.id;
      if (!fileId) {
        throw new Error("Drive API did not return a file ID.");
      }

      // Try setting permission to anyone with link can view (so organizers can review receipts easily)
      try {
        await withRetry(() =>
          this.drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          }),
        );
      } catch (permErr: any) {
        console.warn(
          "[MerchDriveClient] Could not set public view permission (non-critical):",
          permErr.message,
        );
      }

      const viewUrl =
        response.data.webViewLink ||
        `https://drive.google.com/file/d/${fileId}/view`;

      return {
        fileId,
        viewUrl,
      };
    } catch (error: any) {
      console.error(
        "[MerchDriveClient] Failed to upload receipt:",
        error.response?.data || error.message,
      );
      throw new Error(`Receipt Drive Upload Failed: ${error.message}`);
    }
  }
}
