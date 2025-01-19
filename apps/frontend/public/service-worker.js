self.addEventListener('push', function (event) {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    title: data.title,
    icon: '/pwa/icon-192x192.png',
    badge: '/pwa/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.link,
      dateOfArrival: Date.now(),
      primaryKey: '1',
    },
    actions: [
      {
        action: 'open_link',
        title: 'Open Link',
        icon: '/pwa/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/pwa/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  let data = event.notification.data;

  if (!event.action) {
    event.waitUntil(clients.openWindow(data.url));
    return;
  }

  switch (event.action) {
    case 'open_link':
      event.waitUntil(clients.openWindow(data.url));
      break;
    case 'close':
      break;
  }
});
