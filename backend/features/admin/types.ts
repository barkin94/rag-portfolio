import type { ThreadSummary, SyncStatusDoc, Topic } from '@/backend/shared/types';

export type { ThreadSummary, SyncStatusDoc, Topic };

export type MaintenanceStatus = {
  maintenance: boolean;
};

export type SyncStatusResponse = {
  synced: boolean;
  status?: 'success' | 'failed' | 'pending';
  timestamp?: Date;
  details?: string;
};

export type SyncCvResponse = {
  success: boolean;
  status: 'pending' | 'failed';
  message: string;
};

export type ThreadDetailResponse = {
  id: string;
  messages: Array<{ role: 'assistant' | 'user'; content: string }>;
};

export type PushSubscribeRequest = {
  token: string;
};

export type PushSubscribeResponse = {
  ok: boolean;
};