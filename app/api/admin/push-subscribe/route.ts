import { NextResponse } from "next/server";

import pushNotification from "@/backend/push-notification";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });
    await pushNotification.subscribeToTopic(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
