---
name: rag-backend
description: Complete RAG backend: agent orchestration, vector store (MongoDB Atlas + OpenAI-compatible embeddings), retrieval tools with Topic filtering, MongoDB persistence, OpenRouter LLM config, and data chunks (resume, portfolio, interview Q&A, behavioral stories). Use for any backend RAG pipeline changes.
---

# RAG Backend

## Mental Model

```
Agent (backend/features/chat/agent.ts) → getInfoTool (tools.ts) → Vector Store (vector-store.ts)
                                                      ↓
                    MongoDB (mongodb.ts) ← Data Chunks (data-chunks/*.ts)
                    Topic enum (enums.ts) filters retrieval
```

Config (`config.ts`) drives LLM provider, embeddings, DB connections.

## Key Queries (intent → entry point)

| Task | Search For |
|------|------------|
| LLM provider / model | `CHAT_AGENT_*` env vars `backend/features/chat/agent.ts` |
| Retrieval logic | `getInfoTool` `Topic` filter `vector-store.ts` |
| Add chunk type | `data-chunks/*.ts` `Topic` enum `sync-db/route.ts` |
| Conversation persistence | `MongoDBConversationSaver` `checkpointer` `mongodb.ts` |
| Re-index vectors | `indexWithEmbeddings` `sync-db/route.ts` |

## File Map (by responsibility)

| Layer | Files |
|-------|-------|
| **Agent** | `backend/features/chat/agent.ts` (setup, prompt, tools), `schemas.ts` (state), `middlewares/MongoDBConversationSaver.ts` |
| **Config** | `backend/shared/config.ts` (Zod: `BaseSchema` with `CHAT_AGENT_*` vars) |
| **Retrieval** | `backend/features/chat/tools.ts` (`getInfoTool`), `backend/shared/vector/embeddings.ts` (MongoDB Atlas + OpenAI-compatible embeddings), `backend/shared/enums.ts` (`Topic`) |
| **Content** | `backend/features/chat/data-chunks/{resume,portfolio,interview-QnA,behavioral-stories}.ts` |
| **Persistence** | `backend/shared/mongodb.ts` (client, threads, checkpointer), `app/api/sync-db/route.ts` (re-index), `app/api/prompt/route.ts` (chat endpoint) |

## Critical Patterns

- **New chunk type**: Create `data-chunks/new.ts` → add Topic if needed → import in `sync-db/route.ts` → `PUT /api/sync-db`
- **Retrieval tuning**: Edit `getInfoTool` in `tools.ts` (k, scoreThreshold, Topic filter)
- **New LLM provider**: Update `CHAT_AGENT_BASE_URL` and `CHAT_AGENT_API_KEY` in `.env` (provider-agnostic config)

## Env Vars

`CHAT_AGENT_API_KEY`, `CHAT_AGENT_MODEL`, `CHAT_AGENT_TEMPERATURE`, `CHAT_AGENT_MAX_RETRIES`, `CHAT_AGENT_TIMEOUT`, `CHAT_AGENT_BASE_URL`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, `HF_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_API_KEY`, `MONGODB_URI`, `MONGODB_DBNAME`