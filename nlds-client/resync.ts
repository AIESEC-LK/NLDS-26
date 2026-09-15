import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_PORTAL_URL = 'https://nlds-26-admin.vercel.app';
const CRON_SECRET = 'e924e919ed011543e5208861a67f8dfbbf6ef0155692c57fbf124115d75fe6fc';

async function main() {
  console.log('Fetching all registrations from database...');
  const registrations = await prisma.registration.findMany();
  
  console.log(`Found ${registrations.length} registrations. Syncing to Google Sheets...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < registrations.length; i++) {
    const reg = registrations[i];
    try {
      const res = await fetch(`${ADMIN_PORTAL_URL}/api/webhook/sync-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CRON_SECRET}`
        },
        body: JSON.stringify({ registrationId: reg.id })
      });
      
      if (res.ok) {
        successCount++;
        console.log(`[${i+1}/${registrations.length}] Synced ${reg.id} successfully.`);
      } else {
        failCount++;
        console.error(`[${i+1}/${registrations.length}] Failed to sync ${reg.id}: ${res.status} ${await res.text()}`);
      }
    } catch (e) {
      failCount++;
      console.error(`[${i+1}/${registrations.length}] Error syncing ${reg.id}:`, e);
    }
  }
  
  console.log('=================================');
  console.log(`SYNC COMPLETE! Success: ${successCount}, Failed: ${failCount}`);
  console.log('=================================');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
