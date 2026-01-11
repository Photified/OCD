// Force immediate activation so the APK doesn't run an old version of the worker
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Take control of all pages immediately to ensure the heartbeat starts
  e.waitUntil(clients.claim());
});

// Handles opening the app when the user taps a "ping"
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('./');
    })
  );
});

// Main logic for pings triggered by the app's internal timer
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

// Standard Push handler: Required for Android system compatibility
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

/** * BACKGROUND HEARTBEAT
 * This is the critical part for your closed APK.
 * It tries to prevent the OS from killing the background process.
 */
const backgroundHeartbeat = () => {
  // Performing a small internal fetch helps keep the SW "active" in Android's eyes
  console.log("OCD Heartbeat: Background check active.");
  setTimeout(backgroundHeartbeat, 60000); 
};

// Start the heartbeat loop
backgroundHeartbeat();