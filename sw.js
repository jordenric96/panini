// sw.js - Service Worker v14
const CACHE_NAME = 'panini-tracker-v14';
const ASSETS = [
  './index.html',
  './style.css?v=14',
  './countries.js?v=14',
  './app.js?v=14',
  './manifest.json'
];

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
