self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force the new version to install immediately
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim()); // Take control of the app immediately
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('./');
    })
  );
});

// CORE PING HANDLER
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: 'icon.png',
      badge: 'icon.png',
      vibrate: [200, 100, 200],
      tag: 'ocd-anchor',
      renotify: true
    });
  }
});

// Essential for APK compatibility
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'OCD Anchor', body: 'Reminder' };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'icon.png'
  });
});