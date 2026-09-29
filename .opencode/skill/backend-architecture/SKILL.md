---
name: backend-architecture
description: Backend RAG system including agent orchestration, vector store, retrieval tools, data chunks, MongoDB persistence, and OpenRouter LLM configuration. Use when working on backend agent, RAG pipeline, vector search, or LLM provider setup.
---

# Backend Architecture Skill

This skill provides context for the RAG backend system.

## Queries

- Add LLM provider: "Find OpenRouter LLM provider configuration and agent initialization"
- Modify RAG retrieval: "Trace RAG retrieval pipeline from tool to vector store with Topic filtering"
- Change data chunks: "Find data chunks for resume, portfolio, interview Q&A, behavioral stories and Topic enum"
- MongoDB schema changes: "Trace MongoDB checkpoint, checkpointer, and conversation thread persistence"
- Config schema changes: "Find Zod config schema with BaseSchema and OpenRouterSchema"

## Key Files (for reference)

- `backend/agent/index.ts` - Main agent setup with OpenRouter
- `backend/agent/schemas.ts` - Agent state schema
- `backend/agent/middlewares/MongoDBCoversationSaver.ts` - Conversation persistence
- `backend/vector-store.ts` - Upstash vector store + HF embeddings
- `backend/tools.ts` - getInfoTool with semantic search + Topic filtering
- `backend/config.ts` - Zod config for OpenRouter LLM provider
- `backend/mongodb.ts` - MongoDB client + conversation functions
- `backend/enums.ts` - Topic enum for chunk categorization
- `backend/data-chunks/*.ts` - Resume, portfolio, interview, behavioral stories
- `app/api/sync-db/route.ts` - Syncs data chunks to vector store
- `app/api/prompt/route.ts` - AMA chat endpoint (streams agent responses)