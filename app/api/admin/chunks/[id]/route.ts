import { NextRequest, NextResponse } from "next/server";

import * as adminService from "@/backend/features/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "id required" },
      { status: 400 }
    );
  }
  try {
    const chunk = await adminService.getChunk(id);
    if (chunk == null) {
      return NextResponse.json({ error: "Chunk not found" }, { status: 404 });
    }
    return NextResponse.json(chunk);
  } catch (error) {
    console.error("Failed to load chunk:", error);
    return NextResponse.json(
      { error: "Failed to load chunk" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "id required" },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();
    const { pageContent, metadata } = body;

    const updateInput: adminService.ChunkUpdateInput = {};
    if (pageContent !== undefined) updateInput.pageContent = pageContent;
    if (metadata?.tags !== undefined || metadata?.source !== undefined) {
      const metadataUpdate: { tags?: adminService.Topic[]; source?: string } = {};
      if (metadata?.tags !== undefined) metadataUpdate.tags = metadata.tags;
      if (metadata?.source !== undefined) metadataUpdate.source = metadata.source;
      updateInput.metadata = metadataUpdate;
    }

    const chunk = await adminService.updateChunk(id, updateInput);
    if (chunk == null) {
      return NextResponse.json({ error: "Chunk not found" }, { status: 404 });
    }
    return NextResponse.json(chunk);
  } catch (error) {
    console.error("Failed to update chunk:", error);
    return NextResponse.json(
      { error: "Failed to update chunk" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "id required" },
      { status: 400 }
    );
  }
  try {
    const deleted = await adminService.deleteChunk(id);
    if (!deleted) {
      return NextResponse.json({ error: "Chunk not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete chunk:", error);
    return NextResponse.json(
      { error: "Failed to delete chunk" },
      { status: 500 }
    );
  }
}