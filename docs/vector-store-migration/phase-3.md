# Phase 3: Retrieval Tool Refactor (Hybrid Search + Filters via Repository)

**Goal**: Update `getInfoTool` to use `VectorRepository` for hybrid search with correct filter syntax

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 3.1 | Import `vectorRepository` in `retrieval.ts` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.2 | Replace direct `vectorStore` calls with `vectorRepository.hybridSearch()` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.3 | Pass `topics` array directly (repository handles `$in` conversion) | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.4 | Verify tool compiles and types correctly | ⏳ Pending | | |

---

## Implementation Details

### `backend/features/chat/retrieval.ts` — Updated Imports

```typescript
import { tool } from 'langchain';
import { z } from 'zod';

import { vectorRepository } from '@/backend/shared/vector/repository';  // CHANGED
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

**After (MongoDB Atlas via Repository)**:
```typescript
const results = await vectorRepository.hybridSearch(
  `${query} ${expandingKeywords}`,
  {
    k: 6,
    tags: topics,  // Repository converts to { tags: { $in: topics } }
    // vectorWeight defaults to config.HYBRID_SEARCH_ALPHA in repository
  }
);
```

**Key Changes**:
| Aspect | Before (Direct vectorStore) | After (via Repository) |
|--------|----------------------------|------------------------|
| Import | `vectorStore` from `@/backend/shared/vector` | `vectorRepository` from `@/backend/shared/vector/repository` |
| Filter | Manual `{ tags: { $in: topics } }` | Pass `tags: topics` array |
| Hybrid weight | Manual `vectorWeight: config.HYBRID_SEARCH_ALPHA` | Defaults in repository |
| Coupling | Tool knows vector store implementation | Tool only knows repository interface |

---

## Verification

```bash
# Type-check
npx tsc --noEmit backend/features/chat/retrieval.ts

# Verify repository usage
grep -n "vectorRepository" backend/features/chat/retrieval.ts
grep -n "hybridSearch" backend/features/chat/retrieval.ts
grep -n "tags:" backend/features/chat/retrieval.ts
```