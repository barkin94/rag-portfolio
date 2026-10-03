import client from './client';
import config from '../config';
import type { CvData, SyncStatusDoc } from '../types';
import type { Filter } from 'mongodb';

const db = client.db(config.MONGODB_DBNAME);
const cvColl = db.collection<CvData>("cv_data");
const cvSyncStatusColl = db.collection<SyncStatusDoc>("cv_sync_status");

const CURRENT_ID_FILTER: Filter<CvData> = { _id: "current" };

export async function upsertResume(data: Omit<CvData, '_id' | 'updatedAt'>): Promise<void> {
  const now = new Date();
  await cvColl.updateOne(
    CURRENT_ID_FILTER,
    { $set: { ...data, updatedAt: now } },
    { upsert: true },
  );
}

export async function getResume(): Promise<CvData | null> {
  const doc = await cvColl.findOne(CURRENT_ID_FILTER);
  return doc;
}

export async function recordSyncStatus(
  status: 'success' | 'failed' | 'pending',
  details: string
): Promise<void> {
  await cvSyncStatusColl.updateOne(
    { _id: "current" } as Filter<SyncStatusDoc>,
    { $set: { status, timestamp: new Date(), details } },
    { upsert: true }
  );
}

export async function getLastSyncStatus(): Promise<SyncStatusDoc | null> {
  const doc = await cvSyncStatusColl.findOne({ _id: "current" } as Filter<SyncStatusDoc>);
  return doc;
}