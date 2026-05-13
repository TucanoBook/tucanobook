// TucanoBook Service Worker v3 — aggressive cache clear + no CDN interception
const CACHE = 'tucanobook-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
  // Immediately clear ALL old caches on install
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // NEVER touch external requests (Firebase, CDNs, fonts) — leave them to the browser
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/health') return;

  // Network-first for HTML, cache-first for static assets
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)); return res; })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        if (res.status === 200) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)); }
        return res;
      }))
    );
  }
});
