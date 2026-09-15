/**
 * ═══════════════════════════════════════════════════════
 * NLDS 2026 — EXTERNAL SYNC SERVICE (SERVER-SIDE ONLY)
 * ═══════════════════════════════════════════════════════
 * Mirrors the sibling website's idempotency pattern using the EXISTING
 * ExternalSync model (no schema change). Guarantees (spec §20/§24):
 *   - Idempotent: a prior SUCCESS for (registration, provider, eventType) is
 *     never re-synced (SKIPPED) — so retries/reconsideration don't duplicate.
 *   - Honest: outcomes are SUCCESS | FAILED | SKIPPED | NOT_CONFIGURED. A
 *     failure is persisted with its error message and is retryable; we NEVER
 *     report a fake success.
 *   - One tracking row per (registration, provider, eventType): attempts are
 *     incremented on retry rather than spawning unbounded rows.
 *
 * The database remains the source of truth; the sheets are a downstream mirror.
 */
import { prisma } from '@/lib/db/prisma';
import { GoogleSheetsClient } from '@/lib/integrations/google-sheets';

export const SYNC_PROVIDER = 'GOOGLE_SHEETS';

export type SyncEventType = 'PARTICIPANT_APPROVED' | 'PARTICIPANT_REJECTED' | 'REGISTRATION_CREATED';
export type SyncOutcome = 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'NOT_CONFIGURED';

export interface SheetWrite {
    action?: 'UPSERT' | 'DELETE';
    tab: string;
    referenceCode: string;
    values?: (string | number)[];
    headers?: string[];
    target?: 'MASTER' | 'ENTITY' | 'PARTICIPANT';
}

export interface SyncResult {
    status: SyncOutcome;
    error?: string;
}

/**
 * Synchronize a decision to Google Sheets idempotently, tracked via ExternalSync.
 * All writes for one event succeed together or the event is marked FAILED.
 * Target is always the Participant Output spreadsheet to ensure safety of the original.
 */
export async function syncToSheets(
    registrationId: string,
    eventType: SyncEventType,
    writes: SheetWrite[]
): Promise<SyncResult> {
    // Reuse the most recent tracking row for this (registration, provider, eventType).
    const existing = await prisma.externalSync.findFirst({
        where: { registrationId, provider: SYNC_PROVIDER, eventType },
        orderBy: { createdAt: 'desc' },
    });

    // Idempotency guard — already synced successfully.
    if (existing && existing.status === 'SUCCESS') {
        return { status: 'SKIPPED' };
    }

    const client = new GoogleSheetsClient();
    if (!client.isConfigured()) {
        const msg = 'Google Sheets integration is not configured (missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY).';
        await persistAttempt(existing, registrationId, eventType, 'FAILED', msg);
        return { status: 'NOT_CONFIGURED', error: msg };
    }

    const participantSheetId = process.env.GOOGLE_PARTICIPANT_SHEET_ID?.trim();
    if (!participantSheetId) {
        const msg = 'Missing GOOGLE_PARTICIPANT_SHEET_ID. Participant sheet output disabled.';
        await persistAttempt(existing, registrationId, eventType, 'FAILED', msg);
        return { status: 'NOT_CONFIGURED', error: msg };
    }

    const masterSheetId = process.env.GOOGLE_REGISTRATION_SHEET_ID?.trim();
    if (!masterSheetId) {
        const msg = 'Missing GOOGLE_REGISTRATION_SHEET_ID. Master sheet output disabled.';
        await persistAttempt(existing, registrationId, eventType, 'FAILED', msg);
        return { status: 'NOT_CONFIGURED', error: msg };
    }

    const reg = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: { entity: true },
    });
    
    if (!reg) {
        return { status: 'FAILED', error: 'Registration not found' };
    }

    const SUPPORTED_ENTITIES = ['CC', 'CN', 'CS', 'KANDY', 'NIBM', 'NSBM', 'RAJARATA', 'RUHUNA', 'SLIIT', 'USJ', 'WAYAMBA'];
    
    let entityCode = (reg.entity.code || reg.entity.name || 'OTHER').toUpperCase();
    if (!SUPPORTED_ENTITIES.includes(entityCode)) {
        entityCode = 'OTHER';
    }

    const envVarName = `GOOGLE_SHEET_ID_${entityCode}`;
    const entitySheetId = process.env[envVarName]?.trim();

    if (!entitySheetId && writes.some(w => w.target === 'ENTITY')) {
        const msg = `Missing ${envVarName}. Entity sheet output disabled.`;
        await persistAttempt(existing, registrationId, eventType, 'FAILED', msg);
        return { status: 'NOT_CONFIGURED', error: msg };
    }

    const rec =
        existing ??
        (await prisma.externalSync.create({
            data: { registrationId, provider: SYNC_PROVIDER, eventType, status: 'PENDING', attempts: 0 },
        }));

    if (existing) {
        await prisma.externalSync.update({ where: { id: rec.id }, data: { status: 'PENDING' } });
    }

    try {
        for (const w of writes) {
            let targetSpreadsheetId;
            if (w.target === 'ENTITY') {
                targetSpreadsheetId = entitySheetId;
            } else if (w.target === 'MASTER') {
                targetSpreadsheetId = masterSheetId;
            } else {
                targetSpreadsheetId = participantSheetId;
            }
            if (!targetSpreadsheetId) continue; // Safety check, already validated above

            // CRITICAL: Prevent rejected participants from being written to entity spreadsheets
            if (w.target === 'ENTITY' && w.tab === 'Rejected Participants') {
                continue;
            }

            if (w.action === 'DELETE') {
                await client.deleteRowFromTab(targetSpreadsheetId, w.tab, w.referenceCode);
            } else if (w.target === 'PARTICIPANT') {
                await client.upsertDynamicParticipantRow(targetSpreadsheetId, w.tab, w.referenceCode, w.values || []);
            } else {
                await client.upsertRowToTab(targetSpreadsheetId, w.tab, w.referenceCode, w.values || [], w.headers || []);
            }
        }
        await prisma.externalSync.update({
            where: { id: rec.id },
            data: {
                status: 'SUCCESS',
                syncedAt: new Date(),
                lastAttemptAt: new Date(),
                attempts: { increment: 1 },
                errorMessage: null,
            },
        });
        return { status: 'SUCCESS' };
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown sync failure';
        await prisma.externalSync.update({
            where: { id: rec.id },
            data: { status: 'FAILED', errorMessage: msg, lastAttemptAt: new Date(), attempts: { increment: 1 } },
        });
        return { status: 'FAILED', error: msg };
    }
}

/** Read the latest sync outcome per event type for a registration (for UI chips). */
export async function getSyncStatuses(registrationId: string): Promise<Record<string, SyncOutcome | 'NONE'>> {
    const rows = await prisma.externalSync.findMany({
        where: { registrationId, provider: SYNC_PROVIDER },
        orderBy: { createdAt: 'desc' },
    });
    const out: Record<string, SyncOutcome | 'NONE'> = {
        PARTICIPANT_APPROVED: 'NONE',
        PARTICIPANT_REJECTED: 'NONE',
        REGISTRATION_CREATED: 'NONE',
    };
    for (const r of rows) {
        if (out[r.eventType] === 'NONE' || out[r.eventType] === undefined) {
            out[r.eventType] = r.status as SyncOutcome;
        }
    }
    return out;
}

async function persistAttempt(
    existing: { id: string } | null,
    registrationId: string,
    eventType: SyncEventType,
    status: 'FAILED',
    errorMessage: string
): Promise<void> {
    if (existing) {
        await prisma.externalSync.update({
            where: { id: existing.id },
            data: { status, errorMessage, lastAttemptAt: new Date(), attempts: { increment: 1 } },
        });
    } else {
        await prisma.externalSync.create({
            data: {
                registrationId,
                provider: SYNC_PROVIDER,
                eventType,
                status,
                errorMessage,
                lastAttemptAt: new Date(),
                attempts: 1,
            },
        });
    }
}
