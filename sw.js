// sw.js - Service Worker voor PWA installatie
const CACHE_NAME = 'panini-tracker-v1';
const ASSETS = [
  './index.html',
  './style.css',
  './countries.js',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
