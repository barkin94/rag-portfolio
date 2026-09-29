---
name: impact-analysis
description: Analyze impact of code changes by tracing dependency chains through the knowledge graph. Use before refactoring to understand what breaks when changing a symbol, config, or schema.
---

# Impact Analysis Skill

This skill helps you understand what would be affected by a change before making it. Run the suggested graphify queries to trace dependencies.

## Queries

- LLM provider config: "Find config.ts LLM_PROVIDER OPENROUTER_API_KEY OPENROUTER_MODEL agent/index.ts getModelFromConfig"
- Topic enum: "Find Topic enum in enums.ts data-chunks tools.ts getInfoTool filter"
- Vector store config: "Find vector-store.ts UPSTASH_VECTOR HF_EMBEDDINGS embeddings indexWithEmbeddings sync-db"
- MongoDB schema/connection: "Find mongodb.ts MONGODB checkpointer MongoDBSaver MongoDBCoversationSaver agent/index.ts threads"
- Agent system prompt/tools: "Find agent/index.ts systemPrompt getInfoTool summarizationMiddleware MongoDBCoversationSaver checkpointer"
- Data chunk structure: "Find data-chunks resume portfolio interview-QnA behavioral-stories Document langchain vector-store sync-db"
- Chat streaming: "Find ChatInput streaming Chat useReducer streamText MessageHistory Message"
- Config schema (Zod): "Find config.ts BaseSchema LLMProviderUnion configSchema imports vector-store mongodb push-notification agent"

## Key Symbol Dependencies

| Symbol | Defined In | Consumed By |
|--------|------------|-------------|
| `config` (default export) | `config.ts` | `agent/index.ts`, `vector-store.ts`, `mongodb.ts`, `push-notification.ts`, `proxy.ts`, `logger.ts`, all API routes |
| `Topic` enum | `enums.ts` | All `data-chunks/*.ts`, `tools.ts` |
| `getInfoTool` | `tools.ts` | `agent/index.ts` |
| `vectorStore` | `vector-store.ts` | `tools.ts`, `app/api/sync-db/route.ts` |
| `Mongodb.client` | `mongodb.ts` | `agent/index.ts` (checkpointer), `proxy.ts` |
| `stateSchema` | `agent/schemas.ts` | `agent/index.ts`, `agent/middlewares/MongoDBCoversationSaver.ts` |
| `agent` (default) | `agent/index.ts` | `app/api/prompt/route.ts` |
| `getModelFromConfig()` | `agent/index.ts` | `agent/index.ts` (twice: model + summarization) |