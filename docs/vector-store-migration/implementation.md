# Vector Store Migration: Upstash → MongoDB Atlas + Embedding Model Change

## Overview
Migrate vector store from Upstash to MongoDB Atlas Vector Search and switch embedding model from HuggingFace `all-MiniLM-L6-v2` (384-dim) to NVIDIA `nemotron-3-embed-1b` (1024-dim) via OpenAI-compatible endpoint. This migration is a prerequisite for Phase 2 (Hybrid Search) of the Retrieval Quality Improvement Plan, as MongoDB Atlas provides native hybrid search (vector + BM25) replacing Upstash's.

## Target File Structure

```
backend/
├── shared/
│   ├── config.ts                    # - UPSTASH_VECTOR_*, + HYBRID_SEARCH_ALPHA, + MONGODB_ATLAS_INDEX_NAME
│   ├── vector/
│   │   ├── embeddings.ts            # Replace: MongoDBAtlasVectorSearch + NVIDIA embeddings
│   │   ├── index.ts                 # Update: export only from embeddings
│   │   └── upstash-repo.ts          # DELETE (no longer needed)
│   └── repositories/
│       └── chunk.ts                 # NEW: findChunks() function
├── features/
│   └── chat/
│       └── retrieval.ts             # Refactor: use findChunks()
```

## Workflow

**Follow `docs/EXECUTION_WORKFLOW.md` strictly.** Read it first before starting any phase work.

## Phase Status

| Phase | Description | Status | Approval |
|-------|-------------|--------|----------|
| 1 | Config & Dependencies Update | `✅ Complete` | `✅` |
| 2 | Vector Store & Embeddings Replacement + Chunk Repository | `✅ Complete` | `✅` |
| 3 | Retrieval Tool Refactor (Vector Search via Chunk Repository) | `✅ Complete` | `✅` |
| 4 | Atlas Search Index Creation & Re-indexing (via sync-db API) | `✅ Complete` | `✅` |
| 5 | Verification (Vector Search + Filtering) | `✅ Complete` | `✅` |

## Migration Phases

- Phase 1: Reference `docs/vector-store-migration/phase-1.md` when required
- Phase 2: Reference `docs/vector-store-migration/phase-2.md` when required
- Phase 3: Reference `docs/vector-store-migration/phase-3.md` when required
- Phase 4: Reference `docs/vector-store-migration/phase-4.md` when required
- Phase 5: Reference `docs/vector-store-migration/phase-5.md` when required

## Key Decisions

1. **MongoDB Atlas over Upstash**: Native vector search, unified infra (already using MongoDB for chat history), no separate vector DB cost
2. **NVIDIA Nemotron-3-embed-1b (1024-dim)**: Higher quality embeddings than MiniLM (384-dim), OpenAI-compatible API via custom `CHAT_AGENT_BASE_URL`
3. **Full re-index required**: Dimension change (384 → 1024) makes old embeddings incompatible
4. **Filter syntax conversion**: Upstash `tags CONTAINS 'x'` → MongoDB `{ tags: { $in: ['x'] } }` via `preFilter`
5. **Repository pattern (functional)**: `shared/repositories/chunk.ts` exports pure functions (`findChunks`) that encapsulate vector store operations. Retrieval tool depends on repository functions, not vector store implementation. Repository accepts `tags: string[]` and handles MongoDB `$in` conversion internally. No classes — just functions.
6. **Pure vector search**: Using `MongoDBAtlasVectorSearch.similaritySearch()` directly. BM25/hybrid search removed for simplicity; Atlas handles vector search natively.

## Config Changes

| Key | Action | Notes |
|-----|--------|-------|
| `HF_EMBEDDINGS_MODEL` | Remove | Replaced by generic `EMBEDDING_MODEL` |
| `HF_EMBEDDINGS_API_KEY` | Remove | Replaced by generic `EMBEDDING_API_KEY` |
| `UPSTASH_VECTOR_REST_URL` | Remove | No longer used |
| `UPSTASH_VECTOR_REST_TOKEN` | Remove | No longer used |
| `EMBEDDING_API_KEY` | Add (required) | Generic embedding provider API key |
| `EMBEDDING_MODEL` | Add (default: `nvidia/nemotron-3-embed-1b`) | Embedding model name |
| `EMBEDDING_BASE_URL` | Add (default: `https://openrouter.ai/api/v1`) | OpenAI-compatible base URL |
| `MONGODB_ATLAS_INDEX_NAME` | Add (default "embeddings_index") | Atlas Search index name |
| `CHAT_AGENT_*` | Keep | Unchanged, used for LLM |

## Verification Criteria

| Phase | Verify |
|-------|--------|
| 1 | Config validates; `@langchain/mongodb` installed; Upstash vars removed |
| 2 | `embeddings.ts` exports `vectorStore` (MongoDBAtlasVectorSearch) with NVIDIA embeddings |
| 3 | `retrieval.ts` uses `findChunks` with MongoDB `$in` filter via `preFilter` |
| 4 | Atlas Search index created; data re-indexed with 1024-dim embeddings |
| 5 | Vector search returns relevant results; topic filtering works; citations appear |

## Dependencies

- **Blocks**: Retrieval Improvements Phase 2 (Hybrid Search) — requires MongoDB Atlas hybrid search
- **Requires**: MongoDB Atlas cluster with Search enabled, NVIDIA embeddings endpoint access

## Phase 4 & 5 Status

**Phase 4** (Atlas Search Index + Re-indexing):
1. Manual: Create Atlas Search index `embeddings_index` in MongoDB Atlas UI (knnVector 1024-dim cosine, token fields for tags/source, string for text)
2. Run: `curl -X PUT http://localhost:3000/api/sync-db` — invokes `app/api/sync-db/route.ts` which embeds all chunks via NVIDIA 1024-dim and stores in Atlas
3. Verify: `db.embeddings.findOne({}, { embedding: 1 })` → array length 1024

**Phase 5** (Verification): Run after Phase 4 — test vector search relevance and topic filtering.