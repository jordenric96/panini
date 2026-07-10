// sw.js - Service Worker v22

const CACHE_NAME = 'panini-tracker-v22';
const ASSETS = [
    './',
    './index.html',
    './style.css?v=22',
    './countries.js?v=22',
    './app.js?v=22',
    './manifest.json',
    './icon.png'
];

// Installatie: Sla alle bestanden op in de cache
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activatie: Verwijder oude versies uit de cache
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Oude cache verwijderd:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch: Probeer eerst via netwerk (zodat je altijd de nieuwste data hebt), 
// lukt dat niet (offline), val dan terug op de cache.
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request);
        })
    );
});
