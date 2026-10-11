---
name: admin-features
description: Admin dashboard: AMA chat thread listing/detail from MongoDB, Firebase push notification management (FCM/VAPID), and maintenance mode toggle. Use when working on admin authentication, thread management, push notifications, or maintenance features.
---

# Admin Features

## Mental Model

```
app/admin/page.tsx (secret gate) → /admin/threads/
    ├── page.tsx (ThreadListPage) → ThreadSummary
    ├── [threadId]/page.tsx (ThreadDetailPage)
    ├── layout.tsx (AdminLayout: Sidebar + Header)
    │       ├── SideBar (nav: threads, notifications, maintenance)
    │       └── Header
    ├── _components/AdminNotifications (FCM topics, VAPID, test push)
    ├── _components/MaintenanceToggle
    └── API: /api/admin/{threads,maintenance,push-subscribe}
```

## Key Queries (intent → entry point)

| Task | Search For |
|------|------------|
| Thread list/detail | `ThreadListPage` `ThreadSummary` `ThreadDetailPage` `mongodb.ts` |
| Admin auth gate | `ADMIN_PAGE_SECRET` `app/admin/page.tsx` |
| Push notifications | `AdminNotifications` `firebase` `FCM` `VAPID` `push-subscribe` |
| Maintenance toggle | `MAINTENANCE_MODE` `maintenance/route.ts` `MaintenanceToggle` |

## File Map

| Area | Files |
|------|-------|
| **Gate & layout** | `app/admin/page.tsx`, `app/admin/threads/layout.tsx`, `app/admin/threads/_components/{Header,SideBar}` |
| **Threads** | `app/admin/threads/page.tsx`, `app/admin/threads/[threadId]/page.tsx`, `app/api/admin/threads/route.ts`, `app/api/admin/threads/[threadId]/route.ts` |
| **Notifications** | `app/admin/threads/_components/AdminNotifications/index.tsx`, `app/api/admin/push-subscribe/route.ts`, `backend/push-notification.ts` |
| **Maintenance** | `app/admin/threads/_components/MaintenanceToggle/index.tsx`, `app/api/admin/maintenance/route.ts` |
| **DB** | `backend/mongodb.ts` (`getThreads`, `getThreadById`, `deleteThread`) |

## Critical Patterns

- **Auth**: `ADMIN_PAGE_SECRET` checked in `app/admin/page.tsx` via cookie or `?secret=` query
- **New admin page**: Add route under `app/admin/` → link in `SideBar` → API under `app/api/admin/`
- **Thread action**: Add button in `ThreadSummary`/`ThreadDetailPage` → new API route → `mongodb.ts` method

## Env Vars

`ADMIN_PAGE_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `MAINTENANCE_MODE`