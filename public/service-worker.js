const CACHE_NAME = 'code-and-cash-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.php',
    '/assets/css/style.css',
    '/assets/icons/phosphor/style.css',
    '/assets/img/logo.png',
    '/assets/js/services/ApiService.js',
    '/assets/fonts/inter-v20-latin-regular.woff2',
    '/assets/fonts/inter-v20-latin-500.woff2',
    '/assets/fonts/inter-v20-latin-600.woff2',
    '/assets/fonts/jetbrains-mono-v24-latin-regular.woff2',
    '/assets/fonts/oswald-v57-latin-regular.woff2'
];

// Install Event - Caching basic assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching App Shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Only cache successful GET requests from our origin
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // Fallback for offline (optional, could return a custom offline page)
                });

                // Return cached response if available, or wait for network
                return response || fetchPromise;
            });
        })
    );
});
