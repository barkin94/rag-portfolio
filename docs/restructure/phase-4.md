# Phase 4: Admin Feature Extraction

**Goal**: Isolate admin logic into `features/admin/`

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 4.1 | Create `features/admin/` structure | ✅ Complete | `service.ts`, `types.ts`, `index.ts` | - |
| 4.2 | Extract thread listing, maintenance, sync status from `app/api/admin/*` | ✅ Complete | `service.ts` | 6 API routes |
| 4.3 | Create `features/admin/index.ts` barrel | ✅ Complete | `index.ts` | - |
| 4.4 | Update admin API routes to use `adminService` | ✅ Complete | | 6 API routes |
| 4.5 | **Verify**: Admin pages work | ✅ Complete | | |

**Approval Gate**: Test admin thread viewer, maintenance toggle.