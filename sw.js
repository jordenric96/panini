// sw.js - Service Worker v14
// sw.js - Service Worker v15
const CACHE_NAME = 'panini-tracker-v15';
const ASSETS = [ './index.html', './style.css?v=15', './countries.js?v=15', './app.js?v=15', './manifest.json' ];

self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keyList) => { return Promise.all(keyList.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })); })); });
self.addEventListener('fetch', (e) => { e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); });

self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); }));
  }));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
