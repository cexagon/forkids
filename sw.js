/* Aplikasi pindah ke /abaqa/. Service worker lama ini menghapus cache miliknya sendiri (kebun-hitung-v2.*)
   lalu melepas diri, agar tablet tidak terus menampilkan salinan lama. Cache Abaqa di domain yang sama tidak disentuh. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => /^kebun-hitung-v2(\.|$)/.test(k)).map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});
