self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/552/552402.png'
  });
});