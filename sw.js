// sw.js - Service Worker v13
const CACHE_NAME = 'panini-tracker-v13';
const ASSETS = [
  './index.html',
  './style.css?v=13',
  './countries.js?v=13',
  './app.js?v=13',
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
