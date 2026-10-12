# Phase 2: Vector Store & Embeddings Replacement + Repository Layer

**Goal**: Replace Upstash vector store with MongoDB Atlas Vector Search, switch to NVIDIA Nemotron embeddings, and introduce a repository layer in `shared/repositories/`

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 2.1 | Create `shared/repositories/chunk.ts` with chunk repository functions | ⏳ Pending | `backend/shared/repositories/chunk.ts` | - |
| 2.2 | Replace `embeddings.ts` to export `vectorStore` (MongoDBAtlasVectorSearch) | ⏳ Pending | - | `backend/shared/vector/embeddings.ts` |
| 2.3 | Delete `upstash-repo.ts` (no longer needed) | ⏳ Pending | - | `backend/shared/vector/upstash-repo.ts` |
| 2.4 | Update `shared/vector/index.ts` to export from `embeddings` only | ⏳ Pending | - | `backend/shared/vector/index.ts` |
| 2.5 | Verify exports: `vectorStore` from embeddings, chunk functions from repositories | ⏳ Pending | | |

---

## Implementation Details

### `backend/shared/repositories/chunk.ts` — NEW FILE

```typescript
import { vectorStore } from '../vector/embeddings';
import { Document } from '@langchain/core/documents';
import config from '@/backend/shared/config';

export async function hybridSearchChunks(
  query: string,
  options: {
    k: number;
    tags?: string[];
    vectorWeight?: number;
  }
): Promise<Document[]> {
  const filter = options.tags && options.tags.length > 0
    ? { tags: { $in: options.tags } }
    : undefined;

  return vectorStore.hybridSearch(query, {
    k: options.k,
    filter,
    vectorWeight: options.vectorWeight ?? config.HYBRID_SEARCH_ALPHA,
  });
}
```

**Key Points**:
- No class — just pure functions
- Accepts `tags: string[]` for filtering (converts to MongoDB `$in`)
- Defaults `vectorWeight` from config (`HYBRID_SEARCH_ALPHA`)
- Returns `Document[]` (LangChain standard)
- Named `hybridSearchChunks` — clear purpose

### `backend/shared/vector/embeddings.ts` — Full Replacement

```typescript
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

import mongodbClient from '@/backend/shared/mongodb/client';
import config from "../config";

export const vectorStore = new MongoDBAtlasVectorSearch({
  collection: mongodbClient.db(config.MONGODB_DBNAME).collection("embeddings"),
  indexName: config.MONGODB_ATLAS_INDEX_NAME,
});

vectorStore.embeddings = new OpenAIEmbeddings({
  model: config.EMBEDDING_MODEL,
  apiKey: config.EMBEDDING_API_KEY,
  configuration: {
    baseURL: config.EMBEDDING_BASE_URL,
  }
});
```

**Notes**:
- Uses `MongoDBAtlasVectorSearch` from `@langchain/mongodb`
- `OpenAIEmbeddings` with generic config (provider-agnostic)
- Dimensions inferred from model (not configured)
- Collection: `embeddings` in configured database
- Index name from config (`embeddings_index` default)

### `backend/shared/vector/upstash-repo.ts` — DELETE

File no longer needed. MongoDB Atlas handles hybrid search natively.

### `backend/shared/vector/index.ts` — Update

```typescript
export * from './embeddings';
```

---

## Verification

```bash
# Type-check
npx tsc --noEmit backend/shared/vector/embeddings.ts
npx tsc --noEmit backend/shared/repositories/chunk.ts

# Verify exports
grep -r "export.*vectorStore" backend/shared/vector/embeddings.ts
grep -r "export.*hybridSearchChunks" backend/shared/repositories/chunk.ts

# Confirm upstash-repo.ts deleted
test ! -f backend/shared/vector/upstash-repo.ts && echo "Deleted"

# Confirm index.ts updated
grep -v "upstash-repo" backend/shared/vector/index.ts
```