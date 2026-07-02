self.addEventListener('push', (event) => {
  let title = 'New AMA Thread';
  let body = '';
  let threadId = null;

  try {
    const payload = event.data?.json();
    title = payload?.notification?.title ?? payload?.data?.title ?? title;
    body = payload?.notification?.body ?? payload?.data?.body ?? body;
    threadId = payload?.data?.threadId ?? null;
  } catch {}

  event.waitUntil(self.registration.showNotification(title, { body, data: { threadId } }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const threadId = event.notification.data?.threadId;
  const url = threadId ? `/admin/threads/${threadId}` : '/admin/threads';
  event.waitUntil(clients.openWindow(url));
});
