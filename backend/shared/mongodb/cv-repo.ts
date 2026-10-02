import client from './client';
import config from '../config';
import type { CvData, SyncStatusDoc } from '../types';

const db = client.db(config.MONGODB_DBNAME);
const cvColl = db.collection("cv_data");
const cvSyncStatusColl = db.collection("cv_sync_status");

export async function upsertResume(data: Omit<CvData, '_id' | 'updatedAt'>): Promise<void> {
  const now = new Date();
  await cvColl.updateOne(
    { _id: "current" as any },
    { $set: { ...data, updatedAt: now } },
    { upsert: true },
  );
}

export async function getResume(): Promise<CvData | null> {
  const doc = await cvColl.findOne({ _id: 'current' as any });
  return doc as CvData | null;
}

export async function recordSyncStatus(
  status: 'success' | 'failed' | 'pending',
  details: string
): Promise<void> {
  await cvSyncStatusColl.updateOne(
    { _id: 'current' as any },
    { $set: { status, timestamp: new Date(), details } },
    { upsert: true }
  );
}

export async function getLastSyncStatus(): Promise<SyncStatusDoc | null> {
  const doc = await cvSyncStatusColl.findOne({ _id: 'current' as any });
  return doc as SyncStatusDoc | null;
}