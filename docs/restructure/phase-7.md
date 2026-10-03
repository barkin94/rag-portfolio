# Phase 7: Cleanup & Compatibility

**Goal**: Remove old structure, ensure smooth transition

| Step | Action | Status |
|------|--------|--------|
| 7.1 | Remove old flat files: `tools.ts`, `cv-sync.ts`, `cv-parser.ts`, `google-drive.ts`, `push-notification.ts`, `mongodb.ts`, `vector-store.ts`, `enums.ts`, `agent/` (old), `data-chunks/` | ⏳ Pending |
| 7.2 | Update `backend/config.ts` to re-export `shared/config` (compatibility) | ⏳ Pending |
| 7.3 | Update `proxy.ts` imports to use new paths | ⏳ Pending |
| 7.4 | Update any remaining internal imports | ⏳ Pending |
| 7.5 | **Verify**: Full build, all features work | ⏳ Pending |