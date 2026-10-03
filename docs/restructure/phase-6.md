# Phase 6: Knowledge/Retrieval Shared Assets

**Goal**: Move static knowledge chunks to shared location accessible by both agents

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 6.1 | Create `shared/knowledge/` | ⏳ Pending | `portfolio-chunks.ts`, `interview-qna-chunks.ts`, `behavioral-story-chunks.ts` | `data-chunks/*` |
| 6.2 | Add barrel exporting `allChunks`, individual chunk arrays | ⏳ Pending | `index.ts` | - |
| 6.3 | Update `chat/retrieval.ts` and `cv-sync/service.ts` to import from knowledge barrel | ⏳ Pending | | 2 files |
| 6.4 | **Verify**: Both agents retrieve correctly | ⏳ Pending | | |

**Approval Gate**: Test retrieval in both chat and CV sync.