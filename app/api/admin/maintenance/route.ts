import { NextRequest, NextResponse } from "next/server";
import * as adminService from "@/backend/features/admin";

export async function GET() {
  const maintenanceMode = await adminService.getMaintenanceStatus();
  return NextResponse.json(maintenanceMode);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { enabled } = body as { enabled?: boolean };

  if (typeof enabled !== "boolean") {
    return NextResponse.json({ error: "enabled must be boolean" }, { status: 400 });
  }

  const result = await adminService.setMaintenanceMode(enabled);
  return NextResponse.json(result);
}