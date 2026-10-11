---
name: rag-backend
description: Complete RAG backend: agent orchestration, vector store (Upstash + HF embeddings), retrieval tools with Topic filtering, MongoDB persistence, OpenRouter LLM config, and data chunks (resume, portfolio, interview Q&A, behavioral stories). Use for any backend RAG pipeline changes.
---

# RAG Backend

## Mental Model

```
Agent (agent/index.ts) → getInfoTool (tools.ts) → Vector Store (vector-store.ts)
                                                      ↓
                    MongoDB (mongodb.ts) ← Data Chunks (data-chunks/*.ts)
                    Topic enum (enums.ts) filters retrieval
```

Config (`config.ts`) drives LLM provider, embeddings, DB connections.

## Key Queries (intent → entry point)

| Task | Search For |
|------|------------|
| LLM provider / model | `OpenRouterSchema` `getModelFromConfig` `agent/index.ts` |
| Retrieval logic | `getInfoTool` `Topic` filter `vector-store.ts` |
| Add chunk type | `data-chunks/*.ts` `Topic` enum `sync-db/route.ts` |
| Conversation persistence | `MongoDBConversationSaver` `checkpointer` `mongodb.ts` |
| Re-index vectors | `indexWithEmbeddings` `sync-db/route.ts` |

## File Map (by responsibility)

| Layer | Files |
|-------|-------|
| **Agent** | `backend/agent/index.ts` (setup, prompt, tools), `schemas.ts` (state), `middlewares/MongoDBConversationSaver.ts` |
| **Config** | `backend/config.ts` (Zod: `BaseSchema`, `OpenRouterSchema`, `LLMProviderUnion`, `getModelFromConfig`) |
| **Retrieval** | `backend/tools.ts` (`getInfoTool`), `backend/vector-store.ts` (Upstash + HF embeddings), `backend/enums.ts` (`Topic`) |
| **Content** | `backend/data-chunks/{resume,portfolio,interview-QnA,behavioral-stories}.ts` |
| **Persistence** | `backend/mongodb.ts` (client, threads, checkpointer), `app/api/sync-db/route.ts` (re-index), `app/api/prompt/route.ts` (chat endpoint) |

## Critical Patterns

- **New chunk type**: Create `data-chunks/new.ts` → add Topic if needed → import in `sync-db/route.ts` → `PUT /api/sync-db`
- **Retrieval tuning**: Edit `getInfoTool` in `tools.ts` (k, scoreThreshold, Topic filter)
- **New LLM**: Extend `LLMProviderUnion` in `config.ts` → update `getModelFromConfig()` in `agent/index.ts`

## Env Vars

`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, `HF_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_URL`, `MONGODB_URI`, `MONGODB_DB_NAME`