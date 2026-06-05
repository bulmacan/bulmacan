self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bulmacan-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico'
      ]).catch(err => {
        console.warn('Some files failed to cache:', err);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Never cache JSON data files — always fetch fresh from network
  if (url.includes('/data/') && url.endsWith('.json')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For everything else, try cache first then network
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'Bugünkü ipucu seni şaşırtabilir.',
    icon: data.icon || '/brain_red.png',
    badge: '/icons/android-chrome-192x192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Yeni bulmaca seni bekliyor!', options)
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== 'bulmacan-cache')
            .map(key => caches.delete(key))
      )
    )
  );
});