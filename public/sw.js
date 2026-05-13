// TucanoBook Service Worker v2 — only caches same-origin, never blocks CDN
const CACHE = 'tucanobook-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // NEVER intercept external CDN (Firebase, Chart.js, Fonts) — was causing CSP errors
  if (url.origin !== self.location.origin) return;
  // Never intercept API calls
  if (url.pathname.startsWith('/api/') || url.pathname === '/health') return;
  // Only cache GET
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchFresh = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', {status: 503}));
      return cached || fetchFresh;
    })
  );
});
