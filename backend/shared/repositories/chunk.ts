import { vectorStore } from '../vector/embeddings';
import { Document as MongoDocument } from 'mongodb';

interface ChunkResult {
  text: string;
  metadata: {
    tags: string[];
    source: string;
    [key: string]: unknown;
  };
  _id?: string;
}

type MongoDBAtlasFilter = {
  preFilter?: MongoDocument;
  postFilterPipeline?: MongoDocument[];
  includeEmbeddings?: boolean;
} & MongoDocument;

export async function findChunks(
  query: string,
  options: {
    k: number;
    tags?: string[];
    vectorWeight?: number;
  }
): Promise<ChunkResult[]> {
  const { k, tags } = options;

  const filter: MongoDBAtlasFilter = tags && tags.length > 0
    ? { preFilter: { tags: { $in: tags } } }
    : {};

  const results = await vectorStore.similaritySearch(query, k, filter);

  return results.map(doc => ({
    text: doc.pageContent,
    metadata: doc.metadata as ChunkResult['metadata'],
    _id: doc.id,
  }));
}