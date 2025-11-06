const CACHE_NAME = 'tagebuch-cache-v1';
const FILES_TO_CACHE = [
  '/', '/index.html', '/styles.css', '/app.js', '/manifest.json',
  '/icons/icon-192.png'
];

// Installationsphase - Dateien cachen
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Aktivierung - alte Caches entfernen
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch-Event: zuerst Cache, dann Netzwerk
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cachedRes => cachedRes || fetch(evt.request))
  );
});
