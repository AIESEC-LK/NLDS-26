import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getSheetsClient() {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY || '';
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth: auth as any });
}

async function main() {
    const MAIN_SHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!.trim();
    const sheets = getSheetsClient();

    console.log('1. Reading authoritative Main Sheet to see what is already there...');
    const mainDataRes = await sheets.spreadsheets.values.get({
        spreadsheetId: MAIN_SHEET_ID,
        range: "'Registration'!A4:Z1000",
        valueRenderOption: 'UNFORMATTED_VALUE',
    });
    
    const existingRows = mainDataRes.data.values || [];
    const existingReferenceCodes = new Set(existingRows.map(row => row[0]));
    console.log(`Found ${existingRows.length} existing rows in Main Sheet.`);

    console.log('2. Fetching all registrations from Database...');
    const dbRegs = await prisma.registration.findMany({
        include: { participant: true, entity: true, initiativeGroup: true, documents: true }
    });
    console.log(`Loaded ${dbRegs.length} total registrations from Database.`);

    const rowsToAppend = [];
    for (const reg of dbRegs) {
        if (!existingReferenceCodes.has(reg.referenceCode)) {
            // Missing from sheet! We need to append it.
            const cvDoc = reg.documents.find((d: any) => d.type === 'CV');
            
            rowsToAppend.push([
                reg.referenceCode,
                reg.createdAt.toISOString(),
                reg.participant.fullName,
                reg.participant.preferredName,
                reg.participant.gender,
                reg.participant.dateOfBirth,
                reg.participant.nationalIdOrPassport,
                reg.participant.phone,
                reg.participant.personalEmail,
                reg.participant.aiesecEmail || '',
                reg.entity?.name || '',
                reg.initiativeGroup?.name || '',
                reg.customInitiativeGroup || '',
                reg.currentPosition || '',
                reg.foodPreference || '',
                reg.medicalConditions || '',
                reg.guardianName || '',
                reg.guardianContact || '',
                reg.missionGoal || '',
                reg.additionalInformation || '',
                reg.readinessLevel || '',
                cvDoc?.urlReference || '[NO CV]',
                cvDoc?.consentGiven ? 'YES' : 'NO',
                reg.participant.profilePicture || '[N/A]',
                reg.status || 'SUBMITTED'
            ]);
        }
    }

    if (rowsToAppend.length === 0) {
        console.log('All registrations are already in the Main Sheet! Nothing to append.');
        return;
    }

    console.log(`Found ${rowsToAppend.length} missing registrations. Appending them now...`);
    
    await sheets.spreadsheets.values.append({
        spreadsheetId: MAIN_SHEET_ID,
        range: "'Registration'!A:Z",
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: rowsToAppend }
    });

    console.log('SYNC COMPLETE! All missing records appended to the Main Sheet.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
