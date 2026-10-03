# Phase 1: Foundation - Shared Infrastructure

**Goal**: Extract reusable infrastructure, no feature logic changes

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 1.1 | Create `backend/shared/` structure | ⏳ Pending | `shared/config.ts`, `shared/logger.ts`, `shared/types.ts` | - |
| 1.2 | Move `config.ts` → `shared/config.ts` | ⏳ Pending | - | `config.ts` |
| 1.3 | Move `logger.ts` → `shared/logger.ts` | ⏳ Pending | - | `logger.ts` (root) |
| 1.4 | Move `common/types.ts` → `shared/types.ts` | ⏳ Pending | - | `common/types.ts` |
| 1.5 | Create `shared/mongodb/` with repos | ⏳ Pending | `client.ts`, `thread-repo.ts`, `cv-repo.ts`, `config-repo.ts` | `mongodb.ts` |
| 1.6 | Create `shared/vector/` with repos | ⏳ Pending | `upstash-repo.ts`, `embeddings.ts` | `vector-store.ts` |
| 1.7 | Add `backend/index.ts` barrel | ⏳ Pending | `index.ts` | - |
| 1.8 | Add `shared/index.ts` barrel | ⏳ Pending | `shared/index.ts` | - |
| 1.9 | **Verify**: Build passes, all imports resolve | ⏳ Pending | | |

**Approval Gate**: Review shared layer, confirm no behavior change.