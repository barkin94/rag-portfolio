import * as mongodb from '@/backend/shared/mongodb';
import type {
  ChunkCreateInput,
  ChunkUpdateInput,
  ChunkFilter,
  ChunkListResponse,
  ChunkResponse,
} from './chunk-types';

export async function listChunks(
  filter: ChunkFilter = {},
  page = 1,
  pageSize = 20
): Promise<ChunkListResponse> {
  const skip = (page - 1) * pageSize;
  const [chunks, total] = await Promise.all([
    mongodb.getChunks(filter, pageSize, skip),
    mongodb.countChunks(filter),
  ]);
  return { chunks, total };
}

export async function getChunk(id: string): Promise<ChunkResponse | null> {
  return mongodb.getChunkById(id);
}

export async function createChunk(input: ChunkCreateInput): Promise<ChunkResponse> {
  return mongodb.createChunk(input);
}

export async function updateChunk(id: string, input: ChunkUpdateInput): Promise<ChunkResponse | null> {
  return mongodb.updateChunk(id, input);
}

export async function deleteChunk(id: string): Promise<boolean> {
  return mongodb.deleteChunk(id);
}

export async function getSources(): Promise<string[]> {
  return mongodb.getAllSources();
}

export async function getTopics() {
  return mongodb.getAllTopics();
}