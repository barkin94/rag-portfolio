# Phase 3: CV Sync Feature Extraction

**Goal**: Isolate CV pipeline into `features/cv-sync/`

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 3.1 | Create `features/cv-sync/` structure | ⏳ Pending | `service.ts`, `agent.ts`, `parser.ts`, `google-drive.ts`, `document-builders.ts` | - |
| 3.2 | Move `cv-sync.ts` logic → `service.ts` + `document-builders.ts` | ⏳ Pending | | `cv-sync.ts` |
| 3.3 | Move `cv-parser.ts` → `parser.ts` (update model config) | ⏳ Pending | | `cv-parser.ts` |
| 3.4 | Move `google-drive.ts` → `google-drive.ts` | ⏳ Pending | | `google-drive.ts` |
| 3.5 | Create CV sync agent (`agent.ts`) with Nemotron config | ⏳ Pending | `agent.ts` | - |
| 3.6 | Create `features/cv-sync/index.ts` barrel | ⏳ Pending | `index.ts` | - |
| 3.7 | Update `app/api/queues/sync-cv/route.ts` and `app/api/admin/sync-cv/route.ts` | ⏳ Pending | | 2 API routes |
| 3.8 | **Verify**: CV sync works end-to-end | ⏳ Pending | | |

**Approval Gate**: Test CV sync, confirm parsing + indexing works.