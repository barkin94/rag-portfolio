import { handleCallback } from '@vercel/queue';
import { syncCv } from '@/backend/features/cv-sync';
import * as cvRepo from '@/backend/features/cv-sync/repository';
import { notifyCvSyncResult } from '@/backend/features/notifications';
import { recordFinalSyncStatus } from '@/backend/shared/queue-utils';

export const POST = handleCallback(async () => {
  let finalStatus: 'success' | 'failed' = 'failed';
  let msg = 'Unknown error';

  try {
    const result = await syncCv();
    finalStatus = result.success ? 'success' : 'failed';
    msg = result.success
      ? `Synced ${result.experienceCount} roles, ${result.skillsCategories} skill categories`
      : result.error || 'Unknown error';
  } catch (error) {
    msg = error instanceof Error ? error.message : 'Handler crashed';
  } finally {
    await recordFinalSyncStatus(finalStatus, msg, cvRepo.recordSyncStatus, notifyCvSyncResult);
  }
});