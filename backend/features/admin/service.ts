import * as mongodb from '@/backend/shared/mongodb';
import { send } from '@vercel/queue';
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
  const status = await mongodb.getLastSyncStatus();

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
  await mongodb.recordSyncStatus('pending', 'Sync queued');

  await send('cv-sync', { triggeredAt: Date.now() }, {
    idempotencyKey: 'cv-sync-manual',
    retentionSeconds: 3600,
  });

  return {
    success: true,
    status: 'pending',
    message: 'Sync queued',
  };
}