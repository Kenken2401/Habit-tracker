// Notifications only — no asset caching so updates always propagate
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Wipe every cache left over from previous versions
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data;
    self.registration.showNotification(title, { body, icon: '/Habit-tracker/icon-192.png' });
  }
});
