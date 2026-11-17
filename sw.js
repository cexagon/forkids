/* Kebun Hitung: cache supaya bisa dimainkan tanpa internet setelah dibuka sekali. */
const CACHE = 'kebun-hitung-v2.1.2';
const ASSETS = ['./', './index.html', './css/style.css', './js/art.js', './js/content.js', './js/app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  /* Font Google: coba jaringan, simpan salinannya untuk offline */
  if (url.origin !== location.origin) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request);
      const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  /* Pasar 3D: selalu ambil dari jaringan dulu, salinan hanya untuk saat offline */
  if (url.pathname.includes('/pasar3d/')) {
    e.respondWith(fetch(e.request).then(r => { if (r.ok && r.status === 200) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); } return r; }).catch(() => caches.match(e.request).then(hit => hit || Response.error())));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match('./index.html'))));
});
