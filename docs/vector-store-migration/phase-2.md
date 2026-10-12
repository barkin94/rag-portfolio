# Phase 2: Vector Store & Embeddings Replacement + Repository Layer

**Goal**: Replace Upstash vector store with MongoDB Atlas Vector Search, switch to NVIDIA Nemotron embeddings, and introduce a repository layer that encapsulates vector store operations

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 2.1 | Create `repository.ts` with `VectorRepository` class | ⏳ Pending | `backend/shared/vector/repository.ts` | - |
| 2.2 | Replace `embeddings.ts` to export `vectorStore` (MongoDBAtlasVectorSearch) | ⏳ Pending | - | `backend/shared/vector/embeddings.ts` |
| 2.3 | Delete `upstash-repo.ts` (no longer needed) | ⏳ Pending | - | `backend/shared/vector/upstash-repo.ts` |
| 2.4 | Wire `VectorRepository` to use `vectorStore` from `embeddings.ts` | ⏳ Pending | - | `backend/shared/vector/repository.ts` |
| 2.5 | Verify exports: `VectorRepository` and `vectorStore` | ⏳ Pending | | |

---

## Implementation Details

### `backend/shared/vector/repository.ts` — NEW FILE

```typescript
import { vectorStore } from './embeddings';
import { Document } from '@langchain/core/documents';
import config from '@/backend/shared/config';

export class VectorRepository {
  async hybridSearch(
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
}

export const vectorRepository = new VectorRepository();
```

**Key Points**:
- Encapsulates all vector store operations
- Accepts `tags: string[]` for filtering (converts to MongoDB `$in`)
- Defaults `vectorWeight` from config (`HYBRID_SEARCH_ALPHA`)
- Returns `Document[]` (LangChain standard)
- Single export: `vectorRepository` instance

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
  model: "nvidia/nemotron-3-embed-1b",
  apiKey: config.CHAT_AGENT_API_KEY,
  dimensions: 1024,
  configuration: {
    baseURL: config.CHAT_AGENT_BASE_URL,
  }
});
```

**Notes**:
- Uses `MongoDBAtlasVectorSearch` from `@langchain/mongodb`
- `OpenAIEmbeddings` with NVIDIA model via custom `baseURL` (OpenAI-compatible)
- 1024 dimensions — matches `nemotron-3-embed-1b`
- Collection: `embeddings` in configured database
- Index name from config (`embeddings_index` default)

### `backend/shared/vector/upstash-repo.ts` — DELETE

File no longer needed. MongoDB Atlas handles hybrid search natively.

---

## Verification

```bash
# Type-check
npx tsc --noEmit backend/shared/vector/embeddings.ts
npx tsc --noEmit backend/shared/vector/repository.ts

# Verify exports
grep -r "export.*vectorStore" backend/shared/vector/embeddings.ts
grep -r "export.*vectorRepository" backend/shared/vector/repository.ts
grep -r "class VectorRepository" backend/shared/vector/repository.ts

# Confirm upstash-repo.ts deleted
test ! -f backend/shared/vector/upstash-repo.ts && echo "Deleted"
```