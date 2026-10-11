# Phase 0: Shared Topic Definitions (SSOT)

**Goal**: Single source of truth for topic enum, type, and Zod schema with auto-generated descriptions

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 0.1 | Add `TopicDefs` object to `backend/shared/types.ts` | ✅ Complete | - | `backend/shared/types.ts` |
| 0.2 | Derive `Topic` type from `TopicDefs` (replace existing enum) | ✅ Complete | - | `backend/shared/types.ts` |
| 0.3 | Export `Topic` type (keyof TopicDefs) | ✅ Complete | - | `backend/shared/types.ts` |
| 0.4 | Export `TopicSchema` (Zod enum with auto-generated description) | ✅ Complete | - | `backend/shared/types.ts` |
| 0.5 | Update imports in `retrieval.ts` to use `TopicSchema` | ✅ Complete | - | `backend/features/chat/retrieval.ts` |
| 0.6 | **Verify**: Build passes, TopicSchema description contains all topics | ✅ Complete | | |

---

## Implementation Details

### `backend/shared/types.ts` — Add after existing `Topic` enum

```typescript
export const TopicDefs = {
  general_info: { label: "general_info", desc: "Location, summary, preferences" },
  contact: { label: "contact", desc: "Email, LinkedIn, GitHub" },
  work_experience: { label: "work_experience", desc: "Roles, companies, achievements" },
  skills: { label: "skills", desc: "Tech stack, languages, categories" },
  education: { label: "education", desc: "Degrees, certifications" },
  projects: { label: "projects", desc: "Portfolio, RAG details" },
  achievements: { label: "achievements", desc: "Metrics, awards" },
} as const;

export type Topic = keyof typeof TopicDefs;
export const TopicValues = Object.values(TopicDefs).map(t => t.label) as [Topic, ...Topic[]];

export const TopicSchema = z.enum(TopicValues).describe(
  Object.entries(TopicDefs).map(([k, v]) => `${k}=${v.desc}`).join(", ")
);
```

### `backend/features/chat/retrieval.ts` — Update imports

```typescript
import { TopicSchema } from '@/backend/shared/types';
// ...
topics: z.array(TopicSchema),
```

---

## Verification

```bash
# Check build
npm run build

# Verify schema description includes all 7 topics
grep -A 20 "TopicSchema" backend/shared/types.ts
```

**Approval Gate**: Confirm TopicDefs is single source of truth — adding a topic requires only one object entry.