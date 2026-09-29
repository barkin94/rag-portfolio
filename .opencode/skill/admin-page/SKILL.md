---
name: admin-page
description: Admin page for viewing AMA chat threads from MongoDB, push notification management, and maintenance mode toggle. Use when working on admin features, thread listing, or admin authentication.
---

# Admin Page Skill

This skill provides context for the admin page.

## Queries

- Modify thread list: "Find admin threads page with ThreadListPage ThreadSummary and MongoDB"
- Add admin feature: "Find admin page secret token ADMIN_PAGE_SECRET with MongoDB threads"
- Push notifications: "Find push-notification firebase FCM AdminNotifications subscribe"
- Maintenance mode: "Find maintenance MAINTENANCE_MODE admin route toggle"

## Key Files

- `app/admin/page.tsx` - Main admin page (secret token gate)
- `app/admin/threads/page.tsx` - Thread list view
- `app/admin/threads/layout.tsx` - Admin layout with sidebar
- `app/admin/threads/_components/Header/index.tsx` - Admin header
- `app/admin/threads/_components/SideBar/index.tsx` - Admin sidebar
- `app/admin/threads/_components/AdminNotifications/index.tsx` - Push notification management
- `app/api/admin/threads/route.ts` - List/fetch threads
- `app/api/admin/threads/[threadId]/route.ts` - Single thread detail
- `app/api/admin/maintenance/route.ts` - Toggle maintenance mode
- `app/api/admin/push-subscribe/route.ts` - Push subscription management
- `backend/mongodb.ts` - Thread/query functions
- `backend/push-notification.ts` - FCM integration