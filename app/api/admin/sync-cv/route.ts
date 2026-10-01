import { NextResponse } from 'next/server';
import { send } from '@vercel/queue';
import mongodb from '@/backend/mongodb';

export async function POST() {
  await mongodb.recordSyncStatus('pending', 'Sync queued');

  await send('cv-sync', { triggeredAt: Date.now() }, {
    idempotencyKey: 'cv-sync-manual',
    retentionSeconds: 3600,
  });

  return NextResponse.json({
    success: true,
    status: 'pending',
    message: 'Sync queued',
  });
}