import { NextResponse } from 'next/server';
import * as mongodb from '@/backend/shared/mongodb';

export async function GET() {
  const status = await mongodb.getLastSyncStatus();

  if (!status) {
    return NextResponse.json({ synced: false });
  }

  return NextResponse.json({
    synced: true,
    status: status.status,
    timestamp: status.timestamp,
    details: status.details,
  });
}