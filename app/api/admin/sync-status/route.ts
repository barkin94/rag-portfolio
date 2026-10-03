import { NextResponse } from 'next/server';
import * as adminService from '@/backend/features/admin';

export async function GET() {
  const status = await adminService.getSyncStatus();
  return NextResponse.json(status);
}