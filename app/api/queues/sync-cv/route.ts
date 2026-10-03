import { handleCallback } from '@vercel/queue';
import { syncCv } from '@/backend/features/cv-sync';
import * as mongodb from '@/backend/shared/mongodb';
import { notifyCvSyncResult } from '@/backend/push-notification';

export const POST = handleCallback(async () => {
  const result = await syncCv();

  if (result.success) {
    const msg = `Synced ${result.experienceCount} roles, ${result.skillsCategories} skill categories`;
    await mongodb.recordSyncStatus('success', msg);
    await notifyCvSyncResult(true, msg);
  } else {
    const msg = result.error || 'Unknown error';
    await mongodb.recordSyncStatus('failed', msg);
    await notifyCvSyncResult(false, msg);
  }
});