import { NextResponse } from 'next/server';
import * as adminService from '@/backend/features/admin';

export async function POST() {
  const result = await adminService.triggerCvSync();
  return NextResponse.json(result);
}