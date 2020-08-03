/* eslint-disable */

// Global workbox
if (workbox) {
  console.log('Workbox is loaded');

  self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
  });

  // Image caching
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://hacker-news.firebaseio.com',
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'HNApi',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 2000,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    })
  );
} else {
  console.error('Workbox could not be loaded. No offline support');
}
