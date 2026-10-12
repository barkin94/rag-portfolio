# Phase 2: Vector Store & Embeddings Replacement

**Goal**: Replace Upstash vector store with MongoDB Atlas Vector Search and switch to NVIDIA Nemotron embeddings

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 2.1 | Replace `embeddings.ts` with MongoDB Atlas + NVIDIA embeddings | ⏳ Pending | - | `backend/shared/vector/embeddings.ts` |
| 2.2 | Delete `upstash-repo.ts` (no longer needed) | ⏳ Pending | - | `backend/shared/vector/upstash-repo.ts` |
| 2.3 | Verify exports: `vectorStore` (MongoDBAtlasVectorSearch) | ⏳ Pending | | |

---

## Implementation Details

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

File no longer needed. MongoDB Atlas handles hybrid search natively via `vectorStore.hybridSearch()`.

---

## Verification

```bash
# Type-check
npx tsc --noEmit backend/shared/vector/embeddings.ts

# Verify exports
grep -r "export.*vectorStore" backend/shared/vector/embeddings.ts

# Confirm upstash-repo.ts deleted
test ! -f backend/shared/vector/upstash-repo.ts && echo "Deleted"
```