import { NextRequest, NextResponse } from "next/server";

import mongodb from "@/backend/mongodb";

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
    const messages = await mongodb.getMessages(threadId);
    if (messages == null) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json({ id: threadId, messages });
  } catch {
    return NextResponse.json(
      { error: "Failed to load thread" },
      { status: 500 }
    );
  }
}
