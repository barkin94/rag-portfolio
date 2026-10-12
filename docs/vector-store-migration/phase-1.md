# Phase 1: Config & Dependencies Update

**Goal**: Update config schema and dependencies for MongoDB Atlas migration

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 1.1 | Install `@langchain/mongodb` dependency | ✅ Complete | - | `package.json` |
| 1.2 | Remove `@upstash/vector` dependency | ⏳ Pending | - | `package.json` |
| 1.3 | Update `config.ts`: remove Upstash vars, add hybrid alpha & Atlas index name | ⏳ Pending | - | `backend/shared/config.ts` |
| 1.4 | Verify config validation passes | ⏳ Pending | | |

---

## Implementation Details

### `package.json` — Dependencies

```bash
npm install @langchain/mongodb@1.3.1
npm uninstall @upstash/vector
```

### `backend/shared/config.ts` — Update `BaseSchema`

**Remove** (lines 17-20, 25-26):
```typescript
HF_EMBEDDINGS_MODEL: z
  .string()
  .default("sentence-transformers/all-MiniLM-L6-v2"),
HF_EMBEDDINGS_API_KEY: z.string().min(1),

UPSTASH_VECTOR_REST_URL: z.string().url(),
UPSTASH_VECTOR_REST_TOKEN: z.string().min(1),
```

**Add** after `CONTEXT_TURNS` (line 15):
```typescript
// Embedding Model Config (generic, provider-agnostic)
EMBEDDING_API_KEY: z.string().min(1),
EMBEDDING_MODEL: z.string().default("nvidia/nemotron-3-embed-1b"),
EMBEDDING_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
EMBEDDING_DIMENSIONS: z.coerce.number().default(1024),

HYBRID_SEARCH_ALPHA: z.coerce.number().min(0).max(1).default(0.5),
MONGODB_ATLAS_INDEX_NAME: z.string().default("embeddings_index"),
```

**Keep** (used by new embeddings):
```typescript
CHAT_AGENT_API_KEY: z.string().min(1),
CHAT_AGENT_MODEL: z.string().default("openrouter/free"),
CHAT_AGENT_TEMPERATURE: z.coerce.number().default(0.1),
CHAT_AGENT_MAX_RETRIES: z.coerce.number().default(3),
CHAT_AGENT_TIMEOUT: z.coerce.number().default(60000),
CHAT_AGENT_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
```

---

## Verification

```bash
# Type-check config
npx tsc --noEmit backend/shared/config.ts

# Verify no Upstash references in config
grep -r "UPSTASH" backend/shared/config.ts  # Should return nothing
```