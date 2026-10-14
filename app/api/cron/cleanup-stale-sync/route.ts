import { NextResponse } from 'next/server';
import client from '@/backend/shared/mongodb/client';
import config from '@/backend/shared/config';
import logger from '@/backend/shared/logger';
import type { SyncStatusDoc } from '@/backend/features/cv-sync/types';
import type { Filter } from 'mongodb';

const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized invocations
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = client.db(config.MONGODB_DBNAME);
    const cvSyncStatusColl = db.collection<SyncStatusDoc>('cv_sync_status');

    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS);

    const filter: Filter<SyncStatusDoc> = {
      _id: 'current',
      status: 'pending',
      timestamp: { $lt: staleThreshold },
    };

    const result = await cvSyncStatusColl.updateOne(
      filter,
      {
        $set: {
          status: 'failed',
          details: `Sync timed out after ${STALE_THRESHOLD_MS / 60000} minutes (stale cleanup)`,
          timestamp: new Date(),
        },
      }
    );

    if (result.modifiedCount > 0) {
      logger.warn({ thresholdMinutes: STALE_THRESHOLD_MS / 60000 }, 'Marked stale CV sync as failed');
      return NextResponse.json({ cleaned: true, message: 'Stale sync status updated to failed' });
    }

    return NextResponse.json({ cleaned: false, message: 'No stale sync found' });
  } catch (error) {
    logger.error({ error }, 'Stale sync cleanup failed');
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}