self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
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

// Clean notification handler - showing ONLY the trigger text
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body, // This is just the user's task title
      icon: 'icon.png',
      badge: 'icon.png',
      vibrate: [200, 100, 200],
      tag: 'ocd-anchor',
      renotify: true
    });
  }
});

// Standard Push handler (Required for APK system compatibility)
self.addEventListener('push', (event) => {
  let data = { title: 'OCD Anchor', body: 'Time to check in.' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }
  
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'icon.png',
    badge: 'icon.png',
    vibrate: [200, 100, 200],
    tag: 'ocd-anchor',
    renotify: true
  });
});