import { NextResponse } from "next/server";

import * as adminService from "@/backend/features/admin";

export async function GET() {
  try {
    const sources = await adminService.getSources();
    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Failed to fetch sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}