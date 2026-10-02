import { handleCallback } from '@vercel/queue';
import { syncCv } from '@/backend/cv-sync';
import * as mongodb from '@/backend/shared/mongodb';
import pushNotification from '@/backend/push-notification';

export const POST = handleCallback(async () => {
  const result = await syncCv();

  if (result.success) {
    const msg = `Synced ${result.experienceCount} roles, ${result.skillsCategories} skill categories`;
    await mongodb.recordSyncStatus('success', msg);
    await pushNotification.notifyCvSyncResult(true, msg);
  } else {
    const msg = result.error || 'Unknown error';
    await mongodb.recordSyncStatus('failed', msg);
    await pushNotification.notifyCvSyncResult(false, msg);
  }
});