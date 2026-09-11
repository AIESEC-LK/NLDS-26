import { SyncStrategy, ExternalEvent } from "./sync.service";
import { env } from "@/lib/config/env";

export class GoogleSheetsStrategy implements SyncStrategy {
  providerName = "GOOGLE_SHEETS";

  async execute(event: ExternalEvent): Promise<void> {
    const adminUrl = env.ADMIN_SYNC_URL;
    const cronSecret = env.CRON_SECRET;

    // Bypassing integration if external architecture parameters aren't initialized yet
    if (!adminUrl || !cronSecret) {
      console.log(
        `[GOOGLE SHEETS WEBHOOK] Missing ADMIN_SYNC_URL or CRON_SECRET. Skipping synchronisation for ${event.referenceCode}.`,
      );
      return;
    }

    console.log(
      `[GOOGLE SHEETS WEBHOOK] Attempting push to Admin API over ReferenceCode: ${event.referenceCode}.`,
    );

    const res = await fetch(adminUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Admin webhook failed with status ${res.status}: ${errorText}`,
      );
    }
    
    console.log(`[GOOGLE SHEETS WEBHOOK] Successfully triggered admin sync for ${event.referenceCode}`);
  }
}
