const CACHE = 'baku-guide-v4';
const FILES = ['./','./index.html','./style.css','./content.js','./art.js','./metro.js','./metrodata.js','./app.js','./map.js','./itin.js','./v2.js','./manifest.webmanifest',
  './vendor/leaflet/leaflet.js','./vendor/leaflet/leaflet.css','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'FOCUS_EXISTING') {
    e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.id !== e.source.id && 'focus' in c) {
          c.focus();
          if (e.data.url && 'navigate' in c) c.navigate(e.data.url).catch(() => {});
          return;
        }
      }
    }));
  }
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const fresh = url.pathname.endsWith('content.json') || url.pathname.endsWith('content.js');
  if (fresh) {
    e.respondWith(fetch(req).then((res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return res; }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return res; })
      .catch(() => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
    return hit || net;
  }));
});
