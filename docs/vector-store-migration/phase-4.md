# Phase 4: Atlas Search Index Creation & Re-indexing

**Goal**: Create MongoDB Atlas Search index and re-index all data with 1024-dim embeddings

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 4.1 | Create Atlas Search index `embeddings_index` in MongoDB Atlas UI | ⏳ Pending | - | (Atlas UI) |
| 4.2 | Write re-indexing script to embed all chunks with NVIDIA model | ⏳ Pending | `scripts/reindex.ts` | - |
| 4.3 | Run re-indexing script | ⏳ Pending | | |
| 4.4 | Verify index has documents with 1024-dim vectors | ⏳ Pending | | |

---

## Implementation Details

### Atlas Search Index Definition

Create in MongoDB Atlas UI: **Database → Atlas Search → Create Search Index → JSON Editor**

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "embedding": {
        "type": "knnVector",
        "dimensions": 1024,
        "similarity": "cosine"
      },
      "tags": {
        "type": "token"
      },
      "source": {
        "type": "token"
      },
      "content": {
        "type": "string"
      }
    }
  }
}
```

**Index name**: `embeddings_index` (matches `config.MONGODB_ATLAS_INDEX_NAME`)

### Re-indexing Script: `scripts/reindex.ts`

```typescript
import { MongoClient } from "mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import config from "@/backend/shared/config";

const embeddings = new OpenAIEmbeddings({
  model: "nvidia/nemotron-3-embed-1b",
  apiKey: config.CHAT_AGENT_API_KEY,
  dimensions: 1024,
  configuration: { baseURL: config.CHAT_AGENT_BASE_URL },
});

async function reindex() {
  const client = new MongoClient(config.MONGODB_URI);
  await client.connect();
  
  const db = client.db(config.MONGODB_DBNAME);
  const collection = db.collection("embeddings");
  
  // Clear old embeddings (384-dim)
  await collection.deleteMany({});
  
  // Load your source chunks (from JSON files, etc.)
  // For each chunk:
  //   const vector = await embeddings.embedQuery(chunk.text);
  //   await collection.insertOne({
  //     content: chunk.text,
  //     embedding: vector,
  //     tags: chunk.topics,
  //     source: chunk.source,
  //     metadata: chunk.metadata,
  //   });
  
  await client.close();
  console.log("Re-indexing complete");
}

reindex().catch(console.error);
```

**Note**: Source chunks come from your existing data files (resume, portfolio, interview Q&A, behavioral stories). Adapt the script to your data loading logic.

---

## Verification

```bash
# In MongoDB Atlas UI: Atlas Search → embeddings_index → Documents
# Should show documents with 1024-dim embedding arrays

# Or via mongosh:
# db.embeddings.findOne({}, { embedding: 1 })
# embedding array length should be 1024
```