import { ObjectId, type Filter, type WithId } from "mongodb";
import mongodbClient from './client';
import config from '../config';
import { vectorStore } from '@/backend/shared/vector/embeddings';
import type { ChunkFilter, ChunkResponse } from '@/backend/features/admin/chunk-types';
import { Topic } from '@/backend/shared/types';

const db = mongodbClient.db(config.MONGODB_DBNAME);
const embeddingsColl = db.collection("embeddings");

function toResponse(doc: WithId<any>): ChunkResponse {
  return {
    _id: doc._id.toHexString(),
    id: doc._id.toHexString(), // Use MongoDB _id as the chunk ID
    pageContent: doc.text || doc.pageContent,
    metadata: {
      tags: (doc.tags || doc.metadata?.tags || []) as Topic[],
      source: doc.source || doc.metadata?.source || '',
    },
    createdAt: doc.createdAt?.toISOString() || doc._id.getTimestamp().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() || doc._id.getTimestamp().toISOString(),
  };
}

export async function getChunks(filter: ChunkFilter = {}, limit = 100, skip = 0): Promise<ChunkResponse[]> {
  const query: Filter<any> = {};

  if (filter.topic) {
    query.tags = filter.topic;
  }

  if (filter.source) {
    query.source = filter.source;
  }

  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  const docs = await embeddingsColl
    .find(query, { projection: { embedding: 0 } })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return docs.map(toResponse);
}

export async function countChunks(filter: ChunkFilter = {}): Promise<number> {
  const query: Filter<any> = {};

  if (filter.topic) {
    query.tags = filter.topic;
  }

  if (filter.source) {
    query.source = filter.source;
  }

  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  return embeddingsColl.countDocuments(query);
}

export async function getChunkById(id: string): Promise<ChunkResponse | null> {
  let doc: WithId<any> | null = null;
  
  const projection = { embedding: 0 };
  
  if (ObjectId.isValid(id)) {
    doc = await embeddingsColl.findOne({ _id: new ObjectId(id) } as Filter<any>, { projection });
  }
  
  if (!doc) {
    // Also try finding by the ID field in metadata
    doc = await embeddingsColl.findOne({ 
      $or: [
        { "metadata.id": id },
        { id: id }
      ]
    } as Filter<any>, { projection });
  }
  
  return doc ? toResponse(doc) : null;
}

export async function createChunk(input: { 
  pageContent: string; 
  metadata: { tags: Topic[]; source: string };
}): Promise<ChunkResponse> {
  const { Document } = await import('langchain');
  
  const doc = new Document({
    pageContent: input.pageContent,
    metadata: {
      tags: input.metadata.tags,
      source: input.metadata.source,
    },
  });

  await vectorStore.addDocuments([doc]);
  
  // Get the created document
  const createdDoc = await embeddingsColl.findOne({ 
    _id: new ObjectId(doc.id) 
  } as Filter<any>, { projection: { embedding: 0 } });
  
  return createdDoc ? toResponse(createdDoc) : toResponse({ 
    _id: new ObjectId(doc.id),
    text: input.pageContent,
    tags: input.metadata.tags,
    source: input.metadata.source,
  });
}

export async function updateChunk(id: string, input: { 
  pageContent?: string; 
  metadata?: { tags?: Topic[]; source?: string };
}): Promise<ChunkResponse | null> {
  const existingDoc = await embeddingsColl.findOne({ _id: new ObjectId(id) } as Filter<any>, { projection: { embedding: 0 } });
  if (!existingDoc) return null;

  const updatedPageContent = input.pageContent ?? existingDoc.text ?? existingDoc.pageContent;
  const updatedTags = input.metadata?.tags ?? existingDoc.tags ?? existingDoc.metadata?.tags ?? [];
  const updatedSource = input.metadata?.source ?? existingDoc.source ?? existingDoc.metadata?.source ?? '';

  const { Document } = await import('langchain');
  
  const updatedDoc = new Document({
    pageContent: updatedPageContent,
    metadata: {
      tags: updatedTags,
      source: updatedSource,
    },
    id: id,
  });

  await vectorStore.addDocuments([updatedDoc], { ids: [new ObjectId(id) as any] });
  
  const result = await embeddingsColl.findOne({ _id: new ObjectId(id) } as Filter<any>, { projection: { embedding: 0 } });
  return result ? toResponse(result) : null;
}

export async function deleteChunk(id: string): Promise<boolean> {
  try {
    await vectorStore.delete({ ids: [new ObjectId(id) as any] });
    return true;
  } catch (error) {
    // Fallback: try direct delete
    const result = await embeddingsColl.deleteOne({ _id: new ObjectId(id) } as Filter<any>);
    return result.deletedCount > 0;
  }
}

export async function chunkExists(id: string): Promise<boolean> {
  if (ObjectId.isValid(id)) {
    const count = await embeddingsColl.countDocuments({ _id: new ObjectId(id) } as Filter<any>, { limit: 1 });
    if (count > 0) return true;
  }
  const count = await embeddingsColl.countDocuments({ 
    $or: [
      { "metadata.id": id },
      { id: id }
    ]
  } as Filter<any>, { limit: 1 });
  return count > 0;
}

export async function getAllSources(): Promise<string[]> {
  return embeddingsColl.distinct("source");
}

export async function getAllTopics(): Promise<Topic[]> {
  const sources = await embeddingsColl.distinct("tags");
  return sources as Topic[];
}