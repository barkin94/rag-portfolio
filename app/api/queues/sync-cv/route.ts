import { handleCallback } from '@vercel/queue';
import { syncCv } from '@/backend/features/cv-sync';
import * as cvRepo from '@/backend/features/cv-sync/repository';
import { notifyCvSyncResult } from '@/backend/features/notifications';

export const POST = handleCallback(async () => {
  const result = await syncCv();

  if (result.success) {
    const msg = `Synced ${result.experienceCount} roles, ${result.skillsCategories} skill categories`;
    await cvRepo.recordSyncStatus('success', msg);
    await notifyCvSyncResult(true, msg);
  } else {
    const msg = result.error || 'Unknown error';
    await cvRepo.recordSyncStatus('failed', msg);
    await notifyCvSyncResult(false, msg);
  }
});