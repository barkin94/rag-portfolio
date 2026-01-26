import { NextResponse } from "next/server";

import mongodb from "@/backend/mongodb";

export async function GET() {
  try {
    const threads = await mongodb.getThreads();
    return NextResponse.json(threads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list threads" },
      { status: 500 }
    );
  }
}
