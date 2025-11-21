const CACHE_NAME = 'tagebuch-cache-v1';
const FILES_TO_CACHE = [
  '/', '/index.html', '/styles.css', '/app.js', '/manifest.json',
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/pencil-fill.svg',
  '/icons/trash-fill.svg'
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
