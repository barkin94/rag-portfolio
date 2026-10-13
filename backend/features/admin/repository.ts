import client from '@/backend/shared/mongodb/client';
import config from '@/backend/shared/config';
import type { SyncStatusDoc } from '@/backend/features/cv-sync/types';
import type { Filter } from 'mongodb';

const db = client.db(config.MONGODB_DBNAME);
const cvSyncStatusColl = db.collection<SyncStatusDoc>('cv_sync_status');

export async function getLastSyncStatus(): Promise<SyncStatusDoc | null> {
  const doc = await cvSyncStatusColl.findOne({
    _id: 'current',
  } as Filter<SyncStatusDoc>);
  return doc;
}