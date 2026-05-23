// sw.js - Service Worker v2 (Agressieve Cache Update)
const CACHE_NAME = 'panini-tracker-v2';
const ASSETS = [
  './index.html',
  './style.css?v=2',
  './countries.js?v=2',
  './app.js?v=2',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forceer direct de nieuwe versie
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key); // Gooi de oude app-versie weg
        }
      }));
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
