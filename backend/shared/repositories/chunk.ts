import { vectorStore } from '../vector/embeddings';

interface ChunkResult {
  text: string;
  metadata: {
    tags: string[];
    source: string;
    [key: string]: unknown;
  };
  _id?: string;
}

type AtlasSearchFilter = {
  in?: {
    path: string;
    value: string[];
  };
};

export async function findChunks(
  query: string,
  options: {
    k: number;
    tags?: string[];
    vectorWeight?: number;
  }
): Promise<ChunkResult[]> {
  const { k, tags } = options;

  const filter: AtlasSearchFilter = tags && tags.length > 0
    ? { in: { path: 'tags', value: tags } }
    : {};

  const results = await vectorStore.similaritySearch(query, k, filter as unknown as never);

  return results.map(doc => ({
    text: doc.pageContent,
    metadata: doc.metadata as ChunkResult['metadata'],
    _id: doc.id,
  }));
}