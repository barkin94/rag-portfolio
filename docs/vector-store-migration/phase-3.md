# Phase 3: Retrieval Tool Refactor (Hybrid Search + Filters via Chunk Repository)

**Goal**: Update `getInfoTool` to use `hybridSearchChunks` from chunk repository

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 3.1 | Import `hybridSearchChunks` from `@/backend/shared/repositories/chunk` in `retrieval.ts` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.2 | Replace direct `vectorStore` calls with `hybridSearchChunks()` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.3 | Pass `topics` array directly (repository handles `$in` conversion) | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.4 | Verify tool compiles and types correctly | ⏳ Pending | | |

---

## Implementation Details

### `backend/features/chat/retrieval.ts` — Updated Imports

```typescript
import { tool } from 'langchain';
import { z } from 'zod';

import { hybridSearchChunks } from '@/backend/shared/repositories/chunk';  // CHANGED
import { Topic, TopicSchemaDescription } from '@/backend/shared/types';
import logger from '@/backend/shared/logger';
```

### Replace Retrieval Call (lines 11-15)

**Before (Upstash)**:
```typescript
const topicFilters = topics.length > 0
  ? topics.map(t => `tags CONTAINS '${t}'`).join(' OR ')
  : undefined;

const results = await vectorStore.similaritySearch(`${query} ${expandingKeywords}`, 6, topicFilters);
```

**After (MongoDB Atlas via Chunk Repository)**:
```typescript
const results = await hybridSearchChunks(
  `${query} ${expandingKeywords}`,
  {
    k: 6,
    tags: topics,  // Repository converts to { tags: { $in: topics } }
    // vectorWeight defaults to config.HYBRID_SEARCH_ALPHA in repository
  }
);
```

**Key Changes**:
| Aspect | Before (Direct vectorStore) | After (via Chunk Repository) |
|--------|----------------------------|------------------------------|
| Import | `vectorStore` from `@/backend/shared/vector` | `hybridSearchChunks` from `@/backend/shared/repositories/chunk` |
| Filter | Manual `{ tags: { $in: topics } }` | Pass `tags: topics` array |
| Hybrid weight | Manual `vectorWeight: config.HYBRID_SEARCH_ALPHA` | Defaults in repository |
| Coupling | Tool knows vector store implementation | Tool only knows repository function |

---

## Verification

```bash
# Type-check
npx tsc --noEmit backend/features/chat/retrieval.ts

# Verify repository usage
grep -n "hybridSearchChunks" backend/features/chat/retrieval.ts
grep -n "from '@/backend/shared/repositories/chunk'" backend/features/chat/retrieval.ts
grep -n "tags:" backend/features/chat/retrieval.ts
```