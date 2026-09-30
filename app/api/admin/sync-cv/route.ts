import { NextResponse } from 'next/server';
import { syncCv } from '@/backend/cv-sync';
import mongodb from '@/backend/mongodb';
import pushNotification from '@/backend/push-notification';

export async function POST() {
  // Check if a sync is already in progress
  const currentStatus = await mongodb.getLastSyncStatus();
  if (currentStatus?.status === 'pending') {
    return NextResponse.json({ 
      success: false, 
      error: 'Sync already in progress',
      status: 'pending'
    }, { status: 409 });
  }

  // Set status to pending immediately
  await mongodb.recordSyncStatus('pending', 'Sync started');

  // Start sync in background (don't await)
  syncCv().then(async (result) => {
    if (result.success) {
      const msg = `Synced ${result.experienceCount} roles, ${result.skillsCategories} skill categories`;
      await mongodb.recordSyncStatus('success', msg);
      await pushNotification.notifyCvSyncResult(true, msg);
    } else {
      const msg = result.error || "Unknown error";
      await mongodb.recordSyncStatus('failed', msg);
      await pushNotification.notifyCvSyncResult(false, msg);
    }
  }).catch(async (error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await mongodb.recordSyncStatus('failed', errorMessage);
    await pushNotification.notifyCvSyncResult(false, errorMessage);
  });

  return NextResponse.json({ 
    success: true, 
    status: 'pending',
    message: 'Sync started'
  });
}