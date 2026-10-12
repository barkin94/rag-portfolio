# Phase 4: Atlas Search Index Creation & Re-indexing (via sync-db API)

**Goal**: Create MongoDB Atlas Search index and re-index all data with 1024-dim embeddings using existing `app/api/sync-db/route.ts`

---

## Steps

| Step | Action | Status | Files Modified |
|------|--------|--------|----------------|
| 4.1 | Create Atlas Search index `embeddings_index` in MongoDB Atlas UI | ⏳ Pending | (Atlas UI) |
| 4.2 | Update `sync-db/route.ts` for MongoDB Atlas Vector Search | ✅ Complete | `app/api/sync-db/route.ts`, `backend/shared/vector/embeddings.ts` |
| 4.3 | Call sync-db API to re-index | ⏳ Pending | |
| 4.4 | Verify index has documents with 1024-dim vectors | ⏳ Pending | |

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
      "text": {
        "type": "string"
      }
    }
  }
}
```

**Index name**: `embeddings_index` (matches `config.MONGODB_ATLAS_INDEX_NAME`)

**Note**: Field `text` (not `content`) is used for BM25 search — matches `MongoDBAtlasVectorSearch` default `textKey: "text"` and repository's `path: 'text'`.

### Re-indexing via Existing API Route

The existing `app/api/sync-db/route.ts` handles re-indexing:

1. Loads resume from MongoDB (`mongodb.getResume()`)
2. Combines with static chunks (portfolio, interview Q&A, behavioral stories)
3. Creates LangChain `Document` objects with `pageContent` and `metadata.tags`/`source`
4. Calls `vectorStore.addDocuments(documents)` which:
   - Embeds each document's `pageContent` using NVIDIA `nemotron-3-embed-1b` (1024-dim)
   - Inserts into MongoDB `embeddings` collection with fields: `_id`, `text`, `embedding`, `metadata`

**Trigger re-index:**
```bash
# After Atlas index is created and dev server running:
curl -X PUT http://localhost:3000/api/sync-db
```

Or use the UI if there's a button that calls this endpoint.

### Code Flow

```
PUT /api/sync-db
  → mongodb.getResume()  // loads CV from MongoDB
  → create*Chunk()       // builds Document[] from resume + static data
  → vectorStore.addDocuments(documents)
       → MongoDBAtlasVectorSearch.addDocuments()
            → embeddings.embedDocuments(pageContent[])  // NVIDIA 1024-dim
            → collection.insertMany({ _id, text, embedding, metadata })
```

---

## Verification

```bash
# In MongoDB Atlas UI: Atlas Search → embeddings_index → Documents
# Should show documents with 1024-dim embedding arrays

# Or via mongosh:
# db.embeddings.findOne({}, { embedding: 1 })
# embedding array length should be 1024

# Verify text field exists for BM25:
# db.embeddings.findOne({}, { text: 1, metadata: 1 })

# Verify tags are tokenized for filtering:
# db.embeddings.findOne({}, { "metadata.tags": 1 })
```