import { embeddings } from '../vector/embeddings';
import config from '../config';
import mongodbClient from '../mongodb/client';
import { Collection, Document as MongoDocument, WithId } from 'mongodb';

interface ChunkDocument extends WithId<MongoDocument> {
  text: string;
  embedding: number[];
  metadata: {
    tags: string[];
    source: string;
    [key: string]: unknown;
  };
  score?: number;
}

type AtlasSearchFilter = Record<string, unknown>;

export async function findChunks(
  query: string,
  options: {
    k: number;
    tags?: string[];
    vectorWeight?: number;
  }
): Promise<ChunkDocument[]> {
  const { k, tags, vectorWeight = config.HYBRID_SEARCH_ALPHA } = options;

  const filter: AtlasSearchFilter = tags && tags.length > 0
    ? { tags: { $in: tags } }
    : {};

  const collection: Collection<ChunkDocument> = mongodbClient.db(config.MONGODB_DBNAME).collection<ChunkDocument>('embeddings');

  // Build the $search aggregation pipeline for hybrid search
  const searchStage = {
    $search: {
      index: config.MONGODB_ATLAS_INDEX_NAME,
      compound: {
        should: [
          {
            knnBeta: {
              vector: await embeddings.embedQuery(query),
              path: 'embedding',
              k: k * 2,
              score: { vectorWeight },
            },
          },
          {
            text: {
              query: query,
              path: 'text',
              score: { bm25: { k1: 1.2, b: 0.75 } },
            },
          },
        ],
        ...(Object.keys(filter).length > 0 && { filter }),
      },
    },
  };

  const pipeline = [
    searchStage,
    { $limit: k },
    {
      $project: {
        _id: 1,
        text: 1,
        metadata: 1,
        score: { $meta: 'searchScore' },
      },
    },
  ];

  return collection.aggregate<ChunkDocument>(pipeline).toArray();
}