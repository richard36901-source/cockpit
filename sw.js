/* Cockpit service worker — v3.0.0 */
const VERSION = 'cockpit-v3.0.0';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/favicon-32.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(request)
        .then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(request, copy)); return r; })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for the shell
  e.respondWith(
    caches.match(request).then(r => r || fetch(request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(request, copy));
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
