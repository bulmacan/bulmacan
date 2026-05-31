self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bulmacan-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/detektif/detektif_js.js',
        '/detektif/detektif_css.css',
        '/favicon.ico'
      ]).catch(err => {
        console.warn('Some files failed to cache:', err);
      });
    })
  );
});


self.addEventListener('fetch', event => {
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
