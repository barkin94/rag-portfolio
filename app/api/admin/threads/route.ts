import { NextResponse } from "next/server";

import * as adminService from "@/backend/features/admin";

export async function GET() {
  try {
    const threads = await adminService.getThreads();
    return NextResponse.json(threads);
  } catch {
    return NextResponse.json(
      { error: "Failed to list threads" },
      { status: 500 }
    );
  }
}
