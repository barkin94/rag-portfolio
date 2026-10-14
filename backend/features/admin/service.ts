import * as adminRepo from './repository';
import * as cvRepo from '@/backend/features/cv-sync/repository';
import * as mongodb from '@/backend/shared/mongodb';
import { send } from '@vercel/queue';
import logger from '@/backend/shared/logger';
import { withPendingStatus } from '@/backend/shared/queue-utils';
import type {
  ThreadSummary,
  MaintenanceStatus,
  SyncStatusResponse,
  SyncCvResponse,
  ThreadDetailResponse,
} from './types';

export async function getThreads(): Promise<ThreadSummary[]> {
  return mongodb.getThreads();
}

export async function getThreadDetail(threadId: string): Promise<ThreadDetailResponse | null> {
  const messages = await mongodb.getMessages(threadId);
  if (messages == null) {
    return null;
  }
  return { id: threadId, messages };
}

export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
  const maintenanceMode = await mongodb.isInMaintenance();
  return { maintenance: maintenanceMode };
}

export async function setMaintenanceMode(enabled: boolean): Promise<MaintenanceStatus> {
  await mongodb.setMaintenanceMode(enabled);
  return { maintenance: enabled };
}

export async function getSyncStatus(): Promise<SyncStatusResponse> {
  const status = await adminRepo.getLastSyncStatus();

  if (!status) {
    return { synced: false };
  }

  return {
    synced: true,
    status: status.status,
    timestamp: status.timestamp,
    details: status.details,
  };
}

export async function triggerCvSync(): Promise<SyncCvResponse> {
  const idempotencyKey = `cv-sync-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const triggeredAt = Date.now();

  const result = await withPendingStatus(
    (details) => cvRepo.recordSyncStatus('pending', details),
    (details) => cvRepo.recordSyncStatus('failed', details),
    async () => {
      await send('cv-sync', { triggeredAt }, {
        idempotencyKey,
        retentionSeconds: 300,
      });
      logger.info({ idempotencyKey, triggeredAt }, 'CV sync job enqueued');
    },
    'Failed to enqueue CV sync job'
  );

  if (!result.success) {
    return { success: false, status: 'failed', message: result.message };
  }

  return { success: true, status: 'pending', message: 'Sync queued' };
}