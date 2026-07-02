self.addEventListener('push', (event) => {
  let title = 'New AMA message';
  let body = '';

  try {
    const payload = event.data?.json();
    title = payload?.notification?.title ?? payload?.data?.title ?? title;
    body = payload?.notification?.body ?? payload?.data?.body ?? body;
  } catch {}

  event.waitUntil(self.registration.showNotification(title, { body }));
});
