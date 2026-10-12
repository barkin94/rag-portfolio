# Phase 3: Retrieval Tool Refactor (Hybrid Search + Filters)

**Goal**: Update `getInfoTool` to use MongoDB Atlas native hybrid search with correct filter syntax

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 3.1 | Import `config` in `retrieval.ts` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.2 | Replace `similaritySearch` with `hybridSearch` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.3 | Convert filter syntax: Upstash `CONTAINS` → MongoDB `$in` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.4 | Pass `vectorWeight: config.HYBRID_SEARCH_ALPHA` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 3.5 | Verify tool compiles and types correctly | ⏳ Pending | | |

---

## Implementation Details

### `backend/features/chat/retrieval.ts` — Updated Imports

```typescript
import { tool } from 'langchain';
import { z } from 'zod';

import { vectorStore } from '@/backend/shared/vector';
import { Topic, TopicSchemaDescription } from '@/backend/shared/types';
import logger from '@/backend/shared/logger';
import config from '@/backend/shared/config';  // ADD
```

### Replace Retrieval Call (lines 11-15)

**Before (Upstash)**:
```typescript
const topicFilters = topics.length > 0
  ? topics.map(t => `tags CONTAINS '${t}'`).join(' OR ')
  : undefined;

const results = await vectorStore.similaritySearch(`${query} ${expandingKeywords}`, 6, topicFilters);
```

**After (MongoDB Atlas)**:
```typescript
const filter = topics.length > 0
  ? { tags: { $in: topics } }
  : undefined;

const results = await vectorStore.hybridSearch(
  `${query} ${expandingKeywords}`,
  {
    k: 6,
    filter,
    vectorWeight: config.HYBRID_SEARCH_ALPHA,
  }
);
```

**Key Changes**:
| Aspect | Upstash | MongoDB Atlas |
|--------|---------|---------------|
| Method | `similaritySearch(query, k, filter?)` | `hybridSearch(query, { k, filter, vectorWeight })` |
| Filter | SQL-like string: `tags CONTAINS 'x'` | MongoDB query object: `{ tags: { $in: ['x'] } }` |
| Hybrid weight | `alpha` (0=BM25, 1=vector) | `vectorWeight` (same semantics) |
| Top-K param | Positional (2nd arg) | `k` in options object |

---

## Verification

```bash
# Type-check
npx tsc --noEmit backend/features/chat/retrieval.ts

# Verify hybridSearch usage
grep -n "hybridSearch" backend/features/chat/retrieval.ts
grep -n "vectorWeight" backend/features/chat/retrieval.ts
grep -n '\$in' backend/features/chat/retrieval.ts
```