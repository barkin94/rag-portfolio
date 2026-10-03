import { NextRequest, NextResponse } from "next/server";

import * as adminService from "@/backend/features/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  if (!threadId) {
    return NextResponse.json(
      { error: "threadId required" },
      { status: 400 }
    );
  }
  try {
    const threadDetail = await adminService.getThreadDetail(threadId);
    if (threadDetail == null) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json(threadDetail);
  } catch {
    return NextResponse.json(
      { error: "Failed to load thread" },
      { status: 500 }
    );
  }
}
