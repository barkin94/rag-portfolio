---
name: config-schema
description: Environment configuration with Zod schemas for OpenRouter LLM provider, embeddings, MongoDB, vector store, push notifications, and admin features. Use when adding/changing env vars, validation schemas, or feature flags.
---

# Config Schema Skill

This skill provides context for the configuration system.

## Queries

- Add env var: "Find BaseSchema Zod environment variable validation"
- Add LLM provider: "Find LLMProviderUnion with OpenRouterSchema and getModelFromConfig"
- Change defaults: "Find config defaults for temperature and model"
- Push notification config: "Find Firebase service account and VAPID key configuration"
- Admin secret: "Find ADMIN_PAGE_SECRET admin page configuration"

## Key Files

- `backend/config.ts` - Zod schema for OpenRouter LLM provider
- `backend/agent/index.ts` - getModelFromConfig() for OpenRouter
- `backend/vector-store.ts` - Uses HF_EMBEDDINGS_* config
- `backend/mongodb.ts` - Uses MONGODB_* config
- `backend/push-notification.ts` - Uses FIREBASE_* config