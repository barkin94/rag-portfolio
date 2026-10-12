import { NextRequest, NextResponse } from "next/server";

import * as adminService from "@/backend/features/admin";
import { Topic } from "@/backend/shared/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const topic = searchParams.get("topic") || undefined;
    const source = searchParams.get("source") || undefined;
    const search = searchParams.get("search") || undefined;

    const filter: adminService.ChunkFilter = {};
    if (topic) filter.topic = topic as Topic;
    if (source) filter.source = source;
    if (search) filter.search = search;

    const result = await adminService.listChunks(filter, page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to list chunks:", error);
    return NextResponse.json(
      { error: "Failed to list chunks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageContent, metadata } = body;

    if (!pageContent || !metadata?.tags || !metadata?.source) {
      return NextResponse.json(
        { error: "Missing required fields: pageContent, metadata.tags, metadata.source" },
        { status: 400 }
      );
    }

    const chunk = await adminService.createChunk({
      pageContent,
      metadata: {
        tags: metadata.tags,
        source: metadata.source,
      },
    });

    return NextResponse.json(chunk, { status: 201 });
  } catch (error) {
    console.error("Failed to create chunk:", error);
    const message = error instanceof Error ? error.message : "Failed to create chunk";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}