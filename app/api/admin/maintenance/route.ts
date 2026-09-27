import { NextRequest, NextResponse } from "next/server";
import db from "@/backend/mongodb";

export async function GET() {
  const maintenanceMode = await db.isInMaintenance();
  return NextResponse.json({ maintenance: maintenanceMode });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { enabled } = body as { enabled?: boolean };

  if (typeof enabled !== "boolean") {
    return NextResponse.json({ error: "enabled must be boolean" }, { status: 400 });
  }

  await db.setMaintenanceMode(enabled);
  return NextResponse.json({ maintenance: enabled });
}